import { Link } from 'react-router-dom';
import { Briefcase, Users, Eye, Clock, TrendingUp, ChevronRight, Plus, BarChart3 } from 'lucide-react';
import { applicationsApi, jobsApi } from '../../utils/api';
import { statusConfig, timeAgo, getAvatarColor, getInitials } from '../../utils/helpers';
import { useFetch, LoadingSpinner } from '../../utils/useFetch';

export default function EmployerDashboard() {
  const { data: jobs, loading: jobLoading } = useFetch(() => jobsApi.getAll({ limit: 5 }));
  const { data: applications, loading: appLoading } = useFetch(() => applicationsApi.getEmployerApps());

  const loading = jobLoading || appLoading;
  if (loading) return <LoadingSpinner text="Đang tải dashboard..." />;

  const jobList = jobs?.jobs || [];
  const appList = applications || [];

  const totalJobs = jobs?.pagination?.total || jobList.length;
  const pending = appList.filter(a => a.status === 'pending').length;
  const reviewing = appList.filter(a => a.status === 'reviewing').length;
  const interview = appList.filter(a => a.status === 'interview').length;

  const stats = [
    { label: 'Tin đang đăng', value: totalJobs, icon: Briefcase, color: 'blue', change: 'Tổng số tin', up: null },
    { label: 'Tổng ứng viên', value: appList.length, icon: Users, color: 'purple', change: 'Đã nhận', up: null },
    { label: 'Chờ xem xét', value: pending, icon: Eye, color: 'orange', change: reviewing > 0 ? `${reviewing} đang xem xét` : 'Cần xử lý', up: null },
    { label: 'Phỏng vấn', value: interview, icon: Clock, color: 'green', change: 'Đã mời phỏng vấn', up: null },
  ];

  // Biểu đồ: ứng tuyển theo 14 ngày gần nhất
  const now = new Date();
  const barData = Array.from({ length: 14 }, (_, i) => {
    const day = new Date(now);
    day.setDate(now.getDate() - (13 - i));
    const dayStr = day.toISOString().split('T')[0];
    const count = appList.filter(a => a.applied_at?.startsWith(dayStr)).length;
    return { day: day.getDate() + '/' + (day.getMonth() + 1), count };
  });
  const maxBar = Math.max(...barData.map(b => b.count), 1);

  return (
    <div className="animate-fade">
      {/* Welcome */}
      <div className="card" style={{ marginBottom: 'var(--spacing-8)', background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)', border: '1px solid var(--color-primary-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ marginBottom: 'var(--spacing-1)' }}>Bảng điều khiển nhà tuyển dụng 🏢</h2>
            <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)' }}>
              Bạn có <strong style={{ color: 'var(--color-warning)' }}>{pending} đơn ứng tuyển</strong> đang chờ xem xét.
            </p>
          </div>
          <Link to="/employer/jobs" className="btn btn-primary">
            <Plus size={16} /> Đăng tin mới
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div className="stat-card" key={i}>
              <div className={`stat-icon-wrap ${stat.color}`}><Icon size={22} /></div>
              <div className="stat-info">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                {stat.change && <div className={`stat-change ${stat.up ? 'up' : ''}`}>{stat.change}</div>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid-2" style={{ marginBottom: 'var(--spacing-6)' }}>
        {/* Tin tuyển dụng */}
        <div className="card">
          <div className="section-header" style={{ marginBottom: 'var(--spacing-4)' }}>
            <div className="section-title" style={{ fontSize: 'var(--font-size-base)' }}>Tin tuyển dụng</div>
            <Link to="/employer/jobs" className="btn btn-ghost btn-sm">Quản lý <ChevronRight size={14} /></Link>
          </div>
          {jobList.length === 0 ? (
            <p style={{ color: 'var(--color-gray-400)', fontSize: 'var(--font-size-sm)' }}>Chưa có tin tuyển dụng nào.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              {jobList.map(job => (
                <div key={job.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-3)', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-gray-900)' }}>{job.title}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)' }}>{job.location}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-800)' }}>
                      {appList.filter(a => a.job_id === job.id).length} đơn
                    </div>
                    <span className={`badge badge-${statusConfig[job.status]?.color || 'gray'}`} style={{ fontSize: 10 }}>
                      {statusConfig[job.status]?.label || job.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ứng viên mới */}
        <div className="card">
          <div className="section-header" style={{ marginBottom: 'var(--spacing-4)' }}>
            <div className="section-title" style={{ fontSize: 'var(--font-size-base)' }}>Ứng viên mới nhất</div>
            <Link to="/employer/applications" className="btn btn-ghost btn-sm">Xem tất cả <ChevronRight size={14} /></Link>
          </div>
          {appList.length === 0 ? (
            <p style={{ color: 'var(--color-gray-400)', fontSize: 'var(--font-size-sm)' }}>Chưa có đơn ứng tuyển.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              {appList.slice(0, 5).map(app => {
                const cfg = statusConfig[app.status] || statusConfig['pending'];
                return (
                  <div key={app.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                    <div className="avatar avatar-sm" style={{ background: getAvatarColor(app.full_name || 'UV') }}>
                      {getInitials(app.full_name || 'UV')}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-900)' }}>{app.full_name}</div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)' }}>{app.job_title}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span className={`badge badge-${cfg.color}`} style={{ fontSize: 10 }}>{cfg.label}</span>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)', marginTop: 2 }}>{timeAgo(app.applied_at)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Biểu đồ thực tế */}
      <div className="card">
        <div className="section-header" style={{ marginBottom: 'var(--spacing-4)' }}>
          <div>
            <div className="section-title" style={{ fontSize: 'var(--font-size-base)' }}>Thống kê ứng tuyển</div>
            <div className="section-subtitle">14 ngày gần nhất</div>
          </div>
          <BarChart3 size={20} style={{ color: 'var(--color-gray-400)' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--spacing-2)', height: 100 }}>
          {barData.map((bar, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div
                style={{
                  width: '100%',
                  height: `${Math.max((bar.count / maxBar) * 90, bar.count > 0 ? 10 : 0)}%`,
                  minHeight: bar.count > 0 ? 8 : 0,
                  background: `linear-gradient(to top, var(--color-primary), var(--color-primary-subtle))`,
                  borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                  transition: 'height 0.3s',
                }}
                title={`${bar.count} đơn`}
              />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--color-gray-400)', marginTop: 4 }}>
          <span>{barData[0]?.day}</span>
          <span>{barData[6]?.day}</span>
          <span>{barData[13]?.day}</span>
        </div>
      </div>
    </div>
  );
}
