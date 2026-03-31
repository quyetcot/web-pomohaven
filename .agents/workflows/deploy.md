---
description: Quy trình deploy PomoHaven lên Vercel (production-ready).
---

# /deploy — Quy Trình Deploy Lên Vercel

## BƯỚC 1: Pre-deploy Checklist (Bắt buộc)

Trước khi deploy, tự kiểm tra toàn bộ:

- [ ] `npm run build` chạy thành công, không có TypeScript error
- [ ] `.env` KHÔNG được commit lên Git
- [ ] Google OAuth Callback URL đã được cấu hình đúng trên Supabase
- [ ] Tất cả Supabase RLS policies đã có đủ INSERT/SELECT/UPDATE
- [ ] `PROJECT_STATE.md` đã cập nhật changelog

## BƯỚC 2: Build kiểm tra local

```bash
npm run build
npm run preview
```

Mở `http://localhost:3000` → test nhanh các flows chính:
1. Google OAuth login → profile tạo đúng
2. Timer chạy + lưu session
3. Add personal track → data lên DB

## BƯỚC 3: Cấu hình Environment Variables trên Vercel

Vào **Vercel Dashboard → Project → Settings → Environment Variables**, thêm:

| Key | Value | Environment |
| :--- | :--- | :--- |
| `SUPABASE_URL` | `https://[project].supabase.co` | Production, Preview |
| `SUPABASE_KEY` | `[anon public key]` | Production, Preview |
| `NUXT_PUBLIC_SUPABASE_URL` | (same as above) | Production, Preview |
| `NUXT_PUBLIC_SUPABASE_KEY` | (same as above) | Production, Preview |

> ⚠️ Với Nuxt 4, runtime config từ `.env` cần prefix `NUXT_PUBLIC_` để expose ra client-side.

## BƯỚC 4: Cấu hình OAuth Callback

Vào **Supabase Dashboard → Authentication → URL Configuration**:

```
Site URL:     https://[your-app].vercel.app
Redirect URLs: https://[your-app].vercel.app/**
               http://localhost:3000/**
```

## BƯỚC 5: Deploy

```bash
# Cài Vercel CLI nếu chưa có
npm i -g vercel

# Deploy lần đầu (interactive)
vercel

# Deploy lên production
vercel --prod
```

Hoặc dùng **Vercel Git Integration** — push lên `main` là tự động deploy.

## BƯỚC 6: Post-deploy Verification

Sau khi deploy xong:
1. Truy cập URL production
2. Test Google OAuth login end-to-end
3. Add một personal track → kiểm tra Supabase Dashboard
4. Chạy Lighthouse audit — target score: Performance > 85, A11y > 90

---

## Troubleshooting phổ biến

| Lỗi | Nguyên nhân | Fix |
| :--- | :--- | :--- |
| `SUPABASE_URL undefined` | Thiếu env var trên Vercel | Thêm vào Vercel dashboard |
| OAuth redirect sai | Callback URL chưa whitelist | Thêm production URL vào Supabase |
| Build fail TypeScript | Type error bị ẩn ở local | Chạy `vue-tsc --noEmit` trước |
| 500 error trang settings | `user_settings` chưa có row | Kiểm tra trigger `handle_new_user` |
