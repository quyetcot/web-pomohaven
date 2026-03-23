---
description: Chuyển đổi bản thiết kế HTML Mockup sang dự án Nuxt.js thực tế theo quy trình sản xuất chuyên nghiệp.
---

Quy trình này đảm bảo tính bền vững, hiệu năng và thẩm mỹ đỉnh cao cho dự án PomoTune.

---

## GIAI ĐOẠN 1: THIẾT LẬP NỀN TẢNG (THE FOUNDATION)

## GIAI ĐOẠN 1: THIẾT LẬP NỀN TẢNG (THE FOUNDATION)

Mục tiêu: Tạo môi trường làm việc chuẩn mực với Nuxt 4 (Cấu trúc mới).

### 1. Khởi tạo dự án & Cấu hình Module

> ⚠️ **Cảnh báo Kiến trúc Nuxt 4:** Nuxt 4 yêu cầu tất cả mã nguồn component/page/layout nằm bên trong thư mục `app/` thay vì thư mục gốc. Khi cài đặt Tailwind, file cấu hình tailwind.config.ts phải cấu hình quét CSS theo mảng: `['./app/**/*.vue']`.
> **Cảnh báo lỗi ESM:** Khi cài đặt plugin của tailwind, tuyệt đối sử dụng `import` thay vì `require()` vì dự án mặc định là `type: module`.

```bash
# Khởi tạo dự án
npx -y nuxi@latest init .

# Cài đặt các Module cốt lõi
npx -y nuxi@latest module add tailwindcss
npx -y nuxi@latest module add pinia
npm install @vueuse/nuxt @vueuse/core

# Container queries cần cài thủ công (không có trong Nuxt module registry)
npm install @tailwindcss/container-queries
```

### 2. Hệ thống Design Tokens (Tailwind Config)

- Đưa bảng màu đã định nghĩa trong `srs.md` vào `tailwind.config.js`.
- Cấu hình Font `Inter` và các biến thể Typography (Label-sm, Display-lg) theo Editorial Guide.
- Thêm plugin `forms` và `container-queries` vào `tailwind.config.js`:

```javascript
// tailwind.config.js
plugins: [
  require('@tailwindcss/forms'),
  require('@tailwindcss/container-queries'),
],
```

---

## GIAI ĐOẠN 2: NGUYÊN TỬ HÓA UI (UI ATOMIZATION)

Mục tiêu: Tách giao diện HTML thành các Component có khả năng tái sử dụng.

### 3. Cấu trúc Lớp (Layout Strategy)

- Xây dựng `layouts/default.vue` với Sidebar tĩnh và TopBar động.
- Sử dụng `<slot />` cho nội dung thay đổi giữa các trang (Focus, Sanctuary, Analytics).

### 4. Xây dựng Base Components (Atoms)

Tạo các thành phần cơ bản trong `components/base/`:

- `BaseButton.vue` — Nút bấm với hiệu ứng Glow/Active scale.
- `BaseCard.vue` — Panel kính mờ với hiệu ứng blur và ghost border.
- `BaseSlider.vue` — Custom range input cho âm lượng môi trường.

### 5. Xây dựng Feature Components (Molecules)

- `components/focus/TimerOrb.vue` — Đồng hồ Orb trung tâm với logic SVG progress ring.
- `components/audio/ContextualPlayer.vue` — Thanh mini-player cố định ở bottom.

---

## GIAI ĐOẠN 3: XỬ LÝ TRẠNG THÁI (CORE LOGIC — THE BRAIN)

Mục tiêu: Đảm bảo dữ liệu và timer hoạt động xuyên suốt khi đổi trang.

### 6. Pinia Stores Implementation

**`stores/useTimerStore.js`** — Quản lý trạng thái đếm ngược, vòng lặp Focus/Break, thông báo.

> ⚠️ **Quan trọng:** Dùng `startTimestamp` thay vì đếm ngược thuần. `setInterval` bị throttle khi tab bị ẩn (trình duyệt giảm độ chính xác), khiến timer bị lệch. Kết hợp với **Page Visibility API** để tính lại thời gian khi user quay lại tab:

```javascript
// Ví dụ pattern chống timer drift
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    const elapsed = Date.now() - startTimestamp
    remainingTime = totalDuration - elapsed
  }
})
```

**`stores/useAudioStore.js`** — Quản lý danh sách phát, YouTube embed ID, âm lượng Mood Sliders.

> ⚠️ **Lưu ý:** Thêm xử lý lỗi cho trường hợp YouTube embed bị block (adblock, giới hạn vùng, API quota hết). Cần có fallback UI khi player không load được.

### 7. Persistence

Sử dụng `useLocalStorage` của VueUse để lưu cấu hình người dùng và thống kê phiên hiện tại.

> ⚠️ **Thêm schema versioning** để tránh lỗi parse khi cập nhật cấu trúc data trong tương lai. Đặt tên key dạng `pomtune_v1_settings` và thêm logic migration đơn giản khi app khởi động:

```javascript
// Ví dụ pattern versioning
const CURRENT_VERSION = 1
const stored = useLocalStorage('pomtune_v1_settings', defaultSettings)

// Khi nâng version: đọc v1, migrate sang v2, xóa key cũ
```

---

## GIAI ĐOẠN 4: LẮP RÁP & ĐIỀU HƯỚNG (ASSEMBLY & ROUTING)

Mục tiêu: Ghép nối các trang theo đúng cấu trúc SRS.

### 8. Trang hóa (Pages Construction)

- `pages/index.vue` — Focus Dashboard.
- `pages/analytics.vue` — Performance Analytics.
- `pages/library.vue` — Audio Sanctuary.
- `pages/settings.vue` — System Configuration.

### 9. Animations & Transitions

Cấu hình `app.vue` với Page Transition của Nuxt để tạo hiệu ứng chuyển trang mượt mà (Fade/Blur).

> ⚠️ **Lưu ý:** Kiểm tra transition không gây layout shift trên mobile. Ưu tiên dùng `opacity` và `transform` để đảm bảo hiệu năng GPU.

---

## GIAI ĐOẠN 5: TINH CHỈNH & TỐI ƯU (POLISHING & CRAFTSMANSHIP)

### 10. SEO & Performance

- Sử dụng `useHead` để cấu hình Title động theo trạng thái Timer (ví dụ: `"24:59 — Focus Dashboard"`).
- Tối ưu hóa Web Fonts và Lazy-load cho YouTube Player.

### 10b. Error Handling & Accessibility *(bước bổ sung)*

> Bước này cần hoàn thành **trước khi deploy**.

**Error Handling:**
- Xử lý lỗi YouTube embed: adblock, region restriction, API quota hết → hiển thị fallback UI thân thiện.
- Xử lý lỗi LocalStorage đầy hoặc bị block (chế độ ẩn danh trên một số trình duyệt).

**Accessibility (a11y):**
- Kiểm tra keyboard navigation toàn bộ app — người dùng productivity thường không dùng chuột khi đang focus.
- Thêm ARIA labels cho TimerOrb (`aria-label`, `aria-live` để đọc thời gian còn lại).
- Kiểm tra focus trap cho các modal/dialog.
- Chạy audit với Lighthouse hoặc axe DevTools.

### 11. Testing & QA (Bảo vệ chất lượng)

Để đảm bảo không lọt bug trước khi deploy, cần thực hiện các mức độ test sau:

**Unit Testing (với Vitest):**

- Test Store logic (`useTimerStore.js`): Giả lập thời gian (Mock timers), kiểm tra trạng thái chuyển đổi giữa Focus/Break và tính toán thời gian.
- Test Component: Đảm bảo `TimerOrb` hiển thị đúng định dạng `MM:SS` với các edge cases (ví dụ: `00:00`, `99:59`).

**End-to-End (E2E) Testing (với Playwright/Cypress):**

- Mô phỏng luồng hoàn chỉnh: User vào app -> Start timer -> Skip timer -> Kiểm tra Session có được lưu đúng vào LocalStorage không.
- Test tương tác Âm thanh: Đảm bảo YouTube tự dừng khi hết phiên, tự chạy khi sang phiên mới (dựa trên cấu hình Settings).

**Manual QA & Edge Cases (Review chuyên sâu):**

- Terminology Check: Đối chiếu toàn bộ các nhãn trong UI đảm bảo khớp 100% thuật ngữ quy định tại `srs.md`.
- Background Throttling: Để app chạy ngầm, thao tác trên tab khác > 15 phút, quay lại kiểm tra Timer có tự động đồng bộ (anti-drift) chuẩn xác không.
- Strict Offline Mode: Ngắt kết nối mạng hoàn toàn. Kiểm tra Timer hoạt động bình thường và YouTube Player hiển thị Fallback UI thay vì sập lỗi ứng dụng.
- LocalStorage Failures: Giả lập tắt cookie/localstorage trên trình duyệt (Incognito mode strict), ứng dụng phải hiển thị cảnh báo thay vì bị crash.

---

## GIAI ĐOẠN 6: GHI NHẬN & BÀN GIAO (STATE TRACKING)

> **⚠️ BẮT BUỘC ĐỐI VỚI AI AGENT:**

### 12. Cập nhật Memory Bank (`PROJECT_STATE.md`)

Sau khi HOÀN THÀNH bất kỳ một Giai đoạn (Phase) hoặc một Task lớn nào trong quy trình này, AI Agent **BẮT BUỘC** phải thực hiện thao tác sau trước khi kết thúc phiên làm việc:

1. Mở tệp `d:\Projects\web-pomorodo\PROJECT_STATE.md`.
2. Đánh dấu `[x]` vào các công việc đã hoàn thành trong phần **Tiến độ (Progress)**.
3. Cập nhật **Giai đoạn hiện tại**.
4. Ghi chú tóm tắt những gì vừa làm vào phần **Nhật ký thay đổi (Changelog)** với định dạng `[DD/MM/YYYY]: Mô tả...`.
5. Liệt kê rõ công việc tiếp theo vào phần **Các bước tiếp theo (Next Steps)**.