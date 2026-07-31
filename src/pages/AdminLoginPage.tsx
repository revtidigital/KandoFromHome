import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, LogIn, AlertCircle } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { setIsAdminLoggedIn, navigateTo } = useApp();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && (password === 'yamaha2026' || password === 'admin' || password === '123456')) {
      setIsAdminLoggedIn(true);
      navigateTo('admin-dashboard');
    } else {
      setError('Invalid admin credentials. Use admin / yamaha2026');
    }
  };

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '480px' }}>
      <div className="glass-panel animate-fade-in" style={{
        padding: '36px',
        border: '1px solid rgba(0, 229, 255, 0.3)',
        boxShadow: '0 0 30px rgba(0, 229, 255, 0.15)'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(0, 82, 204, 0.25)',
            border: '2px solid #00E5FF',
            color: '#00E5FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <Lock size={32} />
          </div>

          <h2 className="heading-font" style={{ fontSize: '1.8rem', color: 'white', marginBottom: '6px' }}>
            Admin Portal Login
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#A0B2D6' }}>
            Yamaha Motor India Group — Internal Dashboard
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(230, 0, 18, 0.15)',
            border: '1px solid #E60012',
            color: '#FF8888',
            padding: '12px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password (yamaha2026)"
            />
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: '#00E5FF',
            marginBottom: '24px'
          }}>
            💡 Demo credentials: <strong>admin</strong> / <strong>yamaha2026</strong>
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
          >
            <LogIn size={18} />
            <span>Secure Admin Sign In</span>
          </button>
        </form>

      </div>
    </div>
  );
};
