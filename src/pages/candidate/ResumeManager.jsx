import { useState, useEffect } from 'react';
import {
  FileText, Plus, Star, CheckCircle, AlertCircle, Trash2, Edit,
  Download, X, Save, Tag, Briefcase
} from 'lucide-react';
import { resumesApi } from '../../utils/api';
import { formatDate, skillLevelLabel, skillLevelWidth } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';
import { useFetch, LoadingSpinner, ErrorState, EmptyState } from '../../utils/useFetch';

const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];

// Form chọn Ngành nghề & Tags phân loại CV
function CategorySkillSection({ resumeId, initialIndustry = '', initialTags = [], onSave }) {
  const [industry, setIndustry] = useState(initialIndustry);
  const [tags, setTags] = useState(initialTags);
  const [inputTag, setInputTag] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useApp();

  const industriesList = [
    'Công nghệ thông tin / Phần mềm',
    'Marketing / Truyền thông',
    'Thiết kế đồ họa / UI-UX',
    'Kinh doanh / Bán hàng',
    'Tài chính / Kế toán',
    'Nhân sự / Hành chính',
    'Logistics / Xuất nhập khẩu'
  ];

  const handleAddTag = () => {
    const trimmed = inputTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setInputTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!industry) {
      addToast('Vui lòng chọn lĩnh vực nghề nghiệp', 'error');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/candidates/categories-skills', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ industry, skills_tags: tags })
      });
      if (!res.ok) throw new Error('Không thể lưu phân loại');
      addToast('Đã cập nhật ngành nghề và tags phân loại!', 'success');
      if (onSave) onSave();
    } catch (err) {
      addToast('Lỗi: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginBottom: 'var(--spacing-5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <Tag size={18} style={{ color: 'var(--color-primary)' }} />
        <h4 style={{ margin: 0 }}>Ngành nghề & Tags phân loại</h4>
      </div>
      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginBottom: 'var(--spacing-4)' }}>
        Nhà tuyển dụng sẽ dựa vào ngành nghề và các tag này để lọc hồ sơ chuẩn xác, tránh đề xuất sai chuyên ngành.
      </p>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
        <div className="form-group">
          <label>Lĩnh vực / Ngành nghề chính *</label>
          <select value={industry} onChange={e => setIndustry(e.target.value)} required>
            <option value="">-- Chọn lĩnh vực nghề nghiệp --</option>
            {industriesList.map((item, idx) => (
              <option key={idx} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Tags chuyên môn / Kỹ năng then chốt (nhấn Enter hoặc nút Thêm)</label>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
            <input
              type="text"
              placeholder="VD: React, Node.js, SEO, Figma..."
              value={inputTag}
              onChange={e => setInputTag(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              style={{ flex: 1 }}
            />
            <button type="button" className="btn btn-outline btn-sm" onClick={handleAddTag}>
              <Plus size={14} /> Thêm tag
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {tags.length === 0 ? (
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)', fontStyle: 'italic' }}>
                Chưa có tag nào được thêm.
              </span>
            ) : (
              tags.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    borderRadius: '16px',
                    background: 'var(--color-primary-light, #eff6ff)',
                    color: 'var(--color-primary, #2563eb)',
                    fontSize: '12px',
                    fontWeight: 500,
                    border: '1px solid #bfdbfe'
                  }}
                >
                  #{tag}
                  <X
                    size={12}
                    style={{ cursor: 'pointer', color: 'var(--color-gray-500)' }}
                    onClick={() => handleRemoveTag(tag)}
                  />
                </span>
              ))
            )}
          </div>
        </div>

        <div>
          <button type="submit" className="btn btn-primary btn-sm" disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Save size={14} /> {loading ? 'Đang lưu...' : 'Lưu ngành nghề & tags'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Form thêm/sửa kinh nghiệm
function ExperienceForm({ resumeId, existing, onSave, onClose }) {
  const [form, setForm] = useState(existing || {
    company_name: '', position: '', location: '', start_date: '', end_date: '', is_current: false, description: '',
  });
  const [loading, setLoading] = useState(false);
  const { addToast } = useApp();

  const handleSave = async () => {
    if (!form.company_name || !form.position || !form.start_date) {
      addToast('Vui lòng điền đầy đủ thông tin bắt buộc', 'error'); return;
    }
    setLoading(true);
    try {
      if (existing?.id) {
        await resumesApi.updateExperience(resumeId, existing.id, form);
        addToast('Cập nhật kinh nghiệm thành công!', 'success');
      } else {
        await resumesApi.addExperience(resumeId, form);
        addToast('Thêm kinh nghiệm thành công!', 'success');
      }
      onSave();
    } catch (err) { addToast('Lỗi: ' + err.message, 'error'); }
    finally { setLoading(false); }
  };

  const f = (key) => ({ value: form[key] || '', onChange: e => setForm(p => ({ ...p, [key]: e.target.value })) });

  return (
    <div style={{ background: 'var(--color-gray-50)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-5)', marginTop: 'var(--spacing-4)', border: '1px solid var(--color-gray-200)' }}>
      <h4 style={{ marginBottom: 'var(--spacing-4)' }}>{existing ? 'Sửa kinh nghiệm' : 'Thêm kinh nghiệm làm việc'}</h4>
      <div className="grid-2" style={{ gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)' }}>
        <div className="form-group">
          <label>Công ty *</label>
          <input type="text" placeholder="Tên công ty" {...f('company_name')} />
        </div>
        <div className="form-group">
          <label>Vị trí *</label>
          <input type="text" placeholder="Chức danh" {...f('position')} />
        </div>
        <div className="form-group">
          <label>Địa điểm</label>
          <input type="text" placeholder="Hà Nội, Remote..." {...f('location')} />
        </div>
        <div className="form-group">
          <label>Ngày bắt đầu *</label>
          <input type="date" {...f('start_date')} />
        </div>
        <div className="form-group">
          <label>Ngày kết thúc</label>
          <input type="date" {...f('end_date')} disabled={form.is_current} />
        </div>
        <div className="form-group" style={{ justifyContent: 'flex-end' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer', marginTop: 'var(--spacing-5)' }}>
            <input type="checkbox" checked={form.is_current} onChange={e => setForm(p => ({ ...p, is_current: e.target.checked, end_date: '' }))} />
            Đang làm việc tại đây
          </label>
        </div>
      </div>
      <div className="form-group" style={{ marginBottom: 'var(--spacing-4)' }}>
        <label>Mô tả</label>
        <textarea placeholder="Mô tả công việc, thành tích..." {...f('description')} rows={3} />
      </div>
      <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
        <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={loading}>
          <Save size={14} /> {loading ? 'Đang lưu...' : 'Lưu'}
        </button>
        <button className="btn btn-outline btn-sm" onClick={onClose}><X size={14} /> Hủy</button>
      </div>
    </div>
  );
}

// Form thêm/sửa học vấn
function EducationForm({ resumeId, existing, onSave, onClose }) {
  const [form, setForm] = useState(existing || {
    school_name: '', degree: '', field_of_study: '', start_date: '', end_date: '', is_current: false, gpa: '', description: '',
  });
  const [loading, setLoading] = useState(false);
  const { addToast } = useApp();

  const handleSave = async () => {
    if (!form.school_name) { addToast('Vui lòng nhập tên trường', 'error'); return; }
    setLoading(true);
    try {
      if (existing?.id) {
        await resumesApi.updateEducation(resumeId, existing.id, form);
        addToast('Cập nhật học vấn thành công!', 'success');
      } else {
        await resumesApi.addEducation(resumeId, form);
        addToast('Thêm học vấn thành công!', 'success');
      }
      onSave();
    } catch (err) { addToast('Lỗi: ' + err.message, 'error'); }
    finally { setLoading(false); }
  };

  const f = (key) => ({ value: form[key] || '', onChange: e => setForm(p => ({ ...p, [key]: e.target.value })) });

  return (
    <div style={{ background: 'var(--color-gray-50)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-5)', marginTop: 'var(--spacing-4)', border: '1px solid var(--color-gray-200)' }}>
      <h4 style={{ marginBottom: 'var(--spacing-4)' }}>{existing ? 'Sửa học vấn' : 'Thêm học vấn'}</h4>
      <div className="grid-2" style={{ gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)' }}>
        <div className="form-group">
          <label>Trường *</label>
          <input type="text" placeholder="Tên trường / Học viện" {...f('school_name')} />
        </div>
        <div className="form-group">
          <label>Bằng cấp</label>
          <input type="text" placeholder="Cử nhân, Thạc sĩ..." {...f('degree')} />
        </div>
        <div className="form-group">
          <label>Chuyên ngành</label>
          <input type="text" placeholder="Công nghệ thông tin..." {...f('field_of_study')} />
        </div>
        <div className="form-group">
          <label>GPA</label>
          <input type="number" step="0.01" min="0" max="4" placeholder="3.5" {...f('gpa')} />
        </div>
        <div className="form-group">
          <label>Năm bắt đầu</label>
          <input type="date" {...f('start_date')} />
        </div>
        <div className="form-group">
          <label>Năm kết thúc</label>
          <input type="date" {...f('end_date')} disabled={form.is_current} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-2)' }}>
        <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={loading}>
          <Save size={14} /> {loading ? 'Đang lưu...' : 'Lưu'}
        </button>
        <button className="btn btn-outline btn-sm" onClick={onClose}><X size={14} /> Hủy</button>
      </div>
    </div>
  );
}

export default function ResumeManager() {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [showExpForm, setShowExpForm] = useState(false);
  const [showEduForm, setShowEduForm] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [editingEdu, setEditingEdu] = useState(null);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('intermediate');
  const [creatingResume, setCreatingResume] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState('');
  const [activeResumeId, setActiveResumeId] = useState(null);

  const { data: resumes, loading, error, refetch: refetchResumes } = useFetch(() => resumesApi.getAll());

  const activeResume = resumes?.find(r => r.id === activeResumeId) || resumes?.[0];

  useEffect(() => {
    if (resumes?.length > 0 && !activeResumeId) {
      setActiveResumeId(resumes[0].id);
    }
  }, [resumes]);

  const { data: experiences, refetch: refetchExp } = useFetch(
    () => activeResume ? resumesApi.getExperiences(activeResume.id) : Promise.resolve([]),
    [activeResume?.id]
  );
  const { data: educations, refetch: refetchEdu } = useFetch(
    () => activeResume ? resumesApi.getEducations(activeResume.id) : Promise.resolve([]),
    [activeResume?.id]
  );

  const handleCreateResume = async () => {
    if (!newResumeTitle.trim()) { addToast('Vui lòng nhập tên CV', 'error'); return; }
    try {
      await resumesApi.create(newResumeTitle);
      addToast('Tạo CV thành công!', 'success');
      setCreatingResume(false);
      setNewResumeTitle('');
      refetchResumes();
    } catch (err) { addToast('Lỗi: ' + err.message, 'error'); }
  };

  const handleDeleteResume = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa CV này?')) return;
    try {
      await resumesApi.delete(id);
      addToast('Đã xóa CV', 'info');
      refetchResumes();
    } catch (err) { addToast('Lỗi: ' + err.message, 'error'); }
  };

  const handleSetPrimary = async (id) => {
    try {
      await resumesApi.setPrimary(id);
      addToast('Đã đặt làm CV chính!', 'success');
      refetchResumes();
    } catch (err) { addToast('Lỗi: ' + err.message, 'error'); }
  };

  const handleDeleteExp = async (id) => {
    try {
      await resumesApi.deleteExperience(activeResume.id, id);
      addToast('Đã xóa kinh nghiệm', 'info');
      refetchExp();
    } catch (err) { addToast('Lỗi: ' + err.message, 'error'); }
  };

  const handleDeleteEdu = async (id) => {
    try {
      await resumesApi.deleteEducation(activeResume.id, id);
      addToast('Đã xóa học vấn', 'info');
      refetchEdu();
    } catch (err) { addToast('Lỗi: ' + err.message, 'error'); }
  };

  const handleAddSkill = async () => {
    if (!newSkillName.trim()) { addToast('Nhập tên kỹ năng', 'error'); return; }
    try {
      await resumesApi.addSkill(newSkillName, newSkillLevel);
      addToast(`Đã thêm kỹ năng ${newSkillName}!`, 'success');
      setNewSkillName('');
      refetchResumes();
    } catch (err) { addToast('Lỗi: ' + err.message, 'error'); }
  };

  if (loading) return <LoadingSpinner text="Đang tải CV..." />;
  if (error) return <ErrorState message={error} onRetry={refetchResumes} />;

  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-6)' }}>
      {/* LEFT: Resume List */}
      <div style={{ width: 280, flexShrink: 0 }}>
        <div style={{ marginBottom: 'var(--spacing-4)', display: 'flex', gap: 'var(--spacing-2)' }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setCreatingResume(true)}>
            <Plus size={16} /> Tạo CV mới
          </button>
        </div>

        {creatingResume && (
          <div style={{ marginBottom: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            <input type="text" placeholder="Tên CV (vd: CV React Developer)" value={newResumeTitle} onChange={e => setNewResumeTitle(e.target.value)} />
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={handleCreateResume}><Save size={14} /> Tạo</button>
              <button className="btn btn-outline btn-sm" onClick={() => setCreatingResume(false)}><X size={14} /></button>
            </div>
          </div>
        )}

        {resumes?.length === 0 ? (
          <EmptyState icon="📄" title="Chưa có CV" subtitle="Tạo CV đầu tiên của bạn!" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {resumes?.map(resume => (
              <div
                key={resume.id}
                className="card card-sm"
                style={{ cursor: 'pointer', borderColor: activeResume?.id === resume.id ? 'var(--color-primary)' : undefined, background: activeResume?.id === resume.id ? 'var(--color-primary-light)' : undefined }}
                onClick={() => setActiveResumeId(resume.id)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-3)' }}>
                  <div style={{ width: 36, height: 36, background: resume.is_primary ? 'var(--color-primary)' : 'var(--color-gray-200)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: resume.is_primary ? 'white' : 'var(--color-gray-500)', flexShrink: 0 }}>
                    <FileText size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-900)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {resume.title}
                    </div>
                    {resume.is_primary && <span className="badge badge-blue" style={{ fontSize: 10 }}>CV chính</span>}
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)', marginTop: 4 }}>
                      {formatDate(resume.created_at)}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-1)', marginTop: 'var(--spacing-2)' }}>
                  {!resume.is_primary && (
                    <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 6px' }} onClick={e => { e.stopPropagation(); handleSetPrimary(resume.id); }}>
                      <Star size={10} /> Đặt chính
                    </button>
                  )}
                  <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto', color: 'var(--color-danger)' }} onClick={e => { e.stopPropagation(); handleDeleteResume(resume.id); }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: Resume Detail */}
      {activeResume ? (
        <div style={{ flex: 1 }}>
          <div className="card" style={{ marginBottom: 'var(--spacing-5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
              <div style={{ width: 52, height: 52, background: 'var(--color-primary-light)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={24} style={{ color: 'var(--color-primary)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: 4 }}>{activeResume.title}</h3>
                <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
                  {activeResume.is_primary && <span className="badge badge-blue">CV chính</span>}
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)' }}>Tạo: {formatDate(activeResume.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs" style={{ marginBottom: 'var(--spacing-5)' }}>
            {[['overview', 'Tổng quan'], ['skills', 'Kỹ năng']].map(([tab, label]) => (
              <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{label}</button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="animate-fade">
              {/* KHỐI 1: Ngành nghề & Tags phân loại */}
              <CategorySkillSection
                resumeId={activeResume.id}
                onSave={refetchResumes}
              />

              {/* KHỐI 2: Kinh nghiệm làm việc */}
              <div className="card" style={{ marginBottom: 'var(--spacing-5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
                  <h4>💼 Kinh nghiệm làm việc</h4>
                  <button className="btn btn-outline btn-sm" onClick={() => { setEditingExp(null); setShowExpForm(true); }}>
                    <Plus size={14} /> Thêm
                  </button>
                </div>
                {showExpForm && !editingExp && (
                  <ExperienceForm resumeId={activeResume.id} onSave={() => { setShowExpForm(false); refetchExp(); }} onClose={() => setShowExpForm(false)} />
                )}
                {experiences?.length === 0 ? (
                  <p style={{ color: 'var(--color-gray-400)', fontSize: 'var(--font-size-sm)' }}>Chưa có kinh nghiệm. Hãy thêm vào!</p>
                ) : experiences?.map((exp, idx) => (
                  <div key={exp.id}>
                    {editingExp?.id === exp.id ? (
                      <ExperienceForm resumeId={activeResume.id} existing={exp} onSave={() => { setEditingExp(null); refetchExp(); }} onClose={() => setEditingExp(null)} />
                    ) : (
                      <div style={{ display: 'flex', gap: 'var(--spacing-4)', paddingBottom: 'var(--spacing-4)', borderBottom: idx < experiences.length - 1 ? '1px solid var(--color-gray-100)' : 'none', marginBottom: idx < experiences.length - 1 ? 'var(--spacing-4)' : 0 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 2 }}>
                            <span style={{ fontWeight: 600, color: 'var(--color-gray-900)' }}>{exp.position}</span>
                            {exp.is_current && <span className="badge badge-green" style={{ fontSize: 10 }}>Hiện tại</span>}
                          </div>
                          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', fontWeight: 500 }}>{exp.company_name}</div>
                          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)', margin: '2px 0' }}>
                            {formatDate(exp.start_date)} → {exp.is_current ? 'Hiện tại' : formatDate(exp.end_date)}
                            {exp.location && ` · ${exp.location}`}
                          </div>
                          {exp.description && <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', marginTop: 4 }}>{exp.description}</p>}
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--spacing-1)', flexShrink: 0 }}>
                          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setEditingExp(exp)}><Edit size={14} /></button>
                          <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleDeleteExp(exp.id)}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* KHỐI 3: Học vấn */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
                  <h4>🎓 Học vấn</h4>
                  <button className="btn btn-outline btn-sm" onClick={() => { setEditingEdu(null); setShowEduForm(true); }}>
                    <Plus size={14} /> Thêm
                  </button>
                </div>
                {showEduForm && !editingEdu && (
                  <EducationForm resumeId={activeResume.id} onSave={() => { setShowEduForm(false); refetchEdu(); }} onClose={() => setShowEduForm(false)} />
                )}
                {educations?.length === 0 ? (
                  <p style={{ color: 'var(--color-gray-400)', fontSize: 'var(--font-size-sm)' }}>Chưa có học vấn. Hãy thêm vào!</p>
                ) : educations?.map((edu, idx) => (
                  <div key={edu.id}>
                    {editingEdu?.id === edu.id ? (
                      <EducationForm resumeId={activeResume.id} existing={edu} onSave={() => { setEditingEdu(null); refetchEdu(); }} onClose={() => setEditingEdu(null)} />
                    ) : (
                      <div style={{ display: 'flex', gap: 'var(--spacing-4)', paddingBottom: 'var(--spacing-4)', borderBottom: idx < educations.length - 1 ? '1px solid var(--color-gray-100)' : 'none', marginBottom: idx < educations.length - 1 ? 'var(--spacing-4)' : 0 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, color: 'var(--color-gray-900)' }}>{edu.school_name}</div>
                          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)' }}>{edu.degree} {edu.field_of_study && `· ${edu.field_of_study}`}</div>
                          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)', marginTop: 2 }}>
                            {formatDate(edu.start_date)} → {edu.is_current ? 'Hiện tại' : formatDate(edu.end_date)}
                            {edu.gpa && <span style={{ marginLeft: 8 }}>GPA: {edu.gpa}/4.0</span>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--spacing-1)', flexShrink: 0 }}>
                          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setEditingEdu(edu)}><Edit size={14} /></button>
                          <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleDeleteEdu(edu.id)}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="card animate-fade">
              <h4 style={{ marginBottom: 'var(--spacing-4)' }}>Kỹ năng</h4>

              {/* Thêm kỹ năng */}
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-5)' }}>
                <input type="text" placeholder="Tên kỹ năng (React, Python...)" value={newSkillName} onChange={e => setNewSkillName(e.target.value)} style={{ flex: 1 }} onKeyDown={e => e.key === 'Enter' && handleAddSkill()} />
                <select value={newSkillLevel} onChange={e => setNewSkillLevel(e.target.value)} style={{ width: 150 }}>
                  {SKILL_LEVELS.map(l => <option key={l} value={l}>{skillLevelLabel[l]}</option>)}
                </select>
                <button className="btn btn-primary btn-sm" onClick={handleAddSkill}><Plus size={14} /> Thêm</button>
              </div>

              {(!activeResume.skills || activeResume.skills.length === 0) ? (
                <p style={{ color: 'var(--color-gray-400)', fontSize: 'var(--font-size-sm)' }}>Chưa có kỹ năng nào. Hãy thêm vào!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                  {activeResume.skills.map(skill => (
                    <div key={skill.skill_id || skill.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-1)' }}>
                        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--color-gray-800)' }}>{skill.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>{skillLevelLabel[skill.level]}</span>
                          <button className="btn btn-ghost btn-icon btn-sm" style={{ width: 20, height: 20, color: 'var(--color-danger)' }}
                            onClick={() => resumesApi.deleteSkill(skill.skill_id).then(() => { addToast('Đã xóa kỹ năng', 'info'); refetchResumes(); })}>
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: skillLevelWidth[skill.level] }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <EmptyState icon="📄" title="Chưa có CV" subtitle="Tạo CV đầu tiên để bắt đầu!" action={
            <button className="btn btn-primary" onClick={() => setCreatingResume(true)}>Tạo CV mới</button>
          } />
        </div>
      )}
    </div>
  );
}