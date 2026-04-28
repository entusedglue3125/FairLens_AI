import { useApp } from '../context/AppContext';

const tabs = [
  { id: 'analyze', label: 'Analyze', icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )},
  { id: 'history', label: 'History', icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )},
  { id: 'about', label: 'About', icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  )},
];

export default function Navbar() {
  const { activeTab, setActiveTab, toggleTheme, theme } = useApp();

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="navbar-brand">
        <div className="brand-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" fill="url(#brandGrad)" />
            <circle cx="12" cy="13" r="3" fill="white" opacity="0.9"/>
            <path d="M12 10v2M10 13h4" stroke="rgba(79,142,247,0.6)" strokeWidth="1.2"/>
            <defs>
              <linearGradient id="brandGrad" x1="0" y1="0" x2="24" y2="24">
                <stop offset="0%" stopColor="#5b8dee"/>
                <stop offset="100%" stopColor="#a855f7"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span>Fair<span className="brand-accent">Lens</span> AI</span>
        <span className="brand-version">v1.0</span>
      </div>

      {/* Tabs */}
      <div className="navbar-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            className={`navbar-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {activeTab === tab.id && <span className="tab-indicator" />}
          </button>
        ))}
      </div>

      {/* Right */}
      <div className="navbar-right">
        <button
          id="theme-toggle-btn"
          className="theme-toggle"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
}
