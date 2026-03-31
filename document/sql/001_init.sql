-- Migration: 001_init
-- Description: Khởi tạo cấu trúc Database (hỗ trợ Supabase / PostgreSQL) cho PomoHaven
-- Created at: 2026-03-25

-- Kích hoạt extension hỗ trợ sinh UUID tự động (chuẩn PostgreSQL / Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. Table: profiles
-- Bảng chứa thông tin hồ sơ của người dùng (Thường tự động đồng bộ qua Trigger từ auth.users trong Supabase)
-- ============================================================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY, -- REFERENCES auth.users(id) ON DELETE CASCADE (nếu dùng Supabase Auth)
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    timezone TEXT -- Hỗ trợ tính toán thống kê Daily/Weekly chính xác theo múi giờ
);

-- ============================================================================
-- 2. Table: user_settings
-- Cấu hình cá nhân hóa cho mỗi người dùng (Pomodoro time, Break time, YouTube)
-- ============================================================================
CREATE TABLE public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    focus_time INTEGER DEFAULT 3000, -- 50 phút
    break_time INTEGER DEFAULT 600,  -- 10 phút
    yt_video_id TEXT DEFAULT 'jfKfPfyJRdk',
    volume INTEGER DEFAULT 100
);

-- ============================================================================
-- 3. Table: tasks
-- Phân loại sự tập trung (Ngữ cảnh / Dự án / Tags)
-- ============================================================================
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color_code TEXT -- Mã hex (e.g. #4B8EFF) hiển thị trên biểu đồ
);

-- ============================================================================
-- 4. Table: pomo_sessions
-- Bảng lõi ghi nhận hiệu suất, tính trạng của các phiên tập trung và nghỉ ngơi
-- ============================================================================
CREATE TABLE public.pomo_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL, -- Nếu xóa task, session giữ nguyên (null task_id)
    type TEXT NOT NULL CHECK (type IN ('focus', 'short_break', 'long_break')),
    planned_duration INTEGER NOT NULL, -- Số giây định sẵn
    actual_duration INTEGER DEFAULT 0, -- Số giây thực tế đếm được
    status TEXT NOT NULL CHECK (status IN ('completed', 'stopped_early', 'abandoned')),
    started_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. Table: session_interruptions
-- Nhật ký xao nhãng - Lõi giá trị phân tích (Insights) của hệ thống
-- ============================================================================
CREATE TABLE public.session_interruptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.pomo_sessions(id) ON DELETE CASCADE,
    interrupted_at TIMESTAMPTZ NOT NULL,
    resumed_at TIMESTAMPTZ, -- Có thể Null nếu bấm Pause rồi Abandon luôn phiên đó
    duration INTEGER, -- Số giây đã Pause (được tính ra khi Resumed, hoặc trigger backend)
    cause TEXT -- Ví dụ: 'user_paused', 'tab_switched', 'app_closed'
);

-- ============================================================================
-- 6. Table: audio_logs (Tuỳ chọn bổ sung theo UI Analytics "Aural Sanctuary")
-- Lịch sử nghe nhạc trong lúc tập trung
-- ============================================================================
CREATE TABLE public.audio_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.pomo_sessions(id) ON DELETE SET NULL,
    track_id TEXT NOT NULL, -- YouTube ID (v=...) hoặc đường dẫn âm thanh môi trường
    track_name TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL,
    played_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. Indexes
-- Tối ưu hóa truy vấn khi Dashboard và Analytics gọi API lấy dữ liệu theo khoảng thời gian
-- ============================================================================
CREATE INDEX idx_pomo_sessions_user_id_created_at ON public.pomo_sessions(user_id, created_at DESC);
CREATE INDEX idx_interruptions_session_id ON public.session_interruptions(session_id);
CREATE INDEX idx_audio_logs_user_id ON public.audio_logs(user_id, played_at DESC);
