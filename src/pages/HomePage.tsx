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
              src="/yamaha-logo-v2.png"
              alt="Yamaha — Revs Your Heart"
              onError={(e) => { (e.target as HTMLImageElement).src = '/yamaha_logo.png'; }}
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
            src="/image_5.png"
            alt="A family crafting blue and white decorations together at home"
            onError={(e) => { (e.target as HTMLImageElement).src = '/kando_family.png'; }}
          />
          {/* 2nd image in right corner */}
          <img
            className="kd-hero-photo kd-hero-photo--right"
            src="/image_3.png"
            alt="A handmade Our Kando Moment display with paper hearts, notes and fairy lights"
            onError={(e) => { (e.target as HTMLImageElement).src = '/kando_chairman_gift.png'; }}
          />

          <div className="kd-hero-copy">
            <h1 className="kd-title">
              Welcome to Your <span className="kando-script">Kando Space</span>
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

            <svg className="kd-heart-solo" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 20.5s-7.5-4.6-7.5-9.7A4.3 4.3 0 0 1 12 8.2a4.3 4.3 0 0 1 7.5 2.6c0 5.1-7.5 9.7-7.5 9.7Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <p className="kd-hero-note">
              {t.landingSubtitle || "This Yamaha Day, let's celebrate the families behind every Yamaha action."}
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
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="m9 5 7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
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
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="m9 5 7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </article>

              <div className="kd-or" aria-hidden="true">{t.orDivider}</div>
            </div>
          </div>
        </section>

        {/* ============================ Quote band =========================== */}
        <section className="kd-quote">
          <svg className="kd-quote-icon" viewBox="0 0 72 50" fill="none" aria-hidden="true">
            <circle cx="13" cy="11" r="5.6" stroke="currentColor" strokeWidth="2" />
            <circle cx="36" cy="9" r="6.4" stroke="currentColor" strokeWidth="2" />
            <circle cx="59" cy="11" r="5.6" stroke="currentColor" strokeWidth="2" />
            <path
              d="M3.5 44V30.5a9.5 9.5 0 0 1 19 0V44"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M24.5 46V30a11.5 11.5 0 0 1 23 0v16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M49.5 44V30.5a9.5 9.5 0 0 1 19 0V44"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M13 30v14M36 28v18M59 30v14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <div className="kd-quote-text">
            <p>
              {t.footerQuote || 'Behind every Yamaha action is a family that inspires it.'}
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 20.5s-7.5-4.6-7.5-9.7A4.3 4.3 0 0 1 12 8.2a4.3 4.3 0 0 1 7.5 2.6c0 5.1-7.5 9.7-7.5 9.7Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </p>
            <div className="kd-quote-rule"></div>
          </div>
        </section>
      </main>

      {/* ============================== Footer ============================= */}
      <footer className="kd-footer">
        <span>Yamaha Day 2026</span>
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
