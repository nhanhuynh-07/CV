import { useState, useEffect } from 'react';
import { Bell, CheckCheck, Clock, Info, Inbox } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { timeAgo } from '../../utils/helpers';

export default function EmployerNotifications() {
    const { addToast, fetchUnreadNotifications } = useApp();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Gọi API lấy danh sách thông báo từ backend
    const loadNotifications = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setNotifications(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error('Lỗi tải thông báo:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    // Đánh dấu tất cả thông báo là đã đọc
    const handleMarkAllRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch('http://localhost:5000/api/notifications/read-all', {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            if (fetchUnreadNotifications) fetchUnreadNotifications();
            addToast('Đã đánh dấu tất cả là đã đọc', 'info');
        } catch (err) {
            addToast('Lỗi cập nhật trạng thái', 'error');
        }
    };

    // Đánh dấu 1 thông báo cụ thể là đã đọc khi click vào
    const handleMarkRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            if (fetchUnreadNotifications) fetchUnreadNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header thanh công cụ thông báo */}
            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '10px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb' }}>
                        <Bell size={22} />
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '18px' }}>Thông báo tuyển dụng</h2>
                        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                            Bạn có <strong>{unreadCount}</strong> thông báo chưa đọc
                        </p>
                    </div>
                </div>

                {unreadCount > 0 && (
                    <button
                        className="btn btn-outline btn-sm"
                        onClick={handleMarkAllRead}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                        <CheckCheck size={16} /> Đọc tất cả
                    </button>
                )}
            </div>

            {/* Danh sách thông báo */}
            <div className="card" style={{ padding: '8px' }}>
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Đang tải thông báo...</div>
                ) : notifications.length === 0 ? (
                    <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                        <Inbox size={40} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                        <p style={{ margin: 0 }}>Hiện chưa có thông báo nào.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {notifications.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => !item.is_read && handleMarkRead(item.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '14px',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    background: item.is_read ? 'transparent' : '#f0f9ff',
                                    cursor: item.is_read ? 'default' : 'pointer',
                                    borderBottom: '1px solid #f1f5f9',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <div style={{ marginTop: '2px', color: item.is_read ? '#94a3b8' : '#0284c7' }}>
                                    <Info size={18} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                        <div style={{ fontWeight: item.is_read ? 500 : 700, color: '#1e293b', fontSize: '14px' }}>
                                            {item.title}
                                        </div>
                                        <span style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={12} /> {timeAgo(item.created_at)}
                                        </span>
                                    </div>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                                        {item.content}
                                    </p>
                                </div>
                                {!item.is_read && (
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0284c7', alignSelf: 'center', flexShrink: 0 }} />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}