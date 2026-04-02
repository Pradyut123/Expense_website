import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import { client } from '../sanityClient';
import { ShieldCheck, UserPlus, LogIn, AlertCircle } from 'lucide-react';

function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  
  // Registration States
  const [name, setName] = useState('');
  const [username, setUsername] = useState(''); // Shared across both (as Identifier in login)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
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
        password: hashedPassword
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

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100%' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2rem', textAlign: 'center' }}>
        <ShieldCheck size={48} color="var(--accent-primary)" style={{ margin: '0 auto 1.5rem auto' }} />
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          {isLogin ? 'Securely access your dynamic ledger.' : 'Start tracking expenses properly today.'}
        </p>

        {errorMsg && (
          <div style={{ 
            background: 'rgba(255, 71, 87, 0.1)', 
            border: '1px solid var(--danger)', 
            color: 'var(--danger)', 
            padding: '0.75rem', 
            borderRadius: '8px', 
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

        <form onSubmit={isLogin ? handleLogin : handleRegister} style={{ textAlign: 'left' }}>
          {!isLogin && (
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          {!isLogin && (
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="john@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label>{isLogin ? 'Username or Email' : 'Unique Username'}</label>
            <input 
              type="text" 
              placeholder={isLogin ? "john123" : "john123"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} disabled={loading}>
            {loading ? 'Processing...' : isLogin ? <><LogIn size={18} /> Sign In</> : <><UserPlus size={18} /> Register Securely</>}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg('');
            }}
            style={{ color: 'var(--accent-secondary)', cursor: 'pointer', fontWeight: 500 }}
          >
            {isLogin ? 'Register Here.' : 'Log in instead.'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;
