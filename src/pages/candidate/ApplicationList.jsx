import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { statusConfig, formatSalary, timeAgo, getCompanyColor, employmentTypeLabel } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';
import { applicationsApi } from '../../utils/api';
import { useFetch, LoadingSpinner, ErrorState, EmptyState } from '../../utils/useFetch';

const statusSteps = ['pending', 'reviewing', 'interview', 'offer'];

function ApplicationStatusBar({ status }) {
  const isRejected = status === 'rejected';
  const isWithdrawn = status === 'withdrawn';
  const stepIdx = statusSteps.indexOf(status);

  if (isRejected || isWithdrawn) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', padding: 'var(--spacing-3) var(--spacing-4)', background: isRejected ? 'var(--color-danger-light)' : 'var(--color-gray-100)', borderRadius: 'var(--radius-lg)' }}>
        <XCircle size={14} style={{ color: isRejected ? 'var(--color-danger)' : 'var(--color-gray-400)' }} />
        <span style={{ fontSize: 'var(--font-size-sm)', color: isRejected ? 'var(--color-danger)' : 'var(--color-gray-500)', fontWeight: 500 }}>
          {isRejected ? 'Đơn bị từ chối' : 'Đã rút đơn'}
        </span>
      </div>
    );
  }

  const stepLabels = { pending: 'Đã nộp', reviewing: 'Đang xem xét', interview: 'Phỏng vấn', offer: 'Nhận offer' };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      {statusSteps.map((step, i) => {
        const isCompleted = i < stepIdx;
        const isCurrent = i === stepIdx;
        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < statusSteps.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: isCompleted || isCurrent ? 'var(--color-primary)' : 'var(--color-gray-200)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: isCurrent ? '2px solid var(--color-primary-dark)' : '2px solid transparent',
              }}>
                {isCompleted ? <CheckCircle size={12} style={{ color: 'white' }} /> : (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: isCurrent ? 'white' : 'var(--color-gray-400)' }} />
                )}
              </div>
              <span style={{ fontSize: 10, color: isCurrent ? 'var(--color-primary)' : isCompleted ? 'var(--color-gray-500)' : 'var(--color-gray-400)', fontWeight: isCurrent ? 600 : 400, whiteSpace: 'nowrap' }}>
                {stepLabels[step]}
              </span>
            </div>
            {i < statusSteps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: isCompleted ? 'var(--color-primary)' : 'var(--color-gray-200)', margin: '0 var(--spacing-1)', marginBottom: 16 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ApplicationList() {
  const { addToast } = useApp();
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const { data: applications, loading, error, refetch } = useFetch(() => applicationsApi.getMy());

  // Chọn đơn đầu tiên khi data load xong
  useEffect(() => {
    if (applications?.length > 0 && !selected) {
      setSelected(applications[0]);
    }
  }, [applications]);

  const filtered = !applications ? [] :
    filter === 'all' ? applications : applications.filter(a => a.status === filter);

  const handleWithdraw = async (appId) => {
    try {
      await applicationsApi.updateStatus(appId, 'withdrawn');
      addToast('Đã rút đơn ứng tuyển', 'info');
      refetch();
    } catch (err) {
      addToast('Lỗi: ' + err.message, 'error');
    }
  };

  if (loading) return <LoadingSpinner text="Đang tải đơn ứng tuyển..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-6)' }}>
      {/* LEFT */}
      <div style={{ width: 340, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-1)', flexWrap: 'wrap', marginBottom: 'var(--spacing-4)' }}>
          {[
            { key: 'all', label: `Tất cả (${applications?.length || 0})` },
            { key: 'reviewing', label: 'Đang xem' },
            { key: 'interview', label: 'Phỏng vấn' },
            { key: 'rejected', label: 'Không đạt' },
          ].map(f => (
            <button key={f.key} className={`tag ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon="📋" title="Chưa có đơn nào" subtitle="Hãy ứng tuyển các vị trí phù hợp!" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {filtered.map(app => {
              const cfg = statusConfig[app.status] || statusConfig['pending'];
              return (
                <div
                  key={app.id}
                  className="card card-sm"
                  style={{ cursor: 'pointer', borderColor: selected?.id === app.id ? 'var(--color-primary)' : undefined }}
                  onClick={() => setSelected(app)}
                >
                  <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'flex-start' }}>
                    <div className="company-logo" style={{ background: getCompanyColor(app.company_name), width: 36, height: 36, borderRadius: 'var(--radius-md)', fontSize: '0.7rem' }}>
                      {app.company_name?.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-900)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {app.job_title}
                      </div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginBottom: 4 }}>{app.company_name}</div>
                      <span className={`badge badge-${cfg.color}`} style={{ fontSize: 10 }}>{cfg.label}</span>
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)', flexShrink: 0 }}>{timeAgo(app.applied_at)}</div>
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
          <div className="card">
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'flex-start', marginBottom: 'var(--spacing-5)' }}>
              <div className="company-logo" style={{ background: getCompanyColor(selected.company_name), width: 52, height: 52, borderRadius: 'var(--radius-xl)', fontSize: '1.2rem' }}>
                {selected.company_name?.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: 4 }}>{selected.job_title}</h3>
                <div style={{ color: 'var(--color-primary)', fontWeight: 600, marginBottom: 4 }}>{selected.company_name}</div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>
                  {selected.job_location} · {employmentTypeLabel[selected.job_type] || selected.job_type}
                </div>
              </div>
            </div>
            <ApplicationStatusBar status={selected.status} />
          </div>

          <div className="grid-2">
            <div className="card">
              <h4 style={{ marginBottom: 'var(--spacing-3)' }}>Thông tin đơn</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                {[
                  { label: 'Ngày nộp', value: timeAgo(selected.applied_at) },
                  { label: 'Trạng thái', value: (statusConfig[selected.status] || statusConfig['pending']).label },
                  { label: 'Loại hình', value: employmentTypeLabel[selected.job_type] || selected.job_type || '—' },
                  { label: 'Mức lương', value: selected.salary_min ? `${(selected.salary_min / 1e6).toFixed(0)}–${(selected.salary_max / 1e6).toFixed(0)} triệu` : 'Thương lượng' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>{item.label}</span>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--color-gray-800)' }}>{item.value}</span>
                  </div>
                ))}
              </div>
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

          <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
            {selected.status === 'pending' && (
              <button className="btn btn-danger" onClick={() => handleWithdraw(selected.id)}>
                Rút đơn
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
