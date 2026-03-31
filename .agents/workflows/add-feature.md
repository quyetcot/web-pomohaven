---
description: Quy trình thêm một tính năng mới vào PomoHaven một cách an toàn và bài bản, tránh phát sinh bug.
---

# /add-feature — Quy Trình Phát Triển Tính Năng An Toàn

Quy trình này PHẢI được tuân thủ mỗi khi user yêu cầu thêm tính năng mới, không phân biệt lớn hay nhỏ.

---

## BƯỚC 1: Đọc & Hiểu Yêu Cầu

Trước khi viết bất kỳ dòng code nào:

1. **Đọc file liên quan** — Component/Store sẽ bị ảnh hưởng.
2. **Đọc SKILL.md** — `d:\Projects\web-pomorodo\.agents\skills\pomo-design\SKILL.md` trước khi viết HTML/Tailwind.
3. **Xác định phạm vi ảnh hưởng:**
   - Thay đổi `template`, `script`, hay **cả hai**?
   - Ảnh hưởng 1 file hay nhiều file?
   - Cần sửa Pinia Store không? Cần Supabase call không?
4. **Hỏi ngay nếu yêu cầu mơ hồ** — KHÔNG GIẢ ĐỊNH.

---

## BƯỚC 2: Lên Kế Hoạch (KHÔNG Code Ngay!)

> // turbo

- Mô tả ngắn (1-3 dòng) Technical Approach.
- Liệt kê file sẽ **tạo mới** hoặc **sửa đổi**.
- Xác định **side effects** tiềm ẩn.
- Nếu có Supabase: xác nhận RLS policy đã đủ chưa.

---

## BƯỚC 3: Triển Khai Từng Bước

> // turbo

**Quy tắc cứng:**

| # | Quy tắc | Mô tả |
| :--- | :--- | :--- |
| 1 | **Store-First** | State/logic đặt trong Pinia Store. Component chỉ bind template + gọi action. |
| 2 | **No Hardcode** | Không chèn hex/px cứng vào HTML. Dùng Design Tokens Tailwind. |
| 3 | **SSR-Safe** | `window`, `document`, `localStorage` → phải trong `onMounted()` hoặc `typeof window !== 'undefined'`. |
| 4 | **Không xóa code cũ** | Comment tạm thay vì xóa, cho đến khi feature mới ổn định. |
| 5 | **a11y bắt buộc** | `<button>` / `<a>` chỉ chứa icon → PHẢI có `aria-label`. |
| 6 | **Error Handling** | Mọi Supabase call → destructure `{ data, error }`. Không bỏ qua lỗi im lặng. |

---

## BƯỚC 4: Self-QA (Bắt buộc trước khi báo cáo "Xong")

> // turbo

- [ ] **Mở Browser Agent** và tự test tính năng vừa thêm.
- [ ] Hoạt động đúng ở trạng thái bình thường.
- [ ] Edge cases: bấm nhanh, bấm nhiều lần, để trống input, chưa đăng nhập.
- [ ] Mobile (390px) và Desktop (1440px).
- [ ] Console sạch — không có lỗi hay Warning lạ.
- [ ] PomoDesign QA Checklist (từ SKILL.md): border, opacity, radius, color token, no hardcode.

---

## BƯỚC 5: Báo Cáo & Commit

5.1. Tóm tắt những gì đã làm, kèm ảnh chụp UI nếu có thay đổi giao diện.

5.2. Commit theo format:
```
<type>: <mô tả ngắn tiếng Anh>

feat: Add quick-set time chips to Focus Dashboard
fix: Resolve volume slider conflict with draggable player
refactor: Extract beep logic into a composable
fix(db): Handle missing profile for Google OAuth users
```

5.3. Cập nhật `PROJECT_STATE.md` nếu đây là milestone quan trọng.

---

## Bảng Phân Loại Tính Năng (Quick Reference)

| Loại yêu cầu | Files thường bị ảnh hưởng |
| :--- | :--- |
| Thay đổi UI/Style | `*.vue` (template), PomoDesign SKILL |
| Thêm state/logic | Pinia Store + Component |
| Tính năng âm thanh | `useAudioStore.ts`, `useMusicStore.ts` |
| Responsive/Layout | `app/pages/*.vue`, `app/layouts/default.vue` |
| Cài đặt mới | `useTimerStore.ts` + `settings.vue` + `user_settings` table |
| Supabase data mới | Store + Supabase schema + RLS policy |
