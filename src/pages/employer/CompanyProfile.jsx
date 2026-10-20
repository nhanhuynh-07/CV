import { useState, useEffect } from 'react';
import { Building2, Globe, MapPin, Users, Mail, Phone, Save, Loader2, Upload } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CompanyProfile() {
    const { addToast } = useApp();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        company_name: '',
        industry: '',
        company_size: '50-100',
        location: '',
        website: '',
        contact_email: '',
        contact_phone: '',
        description: '',
        logo_url: ''
    });

    // Tải dữ liệu hồ sơ công ty từ Backend
    useEffect(() => {
        const fetchCompany = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5000/api/candidates/company/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok && data) {
                    setForm({
                        company_name: data.company_name || '',
                        industry: data.industry || '',
                        company_size: data.company_size || '50-100',
                        location: data.location || '',
                        website: data.website || '',
                        contact_email: data.contact_email || '',
                        contact_phone: data.contact_phone || '',
                        description: data.description || '',
                        logo_url: data.logo_url || ''
                    });
                }
            } catch (err) {
                console.error('Lỗi tải hồ sơ công ty:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCompany();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/candidates/company/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || data.message || 'Lỗi lưu thông tin');

            addToast('Cập nhật hồ sơ công ty thành công!', 'success');
        } catch (err) {
            addToast('Lỗi: ' + err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                <Loader2 className="animate-spin" size={28} style={{ margin: '0 auto 8px' }} />
                <p>Đang tải thông tin công ty...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header hồ sơ */}
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px' }}>
                <div style={{
                    width: 72, height: 72, borderRadius: '12px', background: '#eff6ff',
                    color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '28px', fontWeight: 700, border: '2px solid #bfdbfe'
                }}>
                    {form.company_name ? form.company_name.charAt(0).toUpperCase() : <Building2 size={36} />}
                </div>
                <div>
                    <h2 style={{ margin: '0 0 6px 0' }}>{form.company_name || 'Tên công ty của bạn'}</h2>
                    <div style={{ display: 'flex', gap: '16px', color: '#64748b', fontSize: '14px', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={14} /> {form.location || 'Chưa cập nhật địa chỉ'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Users size={14} /> {form.company_size} nhân viên
                        </span>
                        {form.website && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Globe size={14} /> {form.website}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Form cập nhật chi tiết */}
            <div className="card" style={{ padding: '24px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Thông tin cơ bản</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>
                                Tên công ty *
                            </label>
                            <input
                                type="text"
                                name="company_name"
                                required
                                value={form.company_name}
                                onChange={handleChange}
                                placeholder="VD: Công ty TNHH Giải Pháp Công Nghệ Việt"
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>
                                Lĩnh vực hoạt động
                            </label>
                            <input
                                type="text"
                                name="industry"
                                value={form.industry}
                                onChange={handleChange}
                                placeholder="VD: Công nghệ phần mềm, Thương mại điện tử..."
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>
                                Quy mô công ty
                            </label>
                            <select
                                name="company_size"
                                value={form.company_size}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            >
                                <option value="1-10">1 - 10 nhân viên (Startup)</option>
                                <option value="10-50">10 - 50 nhân viên</option>
                                <option value="50-100">50 - 100 nhân viên</option>
                                <option value="100-500">100 - 500 nhân viên</option>
                                <option value="500+">Trên 500 nhân viên</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>
                                Địa chỉ trụ sở
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="VD: Quận 1, TP. Hồ Chí Minh"
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>
                                Website công ty
                            </label>
                            <input
                                type="text"
                                name="website"
                                value={form.website}
                                onChange={handleChange}
                                placeholder="https://company.vn"
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>
                                Email liên hệ
                            </label>
                            <input
                                type="email"
                                name="contact_email"
                                value={form.contact_email}
                                onChange={handleChange}
                                placeholder="contact@company.vn"
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>
                                Số điện thoại liên hệ
                            </label>
                            <input
                                type="text"
                                name="contact_phone"
                                value={form.contact_phone}
                                onChange={handleChange}
                                placeholder="028 1234 5678"
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>
                            Giới thiệu về công ty & Môi trường làm việc
                        </label>
                        <textarea
                            name="description"
                            rows={5}
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Tầm nhìn, sứ mệnh, văn hóa làm việc và chế độ đãi ngộ..."
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', lineHeight: 1.6 }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={saving}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
                        >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}