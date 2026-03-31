---
name: BE Migration
description: Quy trình thay đổi Supabase schema an toàn — thêm bảng, thêm cột, đổi FK, không mất data.
---

# BE Migration Skill — Supabase Schema Changes

---

## Nguyên tắc Vàng

> **KHÔNG BAO GIỜ** xóa column hay bảng đang có data production mà không có kế hoạch migration rõ ràng.

---

## 1. Thêm Bảng Mới

**Checklist bắt buộc khi tạo bảng mới:**

```sql
-- 1. Tạo bảng với đủ constraints
CREATE TABLE IF NOT EXISTS public.new_table (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  -- ... các columns khác
  created_at timestamptz DEFAULT now()
);

-- 2. Bật RLS ngay lập tức (KHÔNG để bảng không có RLS)
ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;

-- 3. Tạo policies đầy đủ (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Users can manage own data" ON public.new_table
  FOR ALL USING (auth.uid() = user_id);

-- 4. Test policy bằng cách login và thử insert
```

---

## 2. Thêm Column Mới

```sql
-- An toàn: luôn dùng DEFAULT để không break data cũ
ALTER TABLE public.user_settings
  ADD COLUMN IF NOT EXISTS theme text DEFAULT 'dark';

ALTER TABLE public.user_settings
  ADD COLUMN IF NOT EXISTS language text DEFAULT 'vi';
```

> Sau khi thêm column, cập nhật TypeScript interface trong Store tương ứng.

---

## 3. Đổi Foreign Key

```sql
-- Bước 1: Xóa constraint cũ (không xóa dữ liệu)
ALTER TABLE public.personal_tracks
  DROP CONSTRAINT IF EXISTS personal_tracks_user_id_fkey;

-- Bước 2: Thêm constraint mới
ALTER TABLE public.personal_tracks
  ADD CONSTRAINT personal_tracks_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
```

---

## 4. Đổi tên Column (Nguy hiểm — cần cẩn thận)

```sql
-- Cách an toàn: thêm column mới → migrate data → xóa cột cũ
-- Bước 1: Thêm column mới
ALTER TABLE public.pomo_sessions ADD COLUMN duration_seconds integer;

-- Bước 2: Copy data
UPDATE public.pomo_sessions SET duration_seconds = duration;

-- Bước 3: (Sau khi verify code mới chạy OK) Xóa cột cũ
ALTER TABLE public.pomo_sessions DROP COLUMN duration;
```

---

## 5. Sync Data Bị Thiếu

Dùng khi data bị thiếu do bug cũ (như profiles không được tạo):

```sql
-- Đồng bộ profiles cho tất cả auth users
INSERT INTO public.profiles (id, email)
SELECT id, email FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);

-- Tạo user_settings mặc định cho user chưa có
INSERT INTO public.user_settings (user_id)
SELECT id FROM public.profiles
WHERE id NOT IN (SELECT user_id FROM public.user_settings);
```

---

## 6. Kiểm tra Sau Migration

```sql
-- Kiểm tra RLS có đang bật không
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Kiểm tra policies hiện có
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';

-- Đếm records để verify data không bị mất
SELECT COUNT(*) FROM public.personal_tracks;
SELECT COUNT(*) FROM public.profiles;
```

---

## 7. Cập nhật Code Sau Migration

Sau mỗi thay đổi schema, phải cập nhật đồng thời:

| File | Cần làm gì |
| :--- | :--- |
| TypeScript interface trong Store | Thêm/sửa type cho column mới |
| Store `loadXxx` function | Thêm column mới vào `.select()` |
| Store `addXxx` / `updateXxx` | Thêm field mới vào insert/upsert payload |
| `supabase_schema.sql` trong `document/` | Cập nhật schema documentation |

---

## 8. Không Làm Trong Production

- ❌ `DROP TABLE` mà không backup
- ❌ `ALTER COLUMN ... TYPE` khi có data (convert data trước)
- ❌ Xóa RLS policy mà không thay thế
- ❌ Thay đổi FK mà không kiểm tra orphaned records
