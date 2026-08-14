import React from 'react';
import { useApp } from '../context/AppContext';
import type { Language } from '../i18n/translations';
import './PrivacyPolicyPage.css';

const sections = [
  { titleKey: 'privacySec1Title', bodyKey: 'privacySec1Body' },
  { titleKey: 'privacySec2Title', bodyKey: 'privacySec2Body' },
  { titleKey: 'privacySec3Title', bodyKey: 'privacySec3Body' },
  { titleKey: 'privacySec4Title', bodyKey: 'privacySec4Body' },
  { titleKey: 'privacySec5Title', bodyKey: 'privacySec5Body' },
] as const;

export const PrivacyPolicyPage: React.FC = () => {
  const { t, language, setLanguage, navigateTo } = useApp();

  return (
    <div className="privacy-page">
      <header className="pp-site-header">
        <a
          className="pp-yamaha-logo"
          href="#"
          onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
          aria-label="Yamaha home"
        >
          <img
            className="pp-yamaha-logo-img"
            src="/slgn_flat_red_rgb.svg"
            alt="Yamaha — Revs Your Heart"
            onError={(e) => { (e.target as HTMLImageElement).src = '/yamaha-logo-v2.png'; }}
          />
        </a>

        <div className="pp-campaign-title">{t.kandoFromHome}</div>

        <nav className="pp-header-actions" aria-label="Primary navigation">
          <a
            className="pp-home-link"
            href="#"
            onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m3.5 10.5 8.5-7 8.5 7" />
              <path d="M5.5 9.2V21h13V9.2M9.5 21v-6h5v6" />
            </svg>
            <span>{t.home}</span>
          </a>

          <span className="pp-header-divider" aria-hidden="true"></span>

          <label className="pp-language-picker">
            <span className="sr-only">Choose language</span>
            <select
              aria-label="Choose language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="ta">தமிழ்</option>
            </select>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="m3 6 5 5 5-5" />
            </svg>
          </label>
        </nav>
      </header>

      <main className="pp-page">
        <section className="pp-hero-intro">
          <div className="pp-icon-wrap">
            <svg className="pp-privacy-icon" viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="44" fill="#ffffff" stroke="#d3dff1" strokeWidth="1.5" />
              <path
                d="M50 22 C59 29 67 31 75 31 V49 C75 65 65 76 50 83 C35 76 25 65 25 49 V31 C33 31 41 29 50 22Z"
                fill="#0b4699"
              />
              <rect x="40" y="47" width="20" height="17" rx="2.5" fill="none" stroke="#ffffff" strokeWidth="3" />
              <path
                d="M44 47v-5 a6 6 0 0 1 12 0v5"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="pp-hero-copy">
            <span className="pp-eyebrow">71st Yamaha Day 2026 • Kando From Home</span>
            <h1>{t.privacyPolicyTitle}</h1>
          </div>
        </section>

        <section className="pp-privacy-card">
          {sections.map((section, index) => (
            <article className="pp-privacy-block" key={section.titleKey}>
              <div className="pp-number">{String(index + 1).padStart(2, '0')}</div>
              <div className="pp-privacy-content">
                <h2>{t[section.titleKey].replace(/^\d+\.\s*/, '')}</h2>
                <p>{t[section.bodyKey]}</p>
              </div>
            </article>
          ))}
        </section>

        <div className="pp-bottom-note">
          <span className="pp-line" />
          <span className="pp-mini-heart">♥</span>
          <span className="pp-line" />
        </div>
      </main>
    </div>
  );
};
