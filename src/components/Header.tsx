import React from 'react';
import { useApp } from '../context/AppContext';
import type { Language } from '../i18n/translations';
import { Globe } from 'lucide-react';

export const Header: React.FC = () => {
  const { language, setLanguage, currentView, navigateTo } = useApp();

  if (currentView === 'landing') {
    return null;
  }

  const isHashAdmin = typeof window !== 'undefined' && window.location.hash.includes('admin');
  const isAdminView = currentView === 'admin-dashboard' || currentView === 'admin-login' || isHashAdmin;

  return (
    <header style={{
      background: 'rgba(2, 11, 42, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '76px',
        padding: '0 24px'
      }}>
        {/* Brand Left */}
        <div 
          onClick={() => navigateTo(isAdminView ? 'admin-dashboard' : 'home')} 
          style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#E60012',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(230, 0, 18, 0.5)'
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" fill="none"/>
                <path d="M12 4L12 20M4 12L20 12M6.34 6.34L17.66 17.66M17.66 6.34L6.34 17.66" stroke="white" strokeWidth="1.2"/>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '1px', color: 'white', lineHeight: 1 }}>YAMAHA</div>
              <div style={{ fontSize: '0.65rem', color: '#A0B2D6', letterSpacing: '0.5px' }}>Revs Your Heart</div>
            </div>
          </div>

          <div style={{ width: '1px', height: '28px', background: 'rgba(255, 255, 255, 0.2)' }} />

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.7rem', color: '#00E5FF', fontWeight: 700, letterSpacing: '1px' }}>YAMAHA DAY 2026</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>
              {isAdminView ? 'ADMIN PORTAL' : 'KANDO FROM HOME'}
            </span>
          </div>
        </div>

        {/* Navigation Right — HIDE LANGUAGE SELECTOR ON ADMIN DASHBOARD (Req 5) */}
        {!isAdminView && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '8px 16px',
              borderRadius: '24px',
              border: '1px solid rgba(0, 229, 255, 0.3)'
            }}>
              <Globe size={16} color="#00E5FF" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="en" style={{ background: '#06133B', color: 'white' }}>English</option>
                <option value="hi" style={{ background: '#06133B', color: 'white' }}>हिंदी (Hindi)</option>
                <option value="ta" style={{ background: '#06133B', color: 'white' }}>தமிழ் (Tamil)</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
