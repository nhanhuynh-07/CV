// =============================================
// API Service - Kết nối React với Backend
// =============================================

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

async function request(endpoint, options = {}) {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Lỗi ${response.status}`);
  }
  return data;
}

// =============================================
// AUTH
// =============================================
export const authApi = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request('/auth/me'),
};

// =============================================
// JOBS
// =============================================
export const jobsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/jobs?${query}`);
  },
  getById: (id) => request(`/jobs/${id}`),
  create: (data) => request('/jobs', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/jobs/${id}`, { method: 'DELETE' }),
};

// =============================================
// APPLICATIONS
// =============================================
export const applicationsApi = {
  apply: (job_id, cover_letter) =>
    request('/applications', { method: 'POST', body: JSON.stringify({ job_id, cover_letter }) }),
  getMy: () => request('/applications/my'),
  getEmployerApps: () => request('/applications/employer'),
  updateStatus: (id, status) =>
    request(`/applications/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

// =============================================
// CANDIDATES
// =============================================
export const candidatesApi = {
  getProfile: () => request('/candidates/profile'),
  updateProfile: (data) =>
    request('/candidates/profile', { method: 'PUT', body: JSON.stringify(data) }),
  getSavedJobs: () => request('/candidates/saved-jobs'),
  toggleSaveJob: (jobId) =>
    request(`/candidates/saved-jobs/${jobId}`, { method: 'POST' }),
};

// =============================================
// RESUMES (CV)
// =============================================
export const resumesApi = {
  // Danh sách CV
  getAll: () => request('/resumes'),

  // Tạo CV mới
  create: (title) =>
    request('/resumes', { method: 'POST', body: JSON.stringify({ title }) }),

  // Cập nhật CV
  update: (id, data) =>
    request(`/resumes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Xóa CV
  delete: (id) => request(`/resumes/${id}`, { method: 'DELETE' }),

  // Đặt làm CV chính
  setPrimary: (id) => request(`/resumes/${id}/set-primary`, { method: 'PATCH' }),

  // ----- WORK EXPERIENCE -----
  getExperiences: (resumeId) => request(`/resumes/${resumeId}/experiences`),
  addExperience: (resumeId, data) =>
    request(`/resumes/${resumeId}/experiences`, { method: 'POST', body: JSON.stringify(data) }),
  updateExperience: (resumeId, id, data) =>
    request(`/resumes/${resumeId}/experiences/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteExperience: (resumeId, id) =>
    request(`/resumes/${resumeId}/experiences/${id}`, { method: 'DELETE' }),

  // ----- EDUCATION -----
  getEducations: (resumeId) => request(`/resumes/${resumeId}/educations`),
  addEducation: (resumeId, data) =>
    request(`/resumes/${resumeId}/educations`, { method: 'POST', body: JSON.stringify(data) }),
  updateEducation: (resumeId, id, data) =>
    request(`/resumes/${resumeId}/educations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEducation: (resumeId, id) =>
    request(`/resumes/${resumeId}/educations/${id}`, { method: 'DELETE' }),

  // ----- SKILLS -----
  addSkill: (skill_name, level) =>
    request('/resumes/skills/add', { method: 'POST', body: JSON.stringify({ skill_name, level }) }),
  deleteSkill: (skillId) => request(`/resumes/skills/${skillId}`, { method: 'DELETE' }),
};

// =============================================
// NOTIFICATIONS
// =============================================
export const notificationsApi = {
  getAll: () => request('/notifications'),
  markRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead: () => request('/notifications/read-all', { method: 'PATCH' }),
  delete: (id) => request(`/notifications/${id}`, { method: 'DELETE' }),
};

// Export default
const api = {
  auth: authApi,
  jobs: jobsApi,
  applications: applicationsApi,
  candidates: candidatesApi,
  resumes: resumesApi,
  notifications: notificationsApi,
};

export default api;
