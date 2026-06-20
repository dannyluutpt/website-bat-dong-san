import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Helper function to run SQL queries using Promises
export const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Initialize database schema and seed data
export const initDb = async () => {
  try {
    // 1. Tạo bảng Categories
    await run(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT
      )
    `);

    // 2. Tạo bảng Users (Sales Agent)
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        title TEXT,
        experience_years INTEGER,
        phone TEXT,
        email TEXT,
        bio TEXT,
        avatar_url TEXT
      )
    `);

    // 3. Tạo bảng Properties
    await run(`
      CREATE TABLE IF NOT EXISTS properties (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        category_id TEXT NOT NULL,
        location TEXT NOT NULL,
        region TEXT NOT NULL,
        price REAL NOT NULL,
        price_display TEXT NOT NULL,
        area REAL NOT NULL,
        bedrooms INTEGER,
        bathrooms REAL,
        status TEXT NOT NULL,
        image TEXT NOT NULL,
        description TEXT,
        highlights TEXT, -- Chuỗi JSON
        is_featured INTEGER DEFAULT 0,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      )
    `);

    // 4. Tạo bảng Leads
    await run(`
      CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        property_id TEXT,
        note TEXT,
        status TEXT DEFAULT 'Mới',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5. Thiết lập Index để tối ưu hóa truy vấn tìm kiếm
    await run(`CREATE INDEX IF NOT EXISTS idx_properties_region ON properties(region)`);
    await run(`CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price)`);
    await run(`CREATE INDEX IF NOT EXISTS idx_properties_category ON properties(category_id)`);
    await run(`CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(is_featured)`);

    console.log('Database tables and indexes verified successfully.');

    // 6. Seeding Data nếu trống
    const categoryCount = await get('SELECT COUNT(*) as count FROM categories');
    if (categoryCount.count === 0) {
      console.log('Seeding initial data...');
      
      // Seed Categories
      await run(`INSERT INTO categories VALUES ('c1', 'Căn hộ', 'can-ho', 'Căn hộ chung cư cao cấp, penthouse, duplex')`);
      await run(`INSERT INTO categories VALUES ('c2', 'Biệt thự', 'biet-thu', 'Biệt thự đơn lập, song lập, biệt thự nghỉ dưỡng sát biển')`);
      await run(`INSERT INTO categories VALUES ('c3', 'Nhà phố', 'nha-pho', 'Nhà phố thương mại shophouse, liền kề')`);

      // Seed Agent User
      await run(`
        INSERT INTO users VALUES (
          'u1',
          'Nguyễn Minh Châu',
          'Chuyên Gia Tư Vấn Bất Động Sản Cao Cấp',
          8,
          '090 123 4567',
          'chau.nguyen@primeestates.vn',
          'Tôi cam kết mang lại sự an tâm tuyệt đối và giá trị gia tăng bền vững cho quý khách hàng. Bằng việc phân tích sâu sắc các xu hướng vĩ mô, tôi không chỉ bán nhà mà còn đồng hành cùng quý vị trong việc định hình các kênh đầu tư bất động sản an toàn.',
          'agent_headshot.png'
        )
      `);

      // Seed Properties
      const sampleProperties = [
        {
          id: 'p1',
          title: 'Penthouse Grand Marina Saigon',
          slug: 'penthouse-grand-marina-saigon',
          category_id: 'c1',
          location: 'Quận 1, TP. Hồ Chí Minh',
          region: 'TP. Hồ Chí Minh',
          price: 18.5,
          price_display: '18.5 Tỷ',
          area: 120,
          bedrooms: 3,
          bathrooms: 3,
          status: 'Đang mở bán',
          image: 'luxury_penthouse.png',
          description: 'Căn hộ Penthouse đẳng cấp thượng lưu với tầm nhìn panorama trọn vẹn sông Sài Gòn và bến du thuyền sang trọng. Thiết kế nội thất phong cách Ý tinh tế, nội thất bàn giao cao cấp từ các thương hiệu hàng đầu thế giới.',
          highlights: JSON.stringify(['View sông trực diện', 'Bến du thuyền tư nhân', 'Quản lý bởi Marriott', 'Sở hữu lâu dài']),
          is_featured: 1
        },
        {
          id: 'p2',
          title: 'Townhouse The Manor Central Park',
          slug: 'townhouse-the-manor-central-park',
          category_id: 'c3',
          location: 'Hoàng Mai, Hà Nội',
          region: 'Hà Nội',
          price: 24.0,
          price_display: '24 Tỷ',
          area: 150,
          bedrooms: 4,
          bathrooms: 4.5,
          status: 'Đang bàn giao',
          image: 'luxury_townhouse.png',
          description: 'Nhà phố thương mại (shophouse) kiến trúc châu Âu đương đại, thích hợp kinh doanh sầm uất tại tầng trệt và sinh sống cao cấp tại các tầng trên. Nằm trong quần thể công viên trung tâm quy mô rộng lớn.',
          highlights: JSON.stringify(['Mặt tiền đường lớn', 'Hai lối đi riêng biệt', 'Thiết kế thông minh', 'Tiện ích nội khu 5 sao']),
          is_featured: 1
        },
        {
          id: 'p3',
          title: 'Regent Residences Phu Quoc',
          slug: 'regent-residences-phu-quoc',
          category_id: 'c2',
          location: 'Bãi Trường, Phú Quốc',
          region: 'Phú Quốc',
          price: 45.0,
          price_display: '45 Tỷ',
          area: 350,
          bedrooms: 4,
          bathrooms: 5,
          status: 'Sắp mở bán',
          image: 'luxury_resort_villa.png',
          description: 'Biệt thự nghỉ dưỡng 6 sao trực diện biển Phú Quốc, được vận hành bởi thương hiệu danh tiếng Regent. Sở hữu hồ bơi vô cực dài 20m riêng biệt, hồ cảnh quan yên bình và không gian mở hòa quyện cùng thiên nhiên.',
          highlights: JSON.stringify(['Trực diện biển', 'Vận hành bởi Regent', 'Cam kết doanh thu chia sẻ', 'Hồ bơi vô cực riêng']),
          is_featured: 1
        },
        {
          id: 'p4',
          title: 'Diamond Crown Hai Phong',
          slug: 'diamond-crown-hai-phong',
          category_id: 'c1',
          location: 'Ngô Quyền, Hải Phòng',
          region: 'Hải Phòng',
          price: 6.8,
          price_display: '6.8 Tỷ',
          area: 85,
          bedrooms: 2,
          bathrooms: 2,
          status: 'Đang mở bán',
          image: 'luxury_penthouse.png',
          description: 'Căn hộ biểu tượng kiến trúc Diagrid đỉnh cao duy nhất tại Hải Phòng, đạt giải thưởng công trình xanh LEED. Vị trí ngã tư Lê Hồng Phong kết nối sân bay Cát Bi chỉ trong 5 phút.',
          highlights: JSON.stringify(['Kiến trúc Diagrid độc đáo', 'Tiện ích Smart Home', 'Chứng chỉ xanh quốc tế', 'Ngay trung tâm TP']),
          is_featured: 0
        },
        {
          id: 'p5',
          title: 'The Rivus Elie Saab',
          slug: 'the-rivus-elie-saab',
          category_id: 'c2',
          location: 'TP. Thủ Đức, TP. Hồ Chí Minh',
          region: 'TP. Hồ Chí Minh',
          price: 120.0,
          price_display: '120 Tỷ',
          area: 500,
          bedrooms: 5,
          bathrooms: 6,
          status: 'Sắp mở bán',
          image: 'luxury_resort_villa.png',
          description: 'Dinh thự nghệ thuật Haute Couture phiên bản giới hạn được thiết kế trực tiếp bởi nhà thiết kế huyền thoại Elie Saab. Tọa lạc biệt lập bên sông, mang tính riêng tư tuyệt đối cho giới tinh hoa.',
          highlights: JSON.stringify(['Thiết kế bởi Elie Saab', 'Bến du thuyền định danh', 'Hầm rượu vang sang trọng', 'An ninh 3 lớp nghiêm ngặt']),
          is_featured: 1
        },
        {
          id: 'p6',
          title: 'Sunshine Golden River',
          slug: 'sunshine-golden-river',
          category_id: 'c1',
          location: 'Tây Hồ, Hà Nội',
          region: 'Hà Nội',
          price: 8.2,
          price_display: '8.2 Tỷ',
          area: 130,
          bedrooms: 3,
          bathrooms: 3,
          status: 'Đang bàn giao',
          image: 'luxury_townhouse.png',
          description: 'Căn hộ sở hữu sân vườn rộng tới 30m2 trên cao (Skyland) đột phá thiết kế tại khu đô thị quốc tế Ciputra. Tầm nhìn tuyệt đẹp hướng cầu Nhật Tân và sân golf Ciputra danh giá.',
          highlights: JSON.stringify(['Sân vườn trên cao riêng biệt', 'Mật độ căn hộ cực thấp', 'Hệ thống lọc nước tại vòi', 'Khu Ciputra thượng lưu']),
          is_featured: 0
        }
      ];

      for (const p of sampleProperties) {
        await run(`
          INSERT INTO properties (id, title, slug, category_id, location, region, price, price_display, area, bedrooms, bathrooms, status, image, description, highlights, is_featured)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [p.id, p.title, p.slug, p.category_id, p.location, p.region, p.price, p.price_display, p.area, p.bedrooms, p.bathrooms, p.status, p.image, p.description, p.highlights, p.is_featured]);
      }
      console.log('Seeding completed.');
    }
  } catch (error) {
    console.error('Error during database initialization:', error);
  }
};
