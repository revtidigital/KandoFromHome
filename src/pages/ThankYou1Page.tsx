import React from 'react';
import { useApp } from '../context/AppContext';
import type { Language } from '../i18n/translations';
import '../kando_thankyou1_ui.css';

export const ThankYou1Page: React.FC = () => {
  const { t, navigateTo, language, setLanguage } = useApp();

  return (
    <div className="kando-page-ty1">
      {/* ================= HEADER ================= */}
      <header className="ty1-site-header">
        <div className="ty1-header-inner">
          <a className="ty1-brand" href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} aria-label="Yamaha — Revs Your Heart">
            <img
              className="ty1-brand-logo-img"
              src="/yamaha-logo-v2.png"
              alt="Yamaha — Revs Your Heart"
            />
          </a>

          <h1 className="ty1-header-title">{t.kandoFromHome}</h1>

          <div className="ty1-header-utils">
            <a className="ty1-home-link" href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} aria-label="Go to home page">
              <svg className="ty1-ico-home" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3.5 10.6 12 3.7l8.5 6.9" />
                <path d="M5.6 9.3v10.6h12.8V9.3" />
                <path d="M9.2 19.9v-6h5.6v6" />
              </svg>
              <span>{t.home}</span>
            </a>

            <span className="ty1-v-sep" aria-hidden="true" />

            <select
              className="ty1-lang-select"
              aria-label="Select language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="ta">தமிழ்</option>
            </select>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="ty1-page">
        <div className="ty1-page-inner">
          <section className="ty1-hero" aria-labelledby="thank-you-title">
            {/* Badge */}
            <div className="ty1-badge-wrap" aria-hidden="true">
              <span className="ty1-spark ty1-spark-1" />
              <span className="ty1-spark ty1-spark-2 gold" />
              <span className="ty1-spark ty1-spark-3" />
              <span className="ty1-spark ty1-spark-4 gold" />
              <span className="ty1-spark ty1-spark-5" />
              <span className="ty1-spark ty1-spark-6 gold" />
              <span className="ty1-mini-dot ty1-dot-1" />
              <span className="ty1-mini-dot ty1-dot-2" />
              <span className="ty1-mini-diamond" />

              <svg className="ty1-spark-heart" viewBox="0 0 34 34">
                <path d="M17 29.2S5.4 21.8 5.4 13.8A6.5 6.5 0 0 1 17 9.9a6.5 6.5 0 0 1 11.6 3.9C28.6 21.8 17 29.2 17 29.2Z" />
              </svg>

              <div className="ty1-badge-circle">
                <svg className="ty1-badge-doc" viewBox="0 0 120 120">
                  <path className="ty1-stroke-navy" d="M31 19h43l18 18v61a6 6 0 0 1-6 6H37a6 6 0 0 1-6-6V25a6 6 0 0 1 6-6Z" />
                  <path className="ty1-stroke-navy" d="M74 19v19h18" />
                  <path className="ty1-stroke-navy" d="M45 49h33M45 61h33M45 73h27M45 85h19" />
                  <path className="ty1-fill-navy ty1-heart-cut" d="M91 112c-13-8.2-20-15-20-23a10.7 10.7 0 0 1 20-6.5A10.7 10.7 0 0 1 111 89c0 8-7 14.8-20 23Z" />
                </svg>
              </div>
            </div>

            {/* Thank-you heading */}
            <div className="ty1-thanks-row">
              <h2 className="ty1-thanks" id="thank-you-title">{t.ty1Title}</h2>
              <svg className="ty1-thanks-heart" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M24 42S7 31.2 7 19.4A9.5 9.5 0 0 1 24 13.6a9.5 9.5 0 0 1 17 5.8C41 31.2 24 42 24 42Z" />
              </svg>
            </div>

            <p className="ty1-lead">{t.ty1Lead}</p>

            {/* Polaroid Hero Image */}
            <figure className="ty1-hero-media" aria-label="Kando moment photo">
              <img
                className="ty1-polaroid"
                src="/png1.png"
                alt="Polaroid-style family Kando moment"
                onError={(e) => { (e.target as HTMLImageElement).src = '/user_vertical_card.png'; }}
              />
            </figure>

            <div className="ty1-divider" role="presentation">
              <span className="rule" />
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 20.6S3.9 15.4 3.9 9.8A4.6 4.6 0 0 1 12 7.1a4.6 4.6 0 0 1 8.1 2.7c0 5.6-8.1 10.8-8.1 10.8Z" />
              </svg>
              <span className="rule" />
            </div>

            <p className="ty1-copy">
              {t.ty1CopyLine1}<br />
              {t.ty1CopyLine2}
            </p>

            <div className="ty1-note">
              <span className="ty1-note-ico" aria-hidden="true">
                <svg viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="29" />
                  <path d="M19.5 24.5h25v17h-25z" />
                  <path d="m20.5 25.7 11.5 9 11.5-9" />
                  <path d="M25.2 21.5 32 16l6.8 5.5" />
                </svg>
              </span>
              <p>
                {t.ty1NoteText}
              </p>
            </div>

            <p className="ty1-keep">{t.ty1Keep}</p>

            <p className="ty1-together">
              <span>{t.ty1Together}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 20.8S3.7 15.4 3.7 9.7A4.7 4.7 0 0 1 12 6.9a4.7 4.7 0 0 1 8.3 2.8c0 5.7-8.3 11.1-8.3 11.1Z" />
              </svg>
            </p>
          </section>

          {/* Bottom information panel */}
          <section className="ty1-cards" aria-label="What happens next">
            <article className="ty1-card">
              <span className="ty1-card-icon ty1-card-icon-solid" aria-hidden="true">
                <svg viewBox="0 0 64 64">
                  <rect x="10" y="21" width="44" height="31" rx="5" />
                  <path d="m24 21 4-7h8l4 7" />
                  <circle cx="32" cy="36.5" r="9" />
                  <path d="M47 27h1" />
                </svg>
              </span>

              <div className="ty1-card-body">
                <h3>{t.ty1Card1Title}</h3>
                <p>{t.ty1Card1Text}</p>
              </div>
            </article>

            <span className="ty1-card-separator" aria-hidden="true" />

            <article className="ty1-card ty1-card-spread">
              <span className="ty1-card-icon ty1-people-icon" aria-hidden="true">
                <svg viewBox="0 0 76 62">
                  <circle cx="38" cy="17" r="10" />
                  <path d="M20 56c0-11 8-18 18-18s18 7 18 18" />
                  <circle cx="14" cy="25" r="7.5" />
                  <path d="M2.5 55c0-8 5-13 12-13 3 0 5.5.8 7.7 2.3" />
                  <circle cx="62" cy="25" r="7.5" />
                  <path d="M73.5 55c0-8-5-13-12-13-3 0-5.5.8-7.7 2.3" />
                </svg>
              </span>

              <div className="ty1-card-body">
                <h3>{t.ty1Card2Title}</h3>
                <p>{t.ty1Card2Text}</p>
              </div>

              <svg className="ty1-plane" viewBox="0 0 110 95" aria-hidden="true">
                <path d="M95 8 18 39l29 10 11 29Z" />
                <path d="M95 8 47 49" />
                <path className="ty1-plane-tail" d="M41 64c-8 13-20 18-35 16" />
                <circle className="ty1-plane-dot" cx="8" cy="80" r="7" />
              </svg>
            </article>
          </section>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="ty1-site-footer">
        <div className="ty1-footer-inner">
          <span className="ty1-footer-icon" aria-hidden="true">
            <svg viewBox="0 0 92 82">
              <path d="M8 34 46 6l38 28" />
              <path d="M16 31v44h60V31" />
              <path d="M46 67c-10-6.6-16-12-16-19a8.6 8.6 0 0 1 16-5.5A8.6 8.6 0 0 1 62 48c0 7-6 12.4-16 19Z" />
              <path d="M12 50h8M72 50h8M22 18l5 6M70 18l-5 6" />
            </svg>
          </span>

          <span className="ty1-footer-separator" aria-hidden="true" />

          <div className="ty1-footer-message">
            <p>
              <span>{t.footerQuote}</span>
              <svg className="ty1-footer-heart" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 20.8S3.7 15.4 3.7 9.7A4.7 4.7 0 0 1 12 6.9a4.7 4.7 0 0 1 8.3 2.8c0 5.7-8.3 11.1-8.3 11.1Z" />
              </svg>
            </p>
            <svg className="ty1-swoosh" viewBox="0 0 620 16" preserveAspectRatio="none" aria-hidden="true">
              <path d="M4 11C125 2 495 2 616 11" />
            </svg>
          </div>

          <span className="ty1-footer-separator" aria-hidden="true" />

          <div className="ty1-footer-day">
            <strong>YAMAHA DAY 2026</strong>
            <span>KANDO FROM HOME</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
