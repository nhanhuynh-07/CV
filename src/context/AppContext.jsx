import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // 1. Tự động lấy vai trò từ tài khoản đăng nhập trong localStorage
  const [currentRole, setCurrentRole] = useState(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      return savedUser.role || 'candidate';
    } catch {
      return 'candidate';
    }
  });

  // 2. State quản lý danh sách tin tuyển dụng (kết nối đồng bộ)
  const [jobs, setJobs] = useState([]);

  // 3. State quản lý danh sách đơn ứng tuyển (để đồng bộ số lượng ở Sidebar)
  const [applications, setApplications] = useState([]);

  // 4. State quản lý thông báo (để đồng bộ chuông TopBar)
  const [notifications, setNotifications] = useState([]);

  const [savedJobs, setSavedJobs] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Đếm các số liệu thực tế
  const totalApplicationsCount = applications.length;
  const unreadNotificationsCount = notifications.filter(n => !n.is_read).length;

  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);

  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  const addToast = (message, type = 'default') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  // Hàm xóa tin tuyển dụng dùng chung
  const deleteJob = (jobId) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
    addToast('Đã xóa tin tuyển dụng thành công', 'success');
  };

  // Hàm đánh dấu thông báo đã đọc
  const markNotificationAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        jobs,
        setJobs,
        deleteJob,
        applications,
        setApplications,
        totalApplicationsCount,
        notifications,
        setNotifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        savedJobs,
        toggleSaveJob,
        toasts,
        addToast,
        sidebarCollapsed,
        toggleSidebar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);