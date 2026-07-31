import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Unlock, CheckCircle, ArrowRight, MessageSquareQuote } from 'lucide-react';

export const Form2Page: React.FC = () => {
  const { t, formData, setFormData, navigateTo } = useApp();

  const [isVerified, setIsVerified] = useState(Boolean(formData.empId));
  const [empIdInput, setEmpIdInput] = useState(formData.empId || '');
  const [authError, setAuthError] = useState('');
  const [reflectionText, setReflectionText] = useState(formData.ceoReflection || '');
  const [textError, setTextError] = useState('');

  const handleVerifyEmpId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empIdInput.trim()) {
      setAuthError('Please enter your Employee ID.');
      return;
    }

    setAuthError('');
    setIsVerified(true);
    if (!formData.empId) {
      setFormData(prev => ({ ...prev, empId: empIdInput.trim() }));
    }
  };

  const handleSubmitForm2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionText.trim() || reflectionText.trim().length < 20) {
      setTextError('Please provide a meaningful reflection (minimum 20 characters).');
      return;
    }

    setTextError('');
    setFormData(prev => ({ 
      ...prev, 
      ceoReflection: reflectionText,
      refId: prev.refId || 'KANDO-2026-' + Math.floor(1000 + Math.random() * 9000)
    }));

    navigateTo('thankyou2');
  };

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '800px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 className="heading-font" style={{ fontSize: '2.2rem', color: 'white', marginBottom: '8px' }}>
          {t.form2Title}
        </h1>
        <p style={{ color: '#A0B2D6', fontSize: '1rem' }}>
          {t.form2Subtitle}
        </p>
      </div>

      {/* AUTH GATE PANEL */}
      {!isVerified ? (
        <div className="glass-panel" style={{ padding: '36px', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(255, 215, 0, 0.15)',
            border: '2px solid #FFD700',
            color: '#FFD700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto'
          }}>
            <Lock size={32} />
          </div>

          <h3 className="heading-font" style={{ fontSize: '1.4rem', color: 'white', marginBottom: '8px' }}>
            {t.authGateTitle}
          </h3>
          <p style={{ color: '#A0B2D6', fontSize: '0.95rem', marginBottom: '24px' }}>
            {t.authGateDesc}
          </p>

          <form onSubmit={handleVerifyEmpId} style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div className="form-group">
              <input 
                type="text" 
                className="form-input" 
                placeholder={t.empIdPlaceholder}
                value={empIdInput}
                onChange={(e) => setEmpIdInput(e.target.value)}
                style={{ textAlign: 'center', fontSize: '1.1rem', letterSpacing: '1px' }}
              />
              {authError && <span style={{ color: '#FF4D4D', fontSize: '0.85rem' }}>{authError}</span>}
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Unlock size={18} />
              <span>{t.verifyEmpBtn}</span>
            </button>
          </form>
        </div>
      ) : (
        /* VERIFIED FORM 2 CONTENT */
        <form onSubmit={handleSubmitForm2} className="glass-panel animate-fade-in" style={{ padding: '36px' }}>
          
          {/* VERIFIED BADGE */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 229, 255, 0.12)',
            border: '1px solid #00E5FF',
            color: '#00E5FF',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '24px'
          }}>
            <CheckCircle size={16} />
            <span>{t.verifiedBadgeText}: {formData.empId || empIdInput}</span>
          </div>

          {/* CEO QUESTION CARD */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(8, 30, 90, 0.6) 0%, rgba(3, 15, 50, 0.8) 100%)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#FFD700', marginBottom: '12px' }}>
              <MessageSquareQuote size={24} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{t.ceoQuestionTitle}</h4>
            </div>

            <p style={{
              fontSize: '1.15rem',
              color: 'white',
              fontStyle: 'italic',
              lineHeight: 1.6,
              fontWeight: 500
            }}>
              {t.ceoQuestionText}
            </p>
          </div>

          {/* REFLECTION TEXTAREA */}
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.95rem' }}>
              Your Family's Reflection *
            </label>
            <textarea 
              rows={6}
              className="form-textarea"
              placeholder={t.reflectionPlaceholder}
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#A0B2D6', marginTop: '4px' }}>
              {textError ? (
                <span style={{ color: '#FF4D4D' }}>{textError}</span>
              ) : (
                <span>Describe your emotional experience, family bonding, and Kando moment.</span>
              )}
              <span>{reflectionText.length} chars</span>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button 
            type="submit" 
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1.1rem', marginTop: '16px' }}
          >
            <span>{t.submitForm2Btn}</span>
            <ArrowRight size={20} />
          </button>

        </form>
      )}

    </div>
  );
};
