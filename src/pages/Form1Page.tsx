import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import type { Language } from '../i18n/translations';
import { AlertTriangle, CheckCircle, Loader2, X } from 'lucide-react';
import { useCaptcha } from '../hooks/useCaptcha';
import '../kando_form1_ui.css';

export const Form1Page: React.FC = () => {
  const { t, formData, setFormData, navigateTo, language, setLanguage, apiBaseUrl } = useApp();
  const { getCaptchaToken } = useCaptcha(apiBaseUrl);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Most employees have an Employee ID; the ~50 without one identify by phone
  // instead. Both fields are checked independently in real time as the user
  // types, so if both are filled at once, each shows its own status.
  const [empIdCheckStatus, setEmpIdCheckStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [phoneCheckStatus, setPhoneCheckStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const empIdCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phoneCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const [photo1Preview, setPhoto1Preview] = useState<string | null>(null);
  const [photo2Preview, setPhoto2Preview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  const [dataConsent, setDataConsent] = useState(false);
  const [mediaConsent, setMediaConsent] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [department, setDepartment] = useState('');

  // Submit stays disabled until every required field is filled, the
  // Employee ID / Phone has been confirmed against the whitelist, and the
  // data consent checkbox is checked (media consent is optional).
  const canSubmit = Boolean(
    (empIdCheckStatus === 'valid' || phoneCheckStatus === 'valid') &&
    formData.empName.trim() &&
    formData.photo1 &&
    formData.photo2 &&
    video &&
    dataConsent
  );

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 40 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, video: 'Video size exceeds 40MB limit.' }));
      return;
    }
    setErrors(prev => ({ ...prev, video: '' }));
    setVideo(file);
    setVideoPreview(prev => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const handleRemoveVideo = () => {
    setVideo(null);
    setVideoPreview(prev => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  };

  // File Upload Handler with Max 5MB per Image Limit
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'photo1' | 'photo2') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size limit: Max 5MB per image
    const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_PHOTO_SIZE) {
      setErrors(prev => ({ ...prev, [field]: 'Photo size exceeds 5MB limit. Please choose a smaller image.' }));
      return;
    }

    setErrors(prev => ({ ...prev, [field]: '' }));
    const objectUrl = URL.createObjectURL(file);

    if (field === 'photo1') {
      setFormData(prev => ({ ...prev, photo1: file }));
      setPhoto1Preview(prev => {
        if (prev) URL.revokeObjectURL(prev);
        return objectUrl;
      });
    } else {
      setFormData(prev => ({ ...prev, photo2: file }));
      setPhoto2Preview(prev => {
        if (prev) URL.revokeObjectURL(prev);
        return objectUrl;
      });
    }
  };

  const handleRemovePhoto = (field: 'photo1' | 'photo2') => {
    if (field === 'photo1') {
      setFormData(prev => ({ ...prev, photo1: null }));
      setPhoto1Preview(prev => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    } else {
      setFormData(prev => ({ ...prev, photo2: null }));
      setPhoto2Preview(prev => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDuplicateError(null);
    const newErrors: Record<string, string> = {};

    // 1. Employee ID (or Phone, if no Employee ID) Validation
    if (!formData.empId.trim() && !formData.phone.trim()) {
      newErrors.empId = t.errEmpIdRequired;
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

    // 2. Full Name Validation
    if (!formData.empName.trim()) {
      newErrors.empName = t.errEmpNameRequired;
    }

    // 2b. Company Name / Department / Location Validation
    if (!companyName.trim()) {
      newErrors.companyName = 'Company Name is required';
    }
    if (!department.trim()) {
      newErrors.department = 'Department is required';
    }
    if (!formData.city.trim()) {
      newErrors.location = 'Location is required';
    }

    // 3. Photo & Video Mandatory Validation
    if (!formData.photo1) {
      newErrors.photo1 = t.errPhoto1Required;
    }
    if (!formData.photo2) {
      newErrors.photo2 = t.errPhoto2Required;
    }
    if (!video) {
      newErrors.video = t.errVideoRequired;
    }

    // 4. Privacy Policy Consent
    if (!dataConsent) {
      newErrors.dataConsent = t.errConsentRequired;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const fieldOrder = ['companyName', 'empId', 'empName', 'department', 'location', 'photo1', 'photo2', 'video', 'dataConsent', 'mediaConsent'];
      const fieldToElementId: Record<string, string> = {
        companyName: 'company',
        empId: 'ein',
        empName: 'employee-name',
        department: 'department',
        location: 'location',
        photo1: 'photo-one',
        photo2: 'photo-two',
        video: 'family-video',
        dataConsent: 'dataConsentCheckbox',
        mediaConsent: 'mediaConsentCheckbox'
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

      // 1. Check for a duplicate submission under this identity
      const checkParams = cleanEmpId ? `empId=${encodeURIComponent(cleanEmpId)}` : `phone=${encodeURIComponent(cleanPhone)}`;
      const checkRes = await fetch(`${apiBaseUrl}/api/check-submission?${checkParams}`);
      if (!checkRes.ok) {
        setDuplicateError('Could not verify your submission status. Please try again.');
        setIsSubmitting(false);
        return;
      }
      const checkData = await checkRes.json();
      if (checkData.hasForm1) {
        setDuplicateError(`${identityLabel} has already submitted Form 1. Duplicate submissions are not allowed.`);
        setIsSubmitting(false);
        return;
      }

      // 2. Prepare FormData for API submission
      const captchaToken = await getCaptchaToken('form1_submit');
      const body = new FormData();
      body.append('empId', cleanEmpId);
      body.append('phone', cleanPhone);
      body.append('captchaToken', captchaToken);
      body.append('empName', formData.empName.trim());
      body.append('companyName', companyName.trim());
      body.append('department', department.trim());
      body.append('location', formData.city.trim());
      body.append('language', language);

      if (formData.photo1) body.append('photo1', formData.photo1);
      if (formData.photo2) body.append('photo2', formData.photo2);
      if (video) body.append('video', video);

      const submitRes = await fetch(`${apiBaseUrl}/api/submissions/form1`, {
        method: 'POST',
        body
      });

      if (!submitRes.ok) {
        const errData = await submitRes.json();
        setDuplicateError(errData.error || 'Failed to submit Form 1.');
        setIsSubmitting(false);
        return;
      }

      // Save refId for thank you page
      const generatedRefId = 'KANDO-2026-' + Math.floor(1000 + Math.random() * 9000);
      setFormData(prev => ({ ...prev, refId: generatedRefId }));

      // Marks that this Form 2 visit is a continuation of Form 1, so Form2Page
      // knows it's safe to show the Skip option.
      sessionStorage.setItem('kando_from_form1', '1');
      navigateTo('form2');
    } catch (err) {
      console.error('Submission error:', err);
      setDuplicateError('Something went wrong while submitting. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="kando-page-f1">
      {/* ============================== Header ============================== */}
      <header className="site-header">
        <a className="yamaha-logo" href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} aria-label="Yamaha home">
          <img
            className="yamaha-logo-img"
            src="/slgn_flat_red_rgb.svg"
            alt="Yamaha — Revs Your Heart"
            onError={(e) => { (e.target as HTMLImageElement).src = '/yamaha-logo-v2.png'; }}
          />
        </a>

        <div className="campaign-title">{t.kandoFromHome}</div>

        <nav className="header-actions" aria-label="Primary navigation">
          <a className="home-link" href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m3.5 10.5 8.5-7 8.5 7" />
              <path d="M5.5 9.2V21h13V9.2M9.5 21v-6h5v6" />
            </svg>
            <span>{t.home}</span>
          </a>

          <span className="header-divider" aria-hidden="true"></span>

          <label className="language-picker">
            <span className="sr-only">Choose language</span>
            <select aria-label="Choose language" value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="ta">தமிழ்</option>
            </select>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="m3 6 5 5 5-5" />
            </svg>
          </label>
        </nav>
      </header>

      <main className="entry-main">
        <div className="paper-texture" aria-hidden="true"></div>

        <a className="back-button" href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} aria-label="Go back">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m14.5 18-6-6 6-6" />
          </svg>
          <span>{t.backBtn}</span>
        </a>

        <section className="entry-grid">
          <div className="form-column">
            <div className="intro-copy">
              <div className="headline-row">
                <h1>{t.form1Title}</h1>
                <svg className="gold-heart" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M24 42S6 31.5 6 16.8C6 9.2 15.3 5.2 20.4 11L24 15l3.6-4C32.7 5.2 42 9.2 42 16.8 42 31.5 24 42 24 42Z" />
                </svg>
              </div>
              <p>{t.form1Subtitle}</p>

              <div className="title-flourish" aria-hidden="true">
                <span></span>
                <svg viewBox="0 0 30 28">
                  <path d="M15 25S3 18 3 8.7C3 4 8.7 1.5 12 5.2L15 8.5l3-3.3C21.3 1.5 27 4 27 8.7 27 18 15 25 15 25Z" />
                </svg>
                <span></span>
              </div>
            </div>

            {duplicateError && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                background: 'rgba(180, 35, 24, 0.06)', border: '1.5px solid #b42318',
                borderRadius: '12px', padding: '14px 18px', marginTop: '16px'
              }}>
                <AlertTriangle color="#b42318" size={22} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#b42318' }}>{duplicateError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="entry-form" noValidate>
              {/* Company Name */}
              <div className="field field-full">
                <label htmlFor="company">{t.companyNameLabel}*</label>
                <input
                  id="company"
                  type="text"
                  className={errors.companyName ? 'has-error' : ''}
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder={t.companyNamePlaceholder}
                  autoComplete="organization"
                />
                {errors.companyName && <p className="file-error">{errors.companyName}</p>}
              </div>

              {/* Employee ID */}
              <div className="field">
                <label htmlFor="ein">{t.empId}*</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="ein"
                    type="text"
                    className={formData.empId.trim() && (empIdCheckStatus === 'invalid' || errors.empId) ? 'has-error' : ''}
                    value={formData.empId}
                    disabled={phoneCheckStatus === 'valid'}
                    onChange={e => setFormData(prev => ({ ...prev, empId: e.target.value }))}
                    placeholder={t.einPlaceholder}
                    autoComplete="off"
                    style={{ paddingRight: '40px' }}
                  />
                  {formData.empId.trim() && (
                    <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                      {empIdCheckStatus === 'checking' && <Loader2 size={16} color="#8d98ac" className="animate-spin" />}
                      {empIdCheckStatus === 'valid' && <CheckCircle size={16} color="#137044" />}
                      {empIdCheckStatus === 'invalid' && <AlertTriangle size={16} color="#b42318" />}
                    </span>
                  )}
                </div>
                <p className="file-name" style={{ marginTop: '4px', whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip' }}>
                  {t.noEmpIdNote}
                </p>
                {errors.empId && <p className="file-error">{errors.empId}</p>}
              </div>

              {/* Phone Number */}
              <div className="field">
                <label htmlFor="phone">{t.form1PhoneNumberLabel}*</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{ position: 'absolute', left: '12px', color: '#8d98ac', fontSize: '0.95em', pointerEvents: 'none' }}>+91</span>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    className={formData.phone.trim() && (phoneCheckStatus === 'invalid' || errors.phone || errors.empId) ? 'has-error' : ''}
                    value={formData.phone}
                    disabled={empIdCheckStatus === 'valid'}
                    onChange={e => {
                      const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData(prev => ({ ...prev, phone: digitsOnly }));
                    }}
                    placeholder={t.phoneNoEinPlaceholder}
                    style={{ paddingLeft: '42px', paddingRight: '40px' }}
                  />
                  {formData.phone.trim() && (
                    <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                      {phoneCheckStatus === 'checking' && <Loader2 size={16} color="#8d98ac" className="animate-spin" />}
                      {phoneCheckStatus === 'valid' && <CheckCircle size={16} color="#137044" />}
                      {phoneCheckStatus === 'invalid' && <AlertTriangle size={16} color="#b42318" />}
                    </span>
                  )}
                </div>
                {errors.phone && <p className="file-error">{errors.phone}</p>}
              </div>

              {/* Employee Name */}
              <div className="field">
                <label htmlFor="employee-name">{t.fullName}*</label>
                <input
                  id="employee-name"
                  type="text"
                  className={errors.empName ? 'has-error' : ''}
                  value={formData.empName}
                  onChange={e => setFormData(prev => ({ ...prev, empName: e.target.value }))}
                  placeholder={t.employeeNamePlaceholder}
                  autoComplete="name"
                />
                {errors.empName && <p className="file-error">{errors.empName}</p>}
              </div>

              {/* Department */}
              <div className="field">
                <label htmlFor="department">{t.departmentLabel}*</label>
                <input
                  id="department"
                  type="text"
                  className={errors.department ? 'has-error' : ''}
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  placeholder={t.departmentPlaceholder}
                />
                {errors.department && <p className="file-error">{errors.department}</p>}
              </div>

              {/* Location */}
              <div className="field">
                <label htmlFor="location">{t.locationLabel}*</label>
                <input
                  id="location"
                  type="text"
                  className={errors.location ? 'has-error' : ''}
                  value={formData.city}
                  onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder={t.locationPlaceholder}
                  autoComplete="address-level2"
                />
                {errors.location && <p className="file-error">{errors.location}</p>}
              </div>

              {/* MEDIA UPLOADS */}
              <fieldset className="upload-section field-full">
                <legend>{t.sec2UploadPhotosTitle}</legend>
                <p className="upload-help">{t.sec2UploadPhotosDesc}</p>

                <div className="upload-grid">
                  {/* PHOTO 1 */}
                  <div className="upload-control">
                    <input
                      className="file-input"
                      id="photo-one"
                      type="file"
                      accept="image/*,.png,.jpg,.jpeg,.gif,.webp,.heic,.heif,.bmp,.svg,.tiff"
                      onChange={e => handlePhotoChange(e, 'photo1')}
                    />
                    <label className={`upload-button${photo1Preview ? ' has-file' : ''}${errors.photo1 ? ' has-error' : ''}`} htmlFor="photo-one">
                      {photo1Preview ? (
                        <img src={photo1Preview} alt="Photo 1 preview" className="upload-type-icon" style={{ objectFit: 'cover', borderRadius: '4px' }} />
                      ) : (
                        <svg className="upload-type-icon" viewBox="0 0 32 32" aria-hidden="true">
                          <rect x="3.5" y="5" width="25" height="22" rx="3" />
                          <circle cx="11" cy="12" r="2.2" />
                          <path d="m6.5 23 6.2-6.3 4.3 4.1 3.7-3.5 4.8 5.7" />
                        </svg>
                      )}
                      <span>
                        <strong>{t.photo1Label}</strong>
                      </span>
                      {photo1Preview ? (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => { e.preventDefault(); handleRemovePhoto('photo1'); }}
                          style={{ cursor: 'pointer' }}
                        >
                          <X size={20} />
                        </span>
                      ) : (
                        <svg className="mini-upload" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12 16V4m0 0L8 8m4-4 4 4M5 15v5h14v-5" />
                        </svg>
                      )}
                    </label>
                    <p className="file-name">{formData.photo1 ? formData.photo1.name : t.noFileSelected}</p>
                    {errors.photo1 && <p className="file-error">{errors.photo1}</p>}
                  </div>

                  {/* PHOTO 2 */}
                  <div className="upload-control">
                    <input
                      className="file-input"
                      id="photo-two"
                      type="file"
                      accept="image/*,.png,.jpg,.jpeg,.gif,.webp,.heic,.heif,.bmp,.svg,.tiff"
                      onChange={e => handlePhotoChange(e, 'photo2')}
                    />
                    <label className={`upload-button${photo2Preview ? ' has-file' : ''}${errors.photo2 ? ' has-error' : ''}`} htmlFor="photo-two">
                      {photo2Preview ? (
                        <img src={photo2Preview} alt="Photo 2 preview" className="upload-type-icon" style={{ objectFit: 'cover', borderRadius: '4px' }} />
                      ) : (
                        <svg className="upload-type-icon" viewBox="0 0 32 32" aria-hidden="true">
                          <rect x="3.5" y="5" width="25" height="22" rx="3" />
                          <circle cx="11" cy="12" r="2.2" />
                          <path d="m6.5 23 6.2-6.3 4.3 4.1 3.7-3.5 4.8 5.7" />
                        </svg>
                      )}
                      <span>
                        <strong>{t.photo2Label}</strong>
                      </span>
                      {photo2Preview ? (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => { e.preventDefault(); handleRemovePhoto('photo2'); }}
                          style={{ cursor: 'pointer' }}
                        >
                          <X size={20} />
                        </span>
                      ) : (
                        <svg className="mini-upload" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12 16V4m0 0L8 8m4-4 4 4M5 15v5h14v-5" />
                        </svg>
                      )}
                    </label>
                    <p className="file-name">{formData.photo2 ? formData.photo2.name : t.noFileSelected}</p>
                    {errors.photo2 && <p className="file-error">{errors.photo2}</p>}
                  </div>

                  {/* VIDEO */}
                  <div className="upload-control">
                    <input
                      className="file-input"
                      id="family-video"
                      type="file"
                      accept="video/*,.mp4,.mov,.webm,.avi,.mkv,.wmv,.flv,.m4v,.3gp,.ts"
                      onChange={handleVideoChange}
                    />
                    <label className={`upload-button${videoPreview ? ' has-file' : ''}${errors.video ? ' has-error' : ''}`} htmlFor="family-video">
                      <svg className="upload-type-icon" viewBox="0 0 32 32" aria-hidden="true">
                        <rect x="3.5" y="7" width="18" height="18" rx="3" />
                        <path d="m21.5 13 7-4v14l-7-4" />
                        <path d="m12 12 5 4-5 4v-8Z" />
                      </svg>
                      <span>
                        <strong>{t.sec2UploadVideoTitle}</strong>
                      </span>
                      {videoPreview ? (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => { e.preventDefault(); handleRemoveVideo(); }}
                          style={{ cursor: 'pointer' }}
                        >
                          <X size={20} />
                        </span>
                      ) : (
                        <svg className="mini-upload" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12 16V4m0 0L8 8m4-4 4 4M5 15v5h14v-5" />
                        </svg>
                      )}
                    </label>
                    <p className="file-name">{video ? video.name : t.noFileSelected}</p>
                    {errors.video && <p className="file-error">{errors.video}</p>}
                  </div>
                </div>

                {videoPreview && (
                  <div style={{ marginTop: '14px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <video src={videoPreview} controls style={{ width: '100%', maxHeight: '220px', display: 'block', background: '#000' }} />
                  </div>
                )}
              </fieldset>

              {/* CONSENTS */}
              <div className="field field-full" style={{ gap: '12px' }}>
                <label
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer',
                    padding: '14px 16px', borderRadius: '12px',
                    border: errors.dataConsent ? '1.5px solid #b42318' : '1px solid var(--border)',
                    background: errors.dataConsent ? 'rgba(180,35,24,0.04)' : 'rgba(255,255,255,0.6)'
                  }}
                >
                  <input
                    id="dataConsentCheckbox"
                    type="checkbox"
                    checked={dataConsent}
                    onChange={e => { setDataConsent(e.target.checked); if (e.target.checked) setErrors(prev => ({ ...prev, dataConsent: '' })); }}
                    style={{ accentColor: 'var(--yamaha-blue)', width: '18px', height: '18px', flexShrink: 0, marginTop: '2px' }}
                  />
                  <span style={{ fontSize: '0.87rem', lineHeight: 1.5 }}>
                    {t.consentAgreePrefix}{' '}
                    <a href={`/${language}/terms`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: 'var(--yamaha-blue)', textDecoration: 'underline' }}>
                      {t.consentTermsLink}
                    </a>{' '}
                    {t.consentAndWord}{' '}
                    <a href={`/${language}/privacy`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: 'var(--yamaha-blue)', textDecoration: 'underline' }}>
                      {t.consentPrivacyLink}
                    </a>.*
                  </span>
                </label>
                {errors.dataConsent && (
                  <p className="file-error" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertTriangle size={13} /> {errors.dataConsent}
                  </p>
                )}

                <label
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer',
                    padding: '14px 16px', borderRadius: '12px',
                    border: errors.mediaConsent ? '1.5px solid #b42318' : '1px solid var(--border)',
                    background: errors.mediaConsent ? 'rgba(180,35,24,0.04)' : 'rgba(255,255,255,0.6)'
                  }}
                >
                  <input
                    id="mediaConsentCheckbox"
                    type="checkbox"
                    checked={mediaConsent}
                    onChange={e => { setMediaConsent(e.target.checked); if (e.target.checked) setErrors(prev => ({ ...prev, mediaConsent: '' })); }}
                    style={{ accentColor: 'var(--yamaha-blue)', width: '18px', height: '18px', flexShrink: 0, marginTop: '2px' }}
                  />
                  <span style={{ fontSize: '0.87rem', lineHeight: 1.5 }}>
                    {t.form1MediaConsentText}*
                  </span>
                </label>
                {errors.mediaConsent && (
                  <p className="file-error" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertTriangle size={13} /> {errors.mediaConsent}
                  </p>
                )}
              </div>

              <button className="submit-button" type="submit" disabled={isSubmitting || !canSubmit}>
                <svg className="submit-upload-icon" viewBox="0 0 28 28" aria-hidden="true">
                  <path d="M14 18V4m0 0L9 9m5-5 5 5M5 17v7h18v-7" />
                </svg>
                <span>{isSubmitting ? 'Submitting...' : t.form1SubmitBtn}</span>
                <svg className="submit-arrow" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m9 5 7 7-7 7" />
                </svg>
              </button>
            </form>
          </div>

          <aside className="visual-column" aria-label="Family Kando Moment">
            <div className="polaroid-wrap">
              <figure className="polaroid-frame">
                <img
                  src="/png.webp"
                  alt="A smiling family holding an Our Kando Moment sign"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = img.src.includes('.webp') ? '/png.png' : '/user_form1_right.png';
                  }}
                />
              </figure>
            </div>
          </aside>
        </section>

        <div className="mandatory-note">{t.mandatoryField}</div>
      </main>

      {/* ============================== Footer ============================== */}
      <footer className="page-footer">
        <div className="footer-inner"></div>
      </footer>
    </div>
  );
};
