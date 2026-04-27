import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';

const PRESETS = {
  Hiring: "We are looking for a young, energetic male candidate for the software engineering position. Candidates over 40 need not apply. The ideal person should be able to handle a high-pressure, boys-club environment.",
  Loan: "We are less likely to approve loans for applicants from certain zip codes, particularly those in predominantly minority neighborhoods. Married applicants with children are considered higher risk.",
  Education: "Students from elite private schools are significantly better prepared for university than those from public schools in low-income areas. We prioritize candidates from prestigious feeder institutions.",
};

export default function InputBox({ onSubmit, isLoading }) {
  const { explainMode, sensitivity } = useApp();
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

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

  const handleChip = (key) => {
    setText(PRESETS[key]);
    textareaRef.current?.focus();
  };

  return (
    <div className="input-section">
      <label className="input-label" htmlFor="analyze-textarea">Text to analyze</label>
      <div className="input-card">
        <textarea
          id="analyze-textarea"
          ref={textareaRef}
          className="input-textarea"
          placeholder="Paste text to analyze bias..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={5000}
          spellCheck={false}
        />
        <div className="input-footer">
          <div className="chips">
            {Object.keys(PRESETS).map(key => (
              <button
                key={key}
                id={`chip-${key.toLowerCase()}`}
                className="chip"
                onClick={() => handleChip(key)}
                type="button"
              >
                {key}
              </button>
            ))}
          </div>
          <div className="input-actions">
            <span className="char-count">{text.length} / 5000</span>
            <button
              id="submit-analyze-btn"
              className="submit-btn"
              onClick={handleSubmit}
              disabled={!text.trim() || isLoading}
              type="button"
            >
              {isLoading ? (
                <>
                  <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                  Analyzing
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  Analyze
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
