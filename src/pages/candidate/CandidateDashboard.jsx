import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ClipboardList, Eye, TrendingUp, ChevronRight, CheckCircle, AlertCircle, ArrowUpRight } from 'lucide-react';
import { applicationsApi, resumesApi, jobsApi, notificationsApi } from '../../utils/api';
import { statusConfig, timeAgo, getCompanyColor } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';
import { useFetch, LoadingSpinner, ErrorState } from '../../utils/useFetch';

const ScoreRing = ({ score, size = 100 }) => {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 80 ? '#16a34a' : score >= 60 ? '#2563eb' : '#d97706';

  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth="6" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circumference} strokeDashoffset={circumference - progress}
          strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} />
      </svg>
      <span className="score-ring-value" style={{ fontSize: size > 80 ? '1.25rem' : '0.875rem', color }}>{score}</span>
    </div>
  );
};

export default function CandidateDashboard() {
  const { addToast } = useApp();
  const { data: applications, loading: appLoading } = useFetch(() => applicationsApi.getMy());
  const { data: resumes, loading: resLoading } = useFetch(() => resumesApi.getAll());
  const { data: jobs, loading: jobLoading } = useFetch(() => jobsApi.getAll({ limit: 3 }));
  const { data: notifications } = useFetch(() => notificationsApi.getAll());

  const loading = appLoading || resLoading;

  if (loading) return <LoadingSpinner text="Đang tải dashboard..." />;

  const primaryResume = resumes?.find(r => r.is_primary) || resumes?.[0];
  const recentApps = applications?.slice(0, 4) || [];
  const topJobs = jobs?.jobs?.slice(0, 3) || [];
  const unread = notifications?.filter(n => !n.is_read).length || 0;

  const reviewing = applications?.filter(a => a.status === 'reviewing').length || 0;
  const interview = applications?.filter(a => a.status === 'interview').length || 0;

  const stats = [
    { label: 'Đơn đã nộp', value: applications?.length || 0, icon: ClipboardList, color: 'blue' },
    { label: 'Đang xem xét', value: reviewing, icon: Eye, color: 'orange' },
    { label: 'Phỏng vấn', value: interview, icon: Briefcase, color: 'purple' },
    { label: 'Thông báo mới', value: unread, icon: CheckCircle, color: 'green' },
  ];

  return (
    <div className="animate-fade">
      {/* Welcome Banner */}
      <div className="card" style={{ marginBottom: 'var(--spacing-8)', background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)', border: '1px solid var(--color-primary-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-4)' }}>
          <div>
            <h2 style={{ marginBottom: 'var(--spacing-1)' }}>Xin chào! 👋</h2>
            <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)' }}>
              Bạn có <strong style={{ color: 'var(--color-primary)' }}>{unread} thông báo mới</strong> và{' '}
              <strong style={{ color: 'var(--color-accent)' }}>{topJobs.length} việc làm</strong> mới nhất.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
            <Link to="/jobs" className="btn btn-primary">Tìm việc ngay</Link>
            <Link to="/resumes" className="btn btn-outline">Cập nhật CV</Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div className="stat-card" key={i}>
              <div className={`stat-icon-wrap ${stat.color}`}><Icon size={22} /></div>
              <div className="stat-info">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid-2" style={{ marginBottom: 'var(--spacing-8)' }}>
        {/* CV chính */}
        <div className="card">
          <div className="section-header" style={{ marginBottom: 'var(--spacing-4)' }}>
            <div>
              <div className="section-title" style={{ fontSize: 'var(--font-size-base)' }}>CV của tôi</div>
              <div className="section-subtitle">{primaryResume?.title || 'Chưa có CV'}</div>
            </div>
            <Link to="/resumes" className="btn btn-ghost btn-sm">Xem chi tiết <ChevronRight size={14} /></Link>
          </div>
          {primaryResume ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-6)' }}>
              <ScoreRing score={75} size={110} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
                  <CheckCircle size={14} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-600)' }}>CV đã được tạo thành công</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
                  <AlertCircle size={14} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>Thêm kinh nghiệm để tăng điểm</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                  <AlertCircle size={14} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>Cập nhật kỹ năng mới nhất</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-6)' }}>
              <p style={{ color: 'var(--color-gray-400)', marginBottom: 'var(--spacing-3)' }}>Chưa có CV nào</p>
              <Link to="/resumes" className="btn btn-primary btn-sm">Tạo CV đầu tiên</Link>
            </div>
          )}
        </div>

        {/* Việc làm mới nhất */}
        <div className="card">
          <div className="section-header" style={{ marginBottom: 'var(--spacing-4)' }}>
            <div>
              <div className="section-title" style={{ fontSize: 'var(--font-size-base)' }}>Việc làm mới nhất</div>
              <div className="section-subtitle">Từ database thực tế</div>
            </div>
            <Link to="/jobs" className="btn btn-ghost btn-sm">Xem tất cả <ChevronRight size={14} /></Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {topJobs.length === 0 ? (
              <p style={{ color: 'var(--color-gray-400)', fontSize: 'var(--font-size-sm)' }}>Chưa có việc làm nào</p>
            ) : topJobs.map(job => (
              <div key={job.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-3)', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-lg)' }}>
                <div className="company-logo" style={{ background: getCompanyColor(job.company_name), width: 36, height: 36, borderRadius: 'var(--radius-md)', fontSize: '0.7rem' }}>
                  {job.company_name?.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {job.title}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>{job.company_name} · {job.location}</div>
                </div>
                <Link to="/jobs" style={{ color: 'var(--color-primary)', flexShrink: 0 }}>
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Đơn ứng tuyển gần đây */}
      <div className="card">
        <div className="section-header">
          <div>
            <div className="section-title" style={{ fontSize: 'var(--font-size-base)' }}>Đơn ứng tuyển gần đây</div>
            <div className="section-subtitle">Theo dõi trạng thái</div>
          </div>
          <Link to="/applications" className="btn btn-outline btn-sm">Xem tất cả <ChevronRight size={14} /></Link>
        </div>
        {recentApps.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-6)' }}>
            <p style={{ color: 'var(--color-gray-400)', marginBottom: 'var(--spacing-3)' }}>Chưa có đơn ứng tuyển nào</p>
            <Link to="/jobs" className="btn btn-primary btn-sm">Tìm việc ngay</Link>
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>Vị trí</th>
                  <th>Công ty</th>
                  <th>Trạng thái</th>
                  <th>Ngày nộp</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map(app => {
                  const cfg = statusConfig[app.status] || statusConfig['pending'];
                  return (
                    <tr key={app.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--color-gray-900)', fontSize: 'var(--font-size-sm)' }}>{app.job_title}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)' }}>{app.job_location}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                          <div style={{ width: 24, height: 24, borderRadius: 'var(--radius-sm)', background: getCompanyColor(app.company_name), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 10, fontWeight: 700 }}>
                            {app.company_name?.charAt(0)}
                          </div>
                          <span style={{ fontSize: 'var(--font-size-sm)' }}>{app.company_name}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${cfg.color}`}>{cfg.label}</span>
                      </td>
                      <td style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)' }}>
                        {timeAgo(app.applied_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
