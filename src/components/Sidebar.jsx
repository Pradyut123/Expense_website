import React from 'react';
import { BookOpen, Home, BarChart2, LogOut, X, Sun, Moon, Download, Palette as PaletteIcon } from 'lucide-react';
import { exportToExcel } from '../utils/exportUtils';

const palettes = [
  { id: 'indigo', color: '#818cf8', label: 'Indigo' },
  { id: 'emerald', color: '#10b981', label: 'Emerald' },
  { id: 'rose', color: '#f43f5e', label: 'Rose' },
  { id: 'amber', color: '#f59e0b', label: 'Amber' },
];

function Sidebar({ 
  activeTab, 
  setActiveTab, 
  onLogout, 
  isOpen, 
  onClose, 
  theme, 
  setTheme, 
  palette, 
  setPalette,
  transactions 
}) {
  return (
    <aside className={`app-sidebar glass-panel ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <BookOpen size={24} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.025em' }}>Ledger</h2>
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

        <button 
          className="all-time-btn" 
          onClick={() => exportToExcel(transactions)}
          style={{ width: '100%' }}
        >
          <Download size={18} />
          Export to Excel
        </button>
      </div>

      <div className="sidebar-settings" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="settings-group">
          <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'block' }}>
            Appearance
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className={`theme-toggle-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: '8px', background: theme === 'dark' ? 'var(--panel-bg-hover)' : 'transparent', border: '1px solid var(--panel-border)', color: theme === 'dark' ? 'var(--accent-primary)' : 'var(--text-muted)' }}
            >
              <Moon size={16} />
              Dark
            </button>
            <button 
              className={`theme-toggle-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: '8px', background: theme === 'light' ? 'var(--panel-bg-hover)' : 'transparent', border: '1px solid var(--panel-border)', color: theme === 'light' ? 'var(--accent-primary)' : 'var(--text-muted)' }}
            >
              <Sun size={16} />
              Light
            </button>
          </div>
        </div>

        <div className="settings-group">
          <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'block' }}>
            Accent Color
          </label>
          <div style={{ display: 'flex', gap: '0.75rem', padding: '0.25rem' }}>
            {palettes.map((p) => (
              <button
                key={p.id}
                onClick={() => setPalette(p.id)}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: p.color,
                  border: palette === p.id ? '2px solid var(--text-main)' : '2px solid transparent',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  transform: palette === p.id ? 'scale(1.2)' : 'scale(1)'
                }}
                title={p.label}
              />
            ))}
          </div>
        </div>

        <div className="settings-group">
          <button 
            className="all-time-btn"
            style={{ color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)', width: '100%' }}
            onClick={onLogout}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
