-- ============================================================================
-- Migration: 005_user_settings_extend
-- Description: Thêm các columns còn thiếu vào bảng user_settings
--              Tất cả các columns này đều có logic thực tế trong app đang sử dụng
-- Created at: 2026-06-04
-- Root cause: 001_init.sql chỉ tạo 5 columns cơ bản, bỏ sót 4 columns quan trọng
-- ============================================================================

-- Thêm long_break_time (Long Break Duration — dùng trong timer setMode/skip/reset)
ALTER TABLE public.user_settings
  ADD COLUMN IF NOT EXISTS long_break_time INTEGER DEFAULT 900; -- 15 phút = 900 giây

-- Thêm sound_enabled (Notification & Sounds — dùng trong playBeep() và triggerAlarm())
ALTER TABLE public.user_settings
  ADD COLUMN IF NOT EXISTS sound_enabled BOOLEAN DEFAULT true;

-- Thêm auto_play_focus (Auto-play Music khi focus bắt đầu)
ALTER TABLE public.user_settings
  ADD COLUMN IF NOT EXISTS auto_play_focus BOOLEAN DEFAULT false;

-- Thêm auto_pause_break (Auto-pause Music khi vào break)
ALTER TABLE public.user_settings
  ADD COLUMN IF NOT EXISTS auto_pause_break BOOLEAN DEFAULT false;

-- Thêm daily_goal (Today's Goal — số sessions mục tiêu mỗi ngày)
ALTER TABLE public.user_settings
  ADD COLUMN IF NOT EXISTS daily_goal INTEGER DEFAULT 8;

-- ============================================================================
-- RLS: user_settings đã có policy từ trước (thông qua ensureProfile)
-- Không cần thêm policy mới vì ALTER COLUMN không ảnh hưởng đến RLS
-- ============================================================================

-- Verify (uncomment để kiểm tra sau khi apply):
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'user_settings'
-- ORDER BY ordinal_position;
