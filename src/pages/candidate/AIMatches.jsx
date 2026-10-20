import { Cpu, CheckCircle, XCircle, Zap } from 'lucide-react';
import { mockJobMatches } from '../../data/mockData';
import { formatSalary, getCompanyColor, employmentTypeLabel, getScoreColor } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';

function MatchCard({ match }) {
  const { addToast } = useApp();
  const score = match.match_score;
  const scoreColor = getScoreColor(score);

  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Score accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: scoreColor, borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }} />

      <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'flex-start', marginBottom: 'var(--spacing-4)', paddingTop: 'var(--spacing-2)' }}>
        <div className="company-logo" style={{ background: getCompanyColor(match.job.company.name), width: 48, height: 48, borderRadius: 'var(--radius-xl)', fontSize: '1rem' }}>
          {match.job.company.name.charAt(0)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ marginBottom: 2 }}>{match.job.title}</h4>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', fontWeight: 600 }}>{match.job.company.name}</div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', marginTop: 2 }}>
            {match.job.location} · {formatSalary(match.job.salary_min, match.job.salary_max, match.job.salary_currency, match.job.salary_type)}
          </div>
        </div>
        {/* Big Score */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{score}<span style={{ fontSize: '1rem' }}>%</span></div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)' }}>phù hợp</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: 'var(--spacing-4)' }}>
        <div className="progress-bar">
          <div style={{ height: '100%', borderRadius: 'var(--radius-full)', background: scoreColor, width: `${score}%`, transition: 'width 0.8s ease' }} />
        </div>
      </div>

      {/* Skill Breakdown */}
      <div className="grid-2" style={{ marginBottom: 'var(--spacing-4)' }}>
        <div>
          <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-success)', marginBottom: 'var(--spacing-2)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle size={12} /> Kỹ năng phù hợp ({match.matched_skills.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)' }}>
            {match.matched_skills.map(s => (
              <span key={s} className="badge badge-green" style={{ fontSize: 10 }}>{s}</span>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-danger)', marginBottom: 'var(--spacing-2)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <XCircle size={12} /> Còn thiếu ({match.missing_skills.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)' }}>
            {match.missing_skills.map(s => (
              <span key={s} className="badge badge-red" style={{ fontSize: 10 }}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => addToast(`Đã ứng tuyển ${match.job.title}!`, 'success')}>
          <Zap size={14} /> Ứng tuyển ngay
        </button>
        <button className="btn btn-outline" onClick={() => addToast('Xem chi tiết công việc', 'info')}>Xem JD</button>
      </div>
    </div>
  );
}

export default function AIMatches() {
  return (
    <div>
      {/* Header Banner */}
      <div className="card" style={{ marginBottom: 'var(--spacing-6)', background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)', border: '1px solid var(--color-primary-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
          <div style={{ width: 52, height: 52, background: 'var(--color-primary)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cpu size={24} style={{ color: 'white' }} />
          </div>
          <div>
            <h2 style={{ marginBottom: 4 }}>AI Ghép việc thông minh</h2>
            <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)' }}>
              AI phân tích CV của bạn và tìm ra những công việc phù hợp nhất dựa trên kỹ năng, kinh nghiệm và mức lương mong muốn.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--spacing-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>
          Tìm thấy <strong style={{ color: 'var(--color-gray-900)' }}>{mockJobMatches.length} công việc</strong> phù hợp với CV của bạn
        </div>
        <select className="filter-select">
          <option>Sắp xếp: Độ phù hợp cao nhất</option>
          <option>Mức lương cao nhất</option>
          <option>Mới nhất</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        {mockJobMatches.map(match => <MatchCard key={match.id} match={match} />)}
      </div>
    </div>
  );
}
