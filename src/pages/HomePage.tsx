import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Calendar, Award, ArrowRight, Heart, Video, UserCheck, Image as ImageIcon, FileVideo } from 'lucide-react';

/* Decorative gift-ribbon bow — echoes the gold bow tied on the Yamaha Day
   "Kando From Home" gift box in the campaign artwork. */
const RibbonBow: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 56, style }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={style}>
    <path d="M30 30 C 30 30 10 15 6 24 C 3 31 14 34 30 30 Z" fill="#D1B07B" opacity="0.92" />
    <path d="M30 30 C 30 30 50 15 54 24 C 57 31 46 34 30 30 Z" fill="#D1B07B" opacity="0.92" />
    <path d="M30 30 C 26 34 22 46 18 53 C 24 51 27 44 30 30 Z" fill="#D1B07B" opacity="0.75" />
    <path d="M30 30 C 34 34 38 46 42 53 C 36 51 33 44 30 30 Z" fill="#D1B07B" opacity="0.75" />
    <circle cx="30" cy="30" r="5.5" fill="#B8935E" stroke="#F0DFB8" strokeWidth="1" />
  </svg>
);

export const HomePage: React.FC = () => {
  const { t, navigateTo } = useApp();

  return (
    <div className="container" style={{ padding: '40px 20px', minHeight: '80vh' }}>

      {/* HERO BANNER */}
      <div className="glass-panel animate-fade-in" style={{
        padding: '48px 36px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(209, 176, 123, 0.25)',
        marginBottom: '40px'
      }}>
        {/* Glow accent */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(0, 82, 204, 0.4) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Ribbon bow — gift-box accent, corner of the hero card */}
        <RibbonBow size={64} style={{ position: 'absolute', top: '18px', right: '18px', zIndex: 2, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.35))' }} />

        <div style={{ maxWidth: '800px', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(209, 176, 123, 0.12)',
            border: '1px solid rgba(209, 176, 123, 0.3)',
            color: '#D1B07B',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '16px'
          }}>
            <Sparkles size={16} />
            <span>YAMAHA MOTOR INDIA GROUP · FAMILY DAY 2026</span>
          </div>

          <h1 className="heading-font" style={{
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            fontWeight: 800,
            color: 'var(--text-main)',
            lineHeight: 1.25,
            marginBottom: '16px'
          }}>
            {t.homeHeroTitle}
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: '#A0B2D6',
            lineHeight: 1.6,
            marginBottom: '28px'
          }}>
            {t.homeHeroDesc}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFD700', fontSize: '0.9rem', fontWeight: 600 }}>
            <Calendar size={16} />
            <span>{t.submissionDeadlineText}</span>
          </div>
        </div>
      </div>

      {/* ── TWO SEPARATE FORM SUBMISSION CARDS (Req 1) ── */}
      <div style={{ marginBottom: '48px' }}>
        <h2 className="heading-font" style={{
          fontSize: '1.8rem',
          textAlign: 'center',
          color: 'var(--text-main)',
          marginBottom: '10px'
        }}>
          {t.chooseSubmissionFormTitle}
        </h2>
        <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.95rem', marginBottom: '32px' }}>
          {t.chooseSubmissionFormDesc}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px'
        }}>
          
          {/* FORM 1 CARD */}
          <div className="glass-panel glow-card" style={{
            padding: '32px',
            borderRadius: '20px',
            border: '1.5px solid #D1B07B',
            background: 'linear-gradient(180deg, rgba(0,77,90,0.4) 0%, rgba(1,43,51,0.6) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'rgba(209, 176, 123, 0.2)',
                border: '1.5px solid #D1B07B',
                color: '#D1B07B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <ImageIcon size={28} />
              </div>
              
              <div style={{ fontSize: '0.8rem', color: '#D1B07B', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
                {t.form1Badge}
              </div>

              <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', fontWeight: 800, marginBottom: '12px' }}>
                {t.form1CardTitle}
              </h3>

              <p style={{ fontSize: '0.95rem', color: '#E2E8F0', lineHeight: 1.6, marginBottom: '24px' }}>
                {t.form1CardDesc}
              </p>
            </div>

            <button 
              onClick={() => navigateTo('form1')}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
            >
              <span>{t.form1CardBtn}</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* FORM 2 CARD */}
          <div className="glass-panel glow-card" style={{
            padding: '32px',
            borderRadius: '20px',
            border: '1.5px solid #A855F7',
            background: 'linear-gradient(180deg, rgba(53,18,89,0.4) 0%, rgba(26,6,51,0.6) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'rgba(168, 85, 247, 0.2)',
                border: '1.5px solid #A855F7',
                color: '#C084FC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <FileVideo size={28} />
              </div>

              <div style={{ fontSize: '0.8rem', color: '#C084FC', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
                {t.form2Badge}
              </div>

              <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', fontWeight: 800, marginBottom: '12px' }}>
                {t.form2CardTitle}
              </h3>

              <p style={{ fontSize: '0.95rem', color: '#E2E8F0', lineHeight: 1.6, marginBottom: '24px' }}>
                {t.form2CardDesc}
              </p>
            </div>

            <button 
              onClick={() => navigateTo('form2')}
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '14px',
                fontSize: '1rem',
                borderRadius: '30px',
                background: 'linear-gradient(90deg, #A855F7 0%, #7E22CE 100%)',
                border: 'none',
                color: 'white',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
              }}
            >
              <span>{t.form2CardBtn}</span>
              <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </div>

      {/* CEO MESSAGE SECTION — formal letter card, echoing the "Dear Yamaha Family" PPT slide */}
      <div style={{
        position: 'relative',
        padding: '40px 32px',
        marginBottom: '40px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(8, 22, 60, 0.92) 0%, rgba(3, 13, 40, 0.97) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
        overflow: 'hidden'
      }}>
        {/* Dashed inner frame — invitation-card feel */}
        <div style={{
          position: 'absolute', inset: '14px',
          border: '1.5px dashed rgba(209, 176, 123, 0.35)',
          borderRadius: '14px',
          pointerEvents: 'none'
        }} />

        {/* Ribbon bow — top-left corner, like the gift-tag on the campaign box */}
        <RibbonBow size={72} style={{
          position: 'absolute', top: '-14px', left: '-14px',
          transform: 'rotate(-18deg)',
          filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.4))'
        }} />

        <div style={{ position: 'relative', maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            fontSize: '0.78rem', fontWeight: 800, letterSpacing: '2px',
            color: '#D1B07B', textTransform: 'uppercase', marginBottom: '18px'
          }}>
            {t.ceoMessageTitle}
          </div>

          <p style={{ color: '#E2E8F0', lineHeight: 1.75, fontSize: '1.02rem', textAlign: 'left' }}>
            {t.ceoMessageBody}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(209, 176, 123, 0.3)' }} />
            <Heart size={14} color="#D1B07B" fill="#D1B07B" />
            <div style={{ flex: 1, height: '1px', background: 'rgba(209, 176, 123, 0.3)' }} />
          </div>

          <div style={{ textAlign: 'left' }}>
            <div style={{ color: '#A0B2D6', fontSize: '0.95rem', marginBottom: '4px' }}>With warm regards,</div>
            <div style={{ color: '#D1B07B', fontWeight: 800, fontSize: '1.1rem' }}>Management Team</div>
            <div style={{ color: '#A0B2D6', fontSize: '0.85rem' }}>Yamaha Motor India Group</div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS / STEPS */}
      <div style={{ marginBottom: '40px' }}>
        <h2 className="heading-font" style={{
          fontSize: '1.8rem',
          textAlign: 'center',
          color: 'var(--text-main)',
          marginBottom: '32px'
        }}>
          {t.howItWorksTitle}
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px'
        }}>
          {/* Step 1 */}
          <div className="glass-panel glow-card" style={{ padding: '24px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(0, 191, 255, 0.2)',
              border: '1px solid #D1B07B',
              color: '#D1B07B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Heart size={24} />
            </div>
            <h4 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '8px' }}>1. {t.step1Title}</h4>
            <p style={{ fontSize: '0.9rem', color: '#A0B2D6', lineHeight: 1.5 }}>{t.step1Desc}</p>
          </div>

          {/* Step 2 */}
          <div className="glass-panel glow-card" style={{ padding: '24px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(209, 176, 123, 0.2)',
              border: '1px solid #D1B07B',
              color: '#D1B07B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Video size={24} />
            </div>
            <h4 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '8px' }}>2. {t.step2Title}</h4>
            <p style={{ fontSize: '0.9rem', color: '#A0B2D6', lineHeight: 1.5 }}>{t.step2Desc}</p>
          </div>

          {/* Step 3 */}
          <div className="glass-panel glow-card" style={{ padding: '24px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(168, 85, 247, 0.2)',
              border: '1px solid #A855F7',
              color: '#A855F7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <UserCheck size={24} />
            </div>
            <h4 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '8px' }}>3. {t.step3Title}</h4>
            <p style={{ fontSize: '0.9rem', color: '#A0B2D6', lineHeight: 1.5 }}>{t.step3Desc}</p>
          </div>

          {/* Step 4 */}
          <div className="glass-panel glow-card" style={{ padding: '24px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(255, 215, 0, 0.2)',
              border: '1px solid #FFD700',
              color: '#FFD700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Award size={24} />
            </div>
            <h4 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '8px' }}>4. {t.step4Title}</h4>
            <p style={{ fontSize: '0.9rem', color: '#A0B2D6', lineHeight: 1.5 }}>{t.step4Desc}</p>
          </div>
        </div>
      </div>

    </div>
  );
};
