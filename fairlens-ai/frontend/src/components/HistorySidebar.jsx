import { useApp } from '../context/AppContext';

export default function HistorySidebar({ onReload }) {
  const { history, activeHistoryId, setActiveHistoryId } = useApp();

  const handleClick = (item) => {
    setActiveHistoryId(item.id);
    onReload(item.text, item.result);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-title">Recent Analyses</div>
      {history.length === 0 ? (
        <p className="sidebar-empty">
          No analyses yet. Submit text to get started.
        </p>
      ) : (
        history.map(item => (
          <div
            key={item.id}
            id={`history-item-${item.id}`}
            className={`sidebar-item ${activeHistoryId === item.id ? 'active' : ''}`}
            onClick={() => handleClick(item)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && handleClick(item)}
          >
            <div className="sidebar-item-text">{item.text}</div>
            <div className="sidebar-item-time">{item.timestamp}</div>
          </div>
        ))
      )}
    </aside>
  );
}
