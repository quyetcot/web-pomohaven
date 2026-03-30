---
trigger: always_on
glob: "**/*.{js,ts,vue,css,html,md}"
description: PomoHaven Production Rules & Standards — v5.0
---

# PomoHaven Production Rules & Standards (v5.0)

Quá trình lập trình và maintain dự án này PHẢI tuân thủ tuyệt đối các nguyên tắc sau đây.

---

## 1. Kiến trúc & Công nghệ (Tech Stack)

- **Framework**: Nuxt 4. Tất cả source code **phải đặt trong `app/`** (`pages/`, `components/`, `layouts/`, `assets/`, `app.vue`). Không được đặt ở thư mục gốc.
- **Styling**: Chỉ dùng Tailwind CSS. KHÔNG tạo file CSS custom nếu có thể dùng `@apply`. Tailwind config phải quét `./app/**/*.vue`.
- **Global State**: Pinia + `@vueuse/nuxt` (`useLocalStorage` cho persistence).
- **Backend**: Supabase (PostgreSQL + Auth). Dùng composable `useSupabase()` — không import Supabase client trực tiếp vào component.
- **Icons**: Material Symbols Outlined, kích thước cố định 20px hoặc 24px.

---

## 2. Tiêu chuẩn Mã nguồn (Vue 3 / Nuxt 4)

- **Composition API**: Luôn dùng `<script setup lang="ts">`. Không dùng Options API.
- **Props & Emits**: Bắt buộc khai báo bằng `defineProps` / `defineEmits`. Dùng `withDefaults` nếu có props tùy chọn.
- **Auto-imports**: Tận dụng triệt để — components, composables, Pinia stores đều được auto-import.
- **SSR Safety**: Code dùng `window`, `document`, `navigator` PHẢI nằm trong `onMounted()` hoặc có guard `typeof window !== 'undefined'`.

---

## 3. Quy chuẩn Đặt tên (Naming Conventions)

- **Components**: `PascalCase`.
  - `Base` prefix → UI nguyên tử: `BaseButton.vue`, `BaseSlider.vue`.
  - Feature prefix → tính năng cụ thể: `FocusTimerOrb.vue`, `AudioSanctuaryWidget.vue`.
  - `The` prefix → singleton (chỉ xuất hiện 1 lần): `TheSidebar.vue`, `TheHeader.vue`.
- **Composables**: `camelCase` bắt đầu bằng `use`: `useTimerState.ts`, `useAudioController.ts`.
- **Stores**: `camelCase` bắt đầu bằng `use`, hậu tố `Store`: `useTimerStore.ts`, `useMusicStore.ts`.

---

## 4. Ràng buộc Thiết kế (The Deep Focus Sanctuary)

> **⚠️ BẮT BUỘC:** Trước khi viết HTML/Tailwind cho bất kỳ UI nào, PHẢI đọc `d:\Projects\web-pomorodo\.agents\skills\pomo-design\SKILL.md`.

- **Glassmorphism**: Panel nổi = nền `bg-[#272a31]/60` + `backdrop-blur-[24px]`.
- **Ghost Border**: Không dùng `border-solid`. Dùng `border-t border-l border-[#adc6ff]/10` (chỉ phát sáng cạnh trên-trái).
- **Colors**: Dùng design tokens Tailwind (`bg-surface`, `text-primary`). **Tuyệt đối không hardcode hex/RGB trong class HTML.**
- **Tonal Depth**: Phân tách section bằng màu nền chênh lệch — không dùng `<hr>` hay border đặc.

---

## 5. Supabase & Data Safety

- **Store-First**: Mọi Supabase call phải đi qua Pinia Store. Component không gọi Supabase trực tiếp.
- **Error Handling**: Luôn destructure `{ data, error }` từ mọi Supabase call. Không bỏ qua `error` im lặng.
- **ensureProfile**: Khi user đăng nhập, `useAuthStore.ensureProfile()` được gọi tự động để upsert `profiles` + `user_settings`.
- **RLS Compliance**: Mọi bảng đều bật RLS. Đảm bảo có policy INSERT + SELECT + UPDATE cho mỗi table trước khi write code.
- **Logout Cleanup**: Khi logout, bắt buộc clear localStorage (`resetStore`, `clearAllData`) để bảo vệ privacy.

---

## 6. Quy chuẩn Testing & Performance

- **v-show vs v-if**: `v-show` cho element toggle tần suất cao (dropdown, tooltip). `v-if` cho content nặng hoặc data từ API.
- **Accessibility (a11y)**: `<button>` / `<a>` chỉ chứa icon PHẢI có `aria-label`. Ví dụ: `<button aria-label="Play Music">`.

---

## 7. Tính Nhất quán Thuật ngữ (Terminology)

| Tránh dùng | Dùng thay thế |
| :--- | :--- |
| Dashboard | **Focus Dashboard** |
| Music / YouTube / Audio | **Audio Sanctuary** |
| Stats / History / Analytics | **Performance Analytics** |
| Settings / Config | **System Configuration** |
| Break | **Rest Period** |

---

## 8. Quy Trình Phát Triển An Toàn

> **⚠️ BẮT BUỘC:** Mỗi khi user yêu cầu tính năng mới, PHẢI áp dụng quy trình tại `.agents/workflows/add-feature.md`.

- **Store-First**: Logic nghiệp vụ đặt trong Store. Component chỉ bind template và gọi action.
- **Không xóa code cũ khi thêm mới**: Comment tạm thay vì xóa, cho đến khi feature mới hoạt động ổn định.
- **Self-QA bắt buộc**: Sau khi code xong, dùng Browser Agent tự test trước khi báo cáo "Xong".
- **Event Isolation**: Khi dùng Drag & Drop (`useDraggable`), dùng `onStart` filter để loại trừ `input`, `button`, `a`.
