import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Search, FileText, Briefcase, Bell, Bookmark,
  Settings, LogOut, Users, Building2, ShieldCheck, BarChart3,
  PlusCircle, ClipboardList, Star, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getInitials, getAvatarColor } from '../utils/helpers';

export default function Sidebar() {
  const {
    currentRole,
    sidebarCollapsed,
    toggleSidebar,
    totalApplicationsCount = 0,
    unreadNotificationsCount = 0
  } = useApp();

  const location = useLocation();
  const collapsed = sidebarCollapsed;

  const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const activeRole = savedUser.role || currentRole || 'candidate';

  // 👉 1. Cập nhật tên hiển thị hỗ trợ đủ 3 vai trò
  const displayName = savedUser.full_name || savedUser.name || (
    activeRole === 'admin' ? 'Quản trị viên' : activeRole === 'employer' ? 'Nhà tuyển dụng' : 'Ứng viên'
  );
  const displayRoleTitle = activeRole === 'admin' ? 'Quản trị viên' : activeRole === 'employer' ? 'Nhà tuyển dụng' : 'Ứng viên';

  // Menu cho Ứng viên (Candidate)
  const candidateNav = [
    { section: 'Tổng quan' },
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Tìm việc làm', icon: Search, path: '/jobs' },
    { label: 'Việc làm đã lưu', icon: Bookmark, path: '/saved-jobs' },
    { section: 'Hồ sơ & CV' },
    { label: 'CV của tôi', icon: FileText, path: '/resumes' },
    {
      label: 'Đơn ứng tuyển',
      icon: ClipboardList,
      path: '/applications',
      badge: totalApplicationsCount > 0 ? totalApplicationsCount : null
    },
    { label: 'AI Ghép việc', icon: Star, path: '/ai-matches' },
    { section: 'Tiện ích' },
    {
      label: 'Thông báo',
      icon: Bell,
      path: '/notifications',
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null
    },
    { label: 'Cài đặt', icon: Settings, path: '/settings' },
  ];

  // Menu cho Nhà tuyển dụng (Employer)
  const employerNav = [
    { section: 'Tổng quan' },
    { label: 'Dashboard', icon: LayoutDashboard, path: '/employer' },
    { label: 'Tin tuyển dụng', icon: Briefcase, path: '/employer/jobs' },
    { label: 'Đăng tin mới', icon: PlusCircle, path: '/employer/jobs/new' },
    { section: 'Ứng viên' },
    {
      label: 'Đơn ứng tuyển',
      icon: ClipboardList,
      path: '/employer/applications',
      badge: totalApplicationsCount > 0 ? totalApplicationsCount : null
    },
    { label: 'Tìm ứng viên', icon: Search, path: '/employer/candidates' },
    { section: 'Công ty' },
    { label: 'Hồ sơ công ty', icon: Building2, path: '/employer/company' },
    {
      label: 'Thông báo',
      icon: Bell,
      path: '/employer/notifications',
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null
    },
    { label: 'Cài đặt', icon: Settings, path: '/employer/settings' },
  ];

  // 👉 2. Menu dành riêng cho Quản trị viên (Admin)
  const adminNav = [
    { section: 'Quản trị hệ thống' },
    { label: 'Tổng quan Admin', icon: LayoutDashboard, path: '/admin' },
    { label: 'Quản lý người dùng', icon: Users, path: '/admin/users' },
    { label: 'Quản lý công ty', icon: Building2, path: '/admin/companies' },
    { label: 'Tin tuyển dụng', icon: Briefcase, path: '/admin/jobs' },
    { label: 'Báo cáo thống kê', icon: BarChart3, path: '/admin/reports' },
    { section: 'Hệ thống' },
    { label: 'Cài đặt hệ thống', icon: Settings, path: '/admin/settings' },
  ];

  // 👉 3. Chọn menu chuẩn xác theo vai trò đang đăng nhập
  const navItems = activeRole === 'admin'
    ? adminNav
    : activeRole === 'employer'
      ? employerNav
      : candidateNav;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Logo + Toggle Button */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">JP</div>
        {!collapsed && (
          <div className="sidebar-logo-text">CTY <span>CAMBODIA</span></div>
        )}
        <button
          className="sidebar-toggle-btn"
          onClick={toggleSidebar}
          title={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item, idx) => {
          if (item.section) {
            if (collapsed) return null;
            return <div key={idx} className="sidebar-section-title">{item.section}</div>;
          }
          const Icon = item.icon;
          const isActive = location.pathname === item.path ||
            (item.path !== '/dashboard' && item.path !== '/employer' && item.path !== '/admin' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={idx}
              to={item.path}
              className={`sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'sidebar-link-collapsed' : ''}`}
              title={collapsed ? item.label : ''}
            >
              <Icon className="sidebar-link-icon" size={18} />
              {!collapsed && (
                <>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="sidebar-badge">{item.badge}</span>
                  )}
                </>
              )}
              {collapsed && item.badge && (
                <span className="sidebar-badge-dot" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div
            className="sidebar-avatar"
            style={{ background: getAvatarColor(displayName) }}
          >
            {getInitials(displayName)}
          </div>
          {!collapsed && (
            <>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{displayName}</div>
                <div className="sidebar-user-role">{displayRoleTitle}</div>
              </div>
              <LogOut
                size={16}
                style={{ color: 'var(--color-gray-400)', flexShrink: 0, cursor: 'pointer' }}
                title="Đăng xuất"
                onClick={handleLogout}
              />
            </>
          )}
        </div>
      </div>
    </aside>
  );
}