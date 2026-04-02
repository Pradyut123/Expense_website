import React from 'react';
import { BookOpen, Home, BarChart2, LogOut, X } from 'lucide-react';

function Sidebar({ activeTab, setActiveTab, onLogout, isOpen, onClose }) {
  return (
    <aside className={`app-sidebar glass-panel ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <BookOpen size={24} color="var(--accent-primary)" />
          <h2>Ledger</h2>
        </div>
        <button className="mobile-close-btn" onClick={onClose}>
          <X size={24} />
        </button>
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
