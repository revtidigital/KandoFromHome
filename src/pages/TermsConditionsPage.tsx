import React from 'react';
import { useApp } from '../context/AppContext';
import { FileText } from 'lucide-react';

export const TermsConditionsPage: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '900px' }}>
      <div className="glass-panel" style={{ padding: '40px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#D1B07B', marginBottom: '16px' }}>
          <FileText size={32} />
          <h1 className="heading-font" style={{ fontSize: '2.2rem', color: 'var(--text-main)' }}>
            {t.termsConditionsTitle}
          </h1>
        </div>

        <p style={{ color: '#A0B2D6', marginBottom: '24px', fontSize: '0.95rem' }}>
          {t.termsSubtitle}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', color: 'var(--label-muted)', lineHeight: 1.7 }}>
          
          <section>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '8px' }}>{t.termsSec1Title}</h3>
            <p>{t.termsSec1Body}</p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '8px' }}>{t.termsSec2Title}</h3>
            <p>{t.termsSec2Body}</p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '8px' }}>{t.termsSec3Title}</h3>
            <p>{t.termsSec3Body}</p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '8px' }}>{t.termsSec4Title}</h3>
            <p>{t.termsSec4Body}</p>
          </section>

        </div>

      </div>
    </div>
  );
};
