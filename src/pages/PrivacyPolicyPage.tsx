import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '900px' }}>
      <div className="glass-panel" style={{ padding: '40px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#D1B07B', marginBottom: '16px' }}>
          <Shield size={32} />
          <h1 className="heading-font" style={{ fontSize: '2.2rem', color: 'white' }}>
            {t.privacyPolicyTitle}
          </h1>
        </div>

        <p style={{ color: '#A0B2D6', marginBottom: '24px', fontSize: '0.95rem' }}>
          {t.privacySubtitle}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', color: '#CBD5E1', lineHeight: 1.7 }}>
          
          <section>
            <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>{t.privacySec1Title}</h3>
            <p>{t.privacySec1Body}</p>
          </section>

          <section>
            <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>{t.privacySec2Title}</h3>
            <p>{t.privacySec2Body}</p>
          </section>

          <section>
            <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>{t.privacySec3Title}</h3>
            <p>{t.privacySec3Body}</p>
          </section>

          <section>
            <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>{t.privacySec4Title}</h3>
            <p>{t.privacySec4Body}</p>
          </section>

          <section>
            <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>{t.privacySec5Title}</h3>
            <p>{t.privacySec5Body}</p>
          </section>

        </div>

      </div>
    </div>
  );
};
