---
name: PomoDesign Master
description: Duy trì tính nhất quán cho triết lý thiết kế "Deep Focus Sanctuary" của PomoTune.
---

# PomoDesign Master Skill (v3.0)

Kỹ năng này định nghĩa tư duy thiết kế và cách thức hiện thực hóa phong cách **"High-End Editorial"** (Sang trọng, biên tập) và **"The Deep Focus Sanctuary"** bằng mã nguồn (Tailwind CSS & Vue 3).

## Nguyên lý Cốt lõi (Core Principles)

- **Tránh sự ngột ngạt (Anti-Boxy):** Hủy bỏ các đường viền cứng nhắc (`border-solid`). Mọi khối (block) phải phân tách bằng Tonal Depth (độ sâu màu) hoặc Ghost Border.
- **Tập trung Không gian (Intentional Asymmetry):** Tận dụng tối đa khoảng trắng (Whitespace) để mắt người dùng được "nghỉ ngơi".
- **Chuyển động Hô hấp (Breathing Animations):** Mọi chuyển động (hover, click, timer) cần mượt mà, chậm rãi (tối thiểu `duration-300`).

---

## 1. Hệ thống Phân tầng (Tonal Elevation Architecture)

Mô phỏng các tấm kính mờ (frosted glass) nổi dần lên khỏi một vực thẳm xanh thẫm (Deep blue void).

| Cấp độ | Tên gọi | Tailwind Class đề xuất | Chức năng UI |
| :--- | :--- | :--- | :--- |
| **Level 0** | The Void | `bg-[#10131a]` | Background của toàn bộ trang / Canvas. |
| **Level 1** | The Stage | `bg-[#191c22]` | Vùng chứa nội dung lớn (Sidebar, Cột, Section). |
| **Level 2** | The Component | `bg-[#272a31]` | Card nổi (Bento block), List nhạc, Settings panel. |
| **Level 3** | Floating Glass | `bg-[#363940]/60 backdrop-blur-2xl` | Modal, Tooltip, Flyout menu. |

---

## 2. Bí quyết Kỹ thuật: Glassmorphism & Ghost Border

Tuyệt đối **KHÔNG SỬ DỤNG** viền đặc (`border-white/10`). Phải tạo viền chỉ phát sáng ở góc đón ánh sáng (trên-trái).

### Viền "Bóng ma" (Ghost Border) trên Nuxt / Tailwind
```html
<!-- Dành cho các thẻ Card Level 2/3 -->
<div class="relative rounded-[2rem] bg-[#272a31]/60 backdrop-blur-[24px] overflow-hidden">
  
  <!-- Lớp Ghost Border hắt sáng từ viền trên -->
  <div class="absolute inset-0 border-t border-l border-[#adc6ff]/10 rounded-[2rem] pointer-events-none"></div>
  
  <slot />
</div>
```

### Signature Glow (Ánh sáng tỏa)
Thay vì Dropshadow màu đen (`shadow-lg`), hãy dùng ánh sáng màu Glow:
```html
<button class="bg-[#4b8eff] text-white rounded-full transition-all duration-300 hover:shadow-[0_0_24px_rgba(75,142,255,0.4)]">
  Bắt đầu
</button>
```

---

## 3. Nghệ thuật Typography (Editorial Typography)

Để UI trông đắt tiền, bắt buộc phải tạo sự **tương phản khắt khe** giữa Text cực lớn (Metric) và Text cực nhỏ (Label). Mọi Font dùng `font-['Inter']`.

- **Thống trị (The Timer / Big Metrics):**
  - **Class:** `text-5xl md:text-7xl font-bold tracking-[-0.04em] text-[#adc6ff]`
  - **Lưu ý:** Tracking (khoảng cách chữ) phải âm để các số sít vào nhau, tạo thành một khối kiến trúc.
- **Siêu dữ liệu (Technical Labels):**
  - **Class:** `text-[0.6875rem] uppercase tracking-[0.15em] font-medium text-[#c1c6d7]`
  - **Lưu ý:** Tracking phải rất rộng (+0.15em) để chữ dễ đọc khi ở kích thước bé xíu (11px).

---

## 4. Đặc tả Thành phần Chữ ký (Signature Components)

### 4.1. The Focus Orb (Đồng hồ đếm ngược)
Đây là "linh hồn" của App. Không dùng `progress-bar` thẳng. Phải dùng SVG Circle với hiệu ứng `stroke-dashoffset`.
- **Màu nền vòng (Track):** `#191c22`
- **Màu chạy tiến độ:** `stroke="url(#glowGradient)"`
- **Gradient:** Tuyến tính từ `#adc6ff` sang `#4b8eff`.
- **Logic:** Stroke (viền) không được có góc vuông (`stroke-linecap="round"`).

### 4.2. Mood-Sliders (Thanh trượt môi trường)
Bỏ qua input range truyền thống. 
- **Style thanh trượt (Track/Rail):** `bg-[#32353c] h-1 rounded-full`.
- **Nút kéo (Thumb):** Một chấm tròn màu `#adc6ff` có `box-shadow` nhẹ để giả làm một bóng đèn LED đang phát sáng.

---

## 5. Danh sách nghiệm thu chất lượng UX (The QA Checklist)

Khi phát triển bất kỳ tính năng UI nào, AI Agent PHẢI tự hỏi:
1. **[Quy tắc đường viền]** Có lỡ tay code `border border-gray-...` ở đâu không? Phải chuyển ngay thành Tonal Depth hoặc Ghost Border.
2. **[Quy tắc độ mờ]** Các Blur panel đã đạt độ trong suốt `< 70%` chưa?
3. **[Quy tắc góc bo]** Góc bo có đủ mềm mại không? Box thì dùng `rounded-2xl` đến `rounded-[2rem]`. Button thì bắt buộc `rounded-full`.
4. **[Quy tắc chữ nhạt]** Các Text phụ (Subtext) đã đổi màu sang `#c1c6d7` để giảm chú ý chưa? Tuyệt đối không để text phụ có màu trắng chói mắt.
