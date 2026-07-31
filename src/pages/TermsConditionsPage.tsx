import React from 'react';
import { useApp } from '../context/AppContext';
import { FileText } from 'lucide-react';

export const TermsConditionsPage: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '900px' }}>
      <div className="glass-panel" style={{ padding: '40px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#00E5FF', marginBottom: '16px' }}>
          <FileText size={32} />
          <h1 className="heading-font" style={{ fontSize: '2.2rem', color: 'white' }}>
            {t.termsConditionsTitle}
          </h1>
        </div>

        <p style={{ color: '#A0B2D6', marginBottom: '24px', fontSize: '0.95rem' }}>
          Yamaha Day 2026 "Kando From Home" Official Campaign Guidelines
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', color: '#CBD5E1', lineHeight: 1.7 }}>
          
          <section>
            <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>1. Eligibility</h3>
            <p>
              The Kando From Home DIY Kit initiative is open to all active employees of Yamaha Motor India Group and their immediate family members across all corporate offices, manufacturing plants (Surajpur, Chennai, Kanchipuram), and regional sales locations.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>2. Submission Guidelines & File Specifications</h3>
            <p>
              Each employee is permitted exactly <strong>one submission</strong> against their valid Employee ID. Each entry must consist of:
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
              <li>1 Video file (MP4/MOV, up to 50MB) demonstrating family assembly of the DIY kit.</li>
              <li>2 High-resolution Photo files (JPG/PNG, up to 50MB each) showing the completed craft board.</li>
              <li>Completion of Form 2 (CEO Reflective Question).</li>
            </ul>
          </section>

          <section>
            <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>3. Originality & Safety</h3>
            <p>
              All submissions must feature original DIY craft assembly completed by the employee and their family. Uploaded content must adhere to corporate conduct guidelines and contain no inappropriate or third-party copyrighted material.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>4. Shortlisting & Recognition</h3>
            <p>
              Entries will be evaluated by the Yamaha Day 2026 Admin Committee based on creativity, family participation, and reflection alignment with Yamaha's spirit of Kando. Shortlisted entries will receive special recognition during Yamaha Day 2026 celebrations.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};
