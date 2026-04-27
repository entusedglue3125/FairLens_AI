import { useApp } from '../context/AppContext';
import BiasScore from './BiasScore';
import HighlightedText from './HighlightedText';

export default function ResultsDashboard({ result, originalText, onRetry, error, isLoading }) {
  const { highlightBias } = useApp();

  if (isLoading) {
    return (
      <div className="loading-overlay">
        <div className="spinner" />
        <p className="loading-text">Analyzing text with FairLens AI...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-box">
        <div className="error-title">Analysis Failed</div>
        <div className="error-message">{error}</div>
        <button id="retry-btn" className="retry-btn" onClick={onRetry}>Retry</button>
      </div>
    );
  }

  if (!result) return null;

  const { bias_detected, biased_terms, explanation, fair_alternative, bias_score } = result;

  return (
    <div className="results-grid">

      {/* Card 1: Status + Score */}
      <div className="result-card">
        <div className="result-card-title">Bias Detection</div>
        <div className={`status-pill ${bias_detected ? 'biased' : 'clean'}`}>
          <span className="status-dot" />
          {bias_detected ? 'Bias Detected' : 'No Bias Detected'}
        </div>
        <p className="status-description">
          {bias_detected
            ? `This text contains ${biased_terms?.length || 0} potentially biased term${biased_terms?.length !== 1 ? 's' : ''}.`
            : 'This text appears to be fair and unbiased.'}
        </p>
        {biased_terms && biased_terms.length > 0 && (
          <div className="biased-terms">
            {biased_terms.map((term, i) => (
              <span key={i} className="biased-term-tag">{term}</span>
            ))}
          </div>
        )}
      </div>

      {/* Card 2: Bias Score */}
      <div className="result-card">
        <div className="result-card-title">Bias Score</div>
        <BiasScore score={bias_score ?? 0} />
      </div>

      {/* Card 3: Highlighted Text */}
      <div className="result-card">
        <div className="result-card-title">Original Text — Highlighted</div>
        <HighlightedText
          text={originalText}
          biasedTerms={biased_terms}
          enabled={highlightBias && bias_detected}
        />
      </div>

      {/* Card 4: Explanation */}
      <div className="result-card">
        <div className="result-card-title">Explanation</div>
        <p className="explanation-text">{explanation}</p>
      </div>

      {/* Card 5: Fair Alternative (full width) */}
      <div className="result-card" style={{ gridColumn: '1 / -1' }}>
        <div className="result-card-title">Fair Alternative</div>
        <div className="fair-alternative-text">{fair_alternative}</div>
      </div>

    </div>
  );
}
