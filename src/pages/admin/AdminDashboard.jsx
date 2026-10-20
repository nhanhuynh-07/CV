import { Users, Building2, Briefcase, FileCheck, ArrowUpRight } from 'lucide-react';

export default function AdminDashboard() {
    const stats = [
        { label: 'Tổng người dùng', value: '1,240', sub: '+12% tuần này', icon: Users, color: '#3b82f6', bg: '#eff6ff' },
        { label: 'Doanh nghiệp', value: '86', sub: '5 chờ duyệt', icon: Building2, color: '#10b981', bg: '#ecfdf5' },
        { label: 'Tin tuyển dụng', value: '342', sub: '28 tin mới hôm nay', icon: Briefcase, color: '#f59e0b', bg: '#fffbeb' },
        { label: 'Lượt ứng tuyển', value: '3,890', sub: '+18% so với tháng trước', icon: FileCheck, color: '#6366f1', bg: '#eef2ff' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Banner chào mừng Admin */}
            <div className="card" style={{ padding: '24px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff' }}>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '22px' }}>Trung tâm Quản trị Hệ thống CTY Phúc Nhân</h2>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
                    Theo dõi tổng quan hoạt động, số liệu việc làm và quản lý người dùng trên toàn hệ thống.
                </p>
            </div>

            {/* 4 thẻ thống kê số liệu */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                {stats.map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <div key={i} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>{s.label}</span>
                                <div style={{ padding: '8px', borderRadius: '8px', background: s.bg, color: s.color }}>
                                    <Icon size={20} />
                                </div>
                            </div>
                            <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>{s.value}</div>
                            <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <ArrowUpRight size={14} /> {s.sub}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Danh sách việc làm cần duyệt & Phím tắt quản lý */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                <div className="card" style={{ padding: '20px' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Tin tuyển dụng cần phê duyệt</h3>
                    <p style={{ fontSize: '13px', color: '#64748b' }}>Hiện không có tin tuyển dụng nào đang chờ duyệt.</p>
                </div>

                <div className="card" style={{ padding: '20px' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Phím tắt nhanh</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'flex-start' }}>
                            👥 Danh sách Người dùng
                        </button>
                        <button className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'flex-start' }}>
                            🏢 Danh sách Doanh nghiệp
                        </button>
                        <button className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'flex-start' }}>
                            💼 Kiểm duyệt Tin tuyển dụng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}