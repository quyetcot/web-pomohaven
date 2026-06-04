-- ============================================================================
-- Migration: 005_user_settings_extend
-- Description: Thêm các columns còn thiếu vào bảng user_settings
-- Created at: 2026-06-04
-- Chỉ thêm columns có logic thực tế trong app:
--   long_break_time → timer longBreak mode (setMode, skip, reset)
--   sound_enabled   → playBeep() + triggerAlarm() check trước khi phát âm
--   daily_goal      → Today's Goal widget trong Sidebar
-- Bỏ auto_play_focus và auto_pause_break vì chưa có code logic consume chúng
-- ============================================================================

-- Thêm long_break_time (Long Break Duration)
ALTER TABLE public.user_settings
  ADD COLUMN IF NOT EXISTS long_break_time INTEGER DEFAULT 900; -- 15 phút

-- Thêm sound_enabled (Notification & Sounds)
ALTER TABLE public.user_settings
  ADD COLUMN IF NOT EXISTS sound_enabled BOOLEAN DEFAULT true;

-- Thêm daily_goal (Today's Goal trong Sidebar)
ALTER TABLE public.user_settings
  ADD COLUMN IF NOT EXISTS daily_goal INTEGER DEFAULT 8;

-- Verify:
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'user_settings'
-- ORDER BY ordinal_position;
