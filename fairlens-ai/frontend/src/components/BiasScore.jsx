import { useEffect, useRef } from 'react';

// Interpolate between green (0), amber (50), red (100)
function scoreColor(score) {
  if (score <= 30) return '#22c55e';
  if (score <= 60) return '#f59e0b';
  return '#ef4444';
}

export default function BiasScore({ score }) {
  const r = 44;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = scoreColor(score);

  const levelLabel = score <= 20 ? 'Minimal' : score <= 40 ? 'Low' : score <= 60 ? 'Moderate' : score <= 80 ? 'High' : 'Severe';

  return (
    <div className="score-card">
      <div className="score-svg-wrap">
        <svg width="110" height="110" viewBox="0 0 110 110" aria-label={`Bias score: ${score}`}>
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle cx="55" cy="55" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
          {/* Progress */}
          <circle
            cx="55" cy="55" r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 55 55)"
            style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1), stroke 0.5s ease' }}
          />
          <text x="55" y="52" textAnchor="middle" fill="var(--text-primary)" fontSize="22" fontWeight="700" fontFamily="Inter, sans-serif">{score}</text>
          <text x="55" y="67" textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontFamily="Inter, sans-serif">/ 100</text>
        </svg>
      </div>

      <div className="score-meta">
        <div className="score-number" style={{ color }}>{score}</div>
        <div className="score-label">Bias Score — {levelLabel}</div>

        {[
          { label: 'Low Risk', range: '0–30', fill: '#22c55e', pct: score <= 30 ? (score / 30) * 100 : 100, active: score <= 30 },
          { label: 'Moderate', range: '31–60', fill: '#f59e0b', pct: score <= 30 ? 0 : score <= 60 ? ((score - 30) / 30) * 100 : 100, active: score > 30 && score <= 60 },
          { label: 'High Risk', range: '61–100', fill: '#ef4444', pct: score <= 60 ? 0 : ((score - 60) / 40) * 100, active: score > 60 },
        ].map(row => (
          <div key={row.label} className="score-bar-row">
            <div className="score-bar-label">
              <span style={{ color: row.active ? row.fill : 'var(--text-muted)' }}>{row.label}</span>
              <span>{row.range}</span>
            </div>
            <div className="score-bar-track">
              <div className="score-bar-fill" style={{ width: `${row.pct}%`, background: row.fill, opacity: row.active ? 1 : 0.25 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
