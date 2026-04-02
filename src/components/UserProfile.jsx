import React from 'react';
import { User, Mail, Hash, Shield } from 'lucide-react';

function UserProfile({ user }) {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '2rem' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>Account Profile</h2>

      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: 700,
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{user.name}</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Active Member</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
            <User size={20} color="var(--accent-primary)" />
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Full Name</p>
              <p style={{ margin: 0, fontWeight: 500 }}>{user.name}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
            <Mail size={20} color="var(--accent-secondary)" />
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</p>
              <p style={{ margin: 0, fontWeight: 500 }}>{user.email}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
            <Hash size={20} color="var(--success)" />
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}> Username</p>
              <p style={{ margin: 0, fontWeight: 500 }}>@{user.username}</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', padding: '1rem', border: '1px solid var(--panel-border)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.02)' }}>
          <Shield size={20} color="var(--warning)" />
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Your account is secured via Sanity Database architecture.
          </p>
        </div>

      </div>
    </div>
  );
}

export default UserProfile;
