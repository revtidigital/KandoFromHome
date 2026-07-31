import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Home, FileText } from 'lucide-react';

export const ThankYou1Page: React.FC = () => {
  const { t, formData, navigateTo } = useApp();

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '750px', textAlign: 'center' }}>
      <div className="glass-panel animate-fade-in" style={{
        padding: '48px 32px',
        border: '1.5px solid rgba(0, 229, 255, 0.4)',
        boxShadow: '0 0 50px rgba(0, 229, 255, 0.15)',
        borderRadius: '24px'
      }}>
        
        {/* Animated Check Icon */}
        <div style={{
          width: '84px', height: '84px', borderRadius: '50%',
          background: 'rgba(0, 229, 255, 0.15)', border: '2px solid #00E5FF',
          color: '#00E5FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px auto', boxShadow: '0 0 30px rgba(0, 229, 255, 0.4)'
        }}>
          <CheckCircle2 size={48} />
        </div>

        <h1 className="heading-font" style={{ fontSize: '2.2rem', color: 'white', marginBottom: '12px' }}>
          {t.thankYou1Title || 'Form 1 Submitted Successfully!'}
        </h1>

        <p style={{ color: '#A0B2D6', fontSize: '1.05rem', marginBottom: '32px', lineHeight: 1.6 }}>
          {t.thankYou1Subtitle || 'Your DIY Kit photos and employee details have been safely registered with Yamaha.'}
        </p>

        {/* Reference ID Card */}
        <div style={{
          background: 'rgba(2, 11, 42, 0.85)', border: '1.5px dashed #00E5FF',
          borderRadius: '18px', padding: '24px', maxWidth: '480px', margin: '0 auto 36px auto'
        }}>
          <div style={{ fontSize: '0.85rem', color: '#A0B2D6', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            {t.refIdLabel || 'Form 1 Submission Reference ID'}
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#00E5FF', letterSpacing: '2px', fontFamily: 'monospace' }}>
            {formData.refId || 'KANDO-2026-8942'}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '6px' }}>
            Submitted by: <strong style={{ color: '#CBD5E1' }}>{formData.empName || 'Yamaha Employee'}</strong> ({formData.empId || 'YMI-1049'})
          </div>
        </div>

        {/* Optional Form 2 Banner */}
        <div style={{
          background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.35)',
          borderRadius: '16px', padding: '20px 24px', marginBottom: '28px', textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <FileText size={18} color="#A855F7" />
            <span style={{ color: '#D8B4FE', fontWeight: 700, fontSize: '0.95rem' }}>
              Chairman Invites Your Thoughts — Optional
            </span>
          </div>
          <p style={{ color: '#CBD5E1', fontSize: '0.87rem', lineHeight: 1.5, margin: 0 }}>
            You may optionally participate in the Chairman's initiative — share your thoughts on Yamaha's future. This is completely independent of Form 1.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px' }}>
          <button
            onClick={() => navigateTo('home')}
            className="btn-secondary"
            style={{ padding: '13px 28px', fontSize: '1rem' }}
          >
            <Home size={18} />
            <span>Return to Home</span>
          </button>

          <button
            onClick={() => navigateTo('form2')}
            className="btn-primary"
            style={{
              padding: '13px 28px', fontSize: '1rem',
              background: 'linear-gradient(90deg, #A855F7 0%, #6366F1 100%)',
              color: 'white', border: 'none'
            }}
          >
            <FileText size={18} />
            <span>Fill Chairman's Form (Optional)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
