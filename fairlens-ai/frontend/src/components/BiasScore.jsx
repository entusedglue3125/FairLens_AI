import { useEffect, useState } from 'react';

function scoreColor(score) {
  if (score <= 30) return '#22c55e'; // Green
  if (score <= 60) return '#f59e0b'; // Amber
  return '#ef4444'; // Red
}

export default function BiasScore({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const r = 44;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (animatedScore / 100) * circumference;
  const color = scoreColor(animatedScore);

  const levelLabel = animatedScore <= 20 ? 'Minimal' : animatedScore <= 40 ? 'Low' : animatedScore <= 60 ? 'Moderate' : animatedScore <= 80 ? 'High' : 'Severe';

  // Animate score on mount/change
  useEffect(() => {
    let start = 0;
    const duration = 800;
    const startTime = performance.now();

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(easeProgress * score));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div className="score-card">
      <div className="score-svg-wrap">
        <svg width="110" height="110" viewBox="0 0 110 110" aria-label={`Bias score: ${animatedScore}`}>
          {/* Inner Glow Definition */}
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          
          {/* Track */}
          <circle cx="55" cy="55" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
          
          {/* Progress with glow */}
          <circle
            cx="55" cy="55" r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 55 55)"
            filter={animatedScore > 0 ? "url(#glow)" : ""}
            style={{ transition: 'stroke 0.3s ease' }}
          />
          <text x="55" y="50" textAnchor="middle" fill="var(--text-primary)" fontSize="24" fontWeight="700" fontFamily="Inter, sans-serif">{animatedScore}</text>
          <text x="55" y="68" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="500">/ 100</text>
        </svg>
      </div>

      <div className="score-meta">
        <div className="score-level-header">
          <span className="score-label">Bias Risk Level</span>
          <span className="score-badge" style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}>
            {levelLabel}
          </span>
        </div>

        <div className="score-bars">
          {[
            { label: 'Low', range: '0–30', fill: '#22c55e', pct: animatedScore <= 30 ? (animatedScore / 30) * 100 : 100, active: animatedScore <= 30 },
            { label: 'Moderate', range: '31–60', fill: '#f59e0b', pct: animatedScore <= 30 ? 0 : animatedScore <= 60 ? ((animatedScore - 30) / 30) * 100 : 100, active: animatedScore > 30 && animatedScore <= 60 },
            { label: 'High', range: '61–100', fill: '#ef4444', pct: animatedScore <= 60 ? 0 : ((animatedScore - 60) / 40) * 100, active: animatedScore > 60 },
          ].map(row => (
            <div key={row.label} className={`score-bar-row ${row.active ? 'active' : ''}`}>
              <div className="score-bar-label">
                <span style={{ color: row.active ? row.fill : 'var(--text-muted)', fontWeight: row.active ? 600 : 400 }}>{row.label}</span>
                <span>{row.range}</span>
              </div>
              <div className="score-bar-track">
                <div className="score-bar-fill" style={{ width: `${row.pct}%`, background: row.fill, opacity: row.active ? 1 : 0.3 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
