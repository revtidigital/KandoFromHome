import React from 'react';
import { useApp } from '../context/AppContext';
import type { Language } from '../i18n/translations';
import { ChevronRight } from 'lucide-react';

/* ── OFFICIAL YAMAHA TUNING FORK EMBLEM — 3 interlocked forks at 120° ── */
const YamahaEmblem: React.FC<{ size?: number }> = ({ size = 46 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="47" stroke="white" strokeWidth="2.5" fill="none"/>
    <g transform="rotate(0 50 50)">
      <ellipse cx="43.5" cy="22" rx="5" ry="13" fill="white"/>
      <ellipse cx="56.5" cy="22" rx="5" ry="13" fill="white"/>
      <rect x="47" y="28" width="6" height="22" rx="3" fill="white"/>
    </g>
    <g transform="rotate(120 50 50)">
      <ellipse cx="43.5" cy="22" rx="5" ry="13" fill="white"/>
      <ellipse cx="56.5" cy="22" rx="5" ry="13" fill="white"/>
      <rect x="47" y="28" width="6" height="22" rx="3" fill="white"/>
    </g>
    <g transform="rotate(240 50 50)">
      <ellipse cx="43.5" cy="22" rx="5" ry="13" fill="white"/>
      <ellipse cx="56.5" cy="22" rx="5" ry="13" fill="white"/>
      <rect x="47" y="28" width="6" height="22" rx="3" fill="white"/>
    </g>
    <circle cx="50" cy="50" r="10" fill="#020924"/>
    <circle cx="50" cy="50" r="4" fill="white"/>
  </svg>
);

/* ── VECTOR LANDMARK LINE ART ICONS ── */
const LondonIcon: React.FC = () => (
  <svg width="76" height="52" viewBox="0 0 100 65" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="68" cy="30" r="18" strokeWidth="1.5" />
    <circle cx="68" cy="30" r="2" fill="white" />
    <line x1="68" y1="30" x2="68" y2="12" strokeWidth="1" />
    <line x1="68" y1="30" x2="68" y2="48" strokeWidth="1" />
    <line x1="68" y1="30" x2="50" y2="30" strokeWidth="1" />
    <line x1="68" y1="30" x2="86" y2="30" strokeWidth="1" />
    <line x1="68" y1="30" x2="55" y2="17" strokeWidth="1" />
    <line x1="68" y1="30" x2="81" y2="43" strokeWidth="1" />
    <line x1="68" y1="30" x2="55" y2="43" strokeWidth="1" />
    <line x1="68" y1="30" x2="81" y2="17" strokeWidth="1" />
    <line x1="60" y1="48" x2="68" y2="30" strokeWidth="1.5" />
    <line x1="76" y1="48" x2="68" y2="30" strokeWidth="1.5" />
    
    <rect x="22" y="18" width="14" height="38" />
    <polygon points="22,18 29,6 36,18" fill="rgba(255,255,255,0.15)" />
    <line x1="29" y1="6" x2="29" y2="2" strokeWidth="2" />
    <circle cx="29" cy="26" r="3.5" strokeWidth="1.2" />
    
    <rect x="6" y="32" width="16" height="24" />
    <polygon points="6,32 14,24 22,32" />
    <rect x="36" y="34" width="14" height="22" />
    <line x1="2" y1="56" x2="98" y2="56" strokeWidth="2" />
  </svg>
);

const IndiaGateIcon: React.FC = () => (
  <svg width="64" height="52" viewBox="0 0 80 65" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="18" y="10" width="44" height="6" rx="1" fill="rgba(255,255,255,0.15)" />
    <rect x="14" y="16" width="52" height="7" rx="1" />
    <line x1="22" y1="10" x2="22" y2="6" />
    <line x1="58" y1="10" x2="58" y2="6" />
    <line x1="40" y1="10" x2="40" y2="4" strokeWidth="2" />

    <rect x="18" y="23" width="14" height="33" />
    <rect x="48" y="23" width="14" height="33" />

    <path d="M 32 56 L 32 37 C 32 30 48 30 48 37 L 48 56" strokeWidth="2" fill="rgba(0,0,0,0.3)" />
    <path d="M 35 56 L 35 39 C 35 34 45 34 45 39 L 45 56" strokeWidth="1" />

    <line x1="18" y1="30" x2="32" y2="30" strokeWidth="1" />
    <line x1="48" y1="30" x2="62" y2="30" strokeWidth="1" />
    <line x1="18" y1="42" x2="32" y2="42" strokeWidth="1" />
    <line x1="48" y1="42" x2="62" y2="42" strokeWidth="1" />
    
    <rect x="10" y="56" width="60" height="4" rx="1" fill="white" />
    <line x1="2" y1="60" x2="78" y2="60" strokeWidth="2" />
  </svg>
);

const GopuramIcon: React.FC = () => (
  <svg width="64" height="52" viewBox="0 0 80 65" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="40" y1="4" x2="40" y2="8" strokeWidth="2" />
    <line x1="32" y1="6" x2="32" y2="9" strokeWidth="1.5" />
    <line x1="48" y1="6" x2="48" y2="9" strokeWidth="1.5" />

    <polygon points="30,9 50,9 53,16 27,16" fill="rgba(255,255,255,0.12)" />
    <polygon points="26,16 54,16 57,24 23,24" />
    <polygon points="22,24 58,24 61,33 19,33" />
    <polygon points="18,33 62,33 65,43 15,43" />
    
    <rect x="14" y="43" width="52" height="13" />
    <path d="M 33 56 L 33 46 C 33 42 47 42 47 46 L 47 56" strokeWidth="2" fill="rgba(0,0,0,0.4)" />

    <line x1="36" y1="20" x2="44" y2="20" strokeWidth="1" />
    <line x1="34" y1="28" x2="46" y2="28" strokeWidth="1" />
    <line x1="30" y1="38" x2="50" y2="38" strokeWidth="1" />

    <line x1="4" y1="56" x2="76" y2="56" strokeWidth="2" />
  </svg>
);

export const LandingPage: React.FC = () => {
  const { setLanguage, navigateTo } = useApp();

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    navigateTo('home');
  };

  return (
    <div className="landing-wrapper">
      
      {/* ── BACKGROUND LAYER: FAMILY PHOTO ON RIGHT ── */}
      <div className="landing-bg-image">
        <img 
          src="/clean_right_family.png" 
          alt="Yamaha Family DIY Craft Wall"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: '20% center'
          }}
        />
        {/* SEAMLESS GRADIENT OVERLAY BLENDING IMAGE WITH DEEP BLUE BACKGROUND */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, #020924 0%, rgba(2,9,36,0.85) 18%, rgba(2,9,36,0.3) 40%, transparent 70%)'
        }} />
      </div>

      {/* ── BACKGROUND GLOW ON LEFT ── */}
      <div className="landing-bg-glow" />

      {/* ── FOREGROUND CONTENT CONTAINER ── */}
      <div className="landing-container">

        {/* HEADER */}
        <header className="landing-header">
          
          {/* YAMAHA BRAND LOGO */}
          <div onClick={() => handleSelectLanguage('en')} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <YamahaEmblem size={42} />
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '1.2px', color: 'white', lineHeight: 1 }}>YAMAHA</div>
              <div style={{ fontSize: '0.75rem', color: '#CBD5E1', fontStyle: 'italic', fontFamily: 'Caveat, cursive', marginTop: '1px' }}>Revs Your Heart</div>
            </div>
          </div>

          {/* TOP RIGHT MICROSITE LOGO */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{ textAlign: 'right', lineHeight: 1.1 }}>
              <div style={{ fontSize: '0.62rem', color: 'white', fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase' }}>
                YAMAHA DAY 2026
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', letterSpacing: '1.2px', lineHeight: 1 }}>
                KANDO
              </div>
              <div style={{
                fontSize: '0.62rem', color: 'white', fontWeight: 700, letterSpacing: '1.2px',
                textTransform: 'uppercase', borderTop: '1px solid rgba(255,255,255,0.4)',
                paddingTop: '2px', marginTop: '2px'
              }}>
                FROM HOME
              </div>
            </div>
            <div style={{ paddingTop: '2px' }}>
              <svg width="30" height="34" viewBox="0 0 32 36" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="2,14 16,2 30,14" />
                <rect x="5" y="14" width="22" height="18" rx="1" />
                <rect x="12" y="22" width="8" height="10" rx="1" />
                <path d="M16 19 C16 19 13 16.5 13 15 C13 13.5 14.2 13 15.2 13.8 L16 14.5 L16.8 13.8 C17.8 13 19 13.5 19 15 C19 16.5 16 19 16 19Z" fill="white" stroke="none"/>
              </svg>
            </div>
          </div>
        </header>

        {/* MAIN BODY AREA — FULL LEFT HALF (52% WIDTH, MAX 720PX) */}
        <main className="landing-main">
          
          <div className="landing-content-col">
            
            {/* HEADLINE */}
            <div style={{ width: '100%', textAlign: 'center' }}>
              <h1 className="landing-title-main">
                Create Your
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '0px' }}>
                <span className="landing-title-script">
                  Kando Moment
                </span>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2.2"
                  strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: 'rotate(10deg)', marginTop: '4px', flexShrink: 0 }}>
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
                <div style={{
                  width: '220px', height: '3px',
                  background: 'linear-gradient(90deg, rgba(255,215,0,0.1) 0%, #FFD700 40%, rgba(255,215,0,0.1) 100%)',
                  borderRadius: '2px'
                }} />
              </div>
            </div>

            {/* SUBTITLE DESCRIPTION */}
            <div>
              <p className="landing-subtitle">
                A feeling of joy, pride and togetherness.<br />
                This Yamaha Day, create a special moment with your family<br />
                and share it with Yamaha.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '6px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
            </div>

            {/* CHOOSE YOUR LANGUAGE + 3 CARDS */}
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.25)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '2px', color: '#FFFFFF', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  CHOOSE YOUR LANGUAGE
                </span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.25)' }} />
              </div>

              {/* 3 LANGUAGE CARDS */}
              <div className="landing-lang-grid">
                {[
                  {
                    lang: 'en' as Language,
                    border: '#00C6FF', bg: 'linear-gradient(180deg, #091D58 0%, #041038 100%)',
                    shadow: 'rgba(0,198,255,0.35)', btnBg: 'rgba(0,198,255,0.18)',
                    iconComponent: <LondonIcon />,
                    label: 'ENGLISH', labelFont: undefined,
                    btnLabel: 'ENTER SITE', btnFont: undefined
                  },
                  {
                    lang: 'hi' as Language,
                    border: '#00E5FF', bg: 'linear-gradient(180deg, #004D5A 0%, #012B33 100%)',
                    shadow: 'rgba(0,229,255,0.35)', btnBg: 'rgba(0,229,255,0.18)',
                    iconComponent: <IndiaGateIcon />,
                    label: 'हिंदी', labelFont: 'Noto Sans Devanagari, sans-serif',
                    btnLabel: 'साइट में प्रवेश करें', btnFont: 'Noto Sans Devanagari, sans-serif'
                  },
                  {
                    lang: 'ta' as Language,
                    border: '#A855F7', bg: 'linear-gradient(180deg, #351259 0%, #1A0633 100%)',
                    shadow: 'rgba(168,85,247,0.35)', btnBg: 'rgba(168,85,247,0.18)',
                    iconComponent: <GopuramIcon />,
                    label: 'தமிழ்', labelFont: 'Noto Sans Tamil, sans-serif',
                    btnLabel: 'தளத்திற்குள் செல்லவும்', btnFont: 'Noto Sans Tamil, sans-serif'
                  }
                ].map((card) => (
                  <div
                    key={card.lang}
                    onClick={() => handleSelectLanguage(card.lang)}
                    className="glow-card landing-lang-card"
                    style={{
                      background: card.bg,
                      border: `1.5px solid ${card.border}`,
                      borderRadius: '16px',
                      padding: '14px 10px 12px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      justifyContent: 'space-between',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                      boxShadow: `0 8px 24px ${card.shadow}`
                    }}
                  >
                    {/* VECTOR ICON */}
                    <div style={{ height: '52px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {card.iconComponent}
                    </div>

                    {/* TITLE */}
                    <span style={{
                      fontSize: card.labelFont ? '1.18rem' : '1.1rem',
                      fontWeight: 800,
                      color: 'white',
                      fontFamily: card.labelFont,
                      lineHeight: 1
                    }}>
                      {card.label}
                    </span>

                    {/* BUTTON */}
                    <button style={{
                      width: '100%', padding: '7px 8px', borderRadius: '30px',
                      background: card.btnBg, border: `1px solid ${card.border}`,
                      color: 'white', fontSize: '0.75rem', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                      cursor: 'pointer', boxShadow: `0 0 12px ${card.shadow}`,
                      fontFamily: card.btnFont, flexShrink: 0
                    }}>
                      <span>{card.btnLabel}</span>
                      <ChevronRight size={12} color={card.border} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* CURSIVE SLOGAN BELOW CARDS */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', marginTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="24" height="18" viewBox="0 0 32 24" fill="none" stroke="#FFD700" strokeWidth="2">
                  <circle cx="16" cy="6" r="4" /><path d="M10 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                  <circle cx="7" cy="8" r="3" /><path d="M2 20c0-2.8 2.2-5 5-5" />
                  <circle cx="25" cy="8" r="3" /><path d="M25 15c2.8 0 5 2.2 5 5" />
                </svg>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <p className="landing-slogan">
                Behind every Yamaha action<br />is a family that inspires it.
              </p>
            </div>

          </div>

        </main>

        {/* FOOTER COPYRIGHT */}
        <footer style={{ width: '100%', textAlign: 'center', flexShrink: 0, paddingBottom: '4px' }}>
          <p style={{ fontSize: '0.72rem', color: '#64748B', margin: 0 }}>
            © 2026 Yamaha Motor India Group. All Rights Reserved.
          </p>
        </footer>

      </div>

    </div>
  );
};
