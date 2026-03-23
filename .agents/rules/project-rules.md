---
trigger: always_on
glob: "**/*.{js,ts,vue,css,html,md}"
description: PomoTune Project Code Conventions and Standards
---

# PomoTune Production Rules & Standards (v3.1)

Quá trình lập trình và maintain dự án này PHẢI tuân thủ tuyệt đối các nguyên tắc sau đây để giữ quy trình chuyên nghiệp:

## 1. Kiến trúc & Công nghệ (Tech Stack constraints)
- **Framework**: Bắt buộc dùng Nuxt 4. Tính năng thư mục gốc của Nuxt 3 đã BỊ LOẠI BỎ. Tất cả các file mã nguồn (ngoại trừ cấu hình) đều **phải được đặt trong thư mục `app/`** (bao gồm `pages/`, `components/`, `layouts/`, `assets/`, và `app.vue`).
- **Styling**: Chỉ sử dụng Tailwind CSS. KHÔNG tạo thêm các file CSS/SCSS Custom nếu có thể giải quyết bằng Tailwind Utilities `@apply`. Lưu ý đường dẫn Tailwind bắt buộc trỏ vào `./app/...`.
- **Global State**: Quản lý bằng `Pinia`. Luôn tích hợp `@vueuse/nuxt` (đặc biệt là `useLocalStorage`) để lưu biến persist.
- **Icons**: Sử dụng Material Symbols Outlined (Font size fix ở 20px hoặc 24px).

## 2. Tiêu chuẩn Mã nguồn (Vue 3 / Nuxt 3 Patterns)
- **Composition API**: Luôn sử dụng `<script setup>` cho tất cả các Vue components. Không sử dụng Options API.
- **TypeScript**: Khuyến khích sử dụng `lang="ts"` để tăng tính ổn định của object và data model (VD: Payload API hoặc Settings Object).
- **Props & Emits**: Bắt buộc phải khai báo bằng các macro `defineProps` và `defineEmits`. Sử dụng `withDefaults` nếu có props tuỳ chọn.
- **Auto-imports**: Tận dụng triệt để tính năng auto-imports của Nuxt cho components, composables, và Pinia stores.

## 3. Quy chuẩn Đặt tên (Naming Conventions)
- **Components (`components/`)**: Bắt buộc dùng `PascalCase`.
  - Prefix `Base` cho các thành phần UI nguyên tử (VD: `BaseButton.vue`, `BaseSlider.vue`).
  - Prefix theo Feature cho tính năng lớn (VD: `FocusTimerOrb.vue`, `AudioPlayer.vue`).
  - Prefix `The` cho các thành phần chỉ xuất hiện 1 lần duy nhất (VD: `TheSidebar.vue`, `TheHeader.vue`).
- **Composables (`composables/`)**: Bắt buộc bắt đầu bằng chữ `use` theo `camelCase` (VD: `useTimerState.ts`, `useAudioController.ts`).
- **Store (`stores/`)**: Bắt buộc bắt đầu bằng `use` và hậu tố `Store` (VD: `useTimerStore.js`).

## 4. Ràng buộc Thiết kế (The Deep Focus Sanctuary)
> **⚠️ BẮT BUỘC ĐỐI VỚI AI AGENT:** Trước khi viết code HTML/Tailwind cho lưới giao diện, hãy LUÔN luôn sử dụng tool `view_file` để đọc chi tiết các thông số (Ghost Border, Glow, Tonal) trong tệp chuyên sâu: `d:\Projects\web-pomorodo\.agents\skills\pomo-design\SKILL.md`.
- **Glassmorphism**: Bất cứ Panel nổi nào cũng phải tuân thủ bộ đôi: nền `surface-container` (kèm độ mờ opacity, tối đa 60%) + hiệu ứng `backdrop-filter: blur(20px)`.
- **Colors**: Sử dụng trực tiếp class màu được thiết lập từ `srs.md` (VD: `bg-surface`, `text-primary`). Tuyệt đối không hardcode mã Hex/RGB trực tiếp vào class HTML.
- **Borders**: Tuân thủ luật "No Solid Borders" (Không dùng viền đặc 1px). Bất kỳ section nào phân cách với nhau cũng dùng `Tonal Depth` (màu nền chênh lệch) hoặc Ghost Border (Gradient 15%).

## 5. Quy chuẩn Testing & Performance
- **Testing**: Bắt buộc có test coverage (hiện tại sẽ cấu hình với Vitest).
- **DOM Rendering**: Sử dụng `v-show` cho những element đóng/mở tần suất cao (vd: dropdown, tooltip). Sử dụng `v-if` khi element chứa nội dung có thể nặng/kéo dài (như danh sách API).
- **Accessibility (a11y)**: Bất kỳ nút (`<button>`, `<a>`) nào chỉ chứa Icon mà KHÔNG có text đi kèm thì BẮT BUỘC phải có `aria-label`. (VD: `<button aria-label="Play Music"><span class="material-symbols-outlined">play_arrow</span></button>`).

## 6. Tính Nhất quán Thuật ngữ (Terminology Enforcement)
Bất cứ khi nào tạo UI Label tĩnh, thông báo ứng dụng, hay đặt tên biến, hãy sử dụng hệ thống từ vựng sau:
- Dashboard -> **Focus Dashboard**
- Music/YouTube/Audio -> **Audio Sanctuary**
- Stats/History/Analytics -> **Performance Analytics**
- Settings/Config -> **System Configuration**
- Break -> **Rest Period**
