import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('about');
  const [history, setHistory] = useState([]);
  const [explainMode, setExplainMode] = useState('simple');
  const [highlightBias, setHighlightBias] = useState(true);
  const [sensitivity, setSensitivity] = useState(50);
  const [activeHistoryId, setActiveHistoryId] = useState(null);

  const toggleTheme = useCallback(() => {
    setTheme(t => {
      const next = t === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }, []);

  const addToHistory = useCallback((text, result) => {
    setHistory(prev => [
      {
        id: Date.now(),
        text: text.slice(0, 120),
        result,
        timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      },
      ...prev.slice(0, 19),
    ]);
  }, []);

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      activeTab, setActiveTab,
      history, addToHistory, activeHistoryId, setActiveHistoryId,
      explainMode, setExplainMode,
      highlightBias, setHighlightBias,
      sensitivity, setSensitivity,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
