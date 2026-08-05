import React from 'react';
import { useApp } from '../context/AppContext';
import type { Language } from '../i18n/translations';
import { Globe } from 'lucide-react';

export const Header: React.FC = () => {
  const { language, setLanguage, currentView, navigateTo } = useApp();

  if (currentView === 'landing' || currentView === 'admin-dashboard') {
    return null;
  }

  const isAdminView = currentView === 'admin-login';

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        {/* Brand Left */}
        {isAdminView ? (
          <div
            onClick={() => navigateTo('admin-dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#E60012',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(230, 0, 18, 0.5)',
                flexShrink: 0
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" fill="none"/>
                  <path d="M12 4L12 20M4 12L20 12M6.34 6.34L17.66 17.66M17.66 6.34L6.34 17.66" stroke="white" strokeWidth="1.2"/>
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '1px', color: 'var(--text-main)', lineHeight: 1 }}>YAMAHA</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Revs Your Heart</div>
              </div>
            </div>

            <div className="header-divider" style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.2)' }} />

            <div className="header-subtitle" style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.65rem', color: '#00E5FF', fontWeight: 700, letterSpacing: '1px' }}>YAMAHA DAY 2026</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                ADMIN PORTAL
              </span>
            </div>
          </div>
        ) : (
          <div
            onClick={() => navigateTo('home')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <img src="/yamaha_logo.png" alt="Yamaha" className="site-logo" style={{ height: '34px', width: 'auto', flexShrink: 0 }} />

            <div className="header-divider" style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.2)' }} />

            <div className="header-subtitle" style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.65rem', color: '#D1B07B', fontWeight: 700, letterSpacing: '1px' }}>YAMAHA DAY 2026</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                KANDO FROM HOME
              </span>
            </div>
          </div>
        )}

        {/* Navigation Right — HIDE LANGUAGE SELECTOR ON ADMIN DASHBOARD (Req 5) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!isAdminView && (
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '6px 12px',
              borderRadius: '24px',
              border: '1px solid rgba(209, 176, 123, 0.35)'
            }}>
              <Globe size={14} color="#D1B07B" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-main)',
                  fontSize: '0.82rem',
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
          )}
        </div>
      </div>
    </header>
  );
};
