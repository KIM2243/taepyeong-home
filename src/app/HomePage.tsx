"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ShieldCheck, Zap, Truck, ChevronUp, ChevronLeft, ChevronRight, Phone, MessageCircle, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InquiryModal from '@/components/InquiryModal';
import Link from 'next/link';
import Script from 'next/script';

export default function HomePage({ initialConfigs = {}, initialSlides = [], initialCategories = [] }: any) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [slides, setSlides] = useState<any[]>(initialSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState<any[]>(initialCategories);
  const [configs, setConfigs] = useState<Record<string, string>>(initialConfigs);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroHovered, setHeroHovered] = useState(false);
  const [ctaHovered, setCtaHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length, currentSlide]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const headerDark = !isScrolled;

  return (
    <div className="home-wrapper">
      <Script 
        src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=ab92c2392cf2f9d1f29ad4d9f4069d9a&autoload=false"
        strategy="lazyOnload"
      />
      {/* --- Header --- */}
      <header className={`header ${isScrolled ? 'header-scrolled' : 'header-transparent'}`}>
        <div className="container header-inner">
          <div className="logo-group">
            {!logoError ? (
              <Link href="/">
                <img 
                  src="/logo.png" 
                  alt="태평프레시" 
                  className="main-logo"
                  onError={() => setLogoError(true)}
                />
              </Link>
            ) : (
              <Link href="/" className={`site-logo ${headerDark ? 'logo-white' : ''}`}>
                태평프레시
              </Link>
            )}
          </div>
          
          <nav className="nav-desktop">
            <a href="#top" className={`nav-link ${headerDark ? 'nav-white' : ''}`}>회사소개</a>
            <a href="#products" className={`nav-link ${headerDark ? 'nav-white' : ''}`}>제품소개</a>
            <a href="#value" className={`nav-link ${headerDark ? 'nav-white' : ''}`}>핵심역량</a>
            <a href="#location" className={`nav-link ${headerDark ? 'nav-white' : ''}`}>오시는길</a>
          </nav>

          <div className="header-actions">
            <button className="btn-header-cta desktop-cta" onClick={() => setInquiryModalOpen(true)}>
              <MessageCircle size={16} />
              온라인 문의하기
            </button>
            <button className={`btn-mobile-menu ${headerDark ? 'text-white' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="nav-mobile"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="nav-mobile-inner">
                <a href="#top" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>회사소개</a>
                <a href="#products" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>제품소개</a>
                <a href="#value" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>핵심역량</a>
                <a href="#location" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>오시는길</a>
                <button className="btn-mobile-cta" onClick={() => { setInquiryModalOpen(true); setMobileMenuOpen(false); }}>
                  <MessageCircle size={16} />
                  온라인 문의하기
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>

      {/* --- Dynamic Hero Slider --- */}
      <section id="top" className="hero-slider-section">
        <AnimatePresence mode="wait">
          {slides.length > 0 ? (
            <motion.div 
              key={slides[currentSlide].id}
              className="hero-slide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              style={{ backgroundImage: `url(${slides[currentSlide].imageUrl})` }}
            >
              <div className="hero-overlay" />
              <div className="hero-content container">
                <div className="hero-text-block">
                  <motion.p 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="hero-subtitle"
                  >
                    {slides[currentSlide].accent}
                  </motion.p>
                  <motion.h1 
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                    className="hero-title"
                    style={{ color: configs.hero_title_color || '#ffffff' }}
                    dangerouslySetInnerHTML={{ __html: slides[currentSlide].title }}
                  />
                  <motion.p 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="hero-description"
                    style={{ color: configs.hero_desc_color || '#e2e8f0' }}
                  >
                    {slides[currentSlide].description}
                  </motion.p>
                </div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="hero-actions"
                >
                  <button className="btn-hero-main">
                    자세히 보기 <ArrowRight size={20} />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <div className="hero-slide default-hero">
              <div className="hero-overlay" />
              <div className="default-hero-bg" />
              <div className="hero-content container">
                <div className="hero-text-block">
                  <p className="hero-subtitle">{configs.hero_accent || 'Premium Fresh Logistics'}</p>
                  <h1 className="hero-title" style={{ color: configs.hero_title_color || '#ffffff' }} dangerouslySetInnerHTML={{ 
                    __html: configs.hero_title || '자연의 신선함을<br/><span class="title-accent">식탁까지 안전하게</span>' 
                  }} />
                  <div className="hero-description" style={{ color: configs.hero_desc_color || '#e2e8f0' }} dangerouslySetInnerHTML={{ 
                    __html: configs.hero_description || '(주)태평프레시는 최첨단 저온 물류 시스템을 통해<br/>산지의 신선함을 고객님께 그대로 전달합니다.'
                  }} />
                </div>
                <div className="hero-actions">
                  <motion.a 
                    href="tel:02-6954-7988" 
                    className="btn-hero-main"
                    onMouseEnter={() => setHeroHovered(true)}
                    onMouseLeave={() => setHeroHovered(false)}
                  >
                    <AnimatePresence mode="wait">
                      {!heroHovered ? (
                        <motion.span 
                          key="default"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="btn-inner-content"
                        >
                          <Phone size={18} /> 전화 문의
                        </motion.span>
                      ) : (
                        <motion.span 
                          key="hover"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="btn-inner-content"
                        >
                          <Phone size={18} /> 02-6954-7988
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.a>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {slides.length > 1 && (
          <div className="slider-nav-container container">
            <div className="slider-nav-bars">
              {slides.map((slide, index) => (
                <div 
                  key={slide.id} 
                  className={`nav-bar-item ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                >
                  <div className="bar-label">
                     <span className="bar-num">0{index + 1}</span>
                     <span className="bar-title">{slide.accent}</span>
                  </div>
                  <div className="bar-bg">
                    {index === currentSlide && (
                      <motion.div 
                        className="bar-progress" 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 5, ease: "linear" }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* --- Product Showcase Section --- */}
      <section id="products" className="products-showcase">
        <div className="container">
          <div className="section-header">
            <p className="section-tag">Products</p>
            <h2 className="section-title">제품소개</h2>
          </div>

          {categories.length > 0 ? (
            categories.map((cat) => (
              <ProductRow key={cat.name} categoryName={cat.name} products={cat.products} />
            ))
          ) : (
            <div className="empty-product-msg">
              <p>등록된 제품이 없습니다. 관리자에서 제품을 추가해주세요.</p>
            </div>
          )}
        </div>
      </section>

      {/* --- Value Section --- */}
      <section id="value" className="value-section">
        <div className="container">
          <div className="section-header">
            <p className="section-tag">{configs.value_tag || 'Why Taepyeong Fresh'}</p>
            <h2 className="section-title">{configs.value_title || '태평프레시를 선택하는 이유'}</h2>
          </div>

          <div className="value-grid">
            <ValueCard 
              icon={<Zap size={28} />}
              num="01"
              title={configs.v1_title || '최상의 신선도'}
              desc={configs.v1_desc || '산지에서 식탁까지, 태평프레시만의 Cold-Chain 시스템으로 24시간 신선함을 유지합니다.'}
            />
            <ValueCard 
              icon={<ShieldCheck size={28} />}
              num="02"
              title={configs.v2_title || '철저한 품질관리'}
              desc={configs.v2_desc || '엄격한 위생 기준과 검수 과정을 통해 누구나 안심하고 즐길 수 있는 먹거리를 공급합니다.'}
            />
            <ValueCard 
              icon={<Truck size={28} />}
              num="03"
              title={configs.v3_title || '최적화된 물류'}
              desc={configs.v3_desc || '첨단 IT 시스템과 최적화된 거점을 통해 전 권역에 걸쳐 가장 효율적인 배송 서비스를 제공합니다.'}
            />
          </div>
        </div>
      </section>

      {/* --- Location Section --- */}
      <section id="location" className="location-section">
        <div className="container">
          <div className="section-header">
            <p className="section-tag">Location</p>
            <h2 className="section-title">오시는 길</h2>
          </div>

          <div className="location-info-row">
            <div className="location-detail">
              <div className="detail-item">
                <span className="detail-label">주소</span>
                <span className="detail-value">서울특별시 중랑구 용마산로 419, 은현빌딩 (4층 401호)</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">TEL</span>
                <span className="detail-value">02)6954-7988</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">FAX</span>
                <span className="detail-value">02)6958-7987</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">E-mail</span>
                <span className="detail-value">365@tpfresh.com</span>
              </div>
            </div>
          </div>

          <KakaoMap />
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-inner">
            <div className="cta-text">
              <p className="section-tag" style={{ color: 'rgba(255,255,255,0.7)' }}>{configs.cta_tag || 'Contact Us'}</p>
              <h3 className="cta-title">{configs.cta_title || '신선 물류의 파트너가 되어 드리겠습니다'}</h3>
              <p className="cta-desc">{configs.cta_description || '대량 주문, 납품 상담 등 비즈니스 문의를 환영합니다.'}</p>
            </div>
            <div className="cta-buttons">
              <motion.a 
                href="tel:02-6954-7988" 
                className="btn-cta-primary"
                onMouseEnter={() => setCtaHovered(true)}
                onMouseLeave={() => setCtaHovered(false)}
              >
                <AnimatePresence mode="wait">
                  {!ctaHovered ? (
                    <motion.span 
                      key="default"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="btn-inner-content"
                    >
                      <Phone size={18} /> 전화 문의
                    </motion.span>
                  ) : (
                    <motion.span 
                      key="hover"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="btn-inner-content"
                    >
                      <Phone size={18} /> 02-6954-7988
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.a>
              <a href="mailto:365@tpfresh.com" className="btn-cta-secondary">
                이메일 문의
              </a>
            </div>
          </div>
        </div>
      </section>
      </main>

      {/* --- Footer --- */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <img src="/logo.png" alt="태평프레시" className="footer-logo" />
            </div>
            <div className="footer-links">
              <a href="#top">회사소개</a>
              <a href="#products">제품소개</a>
              <a href="#location">오시는길</a>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  window.open('/privacy', 'privacy', 'width=700,height=800,scrollbars=yes');
                }}
              >
                개인정보처리방침
              </a>
              <Link href="/admin/login" target="_blank" rel="noopener noreferrer">관리자</Link>
            </div>
          </div>
          <div className="footer-divider" />
          <div className="footer-info">
            <p>상호 : (주)태평프레시 / 사업자등록번호 : 865-86-03320 / 대표 : 김종윤 / 주소 : 서울특별시 중랑구 용마산로 419, 4층 401호</p>
            <p>TEL : 02)6954-7988 / FAX : 02)6958-7987 / Email : 365@tpfresh.com</p>
            <p className="copyright">© 2026 Taepyeong Fresh. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* --- Top Button --- */}
      <button 
        onClick={scrollToTop}
        className={`btn-top ${isScrolled ? 'show' : ''}`}
      >
        <ChevronUp size={24} />
      </button>

      <InquiryModal isOpen={inquiryModalOpen} onClose={() => setInquiryModalOpen(false)} />
    </div>
  );
}

/* ========================================
   Sub-Components
   ======================================== */

function ProductRow({ categoryName, products }: { categoryName: string; products: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener('scroll', checkScroll);
    
    // 자동 스크롤 로직 추가
    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      
      // 거의 끝에 도달했으면 처음으로 복귀, 아니면 오른쪽으로 스크롤
      if (scrollLeft + clientWidth >= scrollWidth - 20) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scroll('right');
      }
    }, 4000);

    return () => { 
      if (el) el.removeEventListener('scroll', checkScroll);
      clearInterval(interval);
    };
  }, [products]);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    // 한 칸씩 이동하도록 현재 카드의 실제 너비 계산 (전체 너비의 1/4 + 간격 보정)
    const amount = scrollRef.current.clientWidth / 4 + 5;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <div className="product-row">
      <div className="product-row-header">
        <span className="row-line" />
        <div className="row-header-content">
          <button 
            className={`row-arrow-header ${!canScrollLeft ? 'disabled' : ''}`} 
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
          >
            <ChevronLeft size={24} />
          </button>
          <h3 className="row-category-title">{categoryName}</h3>
          <button 
            className={`row-arrow-header ${!canScrollRight ? 'disabled' : ''}`} 
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
          >
            <ChevronRight size={24} />
          </button>
        </div>
        <span className="row-line" />
      </div>

      <div className="product-scroll-wrap" ref={scrollRef}>
        {products.map((product) => (
          <div key={product.id} className="product-scroll-card">
            <div className="psc-img">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} />
              ) : (
                <div className="psc-no-img">NO IMAGE</div>
              )}
            </div>
            <div className="psc-info">
              <p className="psc-name">{product.name}</p>
              {product.spec && <p className="psc-spec">{product.spec}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ValueCard({ icon, title, desc, num }: { icon: React.ReactNode, title: string, desc: string, num: string }) {
  return (
    <div className="value-card">
      <span className="value-num">{num}</span>
      <div className="value-icon-box">
        {icon}
      </div>
      <h3 className="value-card-title">{title}</h3>
      <div className="value-card-desc" dangerouslySetInnerHTML={{ __html: desc }} />
    </div>
  );
}

function KakaoMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [errorInfo, setErrorInfo] = useState("");

  useEffect(() => {
    const initMap = () => {
      try {
        (window as any).kakao.maps.load(() => {
          setMapLoaded(true);
        });
      } catch (err) {
        setErrorInfo("카카오 API 초기화 중 오류가 발생했습니다.");
      }
    };

    if ((window as any).kakao?.maps?.Map) {
      setMapLoaded(true);
      return;
    }

    const checkInterval = setInterval(() => {
      if ((window as any).kakao?.maps) {
        clearInterval(checkInterval);
        clearTimeout(timeout);
        initMap();
      }
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
      setErrorInfo("카카오맵 서버와 연결할 수 없습니다. 일시적인 네트워크 문제일 수 있습니다.");
    }, 10000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    try {
      const kakao = (window as any).kakao;
      const position = new (window as any).kakao.maps.LatLng(37.5890241, 127.0963398);

      mapRef.current.innerHTML = '';

      const map = new kakao.maps.Map(mapRef.current, {
        center: position,
        level: 3,
      });

      const marker = new kakao.maps.Marker({ position, map });

      const content = `
        <div style="
          position: relative;
          background: #fff;
          border: 1px solid #1e293b;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 15px;
          font-weight: 800;
          color: #1e293b;
          text-align: center;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transform: translateY(-55px);
        ">
          (주)태평프레시
          <div style="
            position: absolute;
            width: 14px;
            height: 10px;
            left: 50%;
            margin-left: -7px;
            bottom: -10px;
            background: url(https://t1.daumcdn.net/localimg/localimages/07/mapjsapi/2x/balloon_arrow.png) no-repeat;
            background-size: 14px 10px;
          "></div>
        </div>
      `;

      const customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: content,
        yAnchor: 1
      });
      customOverlay.setMap(map);

      map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT);

      const handleResize = () => { map.relayout(); map.setCenter(position); };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    } catch (err) {
      console.error("Map init error:", err);
      setErrorInfo("지도 렌더링 중 오류가 발생했습니다.");
    }
  }, [mapLoaded]);

  return (
    <div className="map-container">
      <div ref={mapRef} className="kakao-map" />
      {!mapLoaded && (
        <div className="map-placeholder">
          {errorInfo ? (
            <p style={{ color: '#ef4444', textAlign: 'center', padding: '0 20px', lineHeight: '1.6' }}>
              <strong>지도 연결 실패</strong><br />{errorInfo}
            </p>
          ) : (
            <p>지도를 불러오는 중...</p>
          )}
        </div>
      )}
    </div>
  );
}

