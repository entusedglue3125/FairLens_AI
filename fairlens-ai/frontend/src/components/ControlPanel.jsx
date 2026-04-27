import { useApp } from '../context/AppContext';

export default function ControlPanel() {
  const { explainMode, setExplainMode, highlightBias, setHighlightBias, sensitivity, setSensitivity } = useApp();

  return (
    <div className="control-panel">
      <span className="control-panel-title">Options</span>

      {/* Explain Mode */}
      <div className="control-group">
        <span className="control-label">Explain Mode</span>
        <label className="toggle-switch" title="Toggle explanation style" htmlFor="explain-toggle">
          <input
            id="explain-toggle"
            type="checkbox"
            checked={explainMode === 'technical'}
            onChange={e => setExplainMode(e.target.checked ? 'technical' : 'simple')}
          />
          <span className="toggle-track" />
          <span className="toggle-thumb" />
        </label>
        <span className="control-label" style={{ fontSize: '0.78rem', minWidth: 60 }}>
          {explainMode === 'technical' ? 'Technical' : 'Simple'}
        </span>
      </div>

      {/* Highlight Bias */}
      <div className="control-group">
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
      <div className="control-group">
        <span className="control-label">Sensitivity</span>
        <input
          id="sensitivity-slider"
          type="range"
          min={0}
          max={100}
          value={sensitivity}
          onChange={e => setSensitivity(Number(e.target.value))}
          className="slider-input"
        />
        <span className="slider-value">{sensitivity}</span>
      </div>
    </div>
  );
}
