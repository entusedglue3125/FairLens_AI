import { useState, useEffect, useCallback } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import InputBox from '@/components/InputBox';
import ResultsDashboard from '@/components/ResultsDashboard';
import ControlPanel from '@/components/ControlPanel';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3002';

function PanelContent() {
  const { explainMode, sensitivity } = useApp();
  const [result, setResult] = useState(null);
  const [originalText, setOriginalText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [externalText, setExternalText] = useState('');

  const analyze = useCallback(async (text, mode, sens) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setOriginalText(text);

    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode, sensitivity: sens }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'API Error');
      setResult(data);
    } catch (err) {
      if (err.message.includes('fetch')) {
        setError('Cannot connect to FairLens backend. Ensure it is running locally on port 3001.');
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Listen for context menu right-clicks
  useEffect(() => {
    // Check storage for text saved right before panel opened
    if (chrome && chrome.storage) {
      chrome.storage.local.get(['selectedText'], (res) => {
        if (res.selectedText) {
          setExternalText(res.selectedText);
          analyze(res.selectedText, explainMode, sensitivity);
          chrome.storage.local.remove('selectedText'); // clear it
        }
      });

      // Listen for messages if panel is already open
      const listener = (message) => {
        if (message.type === 'FAIRLENS_ANALYZE_TEXT' && message.text) {
          setExternalText(message.text);
          analyze(message.text, explainMode, sensitivity);
        }
      };
      chrome.runtime.onMessage.addListener(listener);
      return () => chrome.runtime.onMessage.removeListener(listener);
    }
  }, [analyze, explainMode, sensitivity]);

  // If text was passed from extension context menu, prepopulate the input box internally 
  // via a small wrapper or just let InputBox handle its own state. 
  // For simplicity, we'll pass an initial value down if we rewrite InputBox, 
  // but since we want to trigger analysis automatically, we just show the results directly.

  return (
    <div className="flex flex-col min-h-screen bg-[#0f1117] text-white p-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="font-bold text-lg">Fair<span className="text-blue-500">Lens</span> AI</div>
        <div className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full ml-auto">Side Panel</div>
      </div>
      
      <div className="mb-4">
        <ControlPanel />
      </div>

      <InputBox 
        onSubmit={analyze} 
        isLoading={isLoading} 
      />
      
      {/* If external text triggered it, let's show a small badge */}
      {externalText && !isLoading && !result && !error && (
        <div className="text-sm text-blue-400 my-2">
          Received text from selection. Analyzing...
        </div>
      )}

      <div className="mt-6">
        <ResultsDashboard
          result={result}
          originalText={originalText}
          isLoading={isLoading}
          error={error}
          onRetry={() => analyze(originalText, explainMode, sensitivity)}
        />
      </div>
    </div>
  );
}

export default function ExtensionApp() {
  return (
    <AppProvider>
      <PanelContent />
    </AppProvider>
  );
}
