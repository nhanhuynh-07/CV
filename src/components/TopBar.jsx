import { Bell, Search, Plus, LogIn, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const pageTitles = {
  '/': 'Dashboard',
  '/login': 'Đăng nhập',
  '/jobs': 'Tìm việc làm',
  '/saved-jobs': 'Việc làm đã lưu',
  '/resumes': 'CV của tôi',
  '/applications': 'Đơn ứng tuyển',
  '/ai-matches': 'AI Ghép việc',
  '/notifications': 'Thông báo',
  '/settings': 'Cài đặt',
  '/employer': 'Dashboard',
  '/employer/dashboard': 'Dashboard NTD',
  '/employer/jobs': 'Tin tuyển dụng',
  '/employer/jobs/new': 'Đăng tin mới',
  '/employer/applications': 'Đơn ứng tuyển',
  '/employer/candidates': 'Tìm ứng viên',
  '/employer/company': 'Hồ sơ công ty',
  '/admin': 'Quản trị hệ thống',
  '/admin/users': 'Người dùng',
  '/admin/companies': 'Công ty',
  '/admin/jobs': 'Tin tuyển dụng',
};

export default function TopBar({ pathname }) {
  const location = useLocation();
  const navigate = useNavigate();
  // 1. Lấy unreadNotificationsCount từ AppContext
  const { currentRole, unreadNotificationsCount = 0 } = useApp();

  const currentPath = pathname || location.pathname;
  const title = pageTitles[currentPath] || 'JobPortal';
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  return (
    <header className="topbar">
      <h1 className="topbar-title" style={{ fontSize: 'var(--font-size-lg)' }}>
        {title}
      </h1>

      {/* Search */}
      <div className="topbar-search">
        <Search className="topbar-search-icon" />
        <input type="text" placeholder="Tìm kiếm..." />
      </div>

      {/* Actions */}
      <div className="topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {currentRole === 'employer' && (
          <Link to="/employer/jobs/new" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Plus size={14} /> Đăng tin
          </Link>
        )}

        {/* Nút Chuông Thông báo hiển thị con số thật */}
        <Link
          to={currentRole === 'candidate' ? '/notifications' : '/employer/notifications'}
          className="topbar-btn"
          title="Thông báo"
          style={{ position: 'relative' }}
        >
          <Bell size={18} />
          {unreadNotificationsCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: '700',
                minWidth: '16px',
                height: '16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                lineHeight: 1
              }}
            >
              {unreadNotificationsCount}
            </span>
          )}
        </Link>

        {/* Nút Đăng nhập / Đăng xuất */}
        {token ? (
          <button
            onClick={handleLogout}
            className="btn btn-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              cursor: 'pointer',
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '13px',
              color: '#334155'
            }}
            title="Đăng xuất"
          >
            <LogOut size={15} /> Đăng xuất
          </button>
        ) : (
          <Link
            to="/login"
            className="btn btn-primary btn-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              textDecoration: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            <LogIn size={15} /> Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
}