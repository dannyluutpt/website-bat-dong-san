# NHẬT KÝ THỰC HIỆN DỰ ÁN (MEMORY.md)

Tài liệu này ghi lại toàn bộ các công việc đã thực hiện và phương thức triển khai để xây dựng website Bất động sản cao cấp cho môi giới cá nhân/đội ngũ nhỏ.

---

## 1. Các Công Việc Đã Thực Hiện

### Bước 1: Thiết kế kiến trúc hệ thống
- Thiết kế sơ đồ thực thể rút gọn (ERD Database Schema) gồm các bảng chính: `users` (Môi giới), `properties`, `categories`, `leads`.
- Thiết lập danh sách endpoints RESTful API cần thiết để phục vụ Front-end (Xác thực, Lọc sản phẩm, Đăng ký tư vấn).
- Chi tiết thiết kế được lưu tại [implementation_plan.md](file:///C:/Users/MHC-Marketing/.gemini/antigravity/brain/e1e72e55-c9ba-406d-8415-01bd60ac0159/implementation_plan.md).

### Bước 2: Khởi tạo dự án và cài đặt môi trường
- Khởi tạo dự án **Vite + React (JS)** bằng lệnh `create-vite`.
- Cài đặt các thư viện bổ trợ: **Tailwind CSS v4**, `@tailwindcss/postcss`, **autoprefixer**, và thư viện icon chất lượng cao **lucide-react**.

### Bước 3: Tạo hình ảnh thiết kế thực tế (Không dùng ảnh Placeholder)
Sử dụng công cụ tạo ảnh chuyên sâu để tạo ra các hình ảnh chất lượng cao và lưu trữ trực tiếp vào thư mục `/public` của dự án:
1. `luxury_hero_bg.png`: Phối cảnh biệt thự hiện đại sang trọng vào buổi hoàng hôn.
2. `luxury_penthouse.png`: Thiết kế nội thất căn hộ Penthouse tầm nhìn panorama sông nước.
3. `luxury_townhouse.png`: Mặt tiền nhà phố thương mại (shophouse) kiến trúc châu Âu hiện đại.
4. `luxury_resort_villa.png`: Biệt thự nghỉ dưỡng 6 sao sát biển Phú Quốc có bể bơi vô cực.
5. `agent_headshot.png`: Chân dung chuyên nghiệp của Agent Nguyễn Minh Châu.
6. `logo.png` (Cập nhật): Logo thiết kế dạng **Icon-only** tối giản, mạ vàng (gold) với biểu tượng khiên tích hợp chữ lồng **P** & **E** cách điệu nghệ thuật trên nền Navy đậm (đã được sửa đổi loại bỏ phần chữ text đi kèm để tối ưu hóa tính thẩm mỹ và chính xác).

### Bước 4: Tích hợp SEO & Font chữ
- Cập nhật [index.html](file:///e:/Website%20Bất%20động%20sản/index.html) để tích hợp font chữ cao cấp từ Google Fonts:
  - `Playfair Display`: Font chữ có chân thể hiện sự đẳng cấp, quý phái.
  - `Plus Jakarta Sans`: Font chữ không chân hiện đại, tăng khả năng đọc trên thiết bị di động.
- Bổ sung thẻ tiêu đề và meta description tối ưu SEO.

### Bước 5: Xây dựng máy chủ Backend hoàn chỉnh
- Khởi tạo thư mục `server/` và viết máy chủ API bằng **Node.js (Express)**.
- Kết nối CSDL **SQLite** (lưu dạng file `database.sqlite` trong thư mục server).
- Tự động tạo bảng và nạp dữ liệu mẫu (Seeding) cho danh mục, đại lý và danh sách dự án khi khởi động server lần đầu.
- Cài đặt **Nodemailer** tích hợp mockup/thực tế gửi thư báo về email của môi giới khi có Lead đăng ký tư vấn.
- Viết API endpoints:
  - `GET /api/properties`: Lọc dự án động theo từ khóa, khu vực, loại hình và khoảng giá.
  - `GET /api/properties/:slug`: Lấy chi tiết dự án.
  - `POST /api/leads`: Tiếp nhận và kiểm tra thông tin khách hàng.
  - `GET /api/agent/profile`: Lấy profile của môi giới.

### Bước 6: Refactor Front-end tích hợp API & Sửa lỗi hiển thị
- Cập nhật [App.jsx](file:///e:/Website%20Bất%20động%20sản/src/App.jsx) để gọi `fetch()` API thực tế từ backend Server.
- Cài đặt cơ chế **Fallback Mode (Dự phòng ngoại tuyến)** cực kỳ chuyên nghiệp: Nếu Backend Server không hoạt động hoặc mất kết nối, Front-end sẽ tự động phát hiện và sử dụng bộ dữ liệu mock nội bộ giúp website không bị lỗi màn hình trắng, giữ nguyên trải nghiệm khách hàng.
- **Sửa lỗi hiển thị Footer (Cập nhật):** Phát hiện và khắc phục lỗi Footer bị nền trắng/trong suốt làm chìm chữ màu trắng do viết nhầm tên class màu nền (`bg-slate-955` thành `bg-primary-955` chuẩn màu Navy và sửa viền `border-slate-850` thành `border-slate-800`).
- **Thay thế Logo (Cập nhật):** Chuyển từ logo chữ CSS ban đầu sang chèn hình ảnh Logo thiết kế `/public/logo.png` ở cả Header và Footer.

### Bước 7: Bảo mật, Tối ưu hóa & Deployment
- **Bảo mật:** Sử dụng `helmet` để chặn các lỗ hổng HTTP headers, cấu hình `cors` để chỉ cho phép Client được chỉ định truy cập.
- **Tối ưu hóa:** Thiết lập database **Indexing** trên các trường hay tìm kiếm (`region`, `price`, `category_id`, `is_featured`). Xây dựng hệ thống **In-Memory Caching** (TTL 5 phút) cho danh sách dự án không lọc để phản hồi nhanh chóng và giảm tải database.
- **Dockerization:**
  - Viết [Dockerfile](file:///e:/Website%20Bất%20động%20sản/Dockerfile) cho Front-end (multi-stage build phục vụ qua Nginx).
  - Viết [nginx.conf](file:///e:/Website%20Bất%20động%20sản/nginx.conf) cấu hình reverse proxy chuyển tiếp cuộc gọi `/api` để tránh lỗi CORS.
  - Viết [Dockerfile](file:///e:/Website%20Bất%20động%20sản/server/Dockerfile) cho Backend Node.js.
  - Viết [docker-compose.yml](file:///e:/Website%20Bất%20động%20sản/docker-compose.yml) ở thư mục gốc liên kết Front-end và Back-end khép kín cùng ổ đĩa volume ngoài cho SQLite để tránh mất mát dữ liệu.
- **Môi trường:** Tạo file cấu hình biến môi trường mẫu [.env.example](file:///e:/Website%20Bất%20động%20sản/server/.env.example) và [.env](file:///e:/Website%20Bất%20động%20sản/server/.env) chạy sẵn.

---

## 2. Phương Thức Và Công Cụ Thực Hiện

- **Khởi tạo & Cấu hình:** Sử dụng command-line để cài đặt dependencies trực tiếp cho server.
- **Tạo ảnh nghệ thuật:** Sử dụng `generate_image` với prompt mô tả phong cách kiến trúc cao cấp để lưu trữ ảnh thực tế, giúp website hoạt động sinh động ngay sau khi khởi chạy.
- **Kiểm thử chất lượng:** Chạy lệnh `npm run build` để kiểm tra toàn bộ lỗi cú pháp của ứng dụng React. Đồng thời khởi chạy thử server Node.js bằng lệnh `node index.js` kiểm tra quá trình Seeding CSDL và khởi động cổng thành công trước khi đóng gói bàn giao.
- **Lưu trữ & Triển khai (Mới):**
  - Đã kết nối tài khoản GitHub của user `dannyluutpt` và khởi tạo Repo tại: `https://github.com/dannyluutpt/website-bat-dong-san`.
  - Cấu hình base path tương đối trong `vite.config.js`.
  - Tạo tệp tin workflow GitHub Actions `.github/workflows/deploy.yml` tự động build và deploy lên nhánh `gh-pages` để phục vụ chạy demo static online trên GitHub Pages tại URL: `https://dannyluutpt.github.io/website-bat-dong-san/`.
  - Thực hiện push toàn bộ mã nguồn lên nhánh `main`.

