# QUY TẮC PHÁT TRIỂN WEBSITE BẤT ĐỘNG SẢN (PRIME ESTATES)

Tài liệu này lưu trữ các tiêu chuẩn thiết kế, phong cách và kiến trúc kỹ thuật của hệ thống nhằm đảm bảo tính đồng nhất khi phát triển các tính năng tiếp theo hoặc bàn giao cho các mô hình AI khác làm việc.

---

## 1. Nguyên Tắc Thiết Kế Giao Diện (UI/UX Guidelines)

- **Phong cách:** Sang trọng, hiện đại, chuẩn SaaS cao cấp, sử dụng khoảng trắng tốt (Spacious padding/margin) để tạo cảm giác thoáng đãng.
- **Hệ màu chủ đạo (Color Palette):**
  - **Primary (Nền/Khung):** Slate/Navy sẫm (`#0F172A` - Slate 900) kết hợp với màu trắng/xám siêu mịn (`#F8FAFC` - Slate 50).
  - **Accent (Điểm nhấn/Nổi bật):** Màu vàng Gold hoàng gia (`#C5A880` / `#D4AF37`) được dùng cho các huy hiệu trạng thái, nút kêu gọi hành động (CTA), icons và đường viền trang trí.
- **Typography:**
  - **Heading (H1, H2, H3):** Sử dụng font chữ có chân cao cấp `Playfair Display` để thể hiện sự uy tín và thượng lưu.
  - **Body text:** Sử dụng font chữ không chân hiện đại `Plus Jakarta Sans` hoặc `Inter` để tăng tính dễ đọc trên thiết bị di động.
- **Responsive:** Tất cả các thành phần giao diện phải được thiết kế dạng Mobile-First hoặc tối ưu hoàn hảo trên cả Mobile, Tablet, và Desktop.

---

## 2. Quy Tắc Thu Thập Lead & Tối Ưu Hóa Chuyển Đổi (CRO)

- **Form Đăng Ký:** Luôn giữ form đơn giản, chỉ yêu cầu tối thiểu Họ tên và Số điện thoại để giảm ma sát chuyển đổi.
- **CTA nổi bật:** Các nút "Nhận báo giá", "Liên hệ Hotline" hoặc "Nhận tài liệu" phải luôn được thiết kế nổi bật, sử dụng màu Gold hoặc Slate đậm.
- **Chính sách bảo mật:** Luôn có dòng lưu ý bảo mật thông tin 100% để xây dựng lòng tin với khách hàng.

---

## 3. Kiến Trúc Kỹ Thuật (System Architecture) & Bảo mật

- **Database Schema:** 
  - Các bảng cốt lõi gồm: `users` (Môi giới), `properties` (Dự án), `categories` (Loại hình), và `leads` (Khách hàng tiềm năng).
  - Khóa ngoại và ràng buộc thực thể phải được duy trì nghiêm ngặt.
- **Tối ưu hóa Database (Indexing):**
  - Luôn đảm bảo có các Index trên các cột tìm kiếm thường xuyên trong bảng `properties`: `region`, `price`, `category_id`, `is_featured`.
- **API Security:**
  - Kích hoạt **Helmet** để bảo mật HTTP headers.
  - Kích hoạt **CORS** kiểm soát chặt chẽ các domain được truy cập API.
  - **SQL Injection Prevention:** Luôn sử dụng Parameterized Queries (truy vấn tham số hóa `?` hoặc `$1`) khi tương tác với DB. Không bao giờ cộng chuỗi SQL trực tiếp với dữ liệu đầu vào của người dùng.
  - **Lead Validation:** Số điện thoại gửi lên bắt buộc phải được kiểm tra định dạng chính quy (Regex) của Việt Nam ở cả Front-end và Back-end trước khi lưu trữ vào DB.
- **Caching:**
  - Triển khai In-Memory Cache (hoặc Redis) cho danh sách dự án nổi bật và danh mục sản phẩm (TTL mặc định 5 phút) để tăng tốc độ phản hồi API dưới 50ms và giảm tải tối đa cho DB.

---

## 4. Quy tắc Triển Khai (Deployment Rules)

- **Dockerization:**
  - Ứng dụng phải luôn đi kèm `Dockerfile` chuẩn hóa (multi-stage build đối với Frontend React) và `docker-compose.yml` để dễ dàng chạy thử nghiệm trên máy host.
  - SQLite database phải được gắn volume ngoài (`./server/database.sqlite`) để tránh mất dữ liệu khách hàng (Leads) khi container khởi động lại.
- **Nginx Reverse Proxy:**
  - Sử dụng Nginx làm reverse proxy để định tuyến các cuộc gọi `/api/*` tới backend nhằm giải quyết triệt để lỗi CORS khi triển khai Production.
