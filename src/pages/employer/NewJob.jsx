import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function NewJob() {
    const navigate = useNavigate();
    const { addToast } = useApp();

    const [formData, setFormData] = useState({
        title: '',
        location: '',
        salary_min: '',
        salary_max: '',
        salary_type: 'monthly',
        salary_currency: 'VND',
        employment_type: 'full_time',
        experience_level: 'mid',
        description: '',
        requirements: '',
        benefits: '',
        expires_at: ''
    });

    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const token = localStorage.getItem('token');

        try {
            const res = await fetch('http://localhost:5000/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    salary_min: formData.salary_min ? Number(formData.salary_min) : null,
                    salary_max: formData.salary_max ? Number(formData.salary_max) : null
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Lỗi khi tạo tin tuyển dụng');
            }

            addToast('Đăng tin tuyển dụng thành công!', 'success');
            navigate('/employer/jobs');
        } catch (err) {
            console.error(err);
            addToast(err.message || 'Đăng tin thất bại', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => navigate('/employer/jobs')}
                style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
                <ArrowLeft size={16} /> Quay lại danh sách
            </button>

            <div className="card">
                <h2 style={{ marginBottom: '20px' }}>Đăng tin tuyển dụng mới</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Tiêu đề công việc *</label>
                        <input
                            type="text"
                            name="title"
                            required
                            placeholder="VD: Senior React Developer"
                            className="form-input"
                            value={formData.title}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Địa điểm làm việc *</label>
                            <input
                                type="text"
                                name="location"
                                required
                                placeholder="VD: TP. Hồ Chí Minh"
                                className="form-input"
                                value={formData.location}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Hạn nộp hồ sơ</label>
                            <input
                                type="date"
                                name="expires_at"
                                className="form-input"
                                value={formData.expires_at}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Lương tối thiểu</label>
                            <input
                                type="number"
                                name="salary_min"
                                placeholder="VD: 15000000"
                                className="form-input"
                                value={formData.salary_min}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Lương tối đa</label>
                            <input
                                type="number"
                                name="salary_max"
                                placeholder="VD: 25000000"
                                className="form-input"
                                value={formData.salary_max}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Đơn vị tiền tệ</label>
                            <select
                                name="salary_currency"
                                className="form-input"
                                value={formData.salary_currency}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            >
                                <option value="VND">VND</option>
                                <option value="USD">USD</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Hình thức làm việc</label>
                            <select
                                name="employment_type"
                                className="form-input"
                                value={formData.employment_type}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            >
                                <option value="full_time">Toàn thời gian</option>
                                <option value="part_time">Bán thời gian</option>
                                <option value="contract">Hợp đồng</option>
                                <option value="internship">Thực tập</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Cấp bậc kinh nghiệm</label>
                            <select
                                name="experience_level"
                                className="form-input"
                                value={formData.experience_level}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            >
                                <option value="intern">Thực tập sinh</option>
                                <option value="fresher">Fresher</option>
                                <option value="junior">Junior</option>
                                <option value="mid">Mid-level</option>
                                <option value="senior">Senior</option>
                                <option value="lead">Trưởng nhóm</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Mô tả công việc</label>
                        <textarea
                            name="description"
                            rows={4}
                            placeholder="Chi tiết công việc..."
                            className="form-input"
                            value={formData.description}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Yêu cầu ứng viên</label>
                        <textarea
                            name="requirements"
                            rows={3}
                            placeholder="Kỹ năng, kinh nghiệm cần có..."
                            className="form-input"
                            value={formData.requirements}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => navigate('/employer/jobs')}
                            disabled={submitting}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {submitting ? 'Đang lưu...' : 'Đăng tin'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}