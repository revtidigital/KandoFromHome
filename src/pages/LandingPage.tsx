import React from 'react';
import { useApp } from '../context/AppContext';
import type { Language } from '../i18n/translations';

/* ── VECTOR LANDMARK LINE ART ICONS ── */
export const LandingPage: React.FC = () => {
  const { navigateTo } = useApp();

  // Pass lang directly to navigateTo instead of calling setLanguage() first —
  // React state updates are async, so a separate setLanguage() call followed
  // immediately by navigateTo() reads the OLD language value (it hasn't
  // re-rendered yet), which is why picking Hindi right after English could
  // still land on #en/home showing English content.
  const handleSelectLanguage = (lang: Language) => {
    navigateTo('home', lang);
  };

  return (
    <div className="landing-wrapper">
      
      {/* ── BACKGROUND LAYER: FAMILY PHOTO ON RIGHT ── */}
      <div className="landing-bg-image">
        <img 
          src="/new_right_family.png"
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
            <img src="/yamaha_logo.png" alt="Yamaha" style={{ height: '53px', width: 'auto' }} />
          </div>

          {/* TOP RIGHT MICROSITE LOGO */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{ textAlign: 'right', lineHeight: 1.1 }}>
              <div style={{ fontSize: '0.62rem', color: 'white', fontWeight: 500, letterSpacing: '1.2px', textTransform: 'uppercase' }}>
                YAMAHA DAY 2026
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', letterSpacing: '1.2px', lineHeight: 1 }}>
                KANDO
              </div>
              <div style={{
                fontSize: '0.62rem', color: 'white', fontWeight: 500, letterSpacing: '1.2px',
                textTransform: 'uppercase', borderTop: '1px solid rgba(255,255,255,0.4)',
                paddingTop: '2px', marginTop: '2px'
              }}>
                TOGETHER
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
              <div style={{ display: 'inline-block' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '0px' }}>
                  <span className="landing-title-script">
                    Kando Moment
                  </span>
                  <svg width="46" height="44" viewBox="0 0 44 42" fill="none" stroke="#E1AA66" strokeWidth="2.3"
                    strokeLinecap="round" strokeLinejoin="round"
                    style={{ marginTop: '6px', flexShrink: 0 }}>
                    <path d="M22 34 C 16 26 6 22 6 14 C 6 8.5 10.5 5.5 14.5 6.5 C 18 7.3 20.8 10 22 12.8 C 23.2 10 26 7.3 29.5 6.5 C 34 5.5 39 8.5 38 15 C 37.2 21.5 29 26.5 22 34 Z" />
                  </svg>
                </div>
                {/* HEART + SIDE LINES DIVIDER — spans the width of "Kando Moment" */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', width: '100%' }}>
                  <div style={{ flex: 1, height: '1px', background: '#E1AA66' }} />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E1AA66" strokeWidth="2" style={{ flexShrink: 0 }}>
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  <div style={{ flex: 1, height: '1px', background: '#E1AA66' }} />
                </div>
              </div>
            </div>

            {/* SUBTITLE DESCRIPTION */}
            <div>
              <p className="landing-subtitle">
                A feeling of joy, pride and togetherness.<br />
                This Yamaha Day, create a special moment with your family<br />
                and share it with Yamaha.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
                <div style={{ flex: 1, height: '1px', background: '#E1AA66' }} />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" style={{ flexShrink: 0 }}>
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                <div style={{ flex: 1, height: '1px', background: '#E1AA66' }} />
              </div>
            </div>

            {/* 3 LANGUAGE CARDS — each with its own CHOOSE YOUR LANGUAGE label */}
            <div style={{ width: '100%' }}>
              <div className="landing-lang-grid">
                {[
                  {
                    lang: 'en' as Language,
                    border: '#00C6FF', bg: 'linear-gradient(180deg, #091D58 0%, #041038 100%)',
                    shadow: 'rgba(0,198,255,0.35)',
                    label: 'ENGLISH', labelFont: undefined,
                    chooseLabel: 'CHOOSE YOUR LANGUAGE', chooseFont: "'Kozuka Gothic Pro', 'Outfit', sans-serif"
                  },
                  {
                    lang: 'hi' as Language,
                    border: '#00E5FF', bg: 'linear-gradient(180deg, #004D5A 0%, #012B33 100%)',
                    shadow: 'rgba(0,229,255,0.35)',
                    label: 'हिंदी', labelFont: 'Noto Sans Devanagari, sans-serif',
                    chooseLabel: 'अपनी भाषा चुनें', chooseFont: "'Kozuka Gothic Pro', 'Noto Sans Devanagari', sans-serif"
                  },
                  {
                    lang: 'ta' as Language,
                    border: '#A855F7', bg: 'linear-gradient(180deg, #351259 0%, #1A0633 100%)',
                    shadow: 'rgba(168,85,247,0.35)',
                    label: 'தமிழ்', labelFont: 'Noto Sans Tamil, sans-serif',
                    chooseLabel: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்', chooseFont: "'Kozuka Gothic Pro', 'Noto Sans Tamil', sans-serif"
                  }
                ].map((card) => (
                  <div key={card.lang} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    {/* PER-LANGUAGE "CHOOSE YOUR LANGUAGE" LABEL — matches subtitle font/attributes */}
                    <div style={{ height: '48px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', width: '100%' }}>
                      <span style={{
                        fontFamily: card.chooseFont,
                        fontSize: '1.05rem',
                        fontWeight: 400,
                        color: '#E2E8F0',
                        lineHeight: 1.5,
                        textAlign: 'center'
                      }}>
                        {card.chooseLabel}
                      </span>
                    </div>

                    {/* LANGUAGE BOX — name centered */}
                    <div
                      onClick={() => handleSelectLanguage(card.lang)}
                      className="glow-card landing-lang-card"
                      style={{
                        width: '100%',
                        background: card.bg,
                        border: `1.5px solid ${card.border}`,
                        borderRadius: '16px',
                        padding: '14px 10px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        boxSizing: 'border-box',
                        cursor: 'pointer',
                        boxShadow: `0 8px 24px ${card.shadow}`
                      }}
                    >
                      <span style={{
                        fontSize: card.labelFont ? '1.6rem' : '1.5rem',
                        fontWeight: 600,
                        color: 'white',
                        fontFamily: card.labelFont,
                        lineHeight: 1
                      }}>
                        {card.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CURSIVE SLOGAN BELOW CARDS */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', marginTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/slogan_family_icon.png" alt="Family" style={{ height: '52px', width: 'auto' }} />
              </div>
              <p className="landing-slogan">
                Behind every Yamaha action<br />is a family that inspires it.
              </p>
              {/* HEART + SIDE LINES DIVIDER BELOW SLOGAN */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', width: '280px', maxWidth: '100%' }}>
                <div style={{ flex: 1, height: '1px', background: '#E1AA66' }} />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E1AA66" strokeWidth="2" style={{ flexShrink: 0 }}>
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                <div style={{ flex: 1, height: '1px', background: '#E1AA66' }} />
              </div>
            </div>

          </div>

        </main>

      </div>

    </div>
  );
};
