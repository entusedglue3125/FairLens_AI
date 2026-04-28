import { useApp } from '../context/AppContext';

const DEFAULT_EXPLAIN = 'simple';
const DEFAULT_HIGHLIGHT = true;
const DEFAULT_SENSITIVITY = 50;

export default function ControlPanel() {
  const { explainMode, setExplainMode, highlightBias, setHighlightBias, sensitivity, setSensitivity } = useApp();

  const handleReset = () => {
    setExplainMode(DEFAULT_EXPLAIN);
    setHighlightBias(DEFAULT_HIGHLIGHT);
    setSensitivity(DEFAULT_SENSITIVITY);
  };

  // Gradient track: green 0% → amber 50% → red 100%
  const sliderBg = `linear-gradient(to right, #22c55e 0%, #f59e0b 50%, #ef4444 100%)`;
  const sensitivityLabel = sensitivity <= 30 ? 'Low' : sensitivity <= 70 ? 'Medium' : 'High';
  const sensitivityColor = sensitivity <= 30 ? '#22c55e' : sensitivity <= 70 ? '#f59e0b' : '#ef4444';

  return (
    <div className="control-panel">
      <div className="control-panel-left">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ flexShrink: 0 }}>
          <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
          <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
          <line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/>
          <line x1="17" y1="16" x2="23" y2="16"/>
        </svg>
        <span className="control-panel-title">Analysis Options</span>
      </div>

      <div className="control-panel-groups">
        {/* Explain Mode */}
        <div className="control-group" title="Simple: plain language · Technical: academic language">
          <span className="control-label">Explain Mode</span>
          <label className="toggle-switch" htmlFor="explain-toggle">
            <input
              id="explain-toggle"
              type="checkbox"
              checked={explainMode === 'technical'}
              onChange={e => setExplainMode(e.target.checked ? 'technical' : 'simple')}
            />
            <span className="toggle-track" />
            <span className="toggle-thumb" />
          </label>
          <span className="control-mode-label">
            {explainMode === 'technical' ? 'Technical' : 'Simple'}
          </span>
        </div>

        {/* Highlight Bias */}
        <div className="control-group" title="Highlight biased words in the original text">
          <span className="control-label">Highlight Bias</span>
          <label className="toggle-switch" htmlFor="highlight-toggle">
            <input
              id="highlight-toggle"
              type="checkbox"
              checked={highlightBias}
              onChange={e => setHighlightBias(e.target.checked)}
            />
            <span className="toggle-track" />
            <span className="toggle-thumb" />
          </label>
        </div>

        {/* Sensitivity */}
        <div className="control-group" title="Adjusts how aggressively bias is scored">
          <span className="control-label">Sensitivity</span>
          <div className="slider-wrap">
            <input
              id="sensitivity-slider"
              type="range"
              min={0}
              max={100}
              value={sensitivity}
              onChange={e => setSensitivity(Number(e.target.value))}
              className="slider-input"
              style={{ '--slider-bg': sliderBg, '--slider-pct': `${sensitivity}%` }}
            />
          </div>
          <span className="slider-value" style={{ color: sensitivityColor }}>
            {sensitivityLabel}
          </span>
        </div>

        <button className="reset-link" onClick={handleReset} type="button" title="Reset all options to defaults">
          Reset
        </button>
      </div>
    </div>
  );
}
