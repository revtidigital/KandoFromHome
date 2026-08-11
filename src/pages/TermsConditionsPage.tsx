import React from 'react';
import { useApp } from '../context/AppContext';
import type { Language } from '../i18n/translations';
import './TermsConditionsPage.css';

const sections = [
  { titleKey: 'termsSec1Title', bodyKey: 'termsSec1Body' },
  { titleKey: 'termsSec2Title', bodyKey: 'termsSec2Body' },
  { titleKey: 'termsSec3Title', bodyKey: 'termsSec3Body' },
  { titleKey: 'termsSec4Title', bodyKey: 'termsSec4Body' },
] as const;

export const TermsConditionsPage: React.FC = () => {
  const { t, language, setLanguage, navigateTo } = useApp();

  return (
    <div className="terms-page">
      <header className="tp-topbar">
        <div className="tp-topbar-inner">
          <a
            href="#"
            className="tp-brand"
            aria-label="Yamaha Home"
            onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
          >
            <img
              src="/yamaha-logo-v2.png"
              alt="Yamaha Revs Your Heart"
              className="tp-logo"
              onError={(e) => { (e.target as HTMLImageElement).src = '/yamaha_logo.png'; }}
            />
          </a>

          <div className="tp-campaign-title">KANDO FROM HOME</div>

          <div className="tp-header-actions">
            <button
              type="button"
              className="tp-home-link"
              aria-label="Home"
              onClick={() => navigateTo('home')}
            >
              <span className="tp-home-icon">⌂</span>
              <span>{t.home || 'Home'}</span>
            </button>

            <div className="tp-divider" />

            <select
              className="tp-language-select"
              aria-label="Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="ta">தமிழ்</option>
            </select>
          </div>
        </div>
      </header>

      <main className="tp-page">
        <section className="tp-hero-intro">
          <div className="tp-icon-wrap">
            <svg viewBox="0 0 80 80" aria-hidden="true">
              <circle cx="40" cy="40" r="36" fill="#ffffff" stroke="#cfdcf2" strokeWidth="1.5" />
              <path d="M27 20h20l9 9v31H27z" fill="none" stroke="#0b4699" strokeWidth="3" strokeLinejoin="round" />
              <path d="M47 20v10h10" fill="none" stroke="#0b4699" strokeWidth="3" strokeLinejoin="round" />
              <path d="M33 38h16M33 45h16M33 52h10" stroke="#0b4699" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>

          <div className="tp-hero-copy">
            <span className="tp-eyebrow">Yamaha Day 2026 • Kando From Home</span>
            <h1>{t.termsConditionsTitle}</h1>
            <p>{t.termsSubtitle}</p>
          </div>
        </section>

        <section className="tp-terms-card">
          {sections.map((section, index) => (
            <article className="tp-term-block" key={section.titleKey}>
              <div className="tp-number">{String(index + 1).padStart(2, '0')}</div>
              <div className="tp-term-content">
                <h2>{t[section.titleKey].replace(/^\d+\.\s*/, '')}</h2>
                <p>{t[section.bodyKey]}</p>
              </div>
            </article>
          ))}
        </section>

        <div className="tp-bottom-note">
          <span className="tp-line" />
          <span className="tp-mini-heart">♥</span>
          <span className="tp-line" />
        </div>
      </main>
    </div>
  );
};
