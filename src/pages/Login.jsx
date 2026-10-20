import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { User, Briefcase, Mail, Lock, Building, CheckCircle2 } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const { addToast } = useApp();

    const [isRegister, setIsRegister] = useState(false);
    const [role, setRole] = useState('candidate'); // 'candidate' hoặc 'employer'
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        company_name: '',
    });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isRegister) {
                // XỬ LÝ ĐĂNG KÝ
                const res = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                        full_name: formData.full_name,
                        role: role,
                        company_name: role === 'employer' ? formData.company_name : undefined
                    })
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Đăng ký không thành công');

                addToast('Đăng ký tài khoản thành công! Vui lòng đăng nhập.', 'success');
                setIsRegister(false); // Chuyển về tab Đăng nhập
            } else {
                // XỬ LÝ ĐĂNG NHẬP
                const res = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Sai email hoặc mật khẩu');

                // Lưu thông tin phiên đăng nhập
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                addToast(`Chào mừng ${data.user.full_name || 'bạn'} quay trở lại!`, 'success');

                // 👉 ĐIỀU HƯỚNG THÔNG MINH THEO CẢ 3 VAI TRÒ:
                if (data.user.role === 'admin') {
                    navigate('/admin');
                } else if (data.user.role === 'employer') {
                    navigate('/employer');
                } else {
                    navigate('/dashboard');
                }
                window.location.reload();
            }
        } catch (err) {
            addToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
            padding: '20px'
        }}>
            <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
                width: '100%',
                maxWidth: '440px',
                padding: '36px',
                border: '1px solid #e2e8f0'
            }}>
                {/* Header Tiêu đề */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                        {isRegister ? 'Tạo Tài Khoản' : 'Đăng Nhập'}
                    </h2>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                        {isRegister
                            ? 'Tham gia cùng hàng nghìn ứng viên và nhà tuyển dụng'
                            : 'Truy cập hệ thống việc làm và tuyển dụng'}
                    </p>
                </div>

                {/* Nút chọn vai trò khi Đăng ký */}
                {isRegister && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                        <button
                            type="button"
                            onClick={() => setRole('candidate')}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '12px',
                                borderRadius: '10px',
                                border: `2px solid ${role === 'candidate' ? '#2563eb' : '#e2e8f0'}`,
                                background: role === 'candidate' ? '#eff6ff' : '#ffffff',
                                color: role === 'candidate' ? '#2563eb' : '#64748b',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '13px',
                                transition: 'all 0.2s'
                            }}
                        >
                            <User size={20} />
                            Ứng viên
                        </button>

                        <button
                            type="button"
                            onClick={() => setRole('employer')}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '12px',
                                borderRadius: '10px',
                                border: `2px solid ${role === 'employer' ? '#2563eb' : '#e2e8f0'}`,
                                background: role === 'employer' ? '#eff6ff' : '#ffffff',
                                color: role === 'employer' ? '#2563eb' : '#64748b',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '13px',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Briefcase size={20} />
                            Nhà tuyển dụng
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Họ tên đầy đủ khi đăng ký */}
                    {isRegister && (
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                                Họ và tên của bạn
                            </label>
                            <input
                                type="text"
                                name="full_name"
                                required
                                value={formData.full_name}
                                onChange={handleChange}
                                placeholder="VD: Nguyễn Văn A"
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '14px',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    )}

                    {/* Tên công ty khi đăng ký vai trò NTD */}
                    {isRegister && role === 'employer' && (
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                                Tên công ty / Doanh nghiệp
                            </label>
                            <input
                                type="text"
                                name="company_name"
                                required
                                value={formData.company_name}
                                onChange={handleChange}
                                placeholder="VD: Công ty TNHH Công nghệ FPT"
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '14px',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    )}

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@example.com"
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#2563eb',
                            color: '#ffffff',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '8px',
                            transition: 'background 0.2s'
                        }}
                    >
                        {loading ? 'Đang xử lý...' : (isRegister ? 'Đăng ký ngay' : 'Đăng nhập ngay')}
                    </button>
                </form>

                {/* Chuyển đổi qua lại giữa Đăng nhập và Đăng ký */}
                <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#64748b' }}>
                    {isRegister ? (
                        <>
                            Đã có tài khoản?{' '}
                            <span
                                onClick={() => setIsRegister(false)}
                                style={{ color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Đăng nhập
                            </span>
                        </>
                    ) : (
                        <>
                            Chưa có tài khoản?{' '}
                            <span
                                onClick={() => setIsRegister(true)}
                                style={{ color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Tạo tài khoản mới
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}