import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';

const PRESETS = [
  {
    key: 'Hiring',
    icon: '💼',
    text: "We are looking for a young, energetic male candidate for the software engineering position. Candidates over 40 need not apply. The ideal person should be able to handle a high-pressure, boys-club environment.",
  },
  {
    key: 'Loan',
    icon: '💳',
    text: "We are less likely to approve loans for applicants from certain zip codes, particularly those in predominantly minority neighborhoods. Married applicants with children are considered higher risk.",
  },
  {
    key: 'Education',
    icon: '🎓',
    text: "Students from elite private schools are significantly better prepared for university than those from public schools in low-income areas. We prioritize candidates from prestigious feeder institutions.",
  },
];

export default function InputBox({ onSubmit, isLoading }) {
  const { explainMode, sensitivity } = useApp();
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const isReady = text.trim().length > 0 && !isLoading;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!text.trim() || isLoading) return;
    onSubmit(text.trim(), explainMode, sensitivity);
  };

  const handleChip = (preset) => {
    setText(preset.text);
    textareaRef.current?.focus();
  };

  const handleClear = () => {
    setText('');
    textareaRef.current?.focus();
  };

  return (
    <div className="input-section">
      <label className="input-label" htmlFor="analyze-textarea">Text to analyze</label>
      <div className="input-card">
        <div className="textarea-wrap">
          <textarea
            id="analyze-textarea"
            ref={textareaRef}
            className="input-textarea"
            placeholder="Paste or type text to analyze for bias..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={5000}
            spellCheck={false}
          />
          {text.length > 0 && (
            <button
              className="clear-btn"
              onClick={handleClear}
              title="Clear text"
              type="button"
              aria-label="Clear input"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        <div className="input-footer">
          <div className="chips">
            {PRESETS.map(p => (
              <button
                key={p.key}
                id={`chip-${p.key.toLowerCase()}`}
                className="chip"
                onClick={() => handleChip(p)}
                type="button"
              >
                <span className="chip-icon">{p.icon}</span>
                {p.key}
              </button>
            ))}
          </div>

          <div className="input-actions">
            <span className="char-count">
              <span style={{ color: wordCount > 0 ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                {wordCount}w
              </span>
              <span style={{ color: 'var(--border-hover)', margin: '0 4px' }}>·</span>
              <span style={{ color: charCount > 4500 ? 'var(--amber)' : 'var(--text-muted)' }}>
                {charCount}/5000
              </span>
            </span>

            <button
              id="submit-analyze-btn"
              className={`submit-btn ${isReady ? 'ready' : ''}`}
              onClick={handleSubmit}
              disabled={!isReady}
              type="button"
            >
              {isLoading ? (
                <>
                  <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                  Analyzing…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  Analyze
                </>
              )}
            </button>
          </div>
        </div>

        {text.length > 0 && !isLoading && (
          <div className="input-hint">Press Enter to analyze · Shift+Enter for new line</div>
        )}
      </div>
    </div>
  );
}
