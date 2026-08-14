import React from 'react';
import { useApp } from '../context/AppContext';
import type { Language } from '../i18n/translations';
import '../kando_home_ui.css';

export const HomePage: React.FC = () => {
  const { t, language, setLanguage, navigateTo } = useApp();

  return (
    <div className="kando">
      {/* ============================== Header ============================== */}
      <header className="kd-header">
        <div className="kd-header-inner">
          <a className="kd-logo" href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} aria-label="Yamaha — Revs Your Heart">
            <img
              className="kd-logo-image"
              src="/slgn_flat_red_rgb.svg"
              alt="Yamaha — Revs Your Heart"
              onError={(e) => { (e.target as HTMLImageElement).src = '/yamaha-logo-v2.png'; }}
            />
          </a>

          <nav className="kd-header-actions" aria-label="Utility">
            <a className="kd-home" href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M3.5 10.3 12 3.6l8.5 6.7v9.1a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 16.8s-3.1-1.9-3.1-4.1a1.8 1.8 0 0 1 3.1-1.1 1.8 1.8 0 0 1 3.1 1.1c0 2.2-3.1 4.1-3.1 4.1Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
              {t.home || 'Home'}
            </a>

            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <select
                className="kd-lang"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                style={{
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  paddingRight: '38px',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="ta">தமிழ்</option>
              </select>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                style={{ position: 'absolute', right: '14px', pointerEvents: 'none', color: '#0a1c4d' }}
              >
                <path
                  d="m6 9.5 6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </nav>
        </div>
      </header>

      <main>
        {/* =============================== Hero ============================= */}
        <section className="kd-hero">
          {/* 1st image in left corner */}
          <img
            className="kd-hero-photo kd-hero-photo--left"
            src="/image_5.webp"
            alt="A family crafting blue and white decorations together at home"
            onError={(e) => { (e.target as HTMLImageElement).src = '/image_5.png'; }}
          />
          {/* 2nd image in right corner */}
          <img
            className="kd-hero-photo kd-hero-photo--right"
            src="/image_3.webp"
            alt="A handmade Our Kando Moment display with paper hearts, notes and fairy lights"
            onError={(e) => { (e.target as HTMLImageElement).src = '/image_3.png'; }}
          />

          <div className="kd-hero-copy">
            <h1 className="kd-title">
              {t.welcomeToYour || 'Welcome to Your'} <span className="kando-script">{t.kandoSpace || 'Kando Space'}</span>{t.heroWelcomeSuffix ? ` ${t.heroWelcomeSuffix}` : ''}
              <svg className="kd-title-heart" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 20.5s-7.5-4.6-7.5-9.7A4.3 4.3 0 0 1 12 8.2a4.3 4.3 0 0 1 7.5 2.6c0 5.1-7.5 9.7-7.5 9.7Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </h1>

            <p className="kd-subtitle">{t.kandoMoment || 'Create. Share. Inspire.'}</p>

            <svg className="kd-divider-curve" viewBox="0 0 260 14" preserveAspectRatio="none" aria-hidden="true">
              <path
                d="M0 10 Q130 -2 260 10"
                stroke="url(#kd-divider-gradient)"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              <defs>
                <linearGradient id="kd-divider-gradient" x1="0" y1="0" x2="260" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="var(--gold-light)" stopOpacity="0" />
                  <stop offset="50%" stopColor="var(--gold-light)" stopOpacity="1" />
                  <stop offset="100%" stopColor="var(--gold-light)" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            <p className="kd-hero-note">
              {t.landingSubtitle || "This 71st Yamaha Day, let's celebrate the families behind every Yamaha action."}
            </p>
          </div>

          {/* ============================== Cards =========================== */}
          <div className="kd-cards-wrap">
            <div className="kd-cards">
              {/* ---------------------------- Card 1 ---------------------------- */}
              <article className="kd-card kd-card--blue">
                <svg
                  className="kd-card-wave"
                  viewBox="0 0 600 190"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="wave-blue" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#dfe7fb" />
                      <stop offset="100%" stopColor="#b9c9f4" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 96c86 44 168-24 268 6 92 28 214-24 332-52v140H0Z"
                    fill="url(#wave-blue)"
                    opacity="0.55"
                  />
                  <path
                    d="M0 132c96 34 176-18 282 8 96 24 206-14 318-40v90H0Z"
                    fill="url(#wave-blue)"
                    opacity="0.8"
                  />
                </svg>

                <div className="kd-card-head">
                  <span className="kd-badge" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <rect
                        x="3"
                        y="4.5"
                        width="18"
                        height="15"
                        rx="2.6"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />
                      <path
                        d="M3.6 17.4 9 12.3l3.4 3.1 3-2.6 4.9 4.3"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12.2 12.6s-2.8-1.7-2.8-3.7a1.62 1.62 0 0 1 2.8-1 1.62 1.62 0 0 1 2.8 1c0 2-2.8 3.7-2.8 3.7Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <h2 className="kd-card-title">{t.form1Badge || 'Submit your Kando entry'}</h2>
                    <div className="kd-title-rule"></div>
                  </div>
                </div>

                <p className="kd-card-desc">{t.form1CardDesc || "Share your family's Kando Moment with us."}</p>

                <ul className="kd-features">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M3.5 10.3 12 3.6l8.5 6.7v9.1a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 16.9s-3.2-2-3.2-4.2a1.85 1.85 0 0 1 3.2-1.2 1.85 1.85 0 0 1 3.2 1.2c0 2.2-3.2 4.2-3.2 4.2Z"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{t.form1Step1}</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M4 8h2.6l1.4-2h8l1.4 2H20a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="13.4" r="3.4" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    <span>{t.form1Step2}</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M7.2 18.2A4.2 4.2 0 0 1 7 9.9a5.3 5.3 0 0 1 10.2-1.2 3.8 3.8 0 0 1-.4 9.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 20.4v-8m0 0-2.6 2.6M12 12.4l2.6 2.6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{t.form1Step3}</span>
                  </li>
                </ul>

                <div className="kd-cta">
                  <button
                    className="kd-btn kd-btn--blue"
                    type="button"
                    onClick={() => navigateTo('form1')}
                  >
                    {t.form1CardBtn || 'Submit Entry'}
                  </button>
                </div>
              </article>

              {/* ---------------------------- Card 2 ---------------------------- */}
              <article className="kd-card kd-card--purple">
                <svg
                  className="kd-card-wave"
                  viewBox="0 0 600 190"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="wave-purple" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#eee0fb" />
                      <stop offset="100%" stopColor="#d3bdf5" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 96c86 44 168-24 268 6 92 28 214-24 332-52v140H0Z"
                    fill="url(#wave-purple)"
                    opacity="0.55"
                  />
                  <path
                    d="M0 132c96 34 176-18 282 8 96 24 206-14 318-40v90H0Z"
                    fill="url(#wave-purple)"
                    opacity="0.8"
                  />
                </svg>

                <div className="kd-card-head">
                  <span className="kd-badge" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6 3.5h7.6L19 8.9V20a.9.9 0 0 1-.9.9H6a.9.9 0 0 1-.9-.9V4.4A.9.9 0 0 1 6 3.5Z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.4 15.9l6.3-6.3 2 2-6.3 6.3-2.6.6z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                      <path d="M8.2 7.6h3.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div>
                    <h2 className="kd-card-title">{t.form2Badge || 'Chairman invites your thoughts'}</h2>
                    <div className="kd-title-rule"></div>
                  </div>
                </div>

                <p className="kd-card-desc">
                  {t.form2CardDesc || 'Share your ideas and suggestions. Your thoughts help us grow better, together.'}
                </p>

                <ul className="kd-features">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M3.4 9.2c0-2.4 2.6-4.3 5.8-4.3s5.8 1.9 5.8 4.3-2.6 4.4-5.8 4.4c-.7 0-1.4-.1-2-.2l-3.1 1.7.8-2.6a4.6 4.6 0 0 1-1.5-3.3Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16.4 9.6c2.5.5 4.2 2.1 4.2 4 0 1.1-.6 2.2-1.5 3l.8 2.5-3.1-1.6c-.6.1-1.3.2-2 .2-2.2 0-4.1-.9-5.1-2.2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{t.form2Step1}</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M12 3.3a5.5 5.5 0 0 1 3.2 9.9v2.1H8.8v-2.1A5.5 5.5 0 0 1 12 3.3Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.4 17.6h5.2M10.2 20h3.6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M3.6 9.2h1.8M18.6 9.2h1.8M5.6 3.9l1.3 1.3M17.1 5.2l1.3-1.3"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>{t.form2Step2}</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="8.4" r="2.9" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="4.9" cy="9.6" r="2.2" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="19.1" cy="9.6" r="2.2" stroke="currentColor" strokeWidth="1.5" />
                      <path
                        d="M7.3 18.6c0-2.6 2.1-4.4 4.7-4.4s4.7 1.8 4.7 4.4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M1.7 17.6c0-2 1.4-3.3 3.2-3.3-.7 0-1.3.2-1.9.5M22.3 17.6c0-2-1.4-3.3-3.2-3.3-.7 0-1.3.2-1.9.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>{t.form2Step3}</span>
                  </li>
                </ul>

                <div className="kd-cta">
                  <button
                    className="kd-btn kd-btn--purple"
                    type="button"
                    onClick={() => navigateTo('form2')}
                  >
                    {t.form2CardBtn || 'Share your thoughts'}
                  </button>
                </div>
              </article>

              <div className="kd-or" aria-hidden="true">{t.orDivider}</div>
            </div>
          </div>
        </section>

        {/* ============================ Quote band =========================== */}
        <section className="kd-quote">
          <div className="kd-quote-rule kd-quote-rule--top"></div>
          <div className="kd-quote-row">
            <svg className="kd-quote-bow" viewBox="0 0 140 120" aria-hidden="true">
              <defs>
                <linearGradient id="kd-bow-grad-a" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#2a52c9" />
                  <stop offset="55%" stopColor="#12297a" />
                  <stop offset="100%" stopColor="#0a1d4e" />
                </linearGradient>
                <linearGradient id="kd-bow-grad-b" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3a63de" />
                  <stop offset="55%" stopColor="#1633a0" />
                  <stop offset="100%" stopColor="#0a1d4e" />
                </linearGradient>
              </defs>

              {/* ribbon tails */}
              <path d="M70 66 L38 118 L54 108 L70 84 Z" fill="url(#kd-bow-grad-a)" stroke="#071640" strokeWidth="1.2" />
              <path d="M70 66 L102 118 L86 108 L70 84 Z" fill="url(#kd-bow-grad-b)" stroke="#071640" strokeWidth="1.2" />

              {/* left loop */}
              <path
                d="M70 62
                   C 58 30, 20 12, 8 26
                   C -4 40, 16 62, 44 66
                   C 56 68, 66 66, 70 62 Z"
                fill="url(#kd-bow-grad-a)"
                stroke="#071640"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M62 58 C 48 36, 24 24, 16 32 C 10 40, 22 54, 42 58 C 50 60, 58 60, 62 58 Z"
                fill="#3a63de"
                opacity="0.45"
              />

              {/* right loop */}
              <path
                d="M70 62
                   C 82 30, 120 12, 132 26
                   C 144 40, 124 62, 96 66
                   C 84 68, 74 66, 70 62 Z"
                fill="url(#kd-bow-grad-b)"
                stroke="#071640"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M78 58 C 92 36, 116 24, 124 32 C 130 40, 118 54, 98 58 C 90 60, 82 60, 78 58 Z"
                fill="#5a7bea"
                opacity="0.4"
              />

              {/* center knot */}
              <path d="M56 56 C 56 46, 62 40, 70 40 C 78 40, 84 46, 84 56 C 84 66, 78 72, 70 72 C 62 72, 56 66, 56 56 Z" fill="#0a1d4e" stroke="#071640" strokeWidth="1.5" />
            </svg>

            <div className="kd-quote-text">
              <p>{t.footerQuote || 'Behind every Yamaha action is a family that inspires it.'}</p>
            </div>

            <svg className="kd-quote-bow kd-quote-bow--right" viewBox="0 0 140 120" aria-hidden="true">
              <path d="M70 66 L38 118 L54 108 L70 84 Z" fill="url(#kd-bow-grad-a)" stroke="#071640" strokeWidth="1.2" />
              <path d="M70 66 L102 118 L86 108 L70 84 Z" fill="url(#kd-bow-grad-b)" stroke="#071640" strokeWidth="1.2" />
              <path
                d="M70 62
                   C 58 30, 20 12, 8 26
                   C -4 40, 16 62, 44 66
                   C 56 68, 66 66, 70 62 Z"
                fill="url(#kd-bow-grad-a)"
                stroke="#071640"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M62 58 C 48 36, 24 24, 16 32 C 10 40, 22 54, 42 58 C 50 60, 58 60, 62 58 Z"
                fill="#3a63de"
                opacity="0.45"
              />
              <path
                d="M70 62
                   C 82 30, 120 12, 132 26
                   C 144 40, 124 62, 96 66
                   C 84 68, 74 66, 70 62 Z"
                fill="url(#kd-bow-grad-b)"
                stroke="#071640"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M78 58 C 92 36, 116 24, 124 32 C 130 40, 118 54, 98 58 C 90 60, 82 60, 78 58 Z"
                fill="#5a7bea"
                opacity="0.4"
              />
              <path d="M56 56 C 56 46, 62 40, 70 40 C 78 40, 84 46, 84 56 C 84 66, 78 72, 70 72 C 62 72, 56 66, 56 56 Z" fill="#0a1d4e" stroke="#071640" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="kd-quote-rule kd-quote-rule--bottom"></div>
        </section>
      </main>

      {/* ============================== Footer ============================= */}
      <footer className="kd-footer notranslate" translate="no">
        <span>71st Yamaha Day 2026</span>
        <span className="kd-footer-sep" aria-hidden="true"></span>
        <span>Kando from Home</span>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 20.5s-7.5-4.6-7.5-9.7A4.3 4.3 0 0 1 12 8.2a4.3 4.3 0 0 1 7.5 2.6c0 5.1-7.5 9.7-7.5 9.7Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </footer>
    </div>
  );
};
