import React, { useState } from 'react';
import { Lock } from 'lucide-react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.length > 0 && password.length > 0) {
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div style={{
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      width: '100vw',
      position: 'absolute',
      top: 0,
      left: 0,
      background: 'var(--bg-color)',
      zIndex: 1000
    }}>
      <div className="glass-panel" style={{
        padding: '3rem',
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div style={{
          background: 'rgba(129, 140, 248, 0.1)',
          padding: '1rem',
          borderRadius: '50%',
          color: 'var(--accent-primary)'
        }}>
          <Lock size={32} />
        </div>
        
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>
          Please log in to manage your expenses.
        </p>

        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '1rem' }}>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              placeholder="Enter any username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter any password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          {error && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>Please enter both username and password.</div>}

          <button type="submit" className="btn-primary">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
