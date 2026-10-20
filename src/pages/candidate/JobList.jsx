import { useState, useEffect, useRef } from 'react';
import { MapPin, DollarSign, Bookmark, Search, Upload, FileText, X } from 'lucide-react';
import { formatSalary, employmentTypeLabel, getCompanyColor, timeAgo } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';
import { jobsApi, applicationsApi, candidatesApi } from '../../utils/api';
import { useFetch, LoadingSpinner, ErrorState, EmptyState } from '../../utils/useFetch';

// Modal nộp đơn đính kèm file CV
function ApplyModal({ job, onClose, onSuccess }) {
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { addToast } = useApp();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast('Dung lượng file không được vượt quá 5MB', 'error');
        return;
      }
      setCvFile(file);
    }
  };

  const handleRemoveFile = () => {
    setCvFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('job_id', job.id);
      formData.append('cover_letter', coverLetter);
      if (cvFile) {
        formData.append('cv', cvFile);
      }

      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Lỗi khi nộp đơn ứng tuyển');

      addToast(`Đã nộp đơn ứng tuyển vào ${job.title}!`, 'success');
      onSuccess();
      onClose();
    } catch (err) {
      addToast('Lỗi: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
    }} onClick={onClose}>
      <div className="card" style={{ width: 520, maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: '6px' }}>Ứng tuyển: {job.title}</h3>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
          {job.company_name || 'Nhà tuyển dụng'} · {job.location}
        </p>

        {/* Ô tải CV */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>
            Đính kèm CV (PDF, DOC, DOCX)
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
          />

          {!cvFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
                cursor: 'pointer',
                background: '#f8fafc',
                transition: 'border-color 0.2s',
              }}
            >
              <Upload size={24} style={{ color: '#64748b', margin: '0 auto 6px' }} />
              <div style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>
                Bấm để chọn file CV tải lên
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                Hỗ trợ PDF, DOC, DOCX tối đa 5MB
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              border: '1px solid #bfdbfe',
              background: '#eff6ff',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <FileText size={18} style={{ color: '#2563eb', flexShrink: 0 }} />
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#1e40af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {cvFile.name}
                </span>
                <span style={{ fontSize: '11px', color: '#60a5fa', flexShrink: 0 }}>
                  ({(cvFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}
                title="Bỏ chọn file"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Ô Thư xin việc */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>
            Thư xin việc (không bắt buộc)
          </label>
          <textarea
            placeholder="Giới thiệu bản thân và lý do bạn muốn ứng tuyển..."
            value={coverLetter}
            onChange={e => setCoverLetter(e.target.value)}
            rows={4}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontFamily: 'inherit',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={onClose} disabled={loading}>Hủy</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Đang gửi...' : 'Nộp đơn'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function JobList() {
  const { addToast } = useApp();
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyingJob, setApplyingJob] = useState(null);
  const [savedIds, setSavedIds] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  const { data: result, loading, error, refetch } = useFetch(
    () => jobsApi.getAll({ search, location: locationFilter, job_type: typeFilter }),
    [search, locationFilter, typeFilter]
  );

  const { data: savedJobs } = useFetch(() => candidatesApi.getSavedJobs());

  useEffect(() => {
    if (savedJobs && Array.isArray(savedJobs)) {
      setSavedIds(savedJobs.map(j => j.id));
    }
  }, [savedJobs]);

  const jobs = Array.isArray(result) ? result : (result?.jobs || result?.data || []);

  useEffect(() => {
    if (jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0]);
    }
  }, [jobs, selectedJob]);

  const locations = [...new Set(jobs.map(j => j.location).filter(Boolean))];

  const handleSearch = () => setSearch(searchInput);

  const handleSave = async (jobId) => {
    const isSaved = savedIds.includes(jobId);
    setSavedIds(prev => isSaved ? prev.filter(id => id !== jobId) : [...prev, jobId]);
    try {
      await candidatesApi.toggleSaveJob(jobId);
      addToast(isSaved ? 'Đã bỏ lưu việc làm' : 'Đã lưu việc làm!', 'info');
    } catch (err) {
      setSavedIds(prev => isSaved ? [...prev, jobId] : prev.filter(id => id !== jobId));
      addToast('Lỗi: ' + err.message, 'error');
    }
  };

  if (loading && !result) return <LoadingSpinner text="Đang tải việc làm..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-6)', height: 'calc(100vh - var(--header-height) - var(--spacing-16))' }}>
      {/* LEFT: Job List */}
      <div style={{ width: 380, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', overflowY: 'auto', paddingRight: 'var(--spacing-2)' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
            <input
              type="text"
              placeholder="Tìm kiếm vị trí, công ty..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              style={{ paddingLeft: '2.5rem', width: '100%' }}
            />
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleSearch}>Tìm</button>
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          <select className="filter-select" style={{ flex: 1 }} value={locationFilter} onChange={e => setLocationFilter(e.target.value)}>
            <option value="">Tất cả địa điểm</option>
            {locations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <select className="filter-select" style={{ flex: 1 }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">Loại hình</option>
            {Object.entries(employmentTypeLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>

        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>
          <strong style={{ color: 'var(--color-gray-800)' }}>{result?.pagination?.total || jobs.length}</strong> việc làm
        </div>

        {jobs.length === 0 ? (
          <EmptyState icon="🔍" title="Không tìm thấy việc làm" subtitle="Thử thay đổi từ khóa tìm kiếm" />
        ) : jobs.map(job => {
          const empType = job.employment_type || job.job_type;
          const compName = job.company_name || 'Nhà tuyển dụng';
          return (
            <div
              key={job.id}
              className={`job-card ${selectedJob?.id === job.id ? 'active' : ''}`}
              onClick={() => setSelectedJob(job)}
              style={selectedJob?.id === job.id ? { borderColor: 'var(--color-primary)', background: 'var(--color-primary-light)' } : {}}
            >
              <div className="job-card-header">
                <div className="company-logo" style={{ background: getCompanyColor(compName) }}>
                  {compName.charAt(0)}
                </div>
                <div className="job-card-meta">
                  <div className="job-card-title">{job.title}</div>
                  <div className="job-card-company">{compName}</div>
                </div>
                <button
                  className={`job-save-btn ${savedIds.includes(job.id) ? 'saved' : ''}`}
                  onClick={e => { e.stopPropagation(); handleSave(job.id); }}
                >
                  <Bookmark size={14} fill={savedIds.includes(job.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
              <div className="job-card-body">
                <div className="job-card-info"><MapPin size={12} />{job.location}</div>
                <div className="job-card-info">
                  <DollarSign size={12} />
                  {job.salary_min ? `${(job.salary_min / 1e6).toFixed(0)}–${(job.salary_max / 1e6).toFixed(0)} triệu` : 'Thương lượng'}
                </div>
              </div>
              <div className="job-card-footer">
                <span className="badge badge-blue">{employmentTypeLabel[empType] || empType || 'Toàn thời gian'}</span>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)', marginLeft: 'auto' }}>
                  {timeAgo(job.created_at || Date.now())}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGHT: Job Detail */}
      {selectedJob && (
        <div className="card" style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
            <div className="company-logo" style={{ background: getCompanyColor(selectedJob.company_name || 'NTD'), width: 56, height: 56, borderRadius: 'var(--radius-xl)', fontSize: '1.2rem' }}>
              {(selectedJob.company_name || 'N').charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ marginBottom: 'var(--spacing-1)' }}>{selectedJob.title}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{selectedJob.company_name || 'Nhà tuyển dụng'}</span>
                {selectedJob.is_verified && <span className="badge badge-green">✓ Đã xác minh</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexShrink: 0 }}>
              <button
                className={`btn btn-outline ${savedIds.includes(selectedJob.id) ? 'btn-primary' : ''}`}
                onClick={() => handleSave(selectedJob.id)}
              >
                <Bookmark size={16} fill={savedIds.includes(selectedJob.id) ? 'white' : 'none'} />
                {savedIds.includes(selectedJob.id) ? 'Đã lưu' : 'Lưu'}
              </button>
              <button className="btn btn-primary" onClick={() => setApplyingJob(selectedJob)}>
                Ứng tuyển ngay
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap', padding: 'var(--spacing-4)', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--spacing-6)' }}>
            {[
              { icon: MapPin, label: 'Địa điểm', value: selectedJob.location },
              { icon: DollarSign, label: 'Mức lương', value: selectedJob.salary_min ? `${(selectedJob.salary_min / 1e6).toFixed(0)}–${(selectedJob.salary_max / 1e6).toFixed(0)} triệu VNĐ` : 'Thương lượng' },
              { icon: Bookmark, label: 'Loại hình', value: employmentTypeLabel[selectedJob.employment_type || selectedJob.job_type] || selectedJob.employment_type || selectedJob.job_type || 'Toàn thời gian' },
            ].map((info, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <info.icon size={14} style={{ color: 'var(--color-primary)' }} />
                <div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)' }}>{info.label}</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-800)' }}>{info.value}</div>
                </div>
              </div>
            ))}
          </div>

          {selectedJob.description && (
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <h4 style={{ marginBottom: 'var(--spacing-3)' }}>Mô tả công việc</h4>
              <p style={{ lineHeight: 1.7, whiteSpace: 'pre-line' }}>{selectedJob.description}</p>
            </div>
          )}
          {selectedJob.requirements && (
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <h4 style={{ marginBottom: 'var(--spacing-3)' }}>Yêu cầu</h4>
              <p style={{ lineHeight: 1.7, whiteSpace: 'pre-line' }}>{selectedJob.requirements}</p>
            </div>
          )}
          {selectedJob.benefits && (
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <h4 style={{ marginBottom: 'var(--spacing-3)' }}>Phúc lợi</h4>
              <p style={{ lineHeight: 1.7, whiteSpace: 'pre-line' }}>{selectedJob.benefits}</p>
            </div>
          )}
        </div>
      )}

      {/* Apply Modal */}
      {applyingJob && (
        <ApplyModal
          job={applyingJob}
          onClose={() => setApplyingJob(null)}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}