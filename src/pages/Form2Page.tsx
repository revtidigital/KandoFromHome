import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import type { Language } from '../i18n/translations';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { useCaptcha } from '../hooks/useCaptcha';
import '../kando_form2_ui.css';

export const Form2Page: React.FC = () => {
  const { t, formData, setFormData, navigateTo, language, setLanguage, apiBaseUrl } = useApp();
  const { getCaptchaToken } = useCaptcha(apiBaseUrl);

  const [companyName, setCompanyName] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState(formData.city || '');
  const [thoughts, setThoughts] = useState('');
  const [dataConsent, setDataConsent] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Skip is only allowed when this Form2 visit is a direct continuation of a
  // Form1 submission (flag set by Form1Page right before navigating here).
  const canSkip = sessionStorage.getItem('kando_from_form1') === '1';

  const handleSkip = () => {
    sessionStorage.removeItem('kando_from_form1');
    navigateTo('thankyou1');
  };

  // Most employees have an Employee ID; the ~50 without one identify by phone
  // instead. Both fields are checked independently in real time as the user
  // types, so if both are filled at once, each shows its own status.
  const [empIdCheckStatus, setEmpIdCheckStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [phoneCheckStatus, setPhoneCheckStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const empIdCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phoneCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Submit stays disabled until every required field is filled, the
  // Employee ID / Phone has been confirmed against the whitelist, and the
  // consent checkbox is checked.
  const canSubmit = Boolean(
    (empIdCheckStatus === 'valid' || phoneCheckStatus === 'valid') &&
    formData.empName.trim() &&
    thoughts.trim() &&
    thoughts.trim().length <= 2000 &&
    dataConsent
  );

  useEffect(() => {
    const value = formData.empId.trim();
    if (empIdCheckTimer.current) clearTimeout(empIdCheckTimer.current);
    if (!value) {
      setEmpIdCheckStatus('idle');
      return;
    }
    setEmpIdCheckStatus('checking');
    empIdCheckTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/validate-empid?id=${encodeURIComponent(value)}`);
        const data = await res.json();
        setEmpIdCheckStatus(data.valid ? 'valid' : 'invalid');
      } catch {
        setEmpIdCheckStatus('idle');
      }
    }, 500);
    return () => { if (empIdCheckTimer.current) clearTimeout(empIdCheckTimer.current); };
  }, [formData.empId, apiBaseUrl]);

  useEffect(() => {
    const value = formData.phone.trim();
    if (phoneCheckTimer.current) clearTimeout(phoneCheckTimer.current);
    if (!value) {
      setPhoneCheckStatus('idle');
      return;
    }
    setPhoneCheckStatus('checking');
    phoneCheckTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/validate-phone?phone=${encodeURIComponent(value)}`);
        const data = await res.json();
        setPhoneCheckStatus(data.valid ? 'valid' : 'invalid');
      } catch {
        setPhoneCheckStatus('idle');
      }
    }, 500);
    return () => { if (phoneCheckTimer.current) clearTimeout(phoneCheckTimer.current); };
  }, [formData.phone, apiBaseUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDuplicateError(null);
    const newErrors: Record<string, string> = {};

    if (!formData.empId.trim() && !formData.phone.trim()) {
      newErrors.empId = t.errEmpIdRequired || 'Employee ID is required.';
    } else if (formData.phone.trim() && formData.phone.trim().length !== 10) {
      newErrors.phone = 'Please enter a valid 10 digit phone number.';
    } else if (empIdCheckStatus !== 'valid' && phoneCheckStatus !== 'valid') {
      if (empIdCheckStatus === 'checking' || phoneCheckStatus === 'checking') {
        newErrors.empId = 'Please wait, checking eligibility...';
      } else {
        newErrors.empId = formData.empId.trim()
          ? 'This Employee ID was not found in company records.'
          : 'This Phone Number was not found in company records.';
      }
    }
    if (!formData.empName.trim()) newErrors.empName = t.errEmpNameRequired || 'Full name is required.';
    if (!companyName.trim()) newErrors.companyName = 'Company Name is required';
    if (!department.trim()) newErrors.department = 'Department is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    if (!thoughts.trim()) newErrors.thoughts = 'Please share your thoughts (required).';
    else if (thoughts.trim().length > 2000) newErrors.thoughts = 'Thoughts must be 2000 characters or less.';
    if (!dataConsent) newErrors.dataConsent = 'You must agree to the Terms & Conditions to proceed.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const fieldOrder = ['companyName', 'empId', 'empName', 'department', 'location', 'thoughts', 'dataConsent'];
      const fieldToElementId: Record<string, string> = {
        companyName: 'companyName',
        empId: 'employeeEin',
        empName: 'employeeName',
        department: 'department',
        location: 'location',
        thoughts: 'userThoughts',
        dataConsent: 'dataConsentCheckbox'
      };
      const firstErrorField = fieldOrder.find(key => newErrors[key]);
      if (firstErrorField) {
        requestAnimationFrame(() => {
          document.getElementById(fieldToElementId[firstErrorField])
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanEmpId = formData.empId.trim();
      const cleanPhone = formData.phone.trim();
      const identityLabel = cleanEmpId ? `Employee ID "${cleanEmpId}"` : `Phone Number "${cleanPhone}"`;

      // Check duplicate Form 2
      const checkParams = cleanEmpId ? `empId=${encodeURIComponent(cleanEmpId)}` : `phone=${encodeURIComponent(cleanPhone)}`;
      const checkRes = await fetch(`${apiBaseUrl}/api/check-submission?${checkParams}`);
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (checkData.hasForm2) {
          setDuplicateError(`${identityLabel} has already submitted Form 2. Duplicate submissions are blocked.`);
          setIsSubmitting(false);
          return;
        }
      }

      const captchaToken = await getCaptchaToken('form2_submit');
      const body = new FormData();
      body.append('empId', cleanEmpId);
      body.append('phone', cleanPhone);
      body.append('captchaToken', captchaToken);
      body.append('empName', formData.empName.trim());
      body.append('companyName', companyName.trim());
      body.append('department', department.trim());
      body.append('location', location.trim());
      body.append('thoughts', thoughts.trim());
      body.append('language', language);

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
      sessionStorage.removeItem('kando_from_form1');
      navigateTo('thankyou1');
    } catch (err) {
      console.error('Form 2 submission error:', err);
      sessionStorage.removeItem('kando_from_form1');
      navigateTo('thankyou1');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="kando-page-f2">
      {/* SVG Sprite */}
      <svg className="svg-sprite" aria-hidden="true">
        <symbol id="f2-icon-home" viewBox="0 0 24 24">
          <path d="m3 10.5 9-7.5 9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
          <path d="M9 21v-7h6v7" />
        </symbol>
        <symbol id="f2-icon-chevron-down" viewBox="0 0 24 24">
          <path d="m6 9 6 6 6-6" />
        </symbol>
        <symbol id="f2-icon-chevron-left" viewBox="0 0 24 24">
          <path d="m15 18-6-6 6-6" />
        </symbol>
        <symbol id="f2-icon-chevron-right" viewBox="0 0 24 24">
          <path d="m9 18 6-6-6-6" />
        </symbol>
        <symbol id="f2-icon-heart" viewBox="0 0 24 24">
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
        </symbol>
        <symbol id="f2-icon-building" viewBox="0 0 24 24">
          <path d="M4 21V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v16" />
          <path d="M16 9h3a1 1 0 0 1 1 1v11" />
          <path d="M2 21h20" />
          <path d="M8 8h4M8 12h4M8 16h4" />
        </symbol>
        <symbol id="f2-icon-id-card" viewBox="0 0 24 24">
          <rect x="2.5" y="5" width="19" height="14" rx="2" />
          <circle cx="8" cy="10.5" r="2" />
          <path d="M5.3 16c.6-1.6 1.6-2.4 2.7-2.4 1.2 0 2.2.8 2.8 2.4" />
          <path d="M14.5 9h4M14.5 12.5h4M14.5 16h2.8" />
        </symbol>
        <symbol id="f2-icon-user" viewBox="0 0 24 24">
          <circle cx="12" cy="7.5" r="3.5" />
          <path d="M5 21c.9-4.1 3.3-6.2 7-6.2s6.1 2.1 7 6.2" />
        </symbol>
        <symbol id="f2-icon-users" viewBox="0 0 24 24">
          <circle cx="9" cy="8" r="3" />
          <circle cx="17.5" cy="9" r="2.4" />
          <path d="M2.5 20c.8-4.1 3-6.1 6.5-6.1s5.7 2 6.5 6.1" />
          <path d="M15.7 14.3c3.1.2 5 2 5.8 5.1" />
          <path d="M3 9.8a2.4 2.4 0 0 1 0-4.6" />
        </symbol>
        <symbol id="f2-icon-map-pin" viewBox="0 0 24 24">
          <path d="M20 10c0 5.3-8 11-8 11S4 15.3 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </symbol>
        <symbol id="f2-icon-message" viewBox="0 0 24 24">
          <path d="M4 5h16a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 20 17H9l-5.5 4V6.5A1.5 1.5 0 0 1 5 5Z" />
          <path d="M8 10.5h.01M12 10.5h.01M16 10.5h.01" />
        </symbol>
        <symbol id="f2-icon-send" viewBox="0 0 24 24">
          <path d="m22 2-7 20-4-9-9-4Z" />
          <path d="M22 2 11 13" />
        </symbol>
        <symbol id="f2-icon-shield-check" viewBox="0 0 24 24">
          <path d="M12 3 20 6v5.5c0 4.8-3.2 8.3-8 9.5-4.8-1.2-8-4.7-8-9.5V6Z" />
          <path d="m8.8 12.1 2.1 2.1 4.5-4.5" />
        </symbol>
        <symbol id="f2-icon-family" viewBox="0 0 48 42">
          <circle cx="24" cy="7" r="5" />
          <circle cx="8" cy="15" r="4" />
          <circle cx="40" cy="15" r="4" />
          <path d="M13 35c1.2-7.3 5-11 11-11s9.8 3.7 11 11" />
          <path d="M2 32c.7-5.5 2.8-8.3 6-8.3 2 0 3.7 1 4.8 3" />
          <path d="M46 32c-.7-5.5-2.8-8.3-6-8.3-2 0-3.7 1-4.8 3" />
          <path d="M24 36.5s-4.4-2.7-4.4-5.8a2.9 2.9 0 0 1 4.4-1.7 2.9 2.9 0 0 1 4.4 1.7c0 3.1-4.4 5.8-4.4 5.8Z" />
        </symbol>
      </svg>

      {/* ============================== Header ============================== */}
      <header className="f2-site-header">
        <div className="f2-header-inner">
          <a className="f2-brand" href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} aria-label="Yamaha — Revs Your Heart">
            <img
              className="f2-brand-image"
              src="/slgn_flat_red_rgb.svg"
              alt="Yamaha — Revs Your Heart"
              onError={(e) => { (e.target as HTMLImageElement).src = '/yamaha-logo-v2.png'; }}
            />
          </a>

          <p className="f2-header-title">{t.kandoFromHome}</p>

          <nav className="f2-header-nav" aria-label="Primary navigation">
            <a className="f2-header-home" href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>
              <svg className="icon icon--22" aria-hidden="true">
                <use href="#f2-icon-home"></use>
              </svg>
              <span>{t.home}</span>
            </a>

            <span className="f2-header-divider" aria-hidden="true"></span>

            <select
              className="f2-lang"
              aria-label="Choose language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="ta">தமிழ்</option>
            </select>
          </nav>
        </div>
      </header>

      <main className="f2-page">
        <div className="f2-page-background" aria-hidden="true"></div>

        <div className="f2-page-inner">
          <a className="back" href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>
            <svg className="icon icon--18" aria-hidden="true">
              <use href="#f2-icon-chevron-left"></use>
            </svg>
            <span>{t.backBtn}</span>
          </a>

          <div className="layout">
            <section className="form-column" aria-labelledby="form-title">
              <header className="titles">
                <h1 id="form-title" className="titles__main">{t.form2ChairmanTitle}</h1>
                <p className="titles__script">
                  <span>
                    <span className="titles__script-firstletter">{t.form2ChairmanScript.charAt(0)}</span>
                    {t.form2ChairmanScript.slice(1)}
                  </span>
                  <svg className="icon titles__heart" aria-hidden="true">
                    <use href="#f2-icon-heart"></use>
                  </svg>
                </p>
                <p className="titles__sub">{t.form2ChairmanSub}</p>
              </header>

              {duplicateError && (
                <div className="error-banner">
                  <AlertTriangle size={22} style={{ flexShrink: 0 }} />
                  <span>{duplicateError}</span>
                </div>
              )}

              <form className="form" onSubmit={handleSubmit} noValidate>
                <div className="field field--company">
                  <label className="label" htmlFor="companyName">
                    <svg className="icon icon--label" aria-hidden="true">
                      <use href="#f2-icon-building"></use>
                    </svg>
                    <span>{t.companyNameLabel}*</span>
                  </label>
                  <input
                    className={`input${errors.companyName ? ' is-invalid' : ''}`}
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder={t.companyNamePlaceholder}
                    autoComplete="organization"
                  />
                  {errors.companyName && <p className="field-error">{errors.companyName}</p>}
                </div>

                <div className="form-grid">
                  <div className="field">
                    <label className="label" htmlFor="employeeEin">
                      <svg className="icon icon--label" aria-hidden="true">
                        <use href="#f2-icon-id-card"></use>
                      </svg>
                      <span>{t.form2EmpEinLabel}*</span>
                    </label>
                    <div className="id-field-wrap">
                      <input
                        className={`input${formData.empId.trim() && (empIdCheckStatus === 'invalid' || errors.empId) ? ' is-invalid' : ''}`}
                        id="employeeEin"
                        type="text"
                        value={formData.empId}
                        disabled={phoneCheckStatus === 'valid'}
                        onChange={e => setFormData(prev => ({ ...prev, empId: e.target.value }))}
                        placeholder={t.einPlaceholder}
                        autoComplete="off"
                        style={{ paddingRight: '40px', opacity: phoneCheckStatus === 'valid' ? 0.6 : 1 }}
                      />
                      {formData.empId.trim() && (
                        <span className="id-status-icon">
                          {empIdCheckStatus === 'checking' && <Loader2 size={16} color="#8d98ac" className="animate-spin" />}
                          {empIdCheckStatus === 'valid' && <CheckCircle size={16} color="#2e7d3a" />}
                          {empIdCheckStatus === 'invalid' && <AlertTriangle size={16} color="#b42318" />}
                        </span>
                      )}
                    </div>
                    <p className="field-hint">{t.noEmpIdNote}</p>
                    {errors.empId && <p className="field-error">{errors.empId}</p>}
                  </div>

                  <div className="field">
                    <label className="label" htmlFor="phoneNumber">
                      <svg className="icon icon--label" aria-hidden="true">
                        <use href="#f2-icon-id-card"></use>
                      </svg>
                      <span>{t.form2PhoneNumberLabel}*</span>
                    </label>
                    <div className="id-field-wrap" style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8d98ac', fontSize: '0.95em', pointerEvents: 'none' }}>+91</span>
                      <input
                        className={`input${formData.phone.trim() && (phoneCheckStatus === 'invalid' || errors.phone || errors.empId) ? ' is-invalid' : ''}`}
                        id="phoneNumber"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={formData.phone}
                        disabled={empIdCheckStatus === 'valid'}
                        onChange={e => {
                          const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setFormData(prev => ({ ...prev, phone: digitsOnly }));
                        }}
                        placeholder={t.phoneNoEinPlaceholder}
                        style={{ paddingLeft: '42px', paddingRight: '40px', opacity: empIdCheckStatus === 'valid' ? 0.6 : 1 }}
                      />
                      {formData.phone.trim() && (
                        <span className="id-status-icon">
                          {phoneCheckStatus === 'checking' && <Loader2 size={16} color="#8d98ac" className="animate-spin" />}
                          {phoneCheckStatus === 'valid' && <CheckCircle size={16} color="#2e7d3a" />}
                          {phoneCheckStatus === 'invalid' && <AlertTriangle size={16} color="#b42318" />}
                        </span>
                      )}
                    </div>
                    {errors.phone && <p className="field-error">{errors.phone}</p>}
                  </div>

                  <div className="field">
                    <label className="label" htmlFor="employeeName">
                      <svg className="icon icon--label" aria-hidden="true">
                        <use href="#f2-icon-user"></use>
                      </svg>
                      <span>{t.form2EmployeeNameLabel}*</span>
                    </label>
                    <input
                      className={`input${errors.empName ? ' is-invalid' : ''}`}
                      id="employeeName"
                      type="text"
                      value={formData.empName}
                      onChange={e => setFormData(prev => ({ ...prev, empName: e.target.value }))}
                      placeholder={t.employeeNamePlaceholder}
                      autoComplete="name"
                    />
                    {errors.empName && <p className="field-error">{errors.empName}</p>}
                  </div>

                  <div className="field">
                    <label className="label" htmlFor="department">
                      <svg className="icon icon--label" aria-hidden="true">
                        <use href="#f2-icon-users"></use>
                      </svg>
                      <span>{t.departmentLabel}*</span>
                    </label>
                    <input
                      className={`input${errors.department ? ' is-invalid' : ''}`}
                      id="department"
                      type="text"
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      placeholder={t.departmentPlaceholder}
                      autoComplete="organization-title"
                    />
                    {errors.department && <p className="field-error">{errors.department}</p>}
                  </div>

                  <div className="field">
                    <label className="label" htmlFor="location">
                      <svg className="icon icon--label" aria-hidden="true">
                        <use href="#f2-icon-map-pin"></use>
                      </svg>
                      <span>{t.locationLabel}*</span>
                    </label>
                    <input
                      className={`input${errors.location ? ' is-invalid' : ''}`}
                      id="location"
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder={t.locationPlaceholder}
                      autoComplete="address-level2"
                    />
                    {errors.location && <p className="field-error">{errors.location}</p>}
                  </div>
                </div>

                <div className="field field--thoughts">
                  <label className="label label--thoughts" htmlFor="userThoughts">
                    <svg className="icon icon--label thoughts__icon" aria-hidden="true">
                      <use href="#f2-icon-message"></use>
                    </svg>
                    <span>
                      <strong className="thoughts__title">{t.form2ShareThoughtsTitle}*</strong>
                      <span className="thoughts__description">
                        <strong>{t.form2ShareThoughtsDesc}</strong>
                      </span>
                    </span>
                  </label>

                  <textarea
                    className={`textarea${errors.thoughts ? ' is-invalid' : ''}`}
                    id="userThoughts"
                    rows={4}
                    maxLength={2000}
                    value={thoughts}
                    onChange={e => setThoughts(e.target.value)}
                    placeholder={t.thoughtsPlaceholder}
                  />
                  <div className="char-count-row">
                    {errors.thoughts
                      ? <p className="field-error" style={{ margin: 0 }}>{errors.thoughts}</p>
                      : <span />}
                    <span className={`char-count${thoughts.length > 1800 ? ' warn' : ''}`}>{thoughts.length}/2000</span>
                  </div>
                </div>

                {/* CONSENT */}
                <label className={`consent-wrap${errors.dataConsent ? ' has-error' : ''} mt-16`}>
                  <input
                    id="dataConsentCheckbox"
                    type="checkbox"
                    checked={dataConsent}
                    onChange={e => { setDataConsent(e.target.checked); if (e.target.checked) setErrors(prev => ({ ...prev, dataConsent: '' })); }}
                  />
                  <span className="consent-text">
                    {t.consentAgreePrefix}{' '}
                    <a href={`/${language}/terms`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                      {t.consentTermsLink}
                    </a>{' '}
                    {t.consentAndWord}{' '}
                    <a href={`/${language}/privacy`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                      {t.consentPrivacyLink}
                    </a>. {t.form2ConsentSuffix}*
                  </span>
                </label>
                {errors.dataConsent && (
                  <p className="field-error" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertTriangle size={14} /> {errors.dataConsent}
                  </p>
                )}

                <div className="actions" style={{ gridTemplateColumns: canSkip ? 'auto auto' : undefined, justifyContent: 'flex-start' }}>
                  <button className="submit" type="submit" disabled={isSubmitting || !canSubmit}>
                    <svg className="icon icon--22" aria-hidden="true">
                      <use href="#f2-icon-send"></use>
                    </svg>
                    <span className="submit__text">{isSubmitting ? 'Submitting...' : t.form2SubmitBtn}</span>
                    <span className="submit__arrow" aria-hidden="true">
                      <svg className="icon icon--16">
                        <use href="#f2-icon-chevron-right"></use>
                      </svg>
                    </span>
                  </button>

                  {canSkip && (
                    <button
                      type="button"
                      onClick={handleSkip}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--yamaha-blue, #003087)', fontSize: '0.95rem', fontWeight: 700,
                        padding: '10px 16px', whiteSpace: 'nowrap', order: 3
                      }}
                    >
                      {t.form2SkipBtn}
                    </button>
                  )}
                </div>
              </form>
            </section>

            <aside className="message-card" aria-label="Message from the Chairman">
              <div className="message-card__body">
                <div className="message-card__quote-row">
                  <span className="message-card__quote" aria-hidden="true">"</span>
                  <p className="message-card__lead">
                    {t.form2ChairmanQuoteLine1}<br />
                    {t.form2ChairmanQuoteLine2}
                  </p>
                </div>

                <div className="rule" aria-hidden="true">
                  <span className="rule__line"></span>
                  <svg className="icon rule__heart">
                    <use href="#f2-icon-heart"></use>
                  </svg>
                  <span className="rule__line"></span>
                </div>

                <p className="message-card__text">
                  {t.form2ChairmanQuoteText}
                </p>
              </div>

              <img
                className="message-card__image"
                src="/form2_card_image.jpg"
                alt="Navy Yamaha gift box tied with a gold ribbon beside a handwritten thank-you note and a pen."
                onError={(e) => { (e.target as HTMLImageElement).src = '/form2_card_image.png'; }}
              />
            </aside>
          </div>

          <div className="f2-mandatory-note">{t.mandatoryField}</div>
        </div>
      </main>

      {/* ============================== Footer ============================== */}
      <footer className="f2-site-footer">
        <div className="f2-site-footer__inner"></div>
      </footer>
    </div>
  );
};
