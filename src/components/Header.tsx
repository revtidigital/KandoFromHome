import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Language } from '../i18n/translations';
import { Globe, Sun, Moon, ChevronDown } from 'lucide-react';

const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी (Hindi)' },
  { value: 'ta', label: 'தமிழ் (Tamil)' },
];

export const Header: React.FC = () => {
  const { language, setLanguage, currentView, navigateTo, publicTheme, setPublicTheme } = useApp();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!langMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [langMenuOpen]);

  const activeLanguageLabel = LANGUAGE_OPTIONS.find(opt => opt.value === language)?.label || 'English';

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
              <span style={{ fontSize: '0.65rem', color: '#00E5FF', fontWeight: 700, letterSpacing: '1px' }}>71ST YAMAHA DAY 2026</span>
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
            <div style={{ width: '40px', height: '22px', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              <img src="/yamaha_logo.png" alt="Yamaha" className="site-logo" style={{ height: '100%', width: '100%', objectFit: 'contain' }} />
            </div>

            <div className="header-divider" style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.2)' }} />

            <div className="header-subtitle" style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.65rem', color: '#D1B07B', fontWeight: 700, letterSpacing: '1px' }}>71ST YAMAHA DAY 2026</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                KANDO FROM HOME
              </span>
            </div>
          </div>
        )}

        {/* Navigation Right — HIDE LANGUAGE SELECTOR ON ADMIN DASHBOARD (Req 5) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!isAdminView && (
            <div ref={langMenuRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setLangMenuOpen(open => !open)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '6px 12px',
                  borderRadius: '24px',
                  border: '1px solid rgba(209, 176, 123, 0.35)',
                  color: 'var(--text-main)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Globe size={14} color="#D1B07B" />
                <span>{activeLanguageLabel}</span>
                <ChevronDown size={14} color="#D1B07B" />
              </button>

              {langMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  minWidth: '160px',
                  background: '#06133B',
                  border: '1px solid rgba(209, 176, 123, 0.35)',
                  borderRadius: '14px',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
                  overflow: 'hidden',
                  zIndex: 50
                }}>
                  {LANGUAGE_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setLanguage(opt.value); setLangMenuOpen(false); }}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 14px',
                        background: opt.value === language ? 'rgba(209, 176, 123, 0.18)' : 'transparent',
                        border: 'none',
                        color: 'white',
                        fontSize: '0.82rem',
                        fontWeight: opt.value === language ? 700 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Light/dark theme switcher — every public page except Landing */}
          <button
            onClick={() => setPublicTheme(publicTheme === 'dark' ? 'light' : 'dark')}
            title={publicTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            style={{
              width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
              background: 'rgba(209, 176, 123, 0.12)', border: '1px solid rgba(209, 176, 123, 0.35)',
              color: '#D1B07B', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
          >
            {publicTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
};
