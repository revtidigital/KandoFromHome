import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { Award, Download, Home, Sparkles } from 'lucide-react';

export const ThankYou2Page: React.FC = () => {
  const { t, formData, navigateTo } = useApp();

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="container" style={{ padding: '50px 20px', maxWidth: '850px', textAlign: 'center' }}>
      
      {/* SUCCESS HEADER */}
      <div className="animate-fade-in">
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          color: '#020B2A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          boxShadow: '0 0 35px rgba(255, 215, 0, 0.5)'
        }}>
          <Award size={52} />
        </div>

        <h1 className="heading-font" style={{ fontSize: '2.4rem', color: 'var(--text-main)', marginBottom: '12px' }}>
          {t.thankYou2Title}
        </h1>

        <p style={{ color: '#A0B2D6', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto 36px auto', lineHeight: 1.6 }}>
          {t.thankYou2Subtitle}
        </p>

        {/* PRINTABLE / DOWNLOADABLE CERTIFICATE BADGE CARD */}
        <div className="glass-panel" style={{
          padding: '40px',
          border: '2px solid #FFD700',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(8, 22, 60, 0.95) 0%, rgba(3, 10, 35, 0.98) 100%)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '40px'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #D1B07B 0%, transparent 60%)',
            pointerEvents: 'none'
          }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#FFD700', marginBottom: '12px' }}>
            <Sparkles size={20} />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '2px' }}>OFFICIAL CERTIFICATE OF PARTICIPATION</span>
            <Sparkles size={20} />
          </div>

          <h2 className="heading-font" style={{ fontSize: '2rem', color: 'white', marginBottom: '16px' }}>
            {t.certBadgeTitle}
          </h2>

          <div style={{ fontSize: '1.1rem', color: '#E2E8F0', marginBottom: '8px' }}>
            This certificate is proudly awarded to
          </div>

          <div style={{
            fontFamily: 'Caveat, cursive',
            fontSize: '3rem',
            color: '#D1B07B',
            fontWeight: 700,
            lineHeight: 1,
            margin: '8px 0 16px 0'
          }}>
            {formData.empName || 'Yamaha Motor Employee'} & Family
          </div>

          <p style={{ fontSize: '0.95rem', color: '#A0B2D6', maxWidth: '550px', margin: '0 auto 24px auto', lineHeight: 1.5 }}>
            For successfully creating and sharing their Family DIY Craft wall for <strong>Yamaha Day 2026 · Kando From Home</strong>.
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '30px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#A0B2D6' }}>{t.finalRefIdLabel}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFD700', fontFamily: 'monospace' }}>
                {formData.refId || 'KANDO-2026-8942'}
              </div>
            </div>
            <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.2)' }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#A0B2D6' }}>Issued Date</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white' }}>
                27 July 2026
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
          <button 
            onClick={handlePrintCertificate}
            className="btn-primary"
            style={{ padding: '14px 28px', background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)', color: '#020B2A' }}
          >
            <Download size={18} />
            <span>{t.downloadCertBtn}</span>
          </button>

          <button 
            onClick={() => navigateTo('home')}
            className="btn-secondary"
            style={{ padding: '14px 28px' }}
          >
            <Home size={18} />
            <span>{t.backHomeBtn}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
