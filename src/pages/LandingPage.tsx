import React from 'react';
import { useApp } from '../context/AppContext';
import type { Language } from '../i18n/translations';
import { ChevronRight } from 'lucide-react';

/* ── OFFICIAL YAMAHA TUNING FORK EMBLEM — 3 interlocked forks at 120° ── */
const YamahaEmblem: React.FC<{ size?: number }> = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* Outer border circle */}
    <circle cx="50" cy="50" r="47" stroke="white" strokeWidth="2.5" fill="none"/>

    {/* ── FORK 1 — pointing UP (0°) ── */}
    <g transform="rotate(0 50 50)">
      {/* Left prong */}
      <ellipse cx="43.5" cy="22" rx="5" ry="13" fill="white"/>
      {/* Right prong */}
      <ellipse cx="56.5" cy="22" rx="5" ry="13" fill="white"/>
      {/* Stem connecting prongs to center */}
      <rect x="47" y="28" width="6" height="22" rx="3" fill="white"/>
    </g>

    {/* ── FORK 2 — pointing BOTTOM-RIGHT (120°) ── */}
    <g transform="rotate(120 50 50)">
      <ellipse cx="43.5" cy="22" rx="5" ry="13" fill="white"/>
      <ellipse cx="56.5" cy="22" rx="5" ry="13" fill="white"/>
      <rect x="47" y="28" width="6" height="22" rx="3" fill="white"/>
    </g>

    {/* ── FORK 3 — pointing BOTTOM-LEFT (240°) ── */}
    <g transform="rotate(240 50 50)">
      <ellipse cx="43.5" cy="22" rx="5" ry="13" fill="white"/>
      <ellipse cx="56.5" cy="22" rx="5" ry="13" fill="white"/>
      <rect x="47" y="28" width="6" height="22" rx="3" fill="white"/>
    </g>

    {/* Center hole — hides overlapping stems to create interlocked look */}
    <circle cx="50" cy="50" r="10" fill="#020924"/>
    {/* Small white center dot */}
    <circle cx="50" cy="50" r="4" fill="white"/>
  </svg>
);

export const LandingPage: React.FC = () => {
  const { setLanguage, navigateTo } = useApp();

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    navigateTo('home');
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      background: '#020924',
      color: 'white',
      fontFamily: 'Outfit, sans-serif',
      position: 'relative'
    }}>
      
      {/* ── BLUE RADIAL GLOW BEHIND HEADLINE ── */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '5%',
        width: '550px',
        height: '550px',
        background: 'radial-gradient(circle, rgba(0, 120, 255, 0.4) 0%, rgba(0, 70, 200, 0.12) 55%, transparent 75%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* ── RIGHT SIDE FAMILY PHOTO ── */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '51vw',
        height: '100vh',
        zIndex: 1,
        overflow: 'hidden'
      }}>
        <img 
          src="/clean_right_family.png" 
          alt="Yamaha Family DIY Craft Wall"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '15% center' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, #020924 0%, rgba(2,9,36,0.28) 10%, transparent 28%)'
        }} />
      </div>

      {/* ── MAIN VIEWPORT ── */}
      <div style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px 36px 18px 36px',
        boxSizing: 'border-box',
        zIndex: 5
      }}>

        {/* TOP HEADER */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
          
          {/* YAMAHA LOGO — proper tuning fork emblem + text */}
          <div onClick={() => handleSelectLanguage('en')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <YamahaEmblem size={44} />
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '1px', color: 'white', lineHeight: 1 }}>YAMAHA</div>
              <div style={{ fontSize: '0.72rem', color: '#CBD5E1', fontStyle: 'italic', fontFamily: 'Caveat, cursive', marginTop: '1px' }}>Revs Your Heart</div>
            </div>
          </div>

          {/* TOP RIGHT — YAMAHA DAY 2026 KANDO FROM HOME (matching 2nd picture clearly) */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            {/* Text block */}
            <div style={{ textAlign: 'right', lineHeight: 1.15 }}>
              <div style={{ fontSize: '0.6rem', color: 'white', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                YAMAHA DAY 2026
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', letterSpacing: '1px', lineHeight: 1 }}>
                KANDO
              </div>
              <div style={{
                fontSize: '0.6rem', color: 'white', fontWeight: 700, letterSpacing: '1px',
                textTransform: 'uppercase', borderTop: '1px solid rgba(255,255,255,0.5)',
                paddingTop: '2px', marginTop: '2px'
              }}>
                FROM HOME
              </div>
            </div>
            {/* House + Heart Icon */}
            <div style={{ paddingTop: '2px' }}>
              <svg width="32" height="36" viewBox="0 0 32 36" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {/* House roof */}
                <polyline points="2,14 16,2 30,14" />
                {/* House body */}
                <rect x="5" y="14" width="22" height="18" rx="1" />
                {/* Door */}
                <rect x="12" y="22" width="8" height="10" rx="1" />
                {/* Heart inside house */}
                <path d="M16 19 C16 19 13 16.5 13 15 C13 13.5 14.2 13 15.2 13.8 L16 14.5 L16.8 13.8 C17.8 13 19 13.5 19 15 C19 16.5 16 19 16 19Z" fill="white" stroke="none"/>
              </svg>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main style={{
          display: 'grid',
          gridTemplateColumns: '49% 51%',
          alignItems: 'center',
          zIndex: 10,
          flex: 1,
          margin: '0'
        }}>
          {/* LEFT COLUMN — CENTER ALIGNED */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '14px',
            paddingRight: '16px'
          }}>
            
            {/* HEADLINE */}
            <div style={{ width: '100%', textAlign: 'center' }}>
              <h1 style={{
                fontSize: '2.55rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif',
                color: 'white', lineHeight: 1.05, margin: 0
              }}>
                Create Your
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '2px' }}>
                <span style={{
                  fontFamily: 'Caveat, cursive', fontSize: '4.8rem', color: '#FFFFFF',
                  fontWeight: 700, lineHeight: 0.9,
                  textShadow: '0 0 30px rgba(0,200,255,0.8), 0 0 8px rgba(255,255,255,0.9)'
                }}>
                  Kando Moment
                </span>
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2.2"
                  strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: 'rotate(10deg)', marginTop: '6px', flexShrink: 0 }}>
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
                <div style={{
                  width: '240px', height: '3px',
                  background: 'linear-gradient(90deg, rgba(255,215,0,0.1) 0%, #FFD700 40%, rgba(255,215,0,0.1) 100%)',
                  borderRadius: '2px'
                }} />
              </div>
            </div>

            {/* SUBTITLE */}
            <div>
              <p style={{ fontSize: '1rem', color: '#E2E8F0', lineHeight: 1.5, fontWeight: 400, margin: 0 }}>
                A feeling of joy, pride and togetherness.<br />
                This Yamaha Day, create a special moment with your family<br />
                and share it with Yamaha.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
            </div>

            {/* CHOOSE YOUR LANGUAGE + CARDS */}
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.25)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '2px', color: '#FFFFFF', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  CHOOSE YOUR LANGUAGE
                </span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.25)' }} />
              </div>

              {/* 3 CARDS — exact fixed equal dimensions */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                
                {[
                  {
                    lang: 'en' as Language,
                    border: '#00C6FF', bg: 'linear-gradient(180deg, #091D58 0%, #041038 100%)',
                    shadow: 'rgba(0,198,255,0.3)', btnBg: 'rgba(0,198,255,0.18)',
                    icon: '/clean_london_icon.png', iconAlt: 'London',
                    label: 'ENGLISH', labelFont: undefined,
                    btnLabel: 'ENTER SITE', btnFont: undefined
                  },
                  {
                    lang: 'hi' as Language,
                    border: '#00E5FF', bg: 'linear-gradient(180deg, #004D5A 0%, #012B33 100%)',
                    shadow: 'rgba(0,229,255,0.3)', btnBg: 'rgba(0,229,255,0.18)',
                    icon: '/clean_indiagate_icon.png', iconAlt: 'India Gate',
                    label: 'हिंदी', labelFont: 'Noto Sans Devanagari, sans-serif',
                    btnLabel: 'साइट में प्रवेश करें', btnFont: 'Noto Sans Devanagari, sans-serif'
                  },
                  {
                    lang: 'ta' as Language,
                    border: '#A855F7', bg: 'linear-gradient(180deg, #351259 0%, #1A0633 100%)',
                    shadow: 'rgba(168,85,247,0.3)', btnBg: 'rgba(168,85,247,0.18)',
                    icon: '/clean_gopuram_icon.png', iconAlt: 'Gopuram',
                    label: 'தமிழ்', labelFont: 'Noto Sans Tamil, sans-serif',
                    btnLabel: 'தளத்திற்குள் செல்லவும்', btnFont: 'Noto Sans Tamil, sans-serif'
                  }
                ].map((card) => (
                  <div
                    key={card.lang}
                    onClick={() => handleSelectLanguage(card.lang)}
                    className="glow-card"
                    style={{
                      background: card.bg,
                      border: `1.5px solid ${card.border}`,
                      borderRadius: '14px',
                      padding: '14px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      justifyContent: 'space-between',
                      height: '178px',        /* Fixed equal height */
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                      boxShadow: `0 6px 20px ${card.shadow}`
                    }}
                  >
                    {/* Icon — fixed container height */}
                    <div style={{ height: '58px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <img src={card.icon} alt={card.iconAlt} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                    </div>

                    {/* Language name */}
                    <span style={{
                      fontSize: card.labelFont ? '1.15rem' : '1.05rem',
                      fontWeight: 800,
                      color: 'white',
                      fontFamily: card.labelFont,
                      lineHeight: 1
                    }}>
                      {card.label}
                    </span>

                    {/* Button */}
                    <button style={{
                      width: '100%', padding: '6px 6px', borderRadius: '30px',
                      background: card.btnBg, border: `1px solid ${card.border}`,
                      color: 'white', fontSize: '0.72rem', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px',
                      cursor: 'pointer', boxShadow: `0 0 10px ${card.shadow}`,
                      fontFamily: card.btnFont, flexShrink: 0
                    }}>
                      <span>{card.btnLabel}</span>
                      <ChevronRight size={11} color={card.border} />
                    </button>
                  </div>
                ))}

              </div>
            </div>

            {/* SLOGAN */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <svg width="26" height="20" viewBox="0 0 32 24" fill="none" stroke="#FFD700" strokeWidth="2">
                <circle cx="16" cy="6" r="4" /><path d="M10 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                <circle cx="7" cy="8" r="3" /><path d="M2 20c0-2.8 2.2-5 5-5" />
                <circle cx="25" cy="8" r="3" /><path d="M25 15c2.8 0 5 2.2 5 5" />
              </svg>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <p style={{ fontFamily: 'Caveat, cursive', fontSize: '1.45rem', color: '#FFD700', fontWeight: 600, letterSpacing: '0.5px', margin: 0, textAlign: 'center' }}>
                Behind every Yamaha action<br />is a family that inspires it.
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN SPACER */}
          <div />
        </main>

        {/* FOOTER */}
        <footer style={{ position: 'relative', zIndex: 10, textAlign: 'left' }}>
          <p style={{ fontSize: '0.7rem', color: '#64748B', margin: 0 }}>
            © 2026 Yamaha Motor India Group. All Rights Reserved.
          </p>
        </footer>

      </div>

    </div>
  );
};
