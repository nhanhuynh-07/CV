import { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, MapPin, DollarSign, Users, Clock, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { statusConfig, formatSalary, employmentTypeLabel, experienceLevelLabel } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';

export default function EmployerJobs() {
  const { addToast } = useApp();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const token = localStorage.getItem('token');

  // 1. Tải danh sách tin tuyển dụng từ PostgreSQL backend
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/jobs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();

      // Hỗ trợ cả trường hợp API trả về mảng trực tiếp hoặc bọc trong object data
      if (Array.isArray(data)) {
        setJobs(data);
      } else if (Array.isArray(data.jobs)) {
        setJobs(data.jobs);
      } else if (Array.isArray(data.data)) {
        setJobs(data.data);
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.error('Lỗi tải tin tuyển dụng:', err);
      addToast('Không thể kết nối đến máy chủ lấy tin tuyển dụng', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // 2. Gửi yêu cầu xóa tin đến database PostgreSQL
  const handleDelete = async (jobId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tin tuyển dụng này?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Lỗi khi xóa tin tuyển dụng từ máy chủ');
      }

      // Xóa thành công trên DB -> lọc bỏ khỏi state UI
      setJobs(prev => prev.filter(j => j.id !== jobId));
      addToast('Đã xóa tin tuyển dụng thành công', 'success');
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Xóa tin tuyển dụng thất bại', 'error');
    }
  };

  const filtered = filter === 'all' ? jobs : jobs.filter(j => j.status === filter);

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Tin tuyển dụng</div>
          <div className="section-subtitle">{jobs.length} tin đang quản lý</div>
        </div>
        <Link to="/employer/jobs/new" className="btn btn-primary">
          <Plus size={16} /> Đăng tin mới
        </Link>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-5)', flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: 'Tất cả' },
          { key: 'published', label: 'Đang đăng' },
          { key: 'draft', label: 'Nháp' },
          { key: 'closed', label: 'Đã đóng' },
        ].map(f => (
          <button key={f.key} className={`tag ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-gray-500)' }}>
          <Loader2 className="animate-spin" size={28} style={{ margin: '0 auto 8px' }} />
          <p>Đang tải dữ liệu từ máy chủ...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-gray-500)' }}>
          <p>Chưa có tin tuyển dụng nào trong danh mục này.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          {filtered.map(job => {
            const cfg = statusConfig[job.status] || { color: 'gray', dot: '', label: job.status || 'Chưa rõ' };
            return (
              <div key={job.id} className="card">
                <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-2)' }}>
                      <h4 style={{ margin: 0 }}>{job.title}</h4>
                      <span className={`badge badge-${cfg.color}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span className={`status-dot ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap', marginBottom: 'var(--spacing-3)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>
                        <MapPin size={13} /> {job.location || 'Chưa cập nhật'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>
                        <DollarSign size={13} /> {formatSalary(job.salary_min, job.salary_max, job.salary_currency || 'VND', job.salary_type)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>
                        <Clock size={13} /> HSD: {job.expires_at ? new Date(job.expires_at).toLocaleDateString('vi-VN') : 'Không thời hạn'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                      {job.employment_type && (
                        <span className="badge badge-gray">{employmentTypeLabel[job.employment_type] || job.employment_type}</span>
                      )}
                      {job.experience_level && (
                        <span className="badge badge-gray">{experienceLevelLabel[job.experience_level] || job.experience_level}</span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexShrink: 0 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-gray-900)' }}>
                        {job.application_count ?? 0}
                      </div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)' }}>Ứng viên</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-gray-900)' }}>
                        {job.view_count ?? 0}
                      </div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)' }}>Lượt xem</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexShrink: 0 }}>
                    <button className="btn btn-outline btn-sm btn-icon" title="Xem" onClick={() => addToast('Đang xem tin...', 'info')}>
                      <Eye size={14} />
                    </button>
                    <button className="btn btn-outline btn-sm btn-icon" title="Sửa" onClick={() => addToast('Mở trình chỉnh sửa...', 'info')}>
                      <Edit size={14} />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm btn-icon"
                      title="Xóa"
                      onClick={() => handleDelete(job.id)}
                    >
                      <Trash2 size={14} style={{ color: 'var(--color-danger)' }} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}