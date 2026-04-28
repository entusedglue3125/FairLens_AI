import { useState } from 'react';
import { useApp } from '../context/AppContext';
import BiasScore from './BiasScore';
import HighlightedText from './HighlightedText';

export default function ResultsDashboard({ result, originalText, onRetry, error, isLoading }) {
  const { highlightBias } = useApp();
  const [copiedText, setCopiedText] = useState(false);
  const [copiedAlt, setCopiedAlt] = useState(false);

  const handleCopy = async (text, setter) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleExport = () => {
    if (!result) return;
    const report = `FairLens AI Analysis Report\n===========================\n\nOriginal Text:\n${originalText}\n\nBias Detected: ${result.bias_detected ? 'Yes' : 'No'}\nBias Score: ${result.bias_score}/100\n\nExplanation:\n${result.explanation}\n\nFair Alternative:\n${result.fair_alternative}\n`;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fairlens-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="loading-overlay">
        <div className="spinner-container">
          <div className="spinner" />
          <div className="spinner-inner" />
        </div>
        <p className="loading-text">Analyzing text with FairLens AI...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-box">
        <div className="error-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div className="error-title">Analysis Failed</div>
        </div>
        <div className="error-message">{error}</div>
        <button id="retry-btn" className="retry-btn" onClick={onRetry}>Retry Analysis</button>
      </div>
    );
  }

  if (!result) return null;

  const { bias_detected, biased_terms, explanation, fair_alternative, bias_score } = result;

  return (
    <div className="results-wrapper fade-in-up">
      <div className="results-header">
        <h2 className="results-title">Analysis Results</h2>
        <button className="export-btn" onClick={handleExport} title="Download Report">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export
        </button>
      </div>

      <div className="results-grid">
        {/* Card 1: Status */}
        <div className="result-card stagger-1">
          <div className="result-card-title">Bias Detection</div>
          <div className={`status-pill ${bias_detected ? 'biased' : 'clean'}`}>
            <span className="status-dot-pulse"><span className="status-dot" /></span>
            {bias_detected ? 'Bias Detected' : 'No Bias Detected'}
          </div>
          <p className="status-description">
            {bias_detected
              ? `This text contains ${biased_terms?.length || 0} potentially biased term${biased_terms?.length !== 1 ? 's' : ''}.`
              : 'This text appears to be fair and unbiased. No significant biased terms were detected.'}
          </p>
          {biased_terms && biased_terms.length > 0 && (
            <div className="biased-terms">
              {biased_terms.map((term, i) => (
                <span key={i} className="biased-term-tag">{term}</span>
              ))}
            </div>
          )}
        </div>

        {/* Card 2: Score */}
        <div className={`result-card stagger-2 ${bias_score > 60 ? 'high-risk-glow' : ''}`}>
          <div className="result-card-title">Bias Score</div>
          <BiasScore score={bias_score ?? 0} />
        </div>

        {/* Card 3: Highlighted */}
        <div className="result-card stagger-3">
          <div className="result-card-header">
            <div className="result-card-title">Original Text</div>
            <button className="copy-btn-small" onClick={() => handleCopy(originalText, setCopiedText)} title="Copy text">
              {copiedText ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              )}
            </button>
          </div>
          <div className="highlight-box">
            <HighlightedText text={originalText} biasedTerms={biased_terms} enabled={highlightBias && bias_detected} />
          </div>
        </div>

        {/* Card 4: Explanation */}
        <div className="result-card stagger-4">
          <div className="result-card-title ai-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            AI Explanation
          </div>
          <p className="explanation-text">{explanation}</p>
        </div>

        {/* Card 5: Fair Alternative */}
        <div className="result-card result-card-full stagger-5">
          <div className="result-card-header">
            <div className="result-card-title ai-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Fair Alternative
            </div>
            <button className="copy-btn" onClick={() => handleCopy(fair_alternative, setCopiedAlt)}>
              {copiedAlt ? (
                <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied!</>
              ) : (
                <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</>
              )}
            </button>
          </div>
          <div className="fair-alternative-text">{fair_alternative}</div>
        </div>

      </div>
    </div>
  );
}
