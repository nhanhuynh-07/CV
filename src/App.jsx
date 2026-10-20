import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import ToastContainer from './components/ToastContainer';
import CompanyProfile from './pages/employer/CompanyProfile';
import EmployerNotifications from './pages/employer/EmployerNotifications';
import AdminDashboard from './pages/admin/AdminDashboard';

// Import trang Login
import Login from './pages/Login';

// Candidate Pages
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import JobList from './pages/candidate/JobList';
import ApplicationList from './pages/candidate/ApplicationList';
import ResumeManager from './pages/candidate/ResumeManager';
import AIMatches from './pages/candidate/AIMatches';
import Notifications from './pages/candidate/Notifications';

// Employer Pages
import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerJobs from './pages/employer/EmployerJobs';
import EmployerApplications from './pages/employer/EmployerApplications';
import NewJob from './pages/employer/NewJob';

import './index.css';

// Component điều hướng thông minh cho trang chủ "/"
function HomeRedirect() {
  const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
  if (savedUser.role === 'admin') return <Navigate to="/admin" replace />;
  if (savedUser.role === 'employer') return <Navigate to="/employer" replace />;
  return <Navigate to="/dashboard" replace />;
}

function AppLayout() {
  const { sidebarCollapsed } = useApp();

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'sidebar-is-collapsed' : ''}`}>
      <Sidebar />
      <div className="main-area">
        <TopBar />
        <main className="page-content">
          <Routes>
            {/* Trang chủ - Tự động điều hướng theo quyền */}
            <Route path="/" element={<HomeRedirect />} />

            {/* Candidate Routes */}
            <Route path="/dashboard" element={<CandidateDashboard />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/saved-jobs" element={<JobList />} />
            <Route path="/applications" element={<ApplicationList />} />
            <Route path="/resumes" element={<ResumeManager />} />
            <Route path="/resume" element={<ResumeManager />} />
            <Route path="/ai-matches" element={<AIMatches />} />
            <Route path="/notifications" element={<Notifications />} />

            {/* Employer Routes */}
            <Route path="/employer" element={<EmployerDashboard />} />
            <Route path="/employer/dashboard" element={<EmployerDashboard />} />
            <Route path="/employer/jobs" element={<EmployerJobs />} />
            <Route path="/employer/jobs/new" element={<NewJob />} />
            <Route path="/employer/applications" element={<EmployerApplications />} />
            <Route path="/employer/notifications" element={<EmployerNotifications />} />
            <Route path="/employer/company" element={<CompanyProfile />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<div className="card" style={{ padding: 24 }}><h2>Quản lý Người dùng</h2></div>} />
            <Route path="/admin/companies" element={<div className="card" style={{ padding: 24 }}><h2>Quản lý Doanh nghiệp & Công ty</h2></div>} />
            <Route path="/admin/jobs" element={<div className="card" style={{ padding: 24 }}><h2>Kiểm duyệt Tin tuyển dụng</h2></div>} />
            <Route path="/admin/settings" element={<div className="card" style={{ padding: 24 }}><h2>Cài đặt Hệ thống</h2></div>} />

            {/* Fallback Route */}
            <Route path="*" element={<HomeRedirect />} />
          </Routes>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Tuyến đường Đăng nhập */}
          <Route path="/login" element={<Login />} />

          {/* Toàn bộ các trang còn lại qua AppLayout */}
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;