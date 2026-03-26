-- Drop existing tables/views if they exist
DROP VIEW IF EXISTS view_session_fqs;
DROP TABLE IF EXISTS session_interruptions CASCADE;
DROP TABLE IF EXISTS pomo_sessions CASCADE;

-- 1. Create pomo_sessions table
CREATE TABLE pomo_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    task_id UUID,
    type TEXT NOT NULL CHECK (type IN ('deep_focus', 'learning', 'creative', 'short_break', 'long_break')),
    planned_duration INTEGER NOT NULL,
    actual_duration INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('completed', 'abandoned', 'skipped')),
    started_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Create session_interruptions table
CREATE TABLE session_interruptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES pomo_sessions(id) ON DELETE CASCADE,
    interrupted_at TIMESTAMPTZ NOT NULL,
    resumed_at TIMESTAMPTZ,
    duration INTEGER NOT NULL,
    cause TEXT NOT NULL
);

-- 3. Enable RLS (Row Level Security)
ALTER TABLE pomo_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_interruptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own sessions" ON pomo_sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own interruptions" ON session_interruptions
    FOR ALL USING (
        auth.uid() = (SELECT user_id FROM pomo_sessions WHERE id = session_id)
    );

-- 4. Create VIEW for Focus Quality Score (FQS)
CREATE OR REPLACE VIEW view_session_fqs AS
SELECT
    ps.id AS session_id,
    ps.user_id,
    ps.started_at,
    ps.type,
    ps.planned_duration,
    ps.actual_duration,
    COUNT(si.id) AS pause_count,
    COALESCE(SUM(si.duration), 0) AS total_pause_duration,
    GREATEST(0, LEAST(100, 
        100 
        - (COUNT(si.id) * 5) 
        - (COALESCE(SUM(si.duration), 0)::FLOAT / ps.planned_duration * 100)
    )) AS fqs_score
FROM pomo_sessions ps
LEFT JOIN session_interruptions si ON ps.id = si.session_id
WHERE ps.type IN ('deep_focus', 'learning', 'creative')
GROUP BY ps.id;

-- 5. Create RPCs for Analytics
CREATE OR REPLACE FUNCTION get_peak_flow_times(p_user_id UUID)
RETURNS TABLE (day_of_week INTEGER, hour_of_day INTEGER, average_fqs FLOAT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        EXTRACT(DOW FROM started_at)::INTEGER AS day_of_week,
        EXTRACT(HOUR FROM started_at)::INTEGER AS hour_of_day,
        AVG(fqs_score)::FLOAT AS average_fqs
    FROM view_session_fqs
    WHERE user_id = p_user_id
    GROUP BY day_of_week, hour_of_day
    ORDER BY average_fqs DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_distraction_leakage(p_user_id UUID, p_days INTEGER DEFAULT 7)
RETURNS TABLE (task_name TEXT, total_leakage_hours FLOAT, leakage_ratio FLOAT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'General Focus'::TEXT AS task_name,
        COALESCE(SUM(total_pause_duration)::FLOAT / 3600, 0) AS total_leakage_hours,
        COALESCE(SUM(total_pause_duration)::FLOAT / NULLIF(SUM(planned_duration), 0), 0) AS leakage_ratio
    FROM view_session_fqs
    WHERE user_id = p_user_id AND started_at >= NOW() - (p_days || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_fatigue_curve(p_user_id UUID, p_days INTEGER DEFAULT 30)
RETURNS TABLE (daily_sequence_number INTEGER, abandon_rate FLOAT, total_sessions BIGINT) AS $$
BEGIN
    RETURN QUERY
    WITH numbered_sessions AS (
        SELECT 
            status,
            ROW_NUMBER() OVER(PARTITION BY DATE(started_at) ORDER BY started_at) AS seq_num
        FROM pomo_sessions
        WHERE user_id = p_user_id AND type IN ('deep_focus', 'learning', 'creative') 
          AND started_at >= NOW() - (p_days || ' days')::INTERVAL
    )
    SELECT 
        seq_num::INTEGER AS daily_sequence_number,
        (COUNT(*) FILTER (WHERE status = 'abandoned')::FLOAT / COUNT(*)) * 100 AS abandon_rate,
        COUNT(*) AS total_sessions
    FROM numbered_sessions
    GROUP BY seq_num
    ORDER BY seq_num;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
