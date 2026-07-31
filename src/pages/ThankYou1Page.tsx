import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, ArrowRight, FileCheck } from 'lucide-react';

export const ThankYou1Page: React.FC = () => {
  const { t, formData, navigateTo } = useApp();

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '750px', textAlign: 'center' }}>
      <div className="glass-panel animate-fade-in" style={{
        padding: '48px 36px',
        border: '1px solid rgba(0, 229, 255, 0.4)',
        boxShadow: '0 0 40px rgba(0, 229, 255, 0.15)'
      }}>
        
        {/* Animated Check Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(0, 229, 255, 0.15)',
          border: '2px solid #00E5FF',
          color: '#00E5FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px auto',
          boxShadow: '0 0 25px rgba(0, 229, 255, 0.4)'
        }}>
          <CheckCircle2 size={44} />
        </div>

        <h1 className="heading-font" style={{ fontSize: '2.2rem', color: 'white', marginBottom: '12px' }}>
          {t.thankYou1Title}
        </h1>

        <p style={{ color: '#A0B2D6', fontSize: '1.05rem', marginBottom: '32px', lineHeight: 1.6 }}>
          {t.thankYou1Subtitle}
        </p>

        {/* Reference ID Card */}
        <div style={{
          background: 'rgba(2, 11, 42, 0.8)',
          border: '1px dashed #00E5FF',
          borderRadius: '16px',
          padding: '20px',
          maxWidth: '450px',
          margin: '0 auto 36px auto'
        }}>
          <div style={{ fontSize: '0.85rem', color: '#A0B2D6', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
            {t.refIdLabel}
          </div>
          <div style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            color: '#00E5FF',
            letterSpacing: '2px',
            fontFamily: 'monospace'
          }}>
            {formData.refId || 'KANDO-2026-8942'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
            Submitted by: {formData.empName || 'Yamaha Employee'} ({formData.empId || 'YMI-1049'})
          </div>
        </div>

        {/* Next Step Box */}
        <div style={{
          background: 'rgba(168, 85, 247, 0.12)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '36px',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <FileCheck size={28} color="#A855F7" style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ color: '#C084FC', fontSize: '1.05rem', fontWeight: 700, marginBottom: '2px' }}>
              Final Step Required: Form 2
            </h4>
            <p style={{ color: '#E2E8F0', fontSize: '0.9rem' }}>
              Please answer the reflection question posed by our CEO to finalize your campaign entry and download your certificate.
            </p>
          </div>
        </div>

        <button 
          onClick={() => navigateTo('form2')}
          className="btn-primary"
          style={{ padding: '16px 36px', fontSize: '1.1rem', background: 'linear-gradient(90deg, #A855F7 0%, #0088FF 100%)' }}
        >
          <span>{t.proceedToForm2Btn}</span>
          <ArrowRight size={20} />
        </button>

      </div>
    </div>
  );
};
