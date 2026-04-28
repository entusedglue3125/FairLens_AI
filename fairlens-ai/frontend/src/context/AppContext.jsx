import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AppContext = createContext(null);

const LS = {
  get: (k, d) => { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => LS.get('fl_theme', 'dark'));
  const [activeTab, setActiveTab] = useState('analyze');
  const [history, setHistory] = useState(() => LS.get('fl_history', []));
  const [explainMode, setExplainMode] = useState(() => LS.get('fl_explain', 'simple'));
  const [highlightBias, setHighlightBias] = useState(() => LS.get('fl_highlight', true));
  const [sensitivity, setSensitivity] = useState(() => LS.get('fl_sensitivity', 50));
  const [activeHistoryId, setActiveHistoryId] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => {
      const next = t === 'dark' ? 'light' : 'dark';
      LS.set('fl_theme', next);
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }, []);

  const setExplainModeP = useCallback(v => { setExplainMode(v); LS.set('fl_explain', v); }, []);
  const setHighlightBiasP = useCallback(v => { setHighlightBias(v); LS.set('fl_highlight', v); }, []);
  const setSensitivityP = useCallback(v => { setSensitivity(v); LS.set('fl_sensitivity', v); }, []);

  const addToHistory = useCallback((text, result) => {
    setHistory(prev => {
      const next = [
        {
          id: Date.now(),
          text: text.slice(0, 120),
          result,
          score: result.bias_score ?? 0,
          timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        },
        ...prev.slice(0, 19),
      ];
      LS.set('fl_history', next);
      return next;
    });
  }, []);

  const deleteHistoryItem = useCallback((id) => {
    setHistory(prev => {
      const next = prev.filter(i => i.id !== id);
      LS.set('fl_history', next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    LS.set('fl_history', []);
    setActiveHistoryId(null);
  }, []);

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      activeTab, setActiveTab,
      history, addToHistory, deleteHistoryItem, clearHistory,
      activeHistoryId, setActiveHistoryId,
      explainMode, setExplainMode: setExplainModeP,
      highlightBias, setHighlightBias: setHighlightBiasP,
      sensitivity, setSensitivity: setSensitivityP,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
