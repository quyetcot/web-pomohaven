---
description: Quy trình thêm một tính năng mới vào PomoHaven một cách an toàn và bài bản, tránh phát sinh bug.
---

# /add-feature — Quy Trình Phát Triển Tính Năng An Toàn

Quy trình này phải được tuân thủ MỖI KHI user yêu cầu thêm một tính năng mới, không phân biệt tính năng lớn hay nhỏ.

---

## BƯỚC 1: Đọc & Hiểu Yêu Cầu (Read & Clarify)

Trước khi viết bất kỳ dòng code nào, AI Agent phải:

1.1. **Đọc lại các file liên quan** để hiểu trạng thái hiện tại của code:
   - Đọc file Component/Store sẽ bị ảnh hưởng.
   - Đọc `d:\Projects\web-pomorodo\.agents\skills\pomo-design\SKILL.md` trước khi viết bất kỳ HTML/Tailwind nào.

1.2. **Xác định phạm vi ảnh hưởng (Impact Scope):**
   - Tính năng này thay đổi `template`, `script` hay **cả hai**?
   - Tính năng này chỉ thay đổi 1 file hay cần sửa nhiều file?
   - Tính năng này có ảnh hưởng đến Pinia Store không?

1.3. **Đặt câu hỏi ngay nếu yêu cầu còn mơ hồ** — KHÔNG GIẢ ĐỊNH.

---

## BƯỚC 2: Lên Kế Hoạch (Plan — KHÔNG Code Ngay!)

> // turbo

2.1. Mô tả ngắn gọn (1-3 dòng) về cách tiếp cận kỹ thuật (Technical Approach).

2.2. Liệt kê các file sẽ được **tạo mới** hoặc **sửa đổi**.

2.3. Xác định **side effects** có thể xảy ra.

---

## BƯỚC 3: Triển Khai Từng Bước Nhỏ (Implement Incrementally)

> // turbo

Quy tắc cứng cần tuân theo khi cài đặt:

- **Quy tắc 1 - Tách Store & View**: Nếu tính năng có state/logic, PHẢI đặt vào Pinia Store trước, KHÔNG viết logic trực tiếp vào component `<template>`.
- **Quy tắc 2 - Không dùng hardcode**: Không chèn mã màu Hex, kích thước pixel cứng vào HTML. Sử dụng Design Tokens của Tailwind (ví dụ: `text-primary`, `bg-surface-container`).
- **Quy tắc 3 - SSR-Safe**: Bất kỳ code nào sử dụng `window`, `document`, hay `localStorage` phải được bọc trong `onMounted()` hoặc kiểm tra `typeof window !== 'undefined'`.
- **Quy tắc 4 - Không xóa code cũ khi thêm code mới**: Nếu cần thay thế một block code, hãy comment tạm thời thay vì xóa, cho đến khi đã xác nhận tính năng mới hoạt động.
- **Quy tắc 5 - a11y Bắt buộc**: Mọi `<button>` hoặc `<a>` chỉ chứa icon phải có `aria-label`.

---

## BƯỚC 4: Tự Kiểm Tra Trước Khi Báo Cáo (Self-QA)

> // turbo

Trước khi nói "Xong", AI Agent BẮT BUỘC phải tự kiểm tra theo danh sách sau:

- [ ] **Mở Browser Agent** và tự kiểm tra tính năng vừa thêm.
- [ ] Kiểm tra tính năng hoạt động đúng trong trạng thái bình thường.
- [ ] Kiểm tra các **Edge Cases**: Bấm nhanh, bấm nhiều lần, để trống input...
- [ ] Kiểm tra trên cả Mobile View (Viewport 390px) và Desktop (1440px).
- [ ] Kiểm tra Console có báo lỗi hay Warning bất thường không.

---

## BƯỚC 5: Báo Cáo & Commit (Report & Commit)

5.1. Báo cáo tóm tắt lại những gì đã làm, kèm ảnh chụp màn hình nếu có thay đổi UI.

5.2. Commit với thông điệp rõ ràng theo định dạng:
```
<type>: <mô tả ngắn gọn bằng tiếng Anh>

Ví dụ:
Feat: Add quick-set time chips to Focus Dashboard
Fix: Resolve volume slider conflict with draggable player
Refactor: Extract beep logic into a composable
```

5.3. Cập nhật `PROJECT_STATE.md` nếu tính năng là một milestone quan trọng.

---

## Bảng Phân Loại Tính Năng (Quick Reference)

| Loại yêu cầu | Files thường bị ảnh hưởng |
| :--- | :--- |
| Thay đổi UI/Style | `<FeatureName>.vue` (template), PomoDesign SKILL |
| Thêm state/logic | `useTimerStore.ts` hoặc `useAudioStore.ts` + Component |
| Tính năng âm thanh | `useTimerStore.ts` (Web Audio API) |
| Responsive/Layout | `app/pages/*.vue`, `app/layouts/default.vue` |
| Cài đặt mới | `useTimerStore.ts` (settings key) + `app/pages/settings.vue` |
