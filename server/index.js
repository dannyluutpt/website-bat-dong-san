import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { initDb, query, run, get } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Cấu hình Middleware bảo mật và CORS
app.use(helmet({
  crossOriginResourcePolicy: false, // Cho phép hiển thị ảnh từ thư mục public của backend nếu cần
}));

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// In-Memory Cache cho danh sách dự án nổi bật (Featured Properties) và danh mục
const CACHE_TTL = 5 * 60 * 1000; // 5 phút
let propertiesCache = {
  data: null,
  timestamp: 0
};
let categoriesCache = {
  data: null,
  timestamp: 0
};

// Hàm xóa cache khi có thay đổi dữ liệu (nếu có API cập nhật)
const invalidateCache = () => {
  propertiesCache.data = null;
  categoriesCache.data = null;
  console.log('Cache invalidated.');
};

// 1. GET /api/categories - Lấy danh mục
app.get('/api/categories', async (req, res) => {
  try {
    const now = Date.now();
    if (categoriesCache.data && (now - categoriesCache.timestamp < CACHE_TTL)) {
      console.log('Serving categories from cache');
      return res.json({ success: true, data: categoriesCache.data });
    }

    const categories = await query('SELECT * FROM categories');
    categoriesCache.data = categories;
    categoriesCache.timestamp = now;

    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Lỗi khi lấy danh mục:', error);
    res.status(500).json({ success: false, message: 'Lỗi server nội bộ' });
  }
});

// 2. GET /api/properties - Lấy danh sách dự án kèm Bộ lọc và Caching
app.get('/api/properties', async (req, res) => {
  try {
    const { search, location, category, priceRange } = req.query;

    // Kiểm tra xem có sử dụng bộ lọc nào không
    const hasFilters = search || location || category || priceRange;

    // Nếu không có bộ lọc (lấy toàn bộ) và cache còn hiệu lực -> dùng cache
    const now = Date.now();
    if (!hasFilters && propertiesCache.data && (now - propertiesCache.timestamp < CACHE_TTL)) {
      console.log('Serving properties list from cache');
      return res.json({ success: true, data: propertiesCache.data });
    }

    // Xây dựng truy vấn SQL động an toàn phòng ngừa SQL Injection
    let sql = `
      SELECT p.*, c.name as category_name 
      FROM properties p
      JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    // Lọc theo từ khóa tìm kiếm (search term)
    if (search) {
      sql += ' AND (p.title LIKE ? OR p.location LIKE ? OR p.description LIKE ?)';
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    // Lọc theo khu vực (region/location)
    if (location && location !== 'Tất cả') {
      sql += ' AND p.region = ?';
      params.push(location);
    }

    // Lọc theo danh mục (category name)
    if (category && category !== 'Tất cả') {
      sql += ' AND c.name = ?';
      params.push(category);
    }

    // Lọc theo khoảng giá
    if (priceRange && priceRange !== 'all') {
      if (priceRange === 'under-10') {
        sql += ' AND p.price < 10';
      } else if (priceRange === '10-30') {
        sql += ' AND p.price >= 10 AND p.price <= 30';
      } else if (priceRange === 'over-30') {
        sql += ' AND p.price > 30';
      }
    }

    // Sắp xếp mặc định: dự án nổi bật lên trước, sau đó theo giá giảm dần
    sql += ' ORDER BY p.is_featured DESC, p.price DESC';

    const rawProperties = await query(sql, params);
    
    // Parse chuỗi highlights từ DB (JSON string) thành mảng JSON đối tượng
    const properties = rawProperties.map(p => ({
      ...p,
      highlights: p.highlights ? JSON.parse(p.highlights) : []
    }));

    // Lưu vào cache nếu đây là truy vấn lấy toàn bộ danh sách không lọc
    if (!hasFilters) {
      propertiesCache.data = properties;
      propertiesCache.timestamp = now;
      console.log('Saved unfiltered properties list to cache.');
    }

    res.json({ success: true, data: properties });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách dự án:', error);
    res.status(500).json({ success: false, message: 'Lỗi server nội bộ' });
  }
});

// 3. GET /api/properties/:slug - Lấy chi tiết một dự án
app.get('/api/properties/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const property = await get(`
      SELECT p.*, c.name as category_name 
      FROM properties p
      JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ?
    `, [slug]);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy dự án' });
    }

    // Parse highlights
    property.highlights = property.highlights ? JSON.parse(property.highlights) : [];

    res.json({ success: true, data: property });
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết dự án:', error);
    res.status(500).json({ success: false, message: 'Lỗi server nội bộ' });
  }
});

// 4. POST /api/leads - Tiếp nhận đăng ký tư vấn (Lead Capture Form)
app.post('/api/leads', async (req, res) => {
  try {
    const { fullName, phone, email, propertyId, note } = req.body;

    // VALIDATION LOGIC
    // 1. Kiểm tra trường bắt buộc
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, message: 'Họ và tên không được để trống' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: 'Số điện thoại không được để trống' });
    }

    // 2. Validate định dạng Số điện thoại Việt Nam
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    if (!phoneRegex.test(phone.trim())) {
      return res.status(400).json({ success: false, message: 'Số điện thoại không hợp lệ (định dạng chuẩn 10 số)' });
    }

    // 3. Lưu thông tin Lead vào Database
    const result = await run(`
      INSERT INTO leads (full_name, phone, email, property_id, note)
      VALUES (?, ?, ?, ?, ?)
    `, [fullName.trim(), phone.trim(), email ? email.trim() : null, propertyId || null, note || null]);

    // Lấy thông tin dự án quan tâm (nếu có) để hiển thị trong mail báo cáo
    let propertyTitle = 'Không xác định / Tư vấn chung';
    if (propertyId) {
      const prop = await get('SELECT title FROM properties WHERE id = ?', [propertyId]);
      if (prop) propertyTitle = prop.title;
    }

    // TỰ ĐỘNG GỬI EMAIL THÔNG BÁO CHO AGENT (MOCKUP/MÔ PHỎNG NẾU THIẾU SMTP CONFIG)
    const emailConfigured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
    const notificationRecipient = process.env.NOTIFICATION_EMAIL || 'chau.nguyen@primeestates.vn';

    const mailContent = `
      ======================================================
      [THÔNG BÁO MỚI] CÓ KHÁCH HÀNG YÊU CẦU TƯ VẤN (LEAD)
      ======================================================
      - Họ tên khách hàng: ${fullName}
      - Số điện thoại: ${phone}
      - Email: ${email || 'Không cung cấp'}
      - Dự án quan tâm: ${propertyTitle}
      - Nhu cầu cụ thể: ${note || 'Tư vấn tổng quan'}
      - Thời gian đăng ký: ${new Date().toLocaleString('vi-VN')}
      ======================================================
    `;

    console.log(mailContent);

    if (emailConfigured) {
      // Thiết lập Transporter thực tế với Nodemailer
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true', // true cho 465, false cho các cổng khác
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: `"PrimeEstates Web Notification" <${process.env.SMTP_USER}>`,
        to: notificationRecipient,
        subject: `[Lead Mới] Khách hàng đăng ký tư vấn dự án: ${propertyTitle}`,
        text: mailContent,
        html: `
          <h3>Thông Báo Khách Hàng Tư Vấn Mới</h3>
          <p><strong>Họ tên:</strong> ${fullName}</p>
          <p><strong>Số điện thoại:</strong> <a href="tel:${phone}">${phone}</a></p>
          <p><strong>Email:</strong> ${email || 'Không cung cấp'}</p>
          <p><strong>Dự án quan tâm:</strong> ${propertyTitle}</p>
          <p><strong>Ghi chú:</strong> ${note || 'Tư vấn tổng quan'}</p>
          <br>
          <p><em>Vui lòng liên hệ lại khách hàng trong vòng 5-15 phút để đảm bảo tỷ lệ chuyển đổi tốt nhất!</em></p>
        `
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Lỗi khi gửi email thông báo thực tế:', error);
        } else {
          console.log('Email thông báo thực tế đã được gửi thành công:', info.response);
        }
      });
    } else {
      console.log('Lưu ý: SMTP chưa được cấu hình hoàn chỉnh. Thông báo Email đang chạy ở chế độ mô phỏng logs.');
    }

    res.status(201).json({
      success: true,
      message: 'Đăng ký nhận tư vấn thành công!',
      data: { leadId: result.id }
    });

  } catch (error) {
    console.error('Lỗi khi đăng ký Lead:', error);
    res.status(500).json({ success: false, message: 'Lỗi server nội bộ' });
  }
});

// 5. GET /api/agent/profile - Lấy thông tin Sale Agent
app.get('/api/agent/profile', async (req, res) => {
  try {
    const agent = await get('SELECT * FROM users LIMIT 1');
    if (!agent) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin Broker' });
    }
    res.json({ success: true, data: agent });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin Agent:', error);
    res.status(500).json({ success: false, message: 'Lỗi server nội bộ' });
  }
});

// Khởi chạy server và kết nối DB
const startServer = async () => {
  await initDb();
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Server đang chạy tại cổng http://localhost:${PORT}`);
    console.log(`🔒 Helmet & CORS bảo mật đã được kích hoạt`);
    console.log(`=======================================================`);
  });
};

startServer();
