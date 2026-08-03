import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, ShieldCheck, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, t } = useApp();

  return (
    <footer style={{
      background: '#010617',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '40px 0 24px 0',
      marginTop: '80px',
      color: '#A0B2D6'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '20px'
        }}>
          {/* Heart Icon Quote */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              color: '#D1B07B'
            }}>
              <Heart size={18} fill="#D1B07B" />
              <div style={{ width: '40px', height: '1px', background: 'rgba(209, 176, 123, 0.4)' }} />
              <Heart size={18} fill="#D1B07B" />
            </div>
            <p style={{
              fontFamily: 'Caveat, cursive',
              fontSize: '1.6rem',
              color: '#FFFFFF',
              fontStyle: 'italic'
            }}>
              "{t.footerQuote}"
            </p>
          </div>

          {/* Links — Admin Portal Option Removed as requested */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            fontSize: '0.9rem',
            margin: '10px 0'
          }}>
            <button 
              onClick={() => navigateTo('home')} 
              style={{ background: 'none', border: 'none', color: '#A0B2D6', cursor: 'pointer' }}
            >
              {t.home}
            </button>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
            <button 
              onClick={() => navigateTo('privacy')} 
              style={{ background: 'none', border: 'none', color: '#A0B2D6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <ShieldCheck size={14} />
              {t.privacy}
            </button>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
            <button 
              onClick={() => navigateTo('terms')} 
              style={{ background: 'none', border: 'none', color: '#A0B2D6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <FileText size={14} />
              {t.terms}
            </button>
          </div>

          <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.06)' }} />

          {/* Copyright */}
          <p style={{ fontSize: '0.8rem', color: 'rgba(160, 178, 214, 0.6)' }}>
            {t.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};
