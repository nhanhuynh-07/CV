// ============================================================
// HELPER UTILITIES
// ============================================================

export const formatSalary = (min, max, currency = 'USD', type = 'monthly') => {
  if (type === 'negotiable') return 'Thỏa thuận';
  const fmt = (n) => n >= 1000 ? `${n / 1000}K` : n;
  if (!min && !max) return 'Thỏa thuận';
  if (!max) return `${fmt(min)} ${currency}`;
  return `${fmt(min)} - ${fmt(max)} ${currency}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const timeAgo = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return `${diff} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
};

export const getInitials = (name = '') => {
  return name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();
};

export const getAvatarColor = (name = '') => {
  const colors = [
    'linear-gradient(135deg, #2563eb, #7c3aed)',
    'linear-gradient(135deg, #059669, #2563eb)',
    'linear-gradient(135deg, #d97706, #dc2626)',
    'linear-gradient(135deg, #7c3aed, #ec4899)',
    'linear-gradient(135deg, #0891b2, #059669)',
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
};

export const getCompanyColor = (name = '') => {
  const colors = [
    'linear-gradient(135deg, #2563eb, #7c3aed)',
    'linear-gradient(135deg, #059669, #0891b2)',
    'linear-gradient(135deg, #d97706, #f59e0b)',
    'linear-gradient(135deg, #7c3aed, #2563eb)',
    'linear-gradient(135deg, #dc2626, #d97706)',
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
};

export const statusConfig = {
  // Application status
  submitted:  { label: 'Đã nộp',       color: 'blue',   dot: 'blue' },
  pending:    { label: 'Đang chờ',      color: 'blue',   dot: 'blue' },
  reviewing:  { label: 'Đang xem xét', color: 'orange', dot: 'orange' },
  interview:  { label: 'Phỏng vấn',    color: 'purple', dot: 'purple' },
  offer:      { label: 'Nhận offer',   color: 'green',  dot: 'green' },
  offered:    { label: 'Nhận offer',   color: 'green',  dot: 'green' },
  rejected:   { label: 'Không đạt',    color: 'red',    dot: 'red' },
  withdrawn:  { label: 'Đã rút',       color: 'gray',   dot: 'gray' },
  // Job status
  draft:      { label: 'Nháp',         color: 'gray',   dot: 'gray' },
  active:     { label: 'Đang đăng',    color: 'green',  dot: 'green' },
  published:  { label: 'Đang đăng',    color: 'green',  dot: 'green' },
  paused:     { label: 'Tạm dừng',     color: 'orange', dot: 'orange' },
  closed:     { label: 'Đã đóng',      color: 'red',    dot: 'red' },
  hidden:     { label: 'Ẩn',           color: 'gray',   dot: 'gray' },
  archived:   { label: 'Lưu trữ',      color: 'gray',   dot: 'gray' },
};


export const employmentTypeLabel = {
  full_time: 'Toàn thời gian',
  part_time: 'Bán thời gian',
  contract: 'Hợp đồng',
  internship: 'Thực tập',
  remote: 'Remote',
};

export const experienceLevelLabel = {
  fresher: 'Fresher',
  junior: 'Junior',
  mid: 'Mid-level',
  senior: 'Senior',
  lead: 'Lead/Manager',
};

export const skillLevelLabel = {
  beginner: 'Cơ bản',
  intermediate: 'Trung cấp',
  advanced: 'Nâng cao',
  expert: 'Chuyên gia',
};

export const skillLevelWidth = {
  beginner: '25%',
  intermediate: '50%',
  advanced: '75%',
  expert: '100%',
};

export const getScoreColor = (score) => {
  if (score >= 80) return '#16a34a';
  if (score >= 60) return '#2563eb';
  if (score >= 40) return '#d97706';
  return '#dc2626';
};
