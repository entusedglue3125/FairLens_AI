import { useState, useCallback, useRef } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import InputBox from './components/InputBox';
import ControlPanel from './components/ControlPanel';
import ResultsDashboard from './components/ResultsDashboard';
import HistorySidebar from './components/HistorySidebar';
import AboutPage from './components/AboutPage';

const API_BASE = 'http://localhost:3002';

function LandingHero({ onScrollToApp }) {
  return (
    <div className="landing-hero">
      <div className="landing-hero-content">
        <div className="hero-badge">AI-Powered Text Analysis</div>
        <h1 className="hero-title">
          Detect & Eliminate<br/>
          <span className="hero-highlight">Hidden Bias</span> in Text
        </h1>
        <p className="hero-subtitle">
          Ensure fair and inclusive communication in hiring, lending, and education.
          Our advanced AI instantly identifies subtle biases and suggests neutral alternatives.
        </p>
        <div className="hero-actions">
          <button className="hero-cta" onClick={onScrollToApp}>
            Start Analyzing
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </div>
      <div className="hero-bg-glow"></div>
    </div>
  );
}

function AnalyzePage() {
  const { addToHistory } = useApp();
  const [result, setResult] = useState(null);
  const [originalText, setOriginalText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastParams, setLastParams] = useState(null);
  const appRef = useRef(null);

  const scrollToApp = () => {
    appRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // focus the textarea after scroll
    setTimeout(() => {
      document.getElementById('analyze-textarea')?.focus();
    }, 600);
  };

  const analyze = useCallback(async (text, mode, sensitivity) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setOriginalText(text);
    setLastParams({ text, mode, sensitivity });
    
    // Scroll to results area automatically
    setTimeout(() => {
        appRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode, sensitivity }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'An unexpected error occurred.');
      } else {
        setResult(data);
        addToHistory(text, data);
      }
    } catch (err) {
      if (err.message.includes('fetch')) {
        setError('Cannot connect to the FairLens backend. Ensure it is running on port 3002.');
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [addToHistory]);

  const handleReload = useCallback((text, savedResult) => {
    setOriginalText(text);
    setResult(savedResult);
    setError(null);
  }, []);

  const handleRetry = useCallback(() => {
    if (lastParams) analyze(lastParams.text, lastParams.mode, lastParams.sensitivity);
  }, [lastParams, analyze]);

  return (
    <div className="analyze-page-wrapper">
      <LandingHero onScrollToApp={scrollToApp} />
      
      <div className="main-content" ref={appRef} style={{ scrollMarginTop: '60px' }}>
        <HistorySidebar onReload={handleReload} />
        <div className="page-container">
          <ControlPanel />
          <InputBox onSubmit={analyze} isLoading={isLoading} />
          <ResultsDashboard
            result={result}
            originalText={originalText}
            isLoading={isLoading}
            error={error}
            onRetry={handleRetry}
          />
        </div>
      </div>
    </div>
  );
}

function HistoryPage() {
  const { history } = useApp();
  const [selected, setSelected] = useState(null);

  return (
    <div className="main-content">
      <HistorySidebar onReload={(text, result) => setSelected({ text, result })} />
      <div className="page-container">
        {!selected ? (
          <div className="history-empty-state">
            <div className="history-empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--border-hover)" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="3" x2="9" y2="21"/>
              </svg>
            </div>
            <h3>{history.length === 0 ? 'No History Yet' : 'Select an Analysis'}</h3>
            <p>
              {history.length === 0
                ? 'Your previous bias checks will appear here. Go to the Analyze tab to get started.'
                : 'Choose an item from the sidebar to view its detailed bias report.'}
            </p>
          </div>
        ) : (
          <ResultsDashboard
            result={selected.result}
            originalText={selected.text}
            isLoading={false}
            error={null}
            onRetry={() => {}}
          />
        )}
      </div>
    </div>
  );
}

function AppContent() {
  const { activeTab } = useApp();

  return (
    <div className="app-layout">
      <Navbar />
      {activeTab === 'analyze' && <AnalyzePage />}
      {activeTab === 'history' && <HistoryPage />}
      {activeTab === 'about' && <AboutPage />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
