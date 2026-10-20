// ============================================================
// MOCK DATA - Based on PostgreSQL Schema
// ============================================================

export const mockIndustries = [
  { id: 1, name: 'Công nghệ thông tin', slug: 'cong-nghe-thong-tin' },
  { id: 2, name: 'Tài chính - Ngân hàng', slug: 'tai-chinh-ngan-hang' },
  { id: 3, name: 'Marketing - Truyền thông', slug: 'marketing-truyen-thong' },
  { id: 4, name: 'Giáo dục - Đào tạo', slug: 'giao-duc-dao-tao' },
  { id: 5, name: 'Y tế - Chăm sóc sức khỏe', slug: 'y-te-cham-soc-suc-khoe' },
];

export const mockSkills = [
  { id: 1, name: 'Java', slug: 'java', category: 'Hard skill' },
  { id: 2, name: 'Python', slug: 'python', category: 'Hard skill' },
  { id: 3, name: 'JavaScript', slug: 'javascript', category: 'Hard skill' },
  { id: 4, name: 'React', slug: 'react', category: 'Hard skill' },
  { id: 5, name: 'Node.js', slug: 'nodejs', category: 'Hard skill' },
  { id: 6, name: 'SQL', slug: 'sql', category: 'Hard skill' },
  { id: 7, name: 'Docker', slug: 'docker', category: 'Hard skill' },
  { id: 8, name: 'AWS', slug: 'aws', category: 'Hard skill' },
  { id: 9, name: 'Git', slug: 'git', category: 'Hard skill' },
  { id: 10, name: 'Communication', slug: 'communication', category: 'Soft skill' },
  { id: 11, name: 'Teamwork', slug: 'teamwork', category: 'Soft skill' },
  { id: 12, name: 'Problem Solving', slug: 'problem-solving', category: 'Soft skill' },
  { id: 13, name: 'English', slug: 'english', category: 'Language' },
  { id: 14, name: 'Japanese', slug: 'japanese', category: 'Language' },
];

export const mockCompanies = [
  { id: 1, name: 'TechVision Corp', slug: 'techvision-corp', description: 'Leading software development company', logo_url: null, address: 'TP. Hồ Chí Minh', company_size: '201-500', industry_id: 1, is_verified: true, founded_year: 2015 },
  { id: 2, name: 'FinanceHub JSC', slug: 'financehub-jsc', description: 'Fintech and banking solutions', logo_url: null, address: 'Hà Nội', company_size: '51-200', industry_id: 2, is_verified: true, founded_year: 2018 },
  { id: 3, name: 'MediaWave Agency', slug: 'mediawave-agency', description: 'Digital marketing agency', logo_url: null, address: 'Đà Nẵng', company_size: '1-50', industry_id: 3, is_verified: false, founded_year: 2020 },
  { id: 4, name: 'CloudBase Solutions', slug: 'cloudbase-solutions', description: 'Cloud infrastructure provider', logo_url: null, address: 'TP. Hồ Chí Minh', company_size: '51-200', industry_id: 1, is_verified: true, founded_year: 2017 },
  { id: 5, name: 'DataSmart AI', slug: 'datasmart-ai', description: 'AI and data analytics', logo_url: null, address: 'Hà Nội', company_size: '1-50', industry_id: 1, is_verified: true, founded_year: 2021 },
];

export const mockJobPosts = [
  {
    id: 1, company_id: 1, title: 'Senior React Developer', slug: 'senior-react-developer-1',
    description: 'Phát triển các ứng dụng web hiện đại với React và TypeScript...',
    requirements: '3+ năm kinh nghiệm React, TypeScript, REST API',
    benefits: 'Lương cạnh tranh, bảo hiểm sức khỏe, thưởng dự án',
    location: 'TP. Hồ Chí Minh', salary_min: 1500, salary_max: 3000, salary_currency: 'USD',
    salary_type: 'monthly', employment_type: 'full_time', experience_level: 'senior',
    industry_id: 1, status: 'published', view_count: 342, application_count: 28,
    expires_at: '2026-11-30', published_at: '2026-10-01',
    skills: [4, 3, 9], company: mockCompanies[0]
  },
  {
    id: 2, company_id: 2, title: 'Backend Developer (Java)', slug: 'backend-developer-java-2',
    description: 'Xây dựng hệ thống backend cho nền tảng tài chính...',
    requirements: 'Java Spring Boot, Microservices, PostgreSQL',
    benefits: 'Môi trường quốc tế, cơ hội thăng tiến, remote 2 ngày/tuần',
    location: 'Hà Nội', salary_min: 1200, salary_max: 2500, salary_currency: 'USD',
    salary_type: 'monthly', employment_type: 'full_time', experience_level: 'mid',
    industry_id: 2, status: 'published', view_count: 187, application_count: 15,
    expires_at: '2026-11-15', published_at: '2026-10-05',
    skills: [1, 6, 7], company: mockCompanies[1]
  },
  {
    id: 3, company_id: 4, title: 'DevOps Engineer', slug: 'devops-engineer-3',
    description: 'Quản lý infrastructure, CI/CD pipeline trên AWS...',
    requirements: 'Docker, Kubernetes, AWS, CI/CD',
    benefits: 'Full remote, stock options, learning budget',
    location: 'Remote', salary_min: 2000, salary_max: 4000, salary_currency: 'USD',
    salary_type: 'monthly', employment_type: 'remote', experience_level: 'senior',
    industry_id: 1, status: 'published', view_count: 521, application_count: 42,
    expires_at: '2026-12-01', published_at: '2026-10-08',
    skills: [7, 8, 9, 6], company: mockCompanies[3]
  },
  {
    id: 4, company_id: 5, title: 'Python Data Engineer', slug: 'python-data-engineer-4',
    description: 'Xây dựng data pipeline, ETL và ML infrastructure...',
    requirements: 'Python, SQL, Apache Spark, ML frameworks',
    benefits: 'Cổ phần công ty, linh hoạt giờ làm',
    location: 'Hà Nội', salary_min: 1800, salary_max: 3500, salary_currency: 'USD',
    salary_type: 'monthly', employment_type: 'full_time', experience_level: 'mid',
    industry_id: 1, status: 'published', view_count: 298, application_count: 19,
    expires_at: '2026-11-20', published_at: '2026-10-10',
    skills: [2, 6, 7, 8], company: mockCompanies[4]
  },
  {
    id: 5, company_id: 3, title: 'Digital Marketing Specialist', slug: 'digital-marketing-5',
    description: 'Lên chiến lược và triển khai các chiến dịch marketing...',
    requirements: 'Google Ads, Facebook Ads, SEO, Analytics',
    benefits: 'Môi trường sáng tạo, team trẻ',
    location: 'Đà Nẵng', salary_min: 800, salary_max: 1500, salary_currency: 'USD',
    salary_type: 'monthly', employment_type: 'full_time', experience_level: 'junior',
    industry_id: 3, status: 'published', view_count: 145, application_count: 31,
    expires_at: '2026-11-25', published_at: '2026-10-12',
    skills: [10, 11, 12], company: mockCompanies[2]
  },
  {
    id: 6, company_id: 1, title: 'Full Stack Developer (Node.js)', slug: 'fullstack-nodejs-6',
    description: 'Phát triển full-stack với Node.js và React...',
    requirements: 'Node.js, React, PostgreSQL, Docker',
    benefits: 'Thưởng hiệu suất, đào tạo kỹ thuật',
    location: 'TP. Hồ Chí Minh', salary_min: 1200, salary_max: 2200, salary_currency: 'USD',
    salary_type: 'monthly', employment_type: 'full_time', experience_level: 'junior',
    industry_id: 1, status: 'published', view_count: 213, application_count: 24,
    expires_at: '2026-11-28', published_at: '2026-10-13',
    skills: [5, 3, 4, 6], company: mockCompanies[0]
  },
];

export const mockCandidate = {
  id: 1,
  full_name: 'Nguyễn Văn An',
  email: 'nguyenvanan@email.com',
  phone: '0901234567',
  address: 'Quận 1, TP. Hồ Chí Minh',
  avatar_url: null,
  summary: 'Full-stack developer với 4 năm kinh nghiệm, đam mê xây dựng sản phẩm.',
  date_of_birth: '1998-03-15',
  gender: 'Nam',
};

export const mockResumes = [
  {
    id: 1, candidate_id: 1, title: 'CV React Developer 2026', is_primary: true,
    file_url: null, file_type: null,
    ai_analysis: {
      strengths: ['Kinh nghiệm React vững', 'Hiểu biết về Cloud', 'Teamwork tốt'],
      weaknesses: ['Thiếu kinh nghiệm Backend Java', 'Chưa có chứng chỉ AWS'],
      suggestions: ['Học thêm Node.js', 'Cải thiện phần mô tả kinh nghiệm'],
    },
    ai_score: 78.5,
    status: 'active',
    created_at: '2026-09-15',
    skills: [
      { skill_id: 3, name: 'JavaScript', level: 'advanced' },
      { skill_id: 4, name: 'React', level: 'advanced' },
      { skill_id: 5, name: 'Node.js', level: 'intermediate' },
      { skill_id: 6, name: 'SQL', level: 'intermediate' },
      { skill_id: 9, name: 'Git', level: 'advanced' },
      { skill_id: 10, name: 'Communication', level: 'advanced' },
      { skill_id: 13, name: 'English', level: 'intermediate' },
    ],
    educations: [
      {
        id: 1, school_name: 'Đại học Bách Khoa TP.HCM', degree: 'Cử nhân',
        field_of_study: 'Công nghệ Thông tin', start_date: '2016-09-01',
        end_date: '2020-07-31', gpa: 3.2, is_current: false,
      }
    ],
    experiences: [
      {
        id: 1, company_name: 'ABC Tech', position: 'Junior Frontend Developer',
        location: 'TP. Hồ Chí Minh', start_date: '2020-08-01', end_date: '2022-06-30',
        is_current: false, description: 'Phát triển UI với React, tích hợp REST API',
      },
      {
        id: 2, company_name: 'TechVision Corp', position: 'React Developer',
        location: 'TP. Hồ Chí Minh', start_date: '2022-07-01', end_date: null,
        is_current: true, description: 'Lead frontend team, kiến trúc SPA, code review',
      }
    ],
  },
  {
    id: 2, candidate_id: 1, title: 'CV Full Stack Developer', is_primary: false,
    file_url: 'cv_fullstack.pdf', file_type: 'pdf',
    ai_analysis: null, ai_score: null, status: 'draft', created_at: '2026-10-01',
    skills: [], educations: [], experiences: [],
  }
];

export const mockApplications = [
  {
    id: 1, job_id: 1, candidate_id: 1, resume_id: 1,
    status: 'reviewing', cover_letter: 'Tôi rất hứng thú với vị trí này...',
    match_score: 87.5, applied_at: '2026-10-02',
    job: mockJobPosts[0],
  },
  {
    id: 2, job_id: 3, candidate_id: 1, resume_id: 1,
    status: 'interview', cover_letter: 'Với kinh nghiệm DevOps...',
    match_score: 72.0, applied_at: '2026-10-09',
    job: mockJobPosts[2],
  },
  {
    id: 3, job_id: 4, candidate_id: 1, resume_id: 1,
    status: 'submitted', cover_letter: 'Tôi có kiến thức Python tốt...',
    match_score: 65.0, applied_at: '2026-10-11',
    job: mockJobPosts[3],
  },
  {
    id: 4, job_id: 2, candidate_id: 1, resume_id: 1,
    status: 'rejected', cover_letter: null,
    match_score: 45.0, applied_at: '2026-09-20',
    job: mockJobPosts[1],
  },
];

export const mockJobMatches = [
  { id: 1, resume_id: 1, job_id: 1, match_score: 87.5, matched_skills: ['React', 'JavaScript', 'Git'], missing_skills: ['TypeScript', 'GraphQL'], job: mockJobPosts[0] },
  { id: 2, resume_id: 1, job_id: 6, match_score: 82.0, matched_skills: ['JavaScript', 'React', 'Node.js', 'SQL'], missing_skills: ['Docker'], job: mockJobPosts[5] },
  { id: 3, resume_id: 1, job_id: 3, match_score: 68.0, matched_skills: ['Git', 'SQL'], missing_skills: ['Docker', 'Kubernetes', 'AWS'], job: mockJobPosts[2] },
];

export const mockNotifications = [
  { id: 1, title: 'Đơn ứng tuyển được xem xét', message: 'TechVision Corp đang xem xét đơn ứng tuyển vị trí Senior React Developer của bạn.', type: 'application_status', is_read: false, created_at: '2026-10-14T09:30:00' },
  { id: 2, title: 'Mời phỏng vấn!', message: 'CloudBase Solutions đã mời bạn phỏng vấn vị trí DevOps Engineer vào 15/10/2026.', type: 'application_status', is_read: false, created_at: '2026-10-13T14:00:00' },
  { id: 3, title: 'CV được phân tích bởi AI', message: 'CV của bạn đã được AI chấm điểm 78.5/100. Xem đề xuất cải thiện.', type: 'system', is_read: true, created_at: '2026-10-10T10:00:00' },
  { id: 4, title: 'Việc làm mới phù hợp', message: 'Có 3 công việc mới phù hợp với profile của bạn. Xem ngay!', type: 'new_match', is_read: true, created_at: '2026-10-08T08:00:00' },
];

// ---- Employer mock data ----
export const mockEmployerStats = {
  total_jobs: 5,
  total_applications: 118,
  pending_review: 23,
  interviews_scheduled: 8,
};

export const mockEmployerApplications = [
  {
    id: 10, job_id: 1, status: 'reviewing', match_score: 87.5, applied_at: '2026-10-14',
    candidate: { full_name: 'Nguyễn Văn An', email: 'nguyenvanan@email.com' },
    job: mockJobPosts[0],
  },
  {
    id: 11, job_id: 1, status: 'submitted', match_score: 74.0, applied_at: '2026-10-13',
    candidate: { full_name: 'Trần Thị Bình', email: 'tranthibibh@email.com' },
    job: mockJobPosts[0],
  },
  {
    id: 12, job_id: 1, status: 'interview', match_score: 91.0, applied_at: '2026-10-11',
    candidate: { full_name: 'Lê Minh Cường', email: 'leminhcuong@email.com' },
    job: mockJobPosts[0],
  },
  {
    id: 13, job_id: 1, status: 'offered', match_score: 95.5, applied_at: '2026-10-08',
    candidate: { full_name: 'Phạm Thúy Dung', email: 'phamthuydung@email.com' },
    job: mockJobPosts[0],
  },
  {
    id: 14, job_id: 2, status: 'rejected', match_score: 35.0, applied_at: '2026-10-07',
    candidate: { full_name: 'Hoàng Văn Em', email: 'hoangvanem@email.com' },
    job: mockJobPosts[1],
  },
];

// ---- Admin mock data ----
export const mockAdminStats = {
  total_users: 4821,
  total_candidates: 3654,
  total_companies: 287,
  total_jobs: 1432,
  total_applications: 9841,
  pending_company_verify: 12,
  new_users_today: 47,
  new_jobs_today: 23,
};

export const mockRecentUsers = [
  { id: 100, email: 'user1@test.com', role: 'candidate', is_active: true, created_at: '2026-10-17T08:00:00' },
  { id: 101, email: 'company1@test.com', role: 'employer', is_active: true, created_at: '2026-10-17T07:30:00' },
  { id: 102, email: 'user2@test.com', role: 'candidate', is_active: false, created_at: '2026-10-17T06:45:00' },
  { id: 103, email: 'company2@test.com', role: 'employer', is_active: true, created_at: '2026-10-16T22:00:00' },
];
