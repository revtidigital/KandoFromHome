import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '900px' }}>
      <div className="glass-panel" style={{ padding: '40px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#00E5FF', marginBottom: '16px' }}>
          <Shield size={32} />
          <h1 className="heading-font" style={{ fontSize: '2.2rem', color: 'white' }}>
            {t.privacyPolicyTitle}
          </h1>
        </div>

        <p style={{ color: '#A0B2D6', marginBottom: '24px', fontSize: '0.95rem' }}>
          Last Updated: 27 July 2026 | Compliant with Digital Personal Data Protection (DPDP) Standards
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', color: '#CBD5E1', lineHeight: 1.7 }}>
          
          <section>
            <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>1. Scope of Data Collection</h3>
            <p>
              For the Yamaha Day 2026 "Kando From Home" campaign, Yamaha Motor India Group collects employee personal information strictly required for identity validation and campaign administration. This includes Employee Full Name, Employee ID, Official Email Address, Contact Number, Plant/City Location, Family Participation Count, and uploaded media files (photos & video).
            </p>
          </section>

          <section>
            <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>2. Purpose & Media Consent</h3>
            <p>
              Personal data collected is used solely for validating participation, shortlisting winning family DIY entries, issuing digital certificates, and organizing Yamaha Day 2026 events. Uploaded photos and videos will only be featured in internal communications and promotional showcases where explicit consent has been provided during Form 1 submission.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>3. Data Storage, Encryption & Security</h3>
            <p>
              All submitted data is stored securely in encrypted PostgreSQL databases and S3-compatible object storage with signed URL access controls. Access is strictly restricted to authorized administrative personnel with role-based access controls and detailed audit logging.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>4. Data Retention & Deletion</h3>
            <p>
              Campaign submissions will be retained for 180 days following the conclusion of Yamaha Day 2026 for archiving and administrative reporting, after which non-featured personal media will be securely purged upon written request from the employee.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>5. Contact Data Protection Officer</h3>
            <p>
              For privacy inquiries or data rights requests, please contact the Internal Data Protection Committee at <code>privacy@yamaha-motor.co.in</code>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};
