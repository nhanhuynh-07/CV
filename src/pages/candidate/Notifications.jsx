import { Bell, CheckCheck, Briefcase, Cpu, Star, Trash2 } from 'lucide-react';
import { timeAgo } from '../../utils/helpers';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { notificationsApi } from '../../utils/api';
import { useFetch, LoadingSpinner, ErrorState, EmptyState } from '../../utils/useFetch';

const iconMap = {
  application_status: Briefcase,
  application_update: Briefcase,
  system: Cpu,
  new_match: Star,
  new_job: Briefcase,
  message: Bell,
};

export default function Notifications() {
  const { addToast } = useApp();
  const { data: notifs, loading, error, refetch } = useFetch(() => notificationsApi.getAll());
  const [localNotifs, setLocalNotifs] = useState(null);

  // Dùng localNotifs nếu đã update locally, ngược lại dùng từ API
  const displayNotifs = localNotifs ?? notifs ?? [];
  const unreadCount = displayNotifs.filter(n => !n.is_read).length;

  const markRead = async (id) => {
    setLocalNotifs(prev => (prev ?? notifs ?? []).map(n => n.id === id ? { ...n, is_read: true } : n));
    try { await notificationsApi.markRead(id); } catch (_) {}
  };

  const markAllRead = async () => {
    setLocalNotifs(prev => (prev ?? notifs ?? []).map(n => ({ ...n, is_read: true })));
    try {
      await notificationsApi.markAllRead();
      addToast('Đã đọc tất cả thông báo', 'success');
    } catch (err) {
      addToast('Lỗi: ' + err.message, 'error');
    }
  };

  const deleteNotif = async (id) => {
    setLocalNotifs(prev => (prev ?? notifs ?? []).filter(n => n.id !== id));
    try {
      await notificationsApi.delete(id);
      addToast('Đã xóa thông báo', 'info');
    } catch (_) {}
  };

  // Đồng bộ khi data từ API về
  if (notifs && localNotifs === null) {
    // chỉ dùng notifs trực tiếp lần đầu
  }

  if (loading) return <LoadingSpinner text="Đang tải thông báo..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Thông báo</div>
          <div className="section-subtitle">{unreadCount} thông báo chưa đọc</div>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-outline btn-sm" onClick={markAllRead}>
            <CheckCheck size={14} /> Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      {displayNotifs.length === 0 ? (
        <EmptyState icon="🔔" title="Không có thông báo" subtitle="Bạn chưa có thông báo nào." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          {displayNotifs.map(notif => {
            const Icon = iconMap[notif.type] || Bell;
            return (
              <div
                key={notif.id}
                className="card card-sm"
                style={{
                  display: 'flex', gap: 'var(--spacing-4)', alignItems: 'flex-start',
                  cursor: 'pointer',
                  background: notif.is_read ? 'var(--color-white)' : 'var(--color-primary-light)',
                  borderColor: notif.is_read ? undefined : 'var(--color-primary-subtle)',
                  transition: 'all 0.2s',
                }}
                onClick={() => markRead(notif.id)}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-lg)',
                  background: notif.is_read ? 'var(--color-gray-100)' : 'var(--color-primary-subtle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={18} style={{ color: notif.is_read ? 'var(--color-gray-400)' : 'var(--color-primary)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: notif.is_read ? 400 : 600, fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-900)', marginBottom: 4 }}>
                    {notif.title}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', lineHeight: 1.5 }}>{notif.message}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)', marginTop: 6 }}>{timeAgo(notif.created_at)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', flexShrink: 0 }}>
                  {!notif.is_read && (
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)' }} />
                  )}
                  <button
                    className="btn btn-ghost btn-icon btn-sm"
                    onClick={e => { e.stopPropagation(); deleteNotif(notif.id); }}
                    title="Xóa thông báo"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
