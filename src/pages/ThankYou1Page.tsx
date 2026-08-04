import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, FileText, Heart } from 'lucide-react';

/* Gift-ribbon bow — navy tone, echoes the bow on the "Dear Yamaha Family"
   letter card in the campaign artwork. */
const NavyRibbonBow: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 70, style }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={style}>
    <path d="M30 30 C 30 30 10 15 6 24 C 3 31 14 34 30 30 Z" fill="#0B1F5C" opacity="0.95" />
    <path d="M30 30 C 30 30 50 15 54 24 C 57 31 46 34 30 30 Z" fill="#0B1F5C" opacity="0.95" />
    <path d="M30 30 C 26 34 22 46 18 53 C 24 51 27 44 30 30 Z" fill="#0B1F5C" opacity="0.8" />
    <path d="M30 30 C 34 34 38 46 42 53 C 36 51 33 44 30 30 Z" fill="#0B1F5C" opacity="0.8" />
    <circle cx="30" cy="30" r="5.5" fill="#D1B07B" stroke="#F0DFB8" strokeWidth="1" />
  </svg>
);

export const ThankYou1Page: React.FC = () => {
  const { t, formData, navigateTo } = useApp();

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '750px', textAlign: 'center' }}>

      {/* LETTER / CERTIFICATE CARD — matches the "Dear Yamaha Family" PPT slide */}
      <div className="animate-fade-in" style={{
        position: 'relative',
        background: 'linear-gradient(160deg, #FAF6EC 0%, #F3EEDF 100%)',
        border: '2px solid #0B1F5C',
        borderRadius: '18px',
        padding: '18px',
        marginBottom: '32px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
        overflow: 'hidden',
        textAlign: 'left'
      }}>
        {/* Inner thin border, offset — double-frame look */}
        <div style={{ position: 'absolute', inset: '10px', border: '1px solid rgba(11, 31, 92, 0.35)', borderRadius: '12px', pointerEvents: 'none' }} />

        <NavyRibbonBow size={76} style={{ position: 'absolute', top: '-16px', left: '-16px', transform: 'rotate(-16deg)', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }} />

        <div style={{ padding: '38px 30px 0 30px', position: 'relative' }}>
          {/* Top-right Yamaha wordmark on a navy chip so it reads on the cream card */}
          <div style={{
            position: 'absolute', top: '14px', right: '14px',
            background: '#0B1F5C', borderRadius: '8px', padding: '6px 12px',
            display: 'flex', alignItems: 'center'
          }}>
            <img src="/yamaha_logo.png" alt="Yamaha" style={{ height: '20px', width: 'auto' }} />
          </div>

          <h1 className="heading-font script-font" style={{ fontSize: '2.6rem', color: '#0B1F5C', marginBottom: '18px', marginTop: '30px' }}>
            Thank You!
          </h1>

          {/* DUMMY PLACEHOLDER COPY — final thank-you message to be confirmed */}
          <p style={{ color: '#2B3A5C', fontSize: '1rem', lineHeight: 1.75, marginBottom: '18px' }}>
            [Dummy content] Thank you for taking part in Yamaha Day 2026 — Kando From Home. Your family's
            creation and the moments you shared mean a great deal to all of us. This is placeholder copy;
            the final thank-you message will be added here once confirmed.
          </p>

          <div style={{ color: '#0B1F5C', fontWeight: 700, fontSize: '0.95rem', marginBottom: '20px' }}>
            With warm regards,<br />
            <span style={{ fontWeight: 800 }}>Yamaha Motor India Group</span>
          </div>
        </div>

        {/* Bottom navy banner — literal tagline from the campaign artwork */}
        <div style={{
          marginTop: '18px', background: '#0B1F5C', borderRadius: '0 0 10px 10px',
          padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px'
        }}>
          <Heart size={16} color="white" />
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'white', fontWeight: 800, fontSize: '1rem' }}>Kando From Home</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.78rem' }}>One Day. Many Homes. One Yamaha Spirit.</div>
          </div>
          <Home size={16} color="white" />
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        {/* Reference ID Card */}
        <div style={{
          background: 'rgba(2, 11, 42, 0.85)', border: '1.5px dashed #D1B07B',
          borderRadius: '18px', padding: '24px', maxWidth: '480px', margin: '0 auto 36px auto'
        }}>
          <div style={{ fontSize: '0.85rem', color: '#A0B2D6', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            {t.refIdLabel || 'Form 1 Submission Reference ID'}
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#D1B07B', letterSpacing: '2px', fontFamily: 'monospace' }}>
            {formData.refId || 'KANDO-2026-8942'}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '6px' }}>
            Submitted by: <strong style={{ color: 'var(--label-muted)' }}>{formData.empName || 'Yamaha Employee'}</strong> ({formData.empId || 'YMI-1049'})
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
          <p style={{ color: 'var(--label-muted)', fontSize: '0.87rem', lineHeight: 1.5, margin: 0 }}>
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
