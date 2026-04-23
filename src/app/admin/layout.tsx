"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  LogOut, 
  ChevronRight,
  Layout,
  Layers,
  Bell,
  MessageCircle,
  Menu,
  X,
  Globe
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin/products', icon: Package, label: '제품 관리', match: '/products' },
  { href: '/admin/content', icon: Layout, label: '랜딩 문구 관리', match: '/content' },
  { href: '/admin/inquiry', icon: MessageCircle, label: '온라인 문의', match: '/inquiry' },
  { href: '/admin/settings', icon: Settings, label: '환경 설정', match: '/settings' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [logoErr, setLogoErr] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  React.useEffect(() => {
    const isAuthenticated = document.cookie.includes('admin_session=true');
    const isPublicPage = pathname === '/admin/login' || pathname === '/admin/forgot-password';
    
    if (!isAuthenticated && !isPublicPage) {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  // Close sidebar on navigation (mobile)
  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (pathname === '/admin/login' || pathname === '/admin/forgot-password') return <>{children}</>;

  const pageTitle = NAV_ITEMS.find(n => pathname.includes(n.match))?.label || '대시보드';

  return (
    <div className="admin-shell">
      {/* Sidebar Backdrop (Mobile) */}
      {isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
            {!logoErr ? (
              <img src="/logo.png" alt="TP" className="sidebar-logo" onError={() => setLogoErr(true)} />
            ) : (
              <div className="sidebar-logo-text">TP</div>
            )}
            <button className="mobile-close-btn" onClick={() => setIsSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="sidebar-brand-info">
            <span className="brand-name">태평프레시</span>
            <span className="brand-role">Admin Console</span>
          </div>
        </div>

        <div className="sidebar-section-label">메뉴</div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => {
            const isActive = pathname.includes(item.match);
            return (
              <Link key={item.href} href={item.href} className={`sidebar-link ${isActive ? 'active' : ''}`}>
                <item.icon size={18} />
                <span>{item.label}</span>
                {isActive && <div className="active-indicator" />}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <Link href="/" className="sidebar-link" target="_blank">
            <Globe size={18} />
            <span>메인페이지 이동</span>
          </Link>
          <button onClick={() => { document.cookie = 'admin_session=; Max-Age=0; path=/'; router.push('/admin/login'); }} className="sidebar-link logout-link">
            <LogOut size={18} />
            <span>로그아웃</span>
          </button>
        </div>
      </aside>

      <main className="admin-body">
        <header className="admin-topbar">
          <div className="topbar-inner">
            <div className="topbar-left">
              <button className="mobile-toggle-btn" onClick={() => setIsSidebarOpen(true)}>
                <Menu size={24} />
              </button>
              <h2 className="topbar-title">{pageTitle}</h2>
            </div>
            <div className="topbar-right">
              <button className="topbar-icon-btn">
                <Bell size={18} />
              </button>
              <div className="topbar-user">
                <div className="user-avatar">A</div>
                <div className="user-info">
                  <span className="user-name">관리자</span>
                  <span className="user-role">Administrator</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="admin-page-wrap">
          {children}
        </div>
      </main>
    </div>
  );
}
