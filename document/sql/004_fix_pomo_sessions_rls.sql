-- Migration: 004_fix_pomo_sessions_rls
-- Description: Thêm RLS policies còn thiếu cho bảng pomo_sessions
--              và đồng bộ CHECK constraint với code thực tế
-- Created at: 2026-06-04
-- Bug: INSERT bị lỗi 42501 (RLS policy violation) vì không có INSERT policy

-- ============================================================================
-- BƯỚC 1: Kiểm tra policies hiện có (chạy để debug, không cần commit)
-- ============================================================================
-- SELECT policyname, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename = 'pomo_sessions' AND schemaname = 'public';

-- ============================================================================
-- BƯỚC 2: Đảm bảo RLS đang bật
-- ============================================================================
ALTER TABLE public.pomo_sessions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- BƯỚC 3: Xóa policies cũ nếu có (tránh conflict)
-- ============================================================================
DROP POLICY IF EXISTS "Users can insert own sessions" ON public.pomo_sessions;
DROP POLICY IF EXISTS "Users can view own sessions" ON public.pomo_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON public.pomo_sessions;
DROP POLICY IF EXISTS "Users can delete own sessions" ON public.pomo_sessions;
-- Xóa policy ALL nếu có từ trước
DROP POLICY IF EXISTS "Users can manage own sessions" ON public.pomo_sessions;

-- ============================================================================
-- BƯỚC 4: Tạo policies đầy đủ
-- ============================================================================

-- Policy SELECT: user chỉ thấy sessions của mình
CREATE POLICY "Users can view own sessions"
  ON public.pomo_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy INSERT: user chỉ insert session với user_id của mình
CREATE POLICY "Users can insert own sessions"
  ON public.pomo_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy UPDATE: user chỉ update session của mình (phòng hờ)
CREATE POLICY "Users can update own sessions"
  ON public.pomo_sessions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy DELETE: user chỉ xóa session của mình (phòng hờ)
CREATE POLICY "Users can delete own sessions"
  ON public.pomo_sessions
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- BƯỚC 5: Verify (chạy sau khi apply để kiểm tra)
-- ============================================================================
-- SELECT policyname, cmd
-- FROM pg_policies
-- WHERE tablename = 'pomo_sessions' AND schemaname = 'public'
-- ORDER BY cmd;

-- Expected output:
-- policyname                    | cmd
-- ------------------------------|--------
-- Users can view own sessions   | SELECT
-- Users can insert own sessions | INSERT
-- Users can update own sessions | UPDATE
-- Users can delete own sessions | DELETE
