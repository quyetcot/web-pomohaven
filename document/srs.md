# Software Requirements Specification (SRS) - PomoTune

## Project: PomoTune - The Deep Focus Sanctuary

---

## 1. Tổng quan dự án (Project Overview)

- **Tên dự án:** PomoTune (Tên mã: The Deep Focus Sanctuary).
- **Mục tiêu:** Tạo ra một không gian làm việc tập trung trên trình duyệt, kết hợp phương pháp Pomodoro với âm nhạc từ YouTube và âm thanh môi trường để tối ưu hóa năng suất.
- **Giá trị cốt lõi:** Đơn giản - Tập trung - Cá nhân hóa dữ liệu - Trải nghiệm cao cấp.
- **Slogan:** "Quiet the noise, find your rhythm."

---

## 2. Đối tượng người dùng (User Personas)

- **Học sinh, sinh viên:** Cần môi trường học tập không xao nhãng.
- **Lập trình viên, người làm việc tự do (Freelancer):** Muốn quản lý thời gian và theo dõi hiệu suất làm việc.

---

## 3. Yêu cầu chức năng (Functional Requirements)

### 3.1. Focus Dashboard (Trang điều khiển chính)

- **Signature Focus Orb:** Bộ đếm thời gian dạng vòng tròn (Orb) với hiệu ứng Glassmorphism và vòng tiến độ (Progress ring) biến đổi theo thời gian thực.
- **Mode Selector:** Chuyển đổi linh hoạt giữa 3 chế độ: **Focus**, **Short Break**, **Long Break**.
- **Interactive Controls:** Điều khiển Start, Pause, Skip, và Reset phiên tập trung.
- **Daily Goals Widget:** Theo dõi tiến độ mục tiêu phiên tập trung trong ngày (ví dụ: 6/8 Sessions).
- **Focus Quote:** Hiển thị danh ngôn truyền cảm hứng thay đổi ngẫu nhiên.

### 3.2. Audio Sanctuary (Hệ thống âm thanh)

- **YouTube Seamless Integration:** Trình phát YouTube tích hợp hỗ trợ tìm kiếm trực tiếp và dán URL.
- **Ambient Mood Sliders:** Slider điều chỉnh âm thanh môi trường (như Rain, Wind, Cafe) độc lập với nhạc YouTube.
- **Smart Playlists:** Lưu trữ và hiển thị các Card playlist trực quan (Techno, Lofi, Nature).
- **Contextual Player:** Thanh mini-player điều khiển nhanh cố định (Sticky Bottom) hiển thị trạng thái phát và tiến độ phiên tập trung.
- **Smart Recommendations:** Đề xuất nhạc dựa trên lịch sử tập trung của người dùng.

### 3.3. Performance Analytics (Trang thống kê & Phân tích)

- **Metrics Bento Grid:** Hiển thị các chỉ số hiệu suất chính:
  - Total Focus Time (Giờ).
  - Sessions Completed (Số phiên).
  - Most Listened track/category (Dòng nhạc nghe nhiều nhất).
- **Weekly Productivity Chart:** Biểu đồ cột thể hiện mức độ tập trung trong tuần.
- **Focus Ratio:** Biểu đồ vòng cung so sánh tỷ lệ giữa Work (Làm việc) và Rest (Nghỉ ngơi/Break).
- **Consistency Map:** Heat-map hiển thị tần suất hoạt động theo ngày trong tháng (kiểu GitHub contribution heatmap).

### 3.4. System Configuration (Trang cài đặt)

- **Timer Logic:** Cấu hình thời gian mặc định cho Focus, Short Break, Long Break.
- **Audio Environment Control:** Cài đặt âm lượng mặc định, chế độ tự động phát nhạc khi bắt đầu phiên, tự động tạm dừng khi nghỉ.
- **Appearance (Theme System):** Hệ thống đổi chủ đề (Theme) với 3 phong cách cao cấp:
  - **Nocturne Focus:** Dark Blue (Mặc định).
  - **Solar Flare:** Warm Orange & Brown.
  - **Moonlight Mist:** Soft Blue & Grey.
- **User Account:** Quản lý thông tin hồ sơ, mật khẩu và đăng xuất.

---

## 4. Yêu cầu phi chức năng (Non-functional Requirements)

- **Độ tin cậy:** Đồng hồ phải chạy chính xác ngay cả khi tab bị ẩn (Sử dụng Web Workers để tránh trình duyệt "ngủ đông" timer).
- **Hiệu suất:** Thời gian phản hồi API mục tiêu dưới 200ms.
- **Tính tương thích:** Chạy ổn định trên các trình duyệt phổ biến: Chrome, Edge, Safari và Firefox.

---

## 5. Kiến trúc kỹ thuật (Technical Architecture)

| Thành phần | Công nghệ đề xuất |
| :--- | :--- |
| **Frontend Framework** | **Vue.js 3 / Nuxt.js** |
| **Styling** | **Tailwind CSS** (Sử dụng Custom Design Tokens) |
| **State Management** | **Pinia** (Quản lý trạng thái Timer và Audio toàn cục) |
| **Backend** | Node.js (Express) hoặc FastAPI |
| **Database** | PostgreSQL (Lưu lịch sử Sessions) |
| **Authentication** | JWT (JSON Web Token) + Google Auth Integration |
| **Deployment** | Vercel (Frontend), Render/Railway (Backend/DB) |

---

## 6. Lập lịch phát triển (Development Roadmap)

1. **Giai đoạn 1 (Design & Layout):** Hoàn thiện các trang Mockup Glassmorphism (Đã hoàn thành).
2. **Giai đoạn 2 (Logic Implementation):** Xây dựng Timer, tích hợp YouTube API và Mood Slider bằng Vue/Nuxt.
3. **Giai đoạn 3 (Data Persistence):** Xây dựng Backend và hệ thống Đăng nhập để lưu trữ Sessions.
4. **Giai đoạn 4 (Visual Polishing):** Triển khai hệ thống Theme và tối ưu hóa hiệu ứng chuyển cảnh.
