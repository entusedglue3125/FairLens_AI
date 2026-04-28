import { useApp } from '../context/AppContext';

function getScoreColor(score) {
  if (score <= 30) return 'var(--green)';
  if (score <= 60) return 'var(--amber)';
  return 'var(--red)';
}

export default function HistorySidebar({ onReload }) {
  const { history, activeHistoryId, setActiveHistoryId, clearHistory, deleteHistoryItem } = useApp();

  const handleClick = (item) => {
    setActiveHistoryId(item.id);
    onReload(item.text, item.result);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteHistoryItem(id);
    if (activeHistoryId === id) {
      setActiveHistoryId(null);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">Recent Analyses</div>
        {history.length > 0 && (
          <button className="clear-history-btn" onClick={clearHistory} title="Clear all history">
            Clear All
          </button>
        )}
      </div>
      
      <div className="sidebar-list">
        {history.length === 0 ? (
          <div className="sidebar-empty">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" className="empty-icon">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <p>No history yet.<br/>Submit text to get started.</p>
          </div>
        ) : (
          history.map(item => {
            const scoreColor = getScoreColor(item.score);
            return (
              <div
                key={item.id}
                id={`history-item-${item.id}`}
                className={`sidebar-item slide-in ${activeHistoryId === item.id ? 'active' : ''}`}
                onClick={() => handleClick(item)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && handleClick(item)}
              >
                <div className="sidebar-item-header">
                  <span className="history-score-badge" style={{ color: scoreColor, borderColor: scoreColor, backgroundColor: `${scoreColor}15` }}>
                    {item.score}
                  </span>
                  <div className="sidebar-item-time">{item.timestamp}</div>
                </div>
                <div className="sidebar-item-text">{item.text}</div>
                <button 
                  className="history-delete-btn" 
                  onClick={(e) => handleDelete(e, item.id)}
                  title="Delete item"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
