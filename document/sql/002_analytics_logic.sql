-- ============================================================================
-- 002_analytics_logic.sql
-- Description: Implement 4 Core Business Logics for Focus Analysis (Supabase RPC)
-- ============================================================================

-- ============================================================================
-- 1. Focus Quality Score (FQS)
-- Tính điểm FQS cho từng phiên. 
-- Sử dụng VIEW để tự động cập nhật điểm khi có dữ liệu xao nhãng nhồi vào.
-- FQS = (actual / planned * 100) - (số lần pause * 5) - (phút pause * 2)
-- Nếu FQS < 0 thì lấy 0, nếu > 100 thì lấy 100.
-- ============================================================================
CREATE OR REPLACE VIEW view_session_fqs AS
SELECT 
    ps.id AS session_id,
    ps.user_id,
    ps.task_id,
    ps.type,
    ps.status,
    ps.started_at,
    ps.planned_duration,
    ps.actual_duration,
    COALESCE(i.pause_count, 0) AS pause_count,
    COALESCE(i.total_pause_duration, 0) AS total_pause_duration,
    GREATEST(0, LEAST(100,
        (CAST(ps.actual_duration AS FLOAT) / NULLIF(ps.planned_duration, 0) * 100) 
        - (COALESCE(i.pause_count, 0) * 5) 
        - (COALESCE(i.total_pause_duration, 0) / 60.0 * 2)
    )) AS fqs_score
FROM 
    public.pomo_sessions ps
LEFT JOIN (
    SELECT 
        session_id, 
        COUNT(*) AS pause_count, 
        SUM(duration) AS total_pause_duration 
    FROM public.session_interruptions 
    GROUP BY session_id
) i ON ps.id = i.session_id;

-- ============================================================================
-- 2. Peak Flow Time Mapping (Bản đồ Khung giờ vàng)
-- Gom nhóm các phiên "completed" và "FQS > 80" theo DOW (Day of week) và HOUR.
-- Đầu ra: Giúp Mobile App ban phát Push Notification "Nên làm việc lúc 9h sáng T3".
-- ============================================================================
CREATE OR REPLACE FUNCTION get_peak_flow_times(p_user_id UUID)
RETURNS TABLE (
    day_of_week INTEGER, -- 0=Sun, 1=Mon, ..., 6=Sat
    hour_of_day INTEGER, -- 0-23
    high_focus_count BIGINT,
    avg_fqs FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CAST(EXTRACT(DOW FROM started_at) AS INTEGER) AS day_of_week,
        CAST(EXTRACT(HOUR FROM started_at) AS INTEGER) AS hour_of_day,
        COUNT(*) AS high_focus_count,
        AVG(fqs_score) AS avg_fqs
    FROM public.view_session_fqs
    WHERE user_id = p_user_id 
      AND status = 'completed' 
      AND fqs_score > 80
      AND type = 'focus'
    GROUP BY 1, 2
    ORDER BY high_focus_count DESC, avg_fqs DESC
    LIMIT 5; -- Lấy 5 khung giờ vàng tốt nhất của người dùng này
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 3. Distraction Leakage (Đo lường Chỉ số Rò rỉ)
-- Tính tổng thời gian làm việc thực tế và đọ với thời gian đã "bốc hơi" vì pause, 
-- Group theo task để biết task nào dễ bị phân tâm nhất.
-- ============================================================================
CREATE OR REPLACE FUNCTION get_distraction_leakage(p_user_id UUID, p_days INTEGER DEFAULT 7)
RETURNS TABLE (
    task_name TEXT,
    total_focus_hours FLOAT,
    total_leakage_hours FLOAT,
    leakage_ratio FLOAT -- Tỉ lệ thời gian chết / thời gian sống
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(t.name, 'Uncategorized') AS task_name,
        CAST(SUM(v.actual_duration) / 3600.0 AS FLOAT) AS total_focus_hours,
        CAST(SUM(v.total_pause_duration) / 3600.0 AS FLOAT) AS total_leakage_hours,
        CAST(SUM(v.total_pause_duration) AS FLOAT) / NULLIF(SUM(v.actual_duration), 1) AS leakage_ratio
    FROM public.view_session_fqs v
    LEFT JOIN public.tasks t ON v.task_id = t.id
    WHERE v.user_id = p_user_id 
      AND v.started_at >= NOW() - (p_days || ' days')::INTERVAL
      AND v.type = 'focus'
    GROUP BY t.name
    ORDER BY total_leakage_hours DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 4. Fatigue Curve Analysis (Đường cong cạn kiệt)
-- Bóc tách thứ tự (sequence) của từng Pomodoro trong 1 ngày, tính tỉ lệ "abandoned".
-- Nếu Pomodoro thứ 4 có abandon_rate = 60%, UI sẽ recommend Break_Time dài hơn.
-- ============================================================================
CREATE OR REPLACE FUNCTION get_fatigue_curve(p_user_id UUID, p_days INTEGER DEFAULT 30)
RETURNS TABLE (
    daily_sequence_number BIGINT, -- Pomodoro lần thứ 1, lần thứ 2, ... trong ngày
    total_sessions BIGINT,
    abandoned_sessions BIGINT,
    abandon_rate FLOAT -- Trên thang % (0-100)
) AS $$
BEGIN
    RETURN QUERY
    WITH RankedSessions AS (
        SELECT 
            id,
            status,
            ROW_NUMBER() OVER (
                PARTITION BY DATE(started_at) -- Đếm lại bắt đầu từ 1 mỗi ngày
                ORDER BY started_at
            ) AS seq_num
        FROM public.pomo_sessions
        WHERE user_id = p_user_id 
          AND type = 'focus'
          AND started_at >= NOW() - (p_days || ' days')::INTERVAL
    )
    SELECT 
        seq_num AS daily_sequence_number,
        COUNT(*) AS total_sessions,
        SUM(CASE WHEN status = 'abandoned' THEN 1 ELSE 0 END) AS abandoned_sessions,
        CAST(SUM(CASE WHEN status = 'abandoned' THEN 1 ELSE 0 END) AS FLOAT) / COUNT(*) * 100 AS abandon_rate
    FROM RankedSessions
    GROUP BY seq_num
    HAVING COUNT(*) > 2 -- Lọc nhiễu: Chỉ lấy các Sequence có ít nhất 3 ngày mà người dùng cố cày tới được
    ORDER BY seq_num;
END;
$$ LANGUAGE plpgsql;
