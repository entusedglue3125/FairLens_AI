import { useState, useCallback } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import InputBox from './components/InputBox';
import ControlPanel from './components/ControlPanel';
import ResultsDashboard from './components/ResultsDashboard';
import HistorySidebar from './components/HistorySidebar';
import AboutPage from './components/AboutPage';

const API_BASE = 'http://localhost:3002';

function AnalyzePage() {
  const { addToHistory, activeTab } = useApp();
  const [result, setResult] = useState(null);
  const [originalText, setOriginalText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastParams, setLastParams] = useState(null);

  const analyze = useCallback(async (text, mode, sensitivity) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setOriginalText(text);
    setLastParams({ text, mode, sensitivity });

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
    <div className="main-content">
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
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', paddingTop: 40, textAlign: 'center' }}>
            {history.length === 0
              ? 'No history yet. Analyze some text first.'
              : 'Select an item from the sidebar to view results.'}
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
