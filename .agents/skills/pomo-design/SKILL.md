---
name: PomoDesign Master
description: Duy trì tính nhất quán cho triết lý thiết kế "Deep Focus Sanctuary" của PomoHaven.
---

# PomoDesign Master Skill (v3.1)

Kỹ năng này định nghĩa tư duy thiết kế và cách thức hiện thực hóa phong cách **"High-End Editorial"** và **"The Deep Focus Sanctuary"** bằng Tailwind CSS & Vue 3.

---

## Nguyên lý Cốt lõi (Core Principles)

- **Anti-Boxy (Tránh ngột ngạt):** Hủy bỏ đường viền cứng (`border-solid`). Phân tách bằng Tonal Depth hoặc Ghost Border.
- **Intentional Asymmetry:** Tận dụng khoảng trắng (Whitespace) để mắt được "nghỉ ngơi".
- **Breathing Animations:** Mọi chuyển động (hover, click, timer) phải mượt mà, tối thiểu `duration-300`.

---

## 1. Hệ thống Phân tầng (Tonal Elevation Architecture)

Mô phỏng các tấm kính mờ nổi lên khỏi một vực thẳm xanh thẫm.

| Cấp độ | Tên gọi | Tailwind Token | Chức năng UI |
| :--- | :--- | :--- | :--- |
| **Level 0** | The Void | `bg-void` | Background toàn trang / Canvas |
| **Level 1** | The Stage | `bg-stage` | Sidebar, Section lớn |
| **Level 2** | The Component | `bg-component` | Card nổi, List nhạc, Settings panel |
| **Level 3** | Floating Glass | `bg-glass` | Modal, Tooltip, Flyout |

> **Mapping tokens → hex** (định nghĩa trong `tailwind.config.ts`):
> - `void` = `#10131a`, `stage` = `#191c22`, `component` = `#272a31`, `glass` = `#363940`

---

## 2. Ghost Border & Glassmorphism

Tuyệt đối **KHÔNG** dùng `border border-white/10`. Viền chỉ phát sáng ở cạnh trên-trái.

```html
<!-- Cấu trúc Card chuẩn Level 2/3 -->
<div class="relative rounded-[2rem] bg-component/60 backdrop-blur-[24px] overflow-hidden">
  <!-- Ghost Border layer — top-left light path -->
  <div class="absolute inset-0 border-t border-l border-accent/10 rounded-[2rem] pointer-events-none"></div>
  <slot />
</div>
```

### Signature Glow (Đổ bóng màu, không phải đen)
```html
<button class="bg-accent text-void rounded-full transition-all duration-300
               hover:shadow-[0_0_24px_rgba(75,142,255,0.4)]">
  Bắt đầu
</button>
```

> **Token mapping**: `accent` = `#4b8eff`, `accent-soft` = `#adc6ff`

---

## 3. Editorial Typography (Nghệ thuật Chữ)

Tạo **tương phản cực đoan** giữa Text metric lớn và Label siêu nhỏ. Font mặc định: `Inter`.

| Vai trò | Tailwind Classes |
| :--- | :--- |
| **The Timer / Big Metric** | `text-5xl md:text-7xl font-bold tracking-[-0.04em] text-accent-soft` |
| **Technical Label** | `text-[0.6875rem] uppercase tracking-[0.15em] font-medium text-muted` |
| **Body / Description** | `text-sm text-subtext leading-relaxed` |

> **Không hardcode hex trong template** — dùng token `text-accent-soft`, `text-muted`, `text-subtext`.

---

## 4. Đặc tả Thành phần Chữ ký

### 4.1. FocusTimerOrb
- Bắt buộc dùng SVG `<circle>` với `stroke-dashoffset`. KHÔNG dùng `<progress>` hay progress-bar thẳng.
- Track ring: `stroke="var(--color-stage)"`, Progress: gradient từ `accent-soft` đến `accent`.
- `stroke-linecap="round"` bắt buộc.

### 4.2. BaseSlider (Mood Sliders)
- Track: `bg-component h-1 rounded-full`
- Thumb: chấm tròn `accent-soft` với `box-shadow` nhẹ (LED glow effect).

---

## 5. QA Checklist (Bắt buộc tự check trước khi báo cáo "Xong")

1. **[Border]** Có `border border-gray-...` nào không? → Đổi sang Ghost Border hoặc Tonal Depth.
2. **[Opacity]** Blur panel đã đạt `opacity < 70%` (tức `/60` trong Tailwind) chưa?
3. **[Radius]** Card dùng `rounded-2xl` đến `rounded-[2rem]`. Button bắt buộc `rounded-full`.
4. **[Color Token]** Text phụ đã dùng `text-muted` / `text-subtext` chưa? Không để trắng chói.
5. **[Hardcode]** Không có `#hex` hay `rgb(...)` nào trong template HTML chưa?
