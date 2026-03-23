# PomoTune Project State & Development Log
*Tệp này là bộ nhớ cốt lõi (Core Memory) của Agent. Đọc tệp này để khôi phục toàn bộ bối cảnh dự án thay vì quét lại toàn bộ mã nguồn.*

## 1. Trạng thái Dự án (Current Status)
- **Giai đoạn hiện tại:** Đang hoàn thiện Thiết lập Music Integration & Analytics cơ bản (Phase 4).
- **Tiến độ (Progress):**
  - [x] Đã chốt yêu cầu phần mềm (SRS.md).
  - [x] Đã hoàn thành Mockup HTML tĩnh (demo, library, settings, analytics).
  - [x] Đã xây dựng Khung bộ quy tắc AI (Rules, Workflows, Skills).
  - [x] Khởi tạo dự án Nuxt 3 & Cấu hình môi trường.
  - [x] Phân rã Layout cơ bản (Header, Sidebar, MobileNav).
  - [x] Xây dựng Atoms/Molecules (TimerOrb, Buttons, Slider).
  - [x] Thiết lập Pinia Store & State Management.

## 2. Quyết định Kiến trúc & Công nghệ (Architecture Decisions)
- **Frontend Stack:** Vue 3 / Nuxt 3 (Universal Rendering) + Tailwind CSS.
- **State Management:** Pinia + `@vueuse/nuxt` (Lưu LocalStorage).
- **Design System:** "The Deep Focus Sanctuary" (Glassmorphism, Tonal Stacking, Ghost Borders). Màu chủ đạo: Deep Blue (`#10131a`, `#adc6ff`).
- **Danh mục Thuật ngữ (Terminology):** Dashboard -> `Focus Dashboard`, Library/Music -> `Audio Sanctuary`, Stats -> `Performance Analytics`, Settings -> `System Configuration`.

## 3. Hệ thống Cấu hình AI (AI Agent Configuration)
Dự án được mã hóa với một bộ não AI mạnh mẽ trong thư mục `.agents`:
- **Rules (`.agents/rules/project-rules.md`):** Các rào cản kỹ thuật buộc AI phải tuân thủ khi viết code (Component API, A11y, Naming conventions).
- **Workflows (`.agents/workflows/html-to-nuxt.md`):** Lộ trình 5 bước phát triển từ HTML tĩnh lên web động bảo mật cao, chống lỗi vặt.
- **Skills (`.agents/skills/pomo-design/SKILL.md`):** Cẩm nang biến AI thành Master Designer, kiểm soát Shadow, Blur, và Typography kiến trúc.

## 4. Nhật ký Thay đổi (Changelog)
- **[23/03/2026]**: Hoàn thành Giai đoạn 5 (Logic Phụ & Tối ưu). Đã chuyển hóa toàn bộ các bản thiết kế mockup (`settings.html`, `library.html`, `analytics.html`, `sessions.vue`) sang các file `*.vue` trong `app/pages/`. Tích hợp trạm phát nhạc ẩn toàn cầu (`ContextualPlayer`) vào layout gốc. Mọi components đều tuân thủ Glassmorphism và kiến trúc mã nguồn chuẩn Nuxt 4.
- **[23/03/2026]**: Hoàn thiện Phase 4 (Assembly). Lắp ghép `<AudioSanctuaryWidget>`, `<HistoryWidget>`, `<StatsWidget>` vào `index.vue`. Khởi tạo `useAudioStore` hỗ trợ gắn mã YouTube linh hoạt.
- **[23/03/2026]**: Xây dựng Giai đoạn 3 (State & Molecules). Khởi tạo `useTimerStore` ứng dụng VueUse `useLocalStorage` và `useDocumentVisibility` để chống trôi timer. Đóng gói hoàn chỉnh SVG Component `<FocusTimerOrb>`.
- **[23/03/2026]**: Xé nhỏ HTML tĩnh thành Vue Components (Giai đoạn 2). Khởi tạo `TheHeader`, `TheSidebar`, `TheMobileNav`. Thiết lập đủ hệ thống `pages/` (Index, Sessions, Library, Analytics, Settings, Auth).
- **[23/03/2026]**: Khởi tạo nền tảng (Phase 1). Cài đặt Nuxt 3, cấu hình Tailwind CSS theo `SKILL.md`, thiết lập Pinia, VueUse.
- **[23/03/2026]**: Tái cấu trúc SRS, đồng bộ hóa thuật ngữ HTML, xây dựng hệ thống `Rules`, `Workflows` và `Skills` cho quy trình sản xuất Nuxt 3 chuyên nghiệp.

## 5. Các bước tiếp theo (Next Steps)
1. Tách các file HTML tĩnh từ thư mục `design/` thành các trang `pages/*.vue` và các thành phần `components/*.vue`.
2. Tạo cấu trúc Layout chung (`layouts/default.vue`).
3. Khởi tạo `stores/` với Pinia.
