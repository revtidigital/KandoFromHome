import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import type { Language } from '../i18n/translations';
import { AlertTriangle, CheckCircle, Upload, Loader2 } from 'lucide-react';
import { useCaptcha } from '../hooks/useCaptcha';
import '../kando_form2_ui.css';

export const Form2Page: React.FC = () => {
  const { t, formData, setFormData, navigateTo, language, setLanguage, apiBaseUrl } = useApp();
  const { getCaptchaToken } = useCaptcha(apiBaseUrl);

  const [companyName, setCompanyName] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState(formData.city || '');
  const [thoughts, setThoughts] = useState('');
  const [optionalFile, setOptionalFile] = useState<File | null>(null);
  const [dataConsent, setDataConsent] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Most employees have an Employee ID; the ~50 without one identify by phone
  // instead. Whichever is filled gets real-time checked against the
  // client-supplied whitelist as the user types.
  const hasNoEmpId = !formData.empId.trim() && formData.phone.trim().length > 0;
  const [idCheckStatus, setIdCheckStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const idCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const value = hasNoEmpId ? formData.phone.trim() : formData.empId.trim();
    if (idCheckTimer.current) clearTimeout(idCheckTimer.current);
    if (!value) {
      setIdCheckStatus('idle');
      return;
    }
    setIdCheckStatus('checking');
    idCheckTimer.current = setTimeout(async () => {
      try {
        const endpoint = hasNoEmpId
          ? `${apiBaseUrl}/api/validate-phone?phone=${encodeURIComponent(value)}`
          : `${apiBaseUrl}/api/validate-empid?id=${encodeURIComponent(value)}`;
        const res = await fetch(endpoint);
        const data = await res.json();
        setIdCheckStatus(data.valid ? 'valid' : 'invalid');
      } catch {
        setIdCheckStatus('idle');
      }
    }, 500);
    return () => { if (idCheckTimer.current) clearTimeout(idCheckTimer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.empId, formData.phone, hasNoEmpId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, optionalFile: 'File size exceeds 50MB limit.' }));
      return;
    }
    setErrors(prev => ({ ...prev, optionalFile: '' }));
    setOptionalFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDuplicateError(null);
    const newErrors: Record<string, string> = {};

    if (!formData.empId.trim() && !formData.phone.trim()) {
      newErrors.empId = t.errEmpIdRequired || 'Employee ID is required.';
    } else if (idCheckStatus === 'invalid') {
      newErrors.empId = hasNoEmpId
        ? 'This Phone Number was not found in company records.'
        : 'This Employee ID was not found in company records.';
    } else if (idCheckStatus === 'checking') {
      newErrors.empId = 'Please wait, checking eligibility...';
    }
    if (!formData.empName.trim()) newErrors.empName = t.errEmpNameRequired || 'Full name is required.';
    if (!thoughts.trim()) newErrors.thoughts = 'Please share your thoughts (required).';
    else if (thoughts.trim().length > 2000) newErrors.thoughts = 'Thoughts must be 2000 characters or less.';
    if (!dataConsent) newErrors.dataConsent = 'You must agree to the Terms & Conditions to proceed.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
      if (optionalFile) body.append('optionalFile', optionalFile);

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
              src="/yamaha-logo (2).png"
              alt="Yamaha — Revs Your Heart"
              onError={(e) => { (e.target as HTMLImageElement).src = '/yamaha_logo.png'; }}
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
                  <span>{t.form2ChairmanScript}</span>
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
                    <span>{t.companyNameLabel}</span>
                  </label>
                  <input
                    className="input"
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="Enter company name"
                    autoComplete="organization"
                  />
                </div>

                <div className="form-grid">
                  <div className="field">
                    <label className="label" htmlFor="employeeEin">
                      <svg className="icon icon--label" aria-hidden="true">
                        <use href="#f2-icon-id-card"></use>
                      </svg>
                      <span>{t.form2EmpEinLabel} {!hasNoEmpId && '*'}</span>
                    </label>
                    <div className="id-field-wrap">
                      <input
                        className={`input${errors.empId ? ' is-invalid' : ''}`}
                        id="employeeEin"
                        type="text"
                        value={formData.empId}
                        disabled={formData.phone.trim().length > 0}
                        onChange={e => setFormData(prev => ({ ...prev, empId: e.target.value }))}
                        placeholder="Enter EIN"
                        autoComplete="off"
                        style={{ paddingRight: '40px', opacity: formData.phone.trim() ? 0.6 : 1 }}
                      />
                      {!hasNoEmpId && formData.empId.trim() && (
                        <span className="id-status-icon">
                          {idCheckStatus === 'checking' && <Loader2 size={16} color="#8d98ac" className="animate-spin" />}
                          {idCheckStatus === 'valid' && <CheckCircle size={16} color="#2e7d3a" />}
                          {idCheckStatus === 'invalid' && <AlertTriangle size={16} color="#b42318" />}
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
                      <span>{t.form2PhoneNumberLabel} {hasNoEmpId && '*'}</span>
                    </label>
                    <div className="id-field-wrap">
                      <input
                        className="input"
                        id="phoneNumber"
                        type="tel"
                        value={formData.phone}
                        disabled={formData.empId.trim().length > 0}
                        onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Only if you have no Employee ID"
                        style={{ paddingRight: '40px', opacity: formData.empId.trim() ? 0.6 : 1 }}
                      />
                      {hasNoEmpId && formData.phone.trim() && (
                        <span className="id-status-icon">
                          {idCheckStatus === 'checking' && <Loader2 size={16} color="#8d98ac" className="animate-spin" />}
                          {idCheckStatus === 'valid' && <CheckCircle size={16} color="#2e7d3a" />}
                          {idCheckStatus === 'invalid' && <AlertTriangle size={16} color="#b42318" />}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="field">
                    <label className="label" htmlFor="employeeName">
                      <svg className="icon icon--label" aria-hidden="true">
                        <use href="#f2-icon-user"></use>
                      </svg>
                      <span>{t.form2EmployeeNameLabel} *</span>
                    </label>
                    <input
                      className={`input${errors.empName ? ' is-invalid' : ''}`}
                      id="employeeName"
                      type="text"
                      value={formData.empName}
                      onChange={e => setFormData(prev => ({ ...prev, empName: e.target.value }))}
                      placeholder="Enter employee name"
                      autoComplete="name"
                    />
                    {errors.empName && <p className="field-error">{errors.empName}</p>}
                  </div>

                  <div className="field">
                    <label className="label" htmlFor="department">
                      <svg className="icon icon--label" aria-hidden="true">
                        <use href="#f2-icon-users"></use>
                      </svg>
                      <span>{t.departmentLabel}</span>
                    </label>
                    <input
                      className="input"
                      id="department"
                      type="text"
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      placeholder="Enter department"
                      autoComplete="organization-title"
                    />
                  </div>

                  <div className="field">
                    <label className="label" htmlFor="location">
                      <svg className="icon icon--label" aria-hidden="true">
                        <use href="#f2-icon-map-pin"></use>
                      </svg>
                      <span>{t.locationLabel}</span>
                    </label>
                    <input
                      className="input"
                      id="location"
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="Enter location"
                      autoComplete="address-level2"
                    />
                  </div>
                </div>

                <div className="field field--thoughts">
                  <label className="label label--thoughts" htmlFor="userThoughts">
                    <svg className="icon icon--label thoughts__icon" aria-hidden="true">
                      <use href="#f2-icon-message"></use>
                    </svg>
                    <span>
                      <strong className="thoughts__title">{t.form2ShareThoughtsTitle}</strong>
                      <span className="thoughts__description">
                        {t.form2ShareThoughtsDesc}
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
                    placeholder="Write your thoughts here..."
                  />
                  <div className="char-count-row">
                    {errors.thoughts
                      ? <p className="field-error" style={{ margin: 0 }}>{errors.thoughts}</p>
                      : <span />}
                    <span className={`char-count${thoughts.length > 1800 ? ' warn' : ''}`}>{thoughts.length}/2000</span>
                  </div>
                </div>

                {/* Optional File Upload */}
                <div className="field field--thoughts">
                  <label className="label" htmlFor="optionalFile">
                    <svg className="icon icon--label" aria-hidden="true">
                      <use href="#f2-icon-message"></use>
                    </svg>
                    <span>{t.form2BrowseOptionalLabel}</span>
                  </label>
                  <label className={`upload-label${optionalFile ? ' has-file' : ''}`} htmlFor="optionalFile">
                    <Upload className="upload-icon" size={20} />
                    <span>{optionalFile ? optionalFile.name : t.form2BrowseFileCta}</span>
                  </label>
                  <input id="optionalFile" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                  {errors.optionalFile && <p className="field-error">{errors.optionalFile}</p>}
                  {optionalFile && (
                    <p className="field-hint" style={{ color: '#2e7d3a' }}>
                      ✓ {optionalFile.name} ({(optionalFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                {/* CONSENT */}
                <label className={`consent-wrap${errors.dataConsent ? ' has-error' : ''} mt-16`}>
                  <input
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
                    </a>. {t.form2ConsentSuffix} *
                  </span>
                </label>
                {errors.dataConsent && (
                  <p className="field-error" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertTriangle size={14} /> {errors.dataConsent}
                  </p>
                )}

                <div className="actions">
                  <button className="submit" type="submit" disabled={isSubmitting || !dataConsent}>
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

                  <div className="privacy">
                    <span className="privacy__badge" aria-hidden="true">
                      <svg className="icon icon--22">
                        <use href="#f2-icon-shield-check"></use>
                      </svg>
                    </span>
                    <p className="privacy__text">
                      <strong>{t.privacyNoteTitle}</strong>
                      {t.form2PrivacyNoteBody}
                    </p>
                  </div>
                </div>
              </form>
            </section>

            <aside className="message-card" aria-label="Message from the Chairman">
              <div className="message-card__body">
                <div className="message-card__quote-row">
                  <span className="message-card__quote" aria-hidden="true">"</span>
                  <p className="message-card__lead">
                    The future is built<br />
                    by our ideas today.
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
                  Share your thoughts and help shape a stronger, more inspiring Yamaha for tomorrow.
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
        </div>
      </main>

      {/* ============================== Footer ============================== */}
      <footer className="f2-site-footer">
        <div className="f2-site-footer__inner">
          <span className="footer__family" aria-hidden="true">
            <svg className="icon">
              <use href="#f2-icon-family"></use>
            </svg>
          </span>

          <p className="footer__tagline">
            <span>Behind every Yamaha action is a family that inspires it.</span>
            <svg className="icon footer__heart" aria-hidden="true">
              <use href="#f2-icon-heart"></use>
            </svg>
          </p>

          <div className="footer__meta">
            <p className="footer__day">YAMAHA DAY 2026</p>
            <p className="footer__kando">KANDO FROM HOME</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
