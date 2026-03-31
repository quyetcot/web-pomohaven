---
name: Supabase Patterns
description: Cẩm nang các pattern Supabase chuẩn cho PomoHaven — RLS, migrations, upsert, realtime.
---

# Supabase Patterns Skill

Skill này định nghĩa các pattern **bắt buộc** khi làm việc với Supabase trong PomoHaven.

---

## 1. Pattern Cơ Bản: Always Destructure Error

> **Quy tắc vàng:** Supabase KHÔNG throw exception. Luôn check `error`.

```typescript
// ✅ Đúng
const { data, error } = await supabase.from('profiles').select('*')
if (error) {
  console.error('[StoreName] Failed:', error.message)
  throw new Error(error.message)
}

// ❌ Sai — silent fail
await supabase.from('profiles').select('*')
```

---

## 2. Pattern CRUD Chuẩn

### INSERT (tạo mới)
```typescript
const { data, error } = await supabase.from('personal_tracks').insert({
  user_id: authStore.user!.id,
  yt_video_id: videoId,
  name: trackName,
  genre: 'Personal'
})
```

### UPSERT (tạo hoặc cập nhật — an toàn hơn INSERT)
```typescript
// onConflict: tên cột unique bị conflict
const { error } = await supabase.from('profiles').upsert(
  { id: user.id, email: user.email },
  { onConflict: 'id', ignoreDuplicates: true }
)
```

### SELECT với filter
```typescript
const { data, error } = await supabase
  .from('personal_tracks')
  .select('*')
  .eq('user_id', authStore.user!.id)
  .order('created_at', { ascending: false })
```

### DELETE
```typescript
const { error } = await supabase
  .from('personal_tracks')
  .delete()
  .eq('id', trackId)
  .eq('user_id', authStore.user!.id) // Double-check ownership
```

---

## 3. Pattern Auth & Profile

### ensureProfile (bắt buộc sau mỗi login)
```typescript
const ensureProfile = async (authUser: User) => {
  await supabase.from('profiles').upsert(
    { id: authUser.id, email: authUser.email },
    { onConflict: 'id', ignoreDuplicates: true }
  )
  await supabase.from('user_settings').upsert(
    { user_id: authUser.id },
    { onConflict: 'user_id', ignoreDuplicates: true }
  )
}
```

### Lắng nghe thay đổi Auth
```typescript
supabase.auth.onAuthStateChange(async (_event, session) => {
  user.value = session?.user ?? null
  if (_event === 'SIGNED_IN' && session?.user) {
    await ensureProfile(session.user)
  }
})
```

---

## 4. RLS (Row Level Security) — Template

**Mỗi bảng mới đều phải có đủ policies:**

```sql
-- Bật RLS
ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;

-- SELECT: chỉ xem của mình
CREATE POLICY "Users can view own data" ON public.new_table
  FOR SELECT USING (auth.uid() = user_id);

-- INSERT: chỉ tạo cho mình
CREATE POLICY "Users can insert own data" ON public.new_table
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE: chỉ sửa của mình
CREATE POLICY "Users can update own data" ON public.new_table
  FOR UPDATE USING (auth.uid() = user_id);

-- DELETE: chỉ xóa của mình
CREATE POLICY "Users can delete own data" ON public.new_table
  FOR DELETE USING (auth.uid() = user_id);
```

---

## 5. Pattern Foreign Key An Toàn

> ⚠️ **Bài học từ bug**: `personal_tracks.user_id` tham chiếu `profiles(id)` thay vì `auth.users(id)` → FK violation khi OAuth user chưa có profile.

**Quy tắc:** Bảng quan trọng nên tham chiếu `auth.users(id)` trực tiếp:

```sql
-- ✅ An toàn — luôn có auth.users khi đã login
user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL

-- ⚠️ Cẩn thận — phải đảm bảo profiles row tồn tại trước
user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL
```

---

## 6. Migration Pattern

Khi thay đổi schema, **KHÔNG xóa column** — chỉ thêm mới hoặc đổi tên:

```sql
-- Thêm column mới (an toàn)
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS theme text DEFAULT 'dark';

-- Đổi FK (nếu cần)
ALTER TABLE public.personal_tracks DROP CONSTRAINT IF EXISTS personal_tracks_user_id_fkey;
ALTER TABLE public.personal_tracks ADD CONSTRAINT personal_tracks_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
```

---

## 7. Error Codes Cần Biết

| Code | Tên | Nguyên nhân thường gặp |
| :--- | :--- | :--- |
| `23503` | FK Violation | Profile chưa tồn tại, insert FK sai |
| `23505` | Unique Violation | Dùng `insert` thay vì `upsert` |
| `42501` | RLS Denied | Policy chưa có hoặc sai điều kiện |
| `PGRST116` | Not Found | `.single()` không tìm thấy row |
| `PGRST301` | JWT Expired | Token hết hạn, cần refresh session |
