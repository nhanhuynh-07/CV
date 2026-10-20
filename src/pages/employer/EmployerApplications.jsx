import { useState, useEffect } from 'react';
import { Check, X, MessageSquare, Eye, Calendar } from 'lucide-react';
import { applicationsApi } from '../../utils/api';
import { statusConfig, timeAgo, getAvatarColor, getInitials } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';
import { useFetch, LoadingSpinner, ErrorState, EmptyState } from '../../utils/useFetch';

const STATUS_ACTIONS = [
  { key: 'reviewing', label: 'Đang xem xét', icon: Eye, cls: 'btn-primary' },
  { key: 'interview', label: 'Mời phỏng vấn', icon: Calendar, cls: 'btn-success' },
  { key: 'offer', label: 'Gửi offer', icon: Check, cls: 'btn-outline' },
  { key: 'rejected', label: 'Từ chối', icon: X, cls: 'btn-danger' },
];

export default function EmployerApplications() {
  const { addToast, setApplications } = useApp();
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const [localApps, setLocalApps] = useState(null);

  const { data: applications, loading, error, refetch } = useFetch(() => applicationsApi.getEmployerApps());

  // Đồng bộ cả local state lẫn context chung
  useEffect(() => {
    if (applications) {
      setLocalApps(applications);
      if (setApplications) {
        setApplications(applications);
      }
    }
  }, [applications, setApplications]);

  useEffect(() => {
    if (localApps?.length > 0 && !selected) {
      setSelected(localApps[0]);
    }
  }, [localApps, selected]);

  const apps = localApps || [];
  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter);

  const updateStatus = async (appId, newStatus) => {
    const prev = apps.find(a => a.id === appId)?.status;
    const updated = apps.map(a => a.id === appId ? { ...a, status: newStatus } : a);

    setLocalApps(updated);
    if (setApplications) setApplications(updated);
    if (selected?.id === appId) setSelected(p => ({ ...p, status: newStatus }));

    try {
      await applicationsApi.updateStatus(appId, newStatus);
      addToast(`Đã cập nhật: "${statusConfig[newStatus]?.label || newStatus}"`, 'success');
    } catch (err) {
      // Rollback nếu thất bại
      const rolledBack = apps.map(a => a.id === appId ? { ...a, status: prev } : a);
      setLocalApps(rolledBack);
      if (setApplications) setApplications(rolledBack);
      addToast('Lỗi cập nhật: ' + err.message, 'error');
    }
  };

  if (loading) return <LoadingSpinner text="Đang tải đơn ứng tuyển..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const filterOptions = ['all', 'pending', 'reviewing', 'interview', 'offer', 'rejected'];

  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-6)' }}>
      {/* LEFT */}
      <div style={{ width: 360, flexShrink: 0 }}>
        <div style={{ marginBottom: 'var(--spacing-4)' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-1)', flexWrap: 'wrap' }}>
            {filterOptions.map(f => (
              <button key={f} className={`tag ${filter === f ? 'active' : ''}`} style={{ fontSize: 11 }} onClick={() => setFilter(f)}>
                {f === 'all' ? `Tất cả (${apps.length})` : `${statusConfig[f]?.label || f} (${apps.filter(a => a.status === f).length})`}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon="📋" title="Không có đơn nào" subtitle="Chưa nhận được đơn ứng tuyển phù hợp." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            {filtered.map(app => {
              const cfg = statusConfig[app.status] || statusConfig['pending'];
              return (
                <div
                  key={app.id}
                  className="card card-sm"
                  style={{ cursor: 'pointer', borderColor: selected?.id === app.id ? 'var(--color-primary)' : undefined, background: selected?.id === app.id ? 'var(--color-primary-light)' : undefined }}
                  onClick={() => setSelected(app)}
                >
                  <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
                    <div className="avatar avatar-md" style={{ background: getAvatarColor(app.full_name || 'UV') }}>
                      {getInitials(app.full_name || 'UV')}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-900)' }}>{app.full_name}</div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.job_title}</div>
                      <span className={`badge badge-${cfg.color}`} style={{ fontSize: 10, marginTop: 4 }}>{cfg.label}</span>
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)', flexShrink: 0 }}>
                      {timeAgo(app.applied_at)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RIGHT */}
      {selected && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' }}>
          {/* Candidate Header */}
          <div className="card">
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'flex-start' }}>
              <div className="avatar avatar-lg" style={{ background: getAvatarColor(selected.full_name || 'UV') }}>
                {getInitials(selected.full_name || 'UV')}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: 4 }}>{selected.full_name}</h3>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', marginBottom: 4 }}>
                  {selected.email} {selected.phone && `· ${selected.phone}`}
                </div>
                {selected.headline && (
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', marginBottom: 4 }}>{selected.headline}</div>
                )}
                <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)' }}>
                    Ứng tuyển: <strong>{selected.job_title}</strong>
                  </span>
                  <span className={`badge badge-${statusConfig[selected.status]?.color || 'gray'}`}>
                    {statusConfig[selected.status]?.label || selected.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="card">
            <h4 style={{ marginBottom: 'var(--spacing-4)' }}>Hành động</h4>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
              {STATUS_ACTIONS.map(({ key, label, icon: Icon, cls }) => (
                <button
                  key={key}
                  className={`btn ${cls} btn-sm`}
                  onClick={() => updateStatus(selected.id, key)}
                  disabled={selected.status === key}
                  style={selected.status === key ? { opacity: 0.5 } : {}}
                >
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid-2">
            <div className="card">
              <h4 style={{ marginBottom: 'var(--spacing-3)' }}>Thông tin đơn</h4>
              {[
                { label: 'Ngày nộp', value: timeAgo(selected.applied_at) },
                { label: 'Trạng thái', value: statusConfig[selected.status]?.label || selected.status },
                { label: 'Vị trí', value: selected.job_title },
                { label: 'Địa điểm', value: selected.candidate_location || '—' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-2)' }}>
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>{item.label}</span>
                  <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--color-gray-800)' }}>{item.value}</span>
                </div>
              ))}
            </div>

            <div className="card">
              <h4 style={{ marginBottom: 'var(--spacing-3)' }}>Thư xin việc</h4>
              {selected.cover_letter ? (
                <p style={{ fontSize: 'var(--font-size-sm)', lineHeight: 1.7, color: 'var(--color-gray-600)' }}>
                  {selected.cover_letter}
                </p>
              ) : (
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-400)', fontStyle: 'italic' }}>
                  Không có thư xin việc
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}