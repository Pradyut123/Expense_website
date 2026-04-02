import React from 'react';
import { User, Mail, Hash, Shield } from 'lucide-react';

function UserProfile({ user }) {
  return (
    <div className="profile-container">
      <h2 className="profile-title">Account Profile</h2>

      <div className="glass-panel profile-card">
        
        <div className="profile-avatar-row">
          <div className="profile-avatar-large">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-avatar-details">
            <h3>{user.name}</h3>
            <p>Active Member</p>
          </div>
        </div>

        <div className="profile-info-grid">
          <div className="profile-info-item">
            <User size={20} color="var(--accent-primary)" />
            <div className="info-content">
              <p className="label">Full Name</p>
              <p className="value">{user.name}</p>
            </div>
          </div>

          <div className="profile-info-item">
            <Mail size={20} color="var(--accent-secondary)" />
            <div className="info-content">
              <p className="label">Email Address</p>
              <p className="value">{user.email}</p>
            </div>
          </div>

          <div className="profile-info-item">
            <Hash size={20} color="var(--success)" />
            <div className="info-content">
              <p className="label">Username</p>
              <p className="value">@{user.username}</p>
            </div>
          </div>
        </div>

        <div className="profile-security-box">
          <Shield size={20} color="var(--warning)" />
          <p>
            Your account is secured via Sanity Database architecture.
          </p>
        </div>

      </div>
    </div>
  );
}

export default UserProfile;
