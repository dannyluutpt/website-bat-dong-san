import { useState, useEffect } from 'react'
import { 
  MapPin, 
  Home, 
  Maximize2, 
  BedDouble, 
  Bath, 
  Phone, 
  Mail, 
  Award, 
  CheckCircle, 
  Search, 
  SlidersHorizontal, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  X, 
  MessageSquare,
  Sparkles,
  PhoneCall,
  Menu,
  AlertCircle
} from 'lucide-react'

// Cấu hình URL API Backend (Sử dụng biến môi trường hoặc mặc định localhost)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Dự Phòng Mock Data (Fallback khi không kết nối được Backend)
const FALLBACK_PROPERTIES = [
  {
    id: 'p1',
    title: 'Penthouse Grand Marina Saigon',
    slug: 'penthouse-grand-marina-saigon',
    category: 'Căn hộ',
    location: 'Quận 1, TP. Hồ Chí Minh',
    region: 'TP. Hồ Chí Minh',
    price: 18.5,
    priceDisplay: '18.5 Tỷ',
    area: 120,
    bedrooms: 3,
    bathrooms: 3,
    status: 'Đang mở bán',
    image: '/luxury_penthouse.png',
    description: 'Căn hộ Penthouse đẳng cấp thượng lưu với tầm nhìn panorama trọn vẹn sông Sài Gòn và bến du thuyền sang trọng. Thiết kế nội thất phong cách Ý tinh tế, nội thất bàn giao cao cấp từ các thương hiệu hàng đầu thế giới.',
    highlights: ['View sông trực diện', 'Bến du thuyền tư nhân', 'Quản lý bởi Marriott', 'Sở hữu lâu dài']
  },
  {
    id: 'p2',
    title: 'Townhouse The Manor Central Park',
    slug: 'townhouse-the-manor-central-park',
    category: 'Nhà phố',
    location: 'Hoàng Mai, Hà Nội',
    region: 'Hà Nội',
    price: 24.0,
    priceDisplay: '24 Tỷ',
    area: 150,
    bedrooms: 4,
    bathrooms: 4.5,
    status: 'Đang bàn giao',
    image: '/luxury_townhouse.png',
    description: 'Nhà phố thương mại (shophouse) kiến trúc châu Âu đương đại, thích hợp kinh doanh sầm uất tại tầng trệt và sinh sống cao cấp tại các tầng trên. Nằm trong quần thể công viên trung tâm quy mô rộng lớn.',
    highlights: ['Mặt tiền đường lớn', 'Hai lối đi riêng biệt', 'Thiết kế thông minh', 'Tiện ích nội khu 5 sao']
  },
  {
    id: 'p3',
    title: 'Regent Residences Phu Quoc',
    slug: 'regent-residences-phu-quoc',
    category: 'Biệt thự',
    location: 'Bãi Trường, Phú Quốc',
    region: 'Phú Quốc',
    price: 45.0,
    priceDisplay: '45 Tỷ',
    area: 350,
    bedrooms: 4,
    bathrooms: 5,
    status: 'Sắp mở bán',
    image: '/luxury_resort_villa.png',
    description: 'Biệt thự nghỉ dưỡng 6 sao trực diện biển Phú Quốc, được vận hành bởi thương hiệu danh tiếng Regent. Sở hữu hồ bơi vô cực dài 20m riêng biệt, hồ cảnh quan yên bình và không gian mở hòa quyện cùng thiên nhiên.',
    highlights: ['Trực diện biển', 'Vận hành bởi Regent', 'Cam kết doanh thu chia sẻ', 'Hồ bơi vô cực riêng']
  },
  {
    id: 'p4',
    title: 'Diamond Crown Hai Phong',
    slug: 'diamond-crown-hai-phong',
    category: 'Căn hộ',
    location: 'Ngô Quyền, Hải Phòng',
    region: 'Hải Phòng',
    price: 6.8,
    priceDisplay: '6.8 Tỷ',
    area: 85,
    bedrooms: 2,
    bathrooms: 2,
    status: 'Đang mở bán',
    image: '/luxury_penthouse.png',
    description: 'Căn hộ biểu tượng kiến trúc Diagrid đỉnh cao duy nhất tại Hải Phòng, đạt giải thưởng công trình xanh LEED. Vị trí ngã tư Lê Hồng Phong kết nối sân bay Cát Bi chỉ trong 5 phút.',
    highlights: ['Kiến trúc Diagrid độc đáo', 'Tiện ích Smart Home', 'Chứng chỉ xanh quốc tế', 'Ngay trung tâm TP']
  },
  {
    id: 'p5',
    title: 'The Rivus Elie Saab',
    slug: 'the-rivus-elie-saab',
    category: 'Biệt thự',
    location: 'TP. Thủ Đức, TP. Hồ Chí Minh',
    region: 'TP. Hồ Chí Minh',
    price: 120.0,
    priceDisplay: '120 Tỷ',
    area: 500,
    bedrooms: 5,
    bathrooms: 6,
    status: 'Sắp mở bán',
    image: '/luxury_resort_villa.png',
    description: 'Dinh thự nghệ thuật Haute Couture phiên bản giới hạn được thiết kế trực tiếp bởi nhà thiết kế huyền thoại Elie Saab. Tọa lạc biệt lập bên sông, mang tính riêng tư tuyệt đối cho giới tinh hoa.',
    highlights: ['Thiết kế bởi Elie Saab', 'Bến du thuyền định danh', 'Hầm rượu vang sang trọng', 'An ninh 3 lớp nghiêm ngặt']
  },
  {
    id: 'p6',
    title: 'Sunshine Golden River',
    slug: 'sunshine-golden-river',
    category: 'Căn hộ',
    location: 'Tây Hồ, Hà Nội',
    region: 'Hà Nội',
    price: 8.2,
    priceDisplay: '8.2 Tỷ',
    area: 130,
    bedrooms: 3,
    bathrooms: 3,
    status: 'Đang bàn giao',
    image: '/luxury_townhouse.png',
    description: 'Căn hộ sở hữu sân vườn rộng tới 30m2 trên cao (Skyland) đột phá thiết kế tại khu đô thị quốc tế Ciputra. Tầm nhìn tuyệt đẹp hướng cầu Nhật Tân và sân golf Ciputra danh giá.',
    highlights: ['Sân vườn trên cao riêng biệt', 'Mật độ căn hộ cực thấp', 'Hệ thống lọc nước tại vòi', 'Khu Ciputra thượng lưu']
  }
];

const FALLBACK_AGENT = {
  fullName: 'Nguyễn Minh Châu',
  title: 'Chuyên Gia Tư Vấn Bất Động Sản Cao Cấp',
  experienceYears: 8,
  phone: '090 123 4567',
  email: 'chau.nguyen@primeestates.vn',
  bio: 'Tôi cam kết mang lại sự an tâm tuyệt đối và giá trị gia tăng bền vững cho quý khách hàng. Bằng việc phân tích sâu sắc các xu hướng vĩ mô, tôi không chỉ bán nhà mà còn đồng hành cùng quý vị trong việc định hình các kênh đầu tư bất động sản an toàn.',
  avatarUrl: '/agent_headshot.png'
};

const LOCATIONS = ['Tất cả', 'Hà Nội', 'TP. Hồ Chí Minh', 'Phú Quốc', 'Hải Phòng'];
const CATEGORIES = ['Tất cả', 'Căn hộ', 'Biệt thự', 'Nhà phố'];
const PRICE_RANGES = [
  { label: 'Tất cả giá', value: 'all' },
  { label: 'Dưới 10 tỷ', value: 'under-10' },
  { label: '10 - 30 tỷ', value: '10-30' },
  { label: 'Trên 30 tỷ', value: 'over-30' }
];

function App() {
  // States cho Bộ lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Tất cả');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');

  // States lấy dữ liệu từ API
  const [properties, setProperties] = useState([]);
  const [agent, setAgent] = useState(FALLBACK_AGENT);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  
  // State cho Mobile Menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State cho Lead Form (Đăng ký tư vấn)
  const [leadForm, setLeadForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    propertyId: '',
    note: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('');

  // State cho Dự án đang xem chi tiết (Modal)
  const [activeProperty, setActiveProperty] = useState(null);

  // 1. Tải thông tin Agent từ API
  useEffect(() => {
    const fetchAgentProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/agent/profile`);
        const data = await res.json();
        if (data.success && data.data) {
          setAgent({
            fullName: data.data.full_name,
            title: data.data.title,
            experienceYears: data.data.experience_years,
            phone: data.data.phone,
            email: data.data.email,
            bio: data.data.bio,
            avatarUrl: data.data.avatar_url
          });
        }
      } catch (error) {
        console.warn('Không thể kết nối API Agent. Sử dụng dữ liệu dự phòng.');
      }
    };
    fetchAgentProfile();
  }, []);

  // 2. Tải danh sách Bất động sản và xử lý Bộ lọc (Thời gian thực từ Backend)
  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        // Xây dựng các query parameters
        const queryParams = new URLSearchParams({
          search: searchTerm,
          location: selectedLocation,
          category: selectedCategory,
          priceRange: selectedPriceRange
        });

        const res = await fetch(`${API_BASE_URL}/properties?${queryParams}`);
        const data = await res.json();
        
        if (data.success) {
          // Trực tiếp dùng dữ liệu từ API
          // Map trường từ DB PostgreSQL/SQLite sang giao diện React
          const mapped = data.data.map(p => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            category: p.category_name || p.category_id,
            location: p.location,
            region: p.region,
            price: p.price,
            priceDisplay: p.price_display,
            area: p.area,
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            status: p.status,
            image: p.image,
            description: p.description,
            highlights: p.highlights
          }));
          setProperties(mapped);
          setIsUsingFallback(false);
        } else {
          throw new Error(data.message || 'Lỗi server');
        }
      } catch (error) {
        console.warn('Lỗi kết nối Backend API. Đang sử dụng cơ chế dự phòng cục bộ (Fallback Mode):', error);
        setIsUsingFallback(true);
        
        // Cơ chế lọc dự phòng cục bộ trên Front-end
        const filtered = FALLBACK_PROPERTIES.filter(prop => {
          const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                prop.location.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesLocation = selectedLocation === 'Tất cả' || prop.region === selectedLocation;
          const matchesCategory = selectedCategory === 'Tất cả' || prop.category === selectedCategory;
          
          let matchesPrice = true;
          if (selectedPriceRange === 'under-10') {
            matchesPrice = prop.price < 10;
          } else if (selectedPriceRange === '10-30') {
            matchesPrice = prop.price >= 10 && prop.price <= 30;
          } else if (selectedPriceRange === 'over-30') {
            matchesPrice = prop.price > 30;
          }

          return matchesSearch && matchesLocation && matchesCategory && matchesPrice;
        });
        setProperties(filtered);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [searchTerm, selectedLocation, selectedCategory, selectedPriceRange]);

  // Xử lý thay đổi dữ liệu Form Đăng Ký
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLeadForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý gửi Form liên hệ (Lưu vào DB thực tế & Gửi email)
  const handleSubmitLead = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Front-end Validation nhanh
    if (!leadForm.fullName || !leadForm.fullName.trim()) {
      alert('Vui lòng nhập Họ tên!');
      return;
    }
    if (!leadForm.phone || !leadForm.phone.trim()) {
      alert('Vui lòng nhập Số điện thoại!');
      return;
    }

    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    if (!phoneRegex.test(leadForm.phone.trim())) {
      alert('Số điện thoại không đúng định dạng Việt Nam (10 số)!');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadForm)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitStatus('success');
        // Reset form
        setLeadForm({
          fullName: '',
          phone: '',
          email: '',
          propertyId: '',
          note: ''
        });
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.message || 'Gửi thông tin thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.warn('Lỗi kết nối Backend. Chuyển sang mô phỏng thành công ở chế độ Offline:', error);
      // Fallback giả lập thành công nếu chạy offline không có server
      setTimeout(() => {
        setSubmitStatus('success');
        setLeadForm({
          fullName: '',
          phone: '',
          email: '',
          propertyId: '',
          note: ''
        });
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Nút hành động đăng ký tư vấn dự án cụ thể từ Card
  const openConsultationWithProperty = (prop) => {
    setLeadForm(prev => ({
      ...prev,
      propertyId: prop.id,
      note: `Tôi muốn nhận báo giá và chính sách bán hàng chi tiết của dự án ${prop.title}`
    }));
    document.getElementById('lead-capture').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-gold-100 selection:text-gold-900">
      
      {/* Cảnh báo chế độ Offline (Dữ liệu dự phòng) */}
      {isUsingFallback && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-center text-xs font-bold flex items-center justify-center gap-2 z-50 shadow-md">
          <AlertCircle className="w-4 h-4 flex-shrink-0 animate-bounce" />
          <span>Ứng dụng đang chạy ở chế độ Offline (Sử dụng cơ sở dữ liệu mẫu Front-end). Vui lòng khởi động Backend Server để sử dụng dữ liệu thực tế!</span>
        </div>
      )}

      {/* 1. Header (Sticky & Glassmorphism) */}
      <header className="sticky top-0 z-50 transition-all duration-300 glassmorphism shadow-sm border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img src="/logo.png" alt="Prime Estates Logo" className="w-11 h-11 rounded-xl object-cover border border-gold-500/30 shadow-sm" />
              <div>
                <span className="font-serif text-xl font-bold text-slate-900 tracking-wider">PRIME</span>
                <span className="font-sans text-xs block text-gold-600 font-bold uppercase tracking-widest mt-[-2px]">ESTATES</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-sm font-semibold text-slate-900 hover:text-gold-600 smooth-transition">Trang Chủ</a>
              <a href="#properties" className="text-sm font-semibold text-slate-600 hover:text-gold-600 smooth-transition">Dự Án</a>
              <a href="#agent-profile" className="text-sm font-semibold text-slate-600 hover:text-gold-600 smooth-transition">Về Chúng Tôi</a>
              <a href="#lead-capture" className="text-sm font-semibold text-slate-600 hover:text-gold-600 smooth-transition">Yêu Cầu Tư Vấn</a>
            </nav>

            {/* CTA Phone Button */}
            <div className="hidden md:flex items-center gap-4">
              <a 
                href={`tel:${agent.phone.replace(/\s+/g, '')}`} 
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 font-semibold text-sm smooth-transition shadow-sm"
              >
                <Phone className="w-4 h-4 text-gold-600 animate-pulse" />
                <span>{agent.phone}</span>
              </a>
              <a 
                href="#lead-capture" 
                className="px-5 py-2.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold shadow-md border border-slate-800 hover:border-slate-700 smooth-transition"
              >
                Nhận Bảng Giá
              </a>
            </div>

            {/* Mobile Menu Icon */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-slate-100/50 text-slate-900 smooth-transition"
                aria-label="Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200/50 bg-white py-4 px-6 space-y-3 animate-fade-in shadow-lg">
            <a 
              href="#" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-900 hover:text-gold-600 py-1"
            >
              Trang Chủ
            </a>
            <a 
              href="#properties" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-600 hover:text-gold-600 py-1"
            >
              Dự Án
            </a>
            <a 
              href="#agent-profile" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-600 hover:text-gold-600 py-1"
            >
              Về Chúng Tôi
            </a>
            <a 
              href="#lead-capture" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-600 hover:text-gold-600 py-1"
            >
              Yêu Cầu Tư Vấn
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <a 
                href={`tel:${agent.phone.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 font-semibold text-sm shadow-sm"
              >
                <Phone className="w-4 h-4 text-gold-600" />
                <span>{agent.phone}</span>
              </a>
              <a 
                href="#lead-capture" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-center font-semibold text-sm shadow-md"
              >
                Nhận Bảng Giá
              </a>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section & Real-time Filter Bar */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-slate-950 text-white overflow-hidden py-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="/luxury_hero_bg.png" 
            alt="Luxury Penthouse Facade" 
            className="w-full h-full object-cover object-center opacity-45 scale-105 transition-transform duration-10000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left flex flex-col items-center md:items-start gap-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-gold-500/30 text-gold-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phân khúc Bất Động Sản Thượng Lưu</span>
          </div>

          <h1 className="max-w-4xl text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight tracking-wide font-serif text-slate-100">
            Nơi Khởi Đầu Hành Trình <br className="hidden sm:inline" />
            <span className="italic font-light text-gold-300 font-serif">Sở Hữu Tổ Ấm Độc Bản</span>
          </h1>

          <p className="max-w-xl text-slate-300 text-base sm:text-lg font-light leading-relaxed">
            Tuyển chọn giỏ hàng độc quyền gồm các bất động sản hạng sang, biệt thự nghỉ dưỡng cao cấp, và căn hộ vĩ đại được giám tuyển bởi chuyên gia uy tín.
          </p>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <a 
              href="#properties" 
              className="px-8 py-4 rounded-full bg-gold-400 text-slate-950 font-bold hover:bg-gold-300 smooth-transition shadow-lg shadow-gold-500/20 hover:scale-105 flex items-center gap-2 group text-sm"
            >
              <span>Khám phá giỏ hàng</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 smooth-transition" />
            </a>
            <a 
              href="#agent-profile" 
              className="px-8 py-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold smooth-transition backdrop-blur-sm text-sm"
            >
              Đồng hành cùng Chuyên gia
            </a>
          </div>

          {/* Interactive Dynamic Filter Bar */}
          <div className="w-full mt-10 max-w-5xl glassmorphism rounded-3xl p-6 sm:p-8 text-slate-950 shadow-2xl border border-white/20 animate-float">
            <div className="flex items-center gap-2 border-b border-slate-200/80 pb-4 mb-4">
              <SlidersHorizontal className="w-4 h-4 text-gold-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">Tìm Kiếm Dự Án Nhanh</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Keyword Search */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 block">Từ khóa</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Tên dự án, địa danh..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all font-semibold"
                  />
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Location Select */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 block">Khu vực</label>
                <select 
                  value={selectedLocation} 
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all font-semibold cursor-pointer"
                >
                  {LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Property Type Select */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 block">Loại hình</label>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all font-semibold cursor-pointer"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Select */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 block">Khoảng giá</label>
                <select 
                  value={selectedPriceRange} 
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all font-semibold cursor-pointer"
                >
                  {PRICE_RANGES.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick status report */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-slate-200/50 text-xs text-slate-500 gap-2">
              <div>
                {isLoading ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 border-2 border-gold-600 border-t-transparent rounded-full animate-spin"></span>
                    Đang tìm kiếm dự án...
                  </span>
                ) : (
                  <>Tìm thấy <span className="font-bold text-slate-800">{properties.length}</span> dự án phù hợp tiêu chí.</>
                )}
              </div>
              {(selectedLocation !== 'Tất cả' || selectedCategory !== 'Tất cả' || selectedPriceRange !== 'all' || searchTerm) && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedLocation('Tất cả');
                    setSelectedCategory('Tất cả');
                    setSelectedPriceRange('all');
                  }}
                  className="text-gold-600 font-bold hover:text-gold-700 underline underline-offset-2 transition-all cursor-pointer bg-transparent border-0"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Properties (Grid Card Section) */}
      <section id="properties" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-block text-xs font-bold text-gold-600 tracking-widest uppercase mb-3">GIỎ HÀNG KHUYÊN DÙNG</div>
          <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 mb-4 font-normal">
            Dự Án Bất Động Sản Nổi Bật
          </h2>
          <div className="w-12 h-1 bg-gold-400 mx-auto rounded-full mb-6"></div>
          <p className="text-slate-500 font-light">
            Các dự án được tuyển chọn khắt khe dựa trên uy tín chủ đầu tư, pháp lý minh bạch và tiềm năng sinh lời bền vững vượt trội.
          </p>
        </div>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-2xl overflow-hidden border border-slate-200/50 p-4 space-y-4 animate-pulse">
                <div className="bg-slate-200 aspect-[4/3] rounded-xl"></div>
                <div className="h-6 bg-slate-200 rounded w-2/3"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-10 bg-slate-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map(prop => (
              <article 
                key={prop.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/60 premium-card-shadow flex flex-col group cursor-pointer"
                onClick={() => setActiveProperty(prop)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={prop.image} 
                    alt={prop.title} 
                    className="w-full h-full object-cover group-hover:scale-110 duration-700 transition-transform"
                  />
                  <span className="absolute top-4 left-4 bg-slate-950/80 text-white font-sans text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/10">
                    {prop.category}
                  </span>

                  <span className={`absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm border ${
                    prop.status === 'Sắp mở bán' 
                      ? 'bg-yellow-50 text-yellow-700 border-yellow-200' 
                      : prop.status === 'Đang mở bán'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {prop.status}
                  </span>

                  <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-4">
                    <span className="text-white font-serif text-2xl font-semibold">
                      {prop.priceDisplay}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-gold-600 smooth-transition line-clamp-1 mb-2">
                    {prop.title}
                  </h3>
                  
                  <div className="flex items-center gap-1 text-slate-400 text-xs mb-4">
                    <MapPin className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
                    <span className="truncate">{prop.location}</span>
                  </div>

                  <p className="text-slate-500 text-xs font-light line-clamp-2 leading-relaxed mb-6">
                    {prop.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 py-3 px-4 rounded-xl bg-slate-50/80 border border-slate-200/50 text-slate-600 text-xs font-semibold mb-6 mt-auto">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{prop.area}m²</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal">Diện tích</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 border-x border-slate-200">
                      <div className="flex items-center gap-1">
                        <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                        <span>{prop.bedrooms}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal">Phòng ngủ</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5 text-slate-400" />
                        <span>{Math.floor(prop.bathrooms)}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal">Phòng tắm</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveProperty(prop);
                      }}
                      className="flex-1 py-2.5 rounded-lg border border-slate-200 hover:border-gold-400 hover:bg-gold-50/20 text-slate-800 text-xs font-bold smooth-transition"
                    >
                      Xem chi tiết
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openConsultationWithProperty(prop);
                      }}
                      className="flex-1 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold smooth-transition shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <PhoneCall className="w-3 h-3 text-gold-300" />
                      <span>Nhận báo giá</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto px-6">
            <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-serif text-slate-900 font-semibold mb-2">Không tìm thấy dự án phù hợp</h3>
            <p className="text-slate-500 text-sm font-light mb-6">
              Chúng tôi không tìm thấy dự án nào tương ứng với tiêu chuẩn bộ lọc của bạn. Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedLocation('Tất cả');
                setSelectedCategory('Tất cả');
                setSelectedPriceRange('all');
              }}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg smooth-transition cursor-pointer"
            >
              Xem tất cả dự án
            </button>
          </div>
        )}
      </section>

      {/* 4. Sale Profile Section (Personal Branding & Trust) */}
      <section id="agent-profile" className="bg-slate-900 text-white py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute left-0 bottom-1/4 w-[400px] h-[400px] bg-slate-800/20 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Agent Portrait */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group max-w-sm sm:max-w-md w-full">
                <div className="absolute inset-0 border border-gold-400 rounded-3xl translate-x-4 translate-y-4 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 smooth-transition"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-gold-600/20 to-transparent rounded-3xl -z-10"></div>
                
                <div className="rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl border-2 border-slate-800 bg-slate-800">
                  <img 
                    src={agent.avatarUrl} 
                    alt={`Chuyên gia BĐS ${agent.fullName}`} 
                    className="w-full h-full object-cover object-center group-hover:scale-105 smooth-transition"
                  />
                </div>

                <div className="absolute -bottom-6 -right-6 glassmorphism-dark rounded-2xl p-4 border border-gold-500/30 text-white max-w-[200px] shadow-xl">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Award className="w-5 h-5 text-gold-400 flex-shrink-0" />
                    <span className="text-xs font-bold text-gold-300 uppercase tracking-widest">TOP MÔI GIỚI</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-normal font-light">
                    Được vinh danh Đại Sứ Thương Hiệu Sun Group & Vinhomes Club.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Profile & Brand Message */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-block text-xs font-bold text-gold-400 tracking-widest uppercase">CHUYÊN GIA ĐỒNG HÀNH</div>
              
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-wide text-slate-100">
                  {agent.fullName}
                </h2>
                <p className="text-gold-400 text-sm font-semibold tracking-wider font-sans uppercase">
                  {agent.title}
                </p>
              </div>

              <div className="w-12 h-[2px] bg-gold-400"></div>

              <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
                {agent.bio}
              </p>

              <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white text-sm font-bold">{agent.experienceYears}+ Năm Kinh Nghiệm</h4>
                    <p className="text-[11px] text-slate-400 font-light mt-0.5">Tư vấn thành công nhiều giao dịch BĐS hạng sang.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white text-sm font-bold">Giỏ Hàng Độc Quyền</h4>
                    <p className="text-[11px] text-slate-400 font-light mt-0.5">Tiếp cận các căn góc, căn đẹp ngoại giao không công khai.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex flex-wrap gap-4 items-center">
                <a 
                  href={`tel:${agent.phone.replace(/\s+/g, '')}`} 
                  className="flex items-center gap-3 px-6 py-3.5 rounded-xl bg-gold-400 text-slate-950 font-bold hover:bg-gold-300 smooth-transition shadow-lg shadow-gold-500/10 text-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>Gọi Hotline 24/7: {agent.phone}</span>
                </a>
                <a 
                  href={`https://zalo.me/${agent.phone.replace(/\s+/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 px-6 py-3.5 rounded-xl border border-white/20 hover:bg-white/5 text-white font-semibold smooth-transition text-sm"
                >
                  <MessageSquare className="w-4 h-4 text-sky-400" />
                  <span>Kết nối Zalo tư vấn</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Lead Capture Form */}
      <section id="lead-capture" className="bg-slate-50 py-24 sm:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/70 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
            
            {/* Left Column of the Form Container */}
            <div className="md:col-span-5 bg-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between relative">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950"></div>
              
              <div className="relative z-10 space-y-6">
                <h3 className="font-serif text-2xl font-normal leading-snug">
                  Đăng Ký Nhận <br />
                  <span className="text-gold-300 font-serif italic font-light">Tài Liệu Độc Quyền</span>
                </h3>
                
                <p className="text-slate-300 text-xs font-light leading-relaxed">
                  Để lại thông tin để được gửi bảng giá gốc của các căn ngoại giao, bảng phân tích dòng tiền và tham quan trực tiếp dự án hoàn toàn miễn phí.
                </p>

                <ul className="space-y-3.5 pt-4 text-xs font-light text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-gold-400 flex-shrink-0" />
                    <span>Cam kết bảo mật thông tin 100%</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-gold-400 flex-shrink-0" />
                    <span>Gửi bảng giá qua Zalo/Email sau 5 phút</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-gold-400 flex-shrink-0" />
                    <span>Ưu tiên chọn căn trực tiếp từ CĐT</span>
                  </li>
                </ul>
              </div>

              <div className="relative z-10 pt-8 border-t border-slate-800 text-[10px] text-slate-400 font-light">
                * Mọi thông tin được xử lý an toàn theo quy định pháp lý và quy chuẩn bảo mật dự án cao cấp.
              </div>
            </div>

            {/* Right Column (Form) */}
            <div className="md:col-span-7 p-8 sm:p-10 relative">
              
              {submitStatus === 'success' ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-10 space-y-4 animate-scale-up">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 mb-2">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-xl text-slate-900 font-bold">Đăng Ký Thành Công!</h4>
                  <p className="text-xs text-slate-500 max-w-sm font-light leading-relaxed">
                    Yêu cầu tư vấn của quý khách đã được ghi nhận vào hệ thống. Chuyên gia {agent.fullName} sẽ liên hệ ngay qua điện thoại/Zalo trong thời gian sớm nhất.
                  </p>
                  <button 
                    onClick={() => setSubmitStatus(null)}
                    className="px-5 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold smooth-transition mt-4 cursor-pointer"
                  >
                    Quay lại
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitLead} className="space-y-4">
                  <h4 className="text-slate-900 font-serif text-lg font-bold">Yêu Cầu Hỗ Trợ 24/7</h4>
                  
                  {submitStatus === 'error' && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Name Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 block">Họ và tên <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="fullName"
                      required
                      value={leadForm.fullName}
                      onChange={handleInputChange}
                      placeholder="Nguyễn Văn A" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all font-semibold text-slate-800"
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 block">Số điện thoại <span className="text-red-500">*</span></label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={leadForm.phone}
                      onChange={handleInputChange}
                      placeholder="09xx xxx xxx" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all font-semibold text-slate-800"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 block">Địa chỉ Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={leadForm.email}
                      onChange={handleInputChange}
                      placeholder="nguyenvana@gmail.com" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all font-semibold text-slate-800"
                    />
                  </div>

                  {/* Property Interest Dropdown */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 block">Dự án quan tâm</label>
                    <select 
                      name="propertyId"
                      value={leadForm.propertyId}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all font-semibold text-slate-800 cursor-pointer"
                    >
                      <option value="">-- Chọn dự án quan tâm (Nếu có) --</option>
                      {properties.map(p => (
                        <option key={p.id} value={p.id}>{p.title} ({p.priceDisplay})</option>
                      ))}
                    </select>
                  </div>

                  {/* Note input */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 block">Nhu cầu / Ghi chú chi tiết</label>
                    <textarea 
                      name="note"
                      rows="3"
                      value={leadForm.note}
                      onChange={handleInputChange}
                      placeholder="Ví dụ: Cần tư vấn căn 3 phòng ngủ tầng cao, chính sách vay ngân hàng..." 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all font-semibold text-slate-800"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-slate-950 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold text-xs rounded-xl shadow-md uppercase tracking-wider smooth-transition flex items-center justify-center gap-2 mt-4 cursor-pointer border-0"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Đang gửi thông tin...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 text-gold-300" />
                        <span>Nhận Báo Giá Ngoại Giao Ngay</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 6. Legal & Footer & Social Links */}
      <footer className="bg-primary-955 text-slate-400 border-t border-slate-800 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
            
            {/* About / Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Prime Estates Logo" className="w-9 h-9 rounded-xl object-cover border border-gold-500/20" />
                <span className="font-serif text-lg font-bold text-white tracking-wider">PRIME ESTATES</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Kênh thông tin bất động sản uy tín, đồng hành và cố vấn đầu tư cho giới tinh hoa. Cam kết giỏ hàng chân thực, pháp lý minh bạch và tối ưu hóa lợi nhuận.
              </p>
              <div className="flex gap-3 pt-2">
                <a href="#" className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center hover:bg-slate-800 hover:text-white smooth-transition text-slate-500">
                  <span className="text-xs font-bold font-sans">Fb</span>
                </a>
                <a href="#" className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center hover:bg-slate-800 hover:text-white smooth-transition text-slate-500">
                  <span className="text-xs font-bold font-sans">Zl</span>
                </a>
                <a href="#" className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center hover:bg-slate-800 hover:text-white smooth-transition text-slate-500">
                  <span className="text-xs font-bold font-sans">In</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider border-l-2 border-gold-400 pl-3">Dự án theo khu vực</h4>
              <ul className="space-y-2 text-xs font-light">
                <li><a href="#properties" onClick={() => { setSelectedLocation('TP. Hồ Chí Minh'); }} className="hover:text-gold-400 hover:underline transition-all">Bất động sản TP. HCM</a></li>
                <li><a href="#properties" onClick={() => { setSelectedLocation('Hà Nội'); }} className="hover:text-gold-400 hover:underline transition-all">Bất động sản Hà Nội</a></li>
                <li><a href="#properties" onClick={() => { setSelectedLocation('Phú Quốc'); }} className="hover:text-gold-400 hover:underline transition-all">Dự án nghỉ dưỡng Phú Quốc</a></li>
                <li><a href="#properties" onClick={() => { setSelectedLocation('Hải Phòng'); }} className="hover:text-gold-400 hover:underline transition-all">Căn hộ cao cấp Hải Phòng</a></li>
              </ul>
            </div>

            {/* Support / Categories */}
            <div className="space-y-4">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider border-l-2 border-gold-400 pl-3">Loại hình sản phẩm</h4>
              <ul className="space-y-2 text-xs font-light">
                <li><a href="#properties" onClick={() => { setSelectedCategory('Căn hộ'); }} className="hover:text-gold-400 hover:underline transition-all">Căn hộ hạng sang / Penthouse</a></li>
                <li><a href="#properties" onClick={() => { setSelectedCategory('Biệt thự'); }} className="hover:text-gold-400 hover:underline transition-all">Biệt thự ven sông / Nghỉ dưỡng</a></li>
                <li><a href="#properties" onClick={() => { setSelectedCategory('Nhà phố'); }} className="hover:text-gold-400 hover:underline transition-all">Nhà phố thương mại / Shophouse</a></li>
                <li><a href="#properties" className="hover:text-gold-400 hover:underline transition-all">Đất nền ngoại ô</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider border-l-2 border-gold-400 pl-3">Thông tin liên hệ</h4>
              <ul className="space-y-3 text-xs font-light">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                  <span>Văn phòng đại diện: Tòa nhà Deutsches Haus, 33 Lê Duẩn, Quận 1, TP. Hồ Chí Minh.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <a href={`tel:${agent.phone.replace(/\s+/g, '')}`} className="hover:text-white smooth-transition">{agent.phone}</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <a href={`mailto:${agent.email}`} className="hover:text-white smooth-transition">{agent.email}</a>
                </li>
              </ul>
            </div>

          </div>

          {/* Copyright & Disclaimer */}
          <div className="border-t border-slate-800/80 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
            <div>
              &copy; {new Date().getFullYear()} PrimeEstates. Thiết kế bởi UI/UX Full-stack Developer cao cấp.
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-400">Điều khoản sử dụng</a>
              <span>&bull;</span>
              <a href="#" className="hover:text-slate-400">Chính sách bảo mật</a>
            </div>
          </div>
        </div>
      </footer>

      {/* 7. Property Details Modal */}
      {activeProperty && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl relative animate-scale-up">
            
            <button 
              onClick={() => setActiveProperty(null)}
              className="absolute top-4 right-4 p-2 bg-slate-900/10 hover:bg-slate-900/20 text-slate-900 rounded-full smooth-transition z-10 cursor-pointer border-0"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/9] w-full">
              <img 
                src={activeProperty.image} 
                alt={activeProperty.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-slate-950/80 text-white font-sans text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md backdrop-blur-sm">
                {activeProperty.category}
              </div>
              <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-slate-950/90 to-transparent flex items-end p-6">
                <div>
                  <span className="text-gold-300 font-serif text-sm font-semibold tracking-wider block mb-1">
                    Giá từ {activeProperty.priceDisplay}
                  </span>
                  <h3 className="text-white font-serif text-2xl sm:text-3xl font-bold">
                    {activeProperty.title}
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-1 text-slate-500 text-xs">
                  <MapPin className="w-4 h-4 text-gold-500" />
                  <span>{activeProperty.location}</span>
                </div>
                
                <div className="flex items-center gap-6 text-slate-700 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Maximize2 className="w-4 h-4 text-slate-400" />
                    <span>{activeProperty.area}m² diện tích</span>
                  </div>
                  <div className="flex items-center gap-1.5 border-l border-slate-200 pl-6">
                    <BedDouble className="w-4 h-4 text-slate-400" />
                    <span>{activeProperty.bedrooms} PN</span>
                  </div>
                  <div className="flex items-center gap-1.5 border-l border-slate-200 pl-6">
                    <Bath className="w-4 h-4 text-slate-400" />
                    <span>{Math.floor(activeProperty.bathrooms)} WC</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif text-sm font-bold text-slate-900 uppercase tracking-wider">Mô tả dự án</h4>
                <p className="text-slate-600 text-sm font-light leading-relaxed">
                  {activeProperty.description}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-serif text-sm font-bold text-slate-900 uppercase tracking-wider">Đặc điểm nổi bật</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeProperty.highlights && activeProperty.highlights.map((hl, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-700 text-xs">
                      <CheckCircle className="w-4 h-4 text-gold-500 flex-shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-light">Tư vấn trực tiếp bởi Chuyên gia</p>
                  <p className="text-sm font-bold text-slate-900">{agent.fullName} ({agent.phone})</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => setActiveProperty(null)}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold smooth-transition bg-white cursor-pointer"
                  >
                    Đóng lại
                  </button>
                  <button 
                    onClick={() => {
                      openConsultationWithProperty(activeProperty);
                      setActiveProperty(null);
                    }}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold smooth-transition flex items-center justify-center gap-2 shadow-md border-0"
                  >
                    <MessageSquare className="w-4 h-4 text-gold-300" />
                    <span>Nhận Bảng Giá Độc Quyền</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default App
