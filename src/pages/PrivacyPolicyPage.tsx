import React from 'react';
import { useApp } from '../context/AppContext';
import type { Language } from '../i18n/translations';
import './PrivacyPolicyPage.css';

const sections = [
  {
    title: 'Information We Collect',
    body: "We may collect information submitted as part of your campaign participation, including personal details, employee information, photographs, videos, written responses and other information voluntarily provided through the campaign forms.",
  },
  {
    title: 'How We Use Your Information',
    body: "Information submitted through the campaign may be used to manage participation, verify entries, review submissions, communicate campaign-related updates, shortlist entries and support campaign administration.",
  },
  {
    title: 'Photos, Videos & Submitted Content',
    body: "Photos, videos and other content submitted for the campaign may be reviewed by authorized campaign administrators and used in accordance with the applicable campaign terms, media rights conditions and internal communication requirements.",
  },
  {
    title: 'Data Protection & Security',
    body: "Reasonable administrative and technical measures should be used to protect submitted information against unauthorized access, loss, misuse or disclosure while it is being handled for campaign purposes.",
  },
  {
    title: 'Information Sharing',
    body: "Campaign information should only be shared with authorized teams, service providers or stakeholders where required for legitimate campaign operations, evaluation, communication or compliance purposes.",
  },
  {
    title: 'Your Consent',
    body: "By submitting information through the Kando From Home campaign, participants acknowledge the applicable campaign guidelines, privacy requirements and media rights conditions associated with their submission.",
  },
];

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
            <span className="pp-eyebrow">Yamaha Day 2026 • Kando From Home</span>
            <h1>Privacy Policy</h1>
            <p>
              Your privacy matters to us. Please review how information related to your
              Kando From Home participation is collected, used and protected.
            </p>
          </div>
        </section>

        <section className="pp-privacy-card">
          {sections.map((section, index) => (
            <article className="pp-privacy-block" key={section.title}>
              <div className="pp-number">{String(index + 1).padStart(2, '0')}</div>
              <div className="pp-privacy-content">
                <h2>{section.title}</h2>
                <p>{section.body}</p>
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
