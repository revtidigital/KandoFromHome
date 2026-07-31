import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export const Form2Page: React.FC = () => {
  const { t, formData, setFormData, navigateTo, language, apiBaseUrl } = useApp();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dataConsent, setDataConsent] = useState(true);

  const [rawPhone, setRawPhone] = useState(formData.phone ? formData.phone.replace(/^\+\d+\s*/, '') : '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDuplicateError(null);
    const newErrors: Record<string, string> = {};

    // 1. Employee ID Validation
    if (!formData.empId.trim()) {
      newErrors.empId = t.errEmpIdRequired;
    }

    // 2. Full Name Validation
    if (!formData.empName.trim()) {
      newErrors.empName = t.errEmpNameRequired;
    }

    // 3. Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = t.errEmailRequired;
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = t.errEmailInvalid;
    }

    // 4. Phone 10-Digit Validation (without +91)
    const digitsOnly = rawPhone.replace(/\D/g, '');
    if (!digitsOnly) {
      newErrors.phone = t.errPhoneRequired;
    } else if (digitsOnly.length !== 10) {
      newErrors.phone = t.errPhone10Digits;
    }

    // 5. City Validation
    if (!formData.city.trim()) {
      newErrors.city = t.errCityRequired;
    }

    // 6. Video File Validation
    if (!formData.video) {
      newErrors.video = t.errVideoRequired;
    }

    // 7. Consent Validation
    if (!dataConsent) {
      newErrors.dataConsent = t.errConsentRequired;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const fullFormattedPhone = `+91 ${digitsOnly}`;
    setFormData(prev => ({ ...prev, phone: fullFormattedPhone }));
    setIsSubmitting(true);

    try {
      // 1. Check if Employee ID is already registered under a different email (Unique Employee ID Check)
      const empIdCheck = await fetch(`${apiBaseUrl}/api/check-empid?empId=${encodeURIComponent(formData.empId.trim())}&email=${encodeURIComponent(formData.email.trim())}`);
      if (empIdCheck.ok) {
        const empIdData = await empIdCheck.json();
        if (empIdData.exists && !empIdData.isSameUser) {
          setDuplicateError(`Employee ID "${formData.empId.trim()}" is already registered to another candidate (${empIdData.registeredName}). Each Employee ID must be unique!`);
          setIsSubmitting(false);
          return;
        }
      }

      // 2. Check if user already submitted Form 2 (1 User 1-Time Submission Validation Req 4)
      const checkRes = await fetch(`${apiBaseUrl}/api/check-submission?empId=${encodeURIComponent(formData.empId.trim())}&email=${encodeURIComponent(formData.email.trim())}`);
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (checkData.hasForm2) {
          setDuplicateError(`User (${formData.empId}) has already submitted Form 2. Duplicate submissions are blocked.`);
          setIsSubmitting(false);
          return;
        }
      }

      // 2. Prepare FormData for API submission
      const body = new FormData();
      body.append('empId', formData.empId.trim());
      body.append('empName', formData.empName.trim());
      body.append('email', formData.email.trim());
      body.append('phone', fullFormattedPhone);
      body.append('city', formData.city.trim());
      body.append('familyMembers', formData.familyMembers || '1');
      body.append('language', language);
      if (formData.video) body.append('video', formData.video);

      const submitRes = await fetch(`${apiBaseUrl}/api/submissions/form2`, {
        method: 'POST',
        body
      });

      if (!submitRes.ok) {
        const errData = await submitRes.json();
        setDuplicateError(errData.error || 'Failed to submit Form 2.');
        setIsSubmitting(false);
        return;
      }

      const generatedRefId = 'KANDO-2026-' + Math.floor(1000 + Math.random() * 9000);
      setFormData(prev => ({ ...prev, refId: generatedRefId }));

      navigateTo('thankyou2');
    } catch (err) {
      console.error('Form 2 submission error:', err);
      navigateTo('thankyou2');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '24px 12px', maxWidth: '850px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 className="heading-font" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'white', marginBottom: '8px' }}>
          {t.form2Title}
        </h1>
        <p style={{ color: '#A0B2D6', fontSize: '0.95rem' }}>
          {t.form2Subtitle}
        </p>
      </div>

      {duplicateError && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1.5px solid #EF4444',
          borderRadius: '12px',
          padding: '14px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#FCA5A5'
        }}>
          <AlertTriangle color="#EF4444" size={24} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{duplicateError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card form-card-panel" style={{ borderRadius: '20px', width: '100%', boxSizing: 'border-box' }}>
        
        {/* PERSONAL DETAILS SECTION */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.15rem', color: '#00E5FF', marginBottom: '16px', fontWeight: 700 }}>
            {t.sec1EmployeeDetailsTitle}
          </h2>

          <div className="form-fields-grid">
            <div style={{ minWidth: 0 }}>
              <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '6px' }}>{t.fullName} *</label>
              <input
                type="text"
                value={formData.empName}
                onChange={e => setFormData(prev => ({ ...prev, empName: e.target.value }))}
                placeholder="e.g. Priya Sundaram"
                style={{
                  width: '100%', minWidth: 0, padding: '12px 14px', borderRadius: '10px', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.06)', border: errors.empName ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.2)',
                  color: 'white', outline: 'none'
                }}
              />
              {errors.empName && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.empName}</p>}
            </div>

            <div style={{ minWidth: 0 }}>
              <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '6px' }}>{t.empId} *</label>
              <input
                type="text"
                value={formData.empId}
                onChange={e => setFormData(prev => ({ ...prev, empId: e.target.value }))}
                placeholder="e.g. YMI-2281"
                style={{
                  width: '100%', minWidth: 0, padding: '12px 14px', borderRadius: '10px', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.06)', border: errors.empId ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.2)',
                  color: 'white', outline: 'none'
                }}
              />
              {errors.empId && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.empId}</p>}
            </div>

            <div style={{ minWidth: 0 }}>
              <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '6px' }}>{t.officialEmail} *</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="name@yamaha-motor.co.in"
                style={{
                  width: '100%', minWidth: 0, padding: '12px 14px', borderRadius: '10px', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.06)', border: errors.email ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.2)',
                  color: 'white', outline: 'none'
                }}
              />
              {errors.email && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.email}</p>}
            </div>

            <div style={{ minWidth: 0 }}>
              <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '6px' }}>{t.phoneNumber} * (10 Digits)</label>
              <div style={{ display: 'flex', gap: '8px', minWidth: 0, width: '100%', alignItems: 'center' }}>
                <div style={{
                  padding: '12px 10px', borderRadius: '10px',
                  background: 'rgba(0, 229, 255, 0.12)', border: '1px solid rgba(0, 229, 255, 0.3)',
                  color: '#00E5FF', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px',
                  flexShrink: 0
                }}>
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={rawPhone}
                  onChange={e => setRawPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9444123456"
                  style={{
                    flex: 1, minWidth: 0, width: '100%', padding: '12px 14px', borderRadius: '10px', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.06)', border: errors.phone ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.2)',
                    color: 'white', outline: 'none', fontSize: '0.95rem'
                  }}
                />
              </div>
              {errors.phone && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.phone}</p>}
            </div>

            <div style={{ minWidth: 0 }}>
              <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '6px' }}>{t.cityLocation} *</label>
              <input
                type="text"
                value={formData.city}
                onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="e.g. Chennai Plant"
                style={{
                  width: '100%', minWidth: 0, padding: '12px 14px', borderRadius: '10px', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.06)', border: errors.city ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.2)',
                  color: 'white', outline: 'none'
                }}
              />
              {errors.city && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.city}</p>}
            </div>

            <div style={{ minWidth: 0 }}>
              <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '6px' }}>{t.familyMembersCount}</label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.familyMembers}
                onChange={e => setFormData(prev => ({ ...prev, familyMembers: e.target.value }))}
                style={{
                  width: '100%', minWidth: 0, padding: '12px 14px', borderRadius: '10px', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white', outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* CEO QUESTION & REFLECTION SECTION */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.15rem', color: '#00E5FF', marginBottom: '8px', fontWeight: 700 }}>
            2. {t.ceoQuestionTitle}
          </h2>
          <p style={{ color: '#E2E8F0', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '14px', lineHeight: 1.5 }}>
            {t.ceoQuestionText}
          </p>

          <textarea
            rows={5}
            value={formData.ceoReflection}
            onChange={e => setFormData(prev => ({ ...prev, ceoReflection: e.target.value }))}
            placeholder={t.reflectionPlaceholder}
            style={{
              width: '100%', padding: '14px', borderRadius: '12px', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)',
              color: 'white', outline: 'none', resize: 'vertical', fontSize: '0.95rem'
            }}
          />
        </div>

        {/* CONSENTS & SUBMIT */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#CBD5E1', fontSize: '0.85rem' }}>
            <input type="checkbox" checked={dataConsent} onChange={e => setDataConsent(e.target.checked)} style={{ accentColor: '#00E5FF' }} />
            I agree to the Terms & Conditions and Privacy Policy. *
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%', padding: '16px', borderRadius: '14px',
            background: 'linear-gradient(90deg, #A855F7 0%, #6366F1 100%)',
            border: 'none', color: 'white', fontSize: '1.05rem', fontWeight: 800,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            boxShadow: '0 6px 20px rgba(168, 85, 247, 0.4)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}
        >
          {isSubmitting ? 'Submitting...' : 'SUBMIT FORM 2'}
          <CheckCircle size={18} />
        </button>

      </form>
    </div>
  );
};
