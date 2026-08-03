import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Calendar, Award, ArrowRight, Heart, Video, UserCheck, Image as ImageIcon, FileVideo } from 'lucide-react';

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
            color: 'white',
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
          color: 'white',
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

              <h3 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 800, marginBottom: '12px' }}>
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

              <h3 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 800, marginBottom: '12px' }}>
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

      {/* CEO MESSAGE SECTION */}
      <div className="glass-panel ceo-card" style={{
        padding: '32px 24px',
        marginBottom: '40px',
        background: 'linear-gradient(135deg, rgba(8, 22, 60, 0.9) 0%, rgba(3, 13, 40, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        alignItems: 'center'
      }}>
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          border: '3px solid #D1B07B',
          overflow: 'hidden',
          boxShadow: '0 0 20px rgba(209, 176, 123, 0.3)',
          flexShrink: 0
        }}>
          <img 
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300" 
            alt="Yamaha Leadership CEO"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div>
          <h3 className="heading-font" style={{ fontSize: '1.4rem', color: '#D1B07B', marginBottom: '8px' }}>
            {t.ceoMessageTitle}
          </h3>
          <p style={{ color: '#E2E8F0', fontStyle: 'italic', lineHeight: 1.6, fontSize: '1rem' }}>
            "{t.ceoMessageBody}"
          </p>
          <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#A0B2D6', fontWeight: 700 }}>
            — Management Team, Yamaha Motor India Group
          </div>
        </div>
      </div>

      {/* HOW IT WORKS / STEPS */}
      <div style={{ marginBottom: '40px' }}>
        <h2 className="heading-font" style={{
          fontSize: '1.8rem',
          textAlign: 'center',
          color: 'white',
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
            <h4 style={{ fontSize: '1.15rem', color: 'white', marginBottom: '8px' }}>1. {t.step1Title}</h4>
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
            <h4 style={{ fontSize: '1.15rem', color: 'white', marginBottom: '8px' }}>2. {t.step2Title}</h4>
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
            <h4 style={{ fontSize: '1.15rem', color: 'white', marginBottom: '8px' }}>3. {t.step3Title}</h4>
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
            <h4 style={{ fontSize: '1.15rem', color: 'white', marginBottom: '8px' }}>4. {t.step4Title}</h4>
            <p style={{ fontSize: '0.9rem', color: '#A0B2D6', lineHeight: 1.5 }}>{t.step4Desc}</p>
          </div>
        </div>
      </div>

    </div>
  );
};
