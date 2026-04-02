import React from 'react';
import { BookOpen, Home, BarChart2, LogOut } from 'lucide-react';

function Sidebar({ activeTab, setActiveTab, onLogout }) {
  return (
    <aside className="app-sidebar glass-panel">
      <div className="sidebar-header">
        <BookOpen size={24} color="var(--accent-primary)" />
        <h2>Ledger</h2>
      </div>

      <div className="sidebar-actions">
        <button 
          className={`all-time-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <Home size={18} />
          Home Dashboard
        </button>

        <button 
          className={`all-time-btn ${activeTab === 'monthly' ? 'active' : ''}`}
          onClick={() => setActiveTab('monthly')}
        >
          <BarChart2 size={18} />
          View Month-Wise
        </button>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
        <button 
          className="all-time-btn"
          style={{ color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
          onClick={onLogout}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
