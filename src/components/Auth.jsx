import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import { client } from '../sanityClient';
import { ShieldCheck, UserPlus, LogIn, AlertCircle, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';

const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What was the name of your first school?",
  "In what city were you born?",
  "What is your mother's maiden name?",
  "What was your first car?"
];

function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  
  // Registration States
  const [name, setName] = useState('');
  const [username, setUsername] = useState(''); // Shared across both (as Identifier in login)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Forgot Password / Recovery States
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState('identify'); // identify, challenge, reset
  const [securityQuestion, setSecurityQuestion] = useState(SECURITY_QUESTIONS[0]);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [targetUser, setTargetUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Universal States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Enforce strong password mechanics
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

  const validatePassword = (pass) => {
    if (!strongPasswordRegex.test(pass)) {
      return "Password must be at least 8 chars, include an uppercase letter, a number, and a special character (@$!%*?&#).";
    }
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    const passError = validatePassword(password);
    if (passError) {
      setErrorMsg(passError);
      return;
    }

    setLoading(true);
    try {
      // 1. Check if user already exists
      const existingUser = await client.fetch(`*[_type == "user" && (username == $username || email == $email)][0]`, { username, email });
      if (existingUser) {
        setErrorMsg("Username or Email is already taken!");
        setLoading(false);
        return;
      }

      // 2. Hash Password securely before sending to database
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // 3. Save into Sanity
      await client.create({
        _type: 'user',
        name,
        username,
        email,
        password: hashedPassword,
        securityQuestion,
        securityAnswer: securityAnswer.toLowerCase().trim() // Store normalized for easier recovery
      });

      // 4. Force them to log in cleanly automatically
      alert("Registration Successful! Redirecting to login...");
      setPassword('');
      setIsLogin(true);
      setErrorMsg('');
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to reach server. Make sure your local VITE_SANITY_TOKEN setup is working.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // Find the user by username or email
      const userDoc = await client.fetch(`*[_type == "user" && (username == $identifier || email == $identifier)][0]`, { identifier: username });
      
      if (!userDoc) {
        setErrorMsg("Account not found. Check your credentials or Register!");
        setLoading(false);
        return;
      }

      // Mathematically compare inputs with the database Hash
      const isValid = bcrypt.compareSync(password, userDoc.password);
      
      if (isValid) {
        // Only return non-sensitive fields to main state
        onAuthSuccess({
          id: userDoc._id,
          name: userDoc.name,
          username: userDoc.username,
          email: userDoc.email
        });
      } else {
        setErrorMsg("Incorrect Password! Please try again.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Connection Error. Ensure DEV server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleIdentify = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const userDoc = await client.fetch(`*[_type == "user" && (username == $identifier || email == $identifier)][0]`, { identifier: username });
      if (!userDoc) {
        setErrorMsg("Account not found.");
      } else if (!userDoc.securityQuestion) {
        setErrorMsg("This account doesn't have security questions set up. Contact admin.");
      } else {
        setTargetUser(userDoc);
        setRecoveryStep('challenge');
        setSecurityAnswer(''); // Clear any previous attempts
      }
    } catch (e) {
      setErrorMsg("Error searching for account.");
    } finally {
      setLoading(false);
    }
  };

  const handleChallenge = (e) => {
    e.preventDefault();
    if (securityAnswer.toLowerCase().trim() === targetUser.securityAnswer) {
      setRecoveryStep('reset');
      setErrorMsg('');
    } else {
      setErrorMsg("Incorrect answer! Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }
    const passError = validatePassword(newPassword);
    if (passError) {
      setErrorMsg(passError);
      return;
    }

    setLoading(true);
    try {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(newPassword, salt);
      await client.patch(targetUser._id).set({ password: hashedPassword }).commit();
      alert("Password reset successful! You can now log in.");
      setIsRecovering(false);
      setIsLogin(true);
      setRecoveryStep('identify');
      setNewPassword('');
      setConfirmPassword('');
      setUsername(targetUser.username); // Pre-fill username for convenience
    } catch (e) {
      setErrorMsg("Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100%', padding: '40px 20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: '2rem' }}>
          {isRecovering ? (
            <KeyRound size={48} color="var(--accent-secondary)" style={{ margin: '0 auto 1.5rem auto' }} />
          ) : (
            <ShieldCheck size={48} color="var(--accent-primary)" style={{ margin: '0 auto 1.5rem auto' }} />
          )}
          
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
            {isRecovering ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Create an Account')}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isRecovering 
              ? 'Follow the steps to regain access.' 
              : (isLogin ? 'Securely access your dynamic ledger.' : 'Start tracking expenses properly today.')
            }
          </p>
        </div>

        {errorMsg && (
          <div style={{ 
            background: 'rgba(255, 71, 87, 0.1)', 
            border: '1px solid var(--danger)', 
            color: 'var(--danger)', 
            padding: '0.75rem', 
            borderRadius: '12px', 
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.85rem',
            textAlign: 'left',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            {errorMsg}
          </div>
        )}

        {/* 1. PASSWORD RECOVERY FLOW */}
        {isRecovering ? (
          <div style={{ textAlign: 'left' }}>
            {/* Step 1: Identify User */}
            {recoveryStep === 'identify' && (
              <form onSubmit={handleIdentify}>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label>Enter Username or Email</label>
                  <input 
                    type="text" 
                    placeholder="e.g. john123" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Searching...' : 'Continue'}
                </button>
              </form>
            )}

            {/* Step 2: Answer Security Question */}
            {recoveryStep === 'challenge' && (
              <form onSubmit={handleChallenge}>
                <div style={{ background: 'var(--panel-bg)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--panel-border)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Security Question</span>
                  <p style={{ margin: '0.5rem 0 0 0', fontWeight: 500, color: 'var(--text-main)' }}>{targetUser?.securityQuestion}</p>
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label>Your Answer</label>
                  <input 
                    type="text" 
                    placeholder="Enter your answer" 
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                  Verify Answer
                </button>
              </form>
            )}

            {/* Step 3: Set New Password */}
            {recoveryStep === 'reset' && (
              <form onSubmit={handleResetPassword}>
                 <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label>New Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label>Confirm Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} disabled={loading}>
                  {loading ? 'Updating...' : <><CheckCircle2 size={18} /> Update Password</>}
                </button>
              </form>
            )}

            <button 
              onClick={() => {
                setIsRecovering(false);
                setErrorMsg('');
                setRecoveryStep('identify');
              }}
              style={{ 
                marginTop: '1.5rem', 
                background: 'transparent', 
                color: 'var(--text-muted)', 
                fontSize: '0.9rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                marginInline: 'auto'
              }}
            >
              <ArrowLeft size={16} /> Back to Login
            </button>
          </div>
        ) : (
          /* 2. LOGIN / REGISTER FLOW */
          <form onSubmit={isLogin ? handleLogin : handleRegister} style={{ textAlign: 'left' }}>
            {!isLogin && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="John" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <input type="text" placeholder="john123" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
              </div>
            )}

            {!isLogin && (
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label>Email Address</label>
                <input type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            )}

            {isLogin && (
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label>Username or Email</label>
                <input 
                  type="text" 
                  placeholder="john123" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group" style={{ marginBottom: isLogin ? '0.75rem' : '1.25rem' }}>
              <label>Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {isLogin && (
              <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                <span 
                  onClick={() => {
                    setIsRecovering(true);
                    setErrorMsg('');
                  }}
                  style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)', cursor: 'pointer', fontWeight: 500 }}
                >
                  Forgot Password?
                </span>
              </div>
            )}

            {!isLogin && (
              <>
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label>Security Question (Select for Recovery)</label>
                  <select 
                    value={securityQuestion} 
                    onChange={(e) => setSecurityQuestion(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    {SECURITY_QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label>Security Answer</label>
                  <input 
                    type="text" 
                    placeholder="Your Answer" 
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} disabled={loading}>
              {loading ? 'Processing...' : isLogin ? <><LogIn size={18} /> Sign In</> : <><UserPlus size={18} /> Register Account</>}
            </button>
          </form>
        )}

        {!isRecovering && (
          <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span 
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg('');
                setSecurityAnswer('');
              }}
              style={{ color: 'var(--accent-secondary)', cursor: 'pointer', fontWeight: 500 }}
            >
              {isLogin ? 'Register Here.' : 'Log in instead.'}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

export default Auth;
