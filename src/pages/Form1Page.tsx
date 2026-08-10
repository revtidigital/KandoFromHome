import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Upload, Image as ImageIcon, FileVideo, AlertTriangle, X, CheckCircle, Loader2, Star } from 'lucide-react';
import { useCaptcha } from '../hooks/useCaptcha';

/* Numbered circular badge — echoes the "1 / 2 / 3" star badges on the
   "My Yamaha Promise" fill-in card in the campaign artwork. */
const StepBadge: React.FC<{ n: number }> = ({ n }) => (
  <div style={{
    width: '30px', height: '30px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #D1B07B 0%, #B8935E 100%)',
    color: '#020B2A', fontWeight: 800, fontSize: '0.95rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, boxShadow: '0 2px 8px rgba(209, 176, 123, 0.4)'
  }}>
    {n}
  </div>
);

export const Form1Page: React.FC = () => {
  const { t, formData, setFormData, navigateTo, language, apiBaseUrl } = useApp();
  const { getCaptchaToken } = useCaptcha(apiBaseUrl);

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

  const [photo1Preview, setPhoto1Preview] = useState<string | null>(null);
  const [photo2Preview, setPhoto2Preview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  const [dataConsent, setDataConsent] = useState(false);
  const [mediaConsent, setMediaConsent] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [department, setDepartment] = useState('');

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 40 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, video: 'Video size exceeds 40MB limit.' }));
      return;
    }
    setErrors(prev => ({ ...prev, video: '' }));
    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleRemoveVideo = () => {
    setVideo(null);
    setVideoPreview(null);
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
      setPhoto1Preview(objectUrl);
    } else {
      setFormData(prev => ({ ...prev, photo2: file }));
      setPhoto2Preview(objectUrl);
    }
  };

  const handleRemovePhoto = (field: 'photo1' | 'photo2') => {
    if (field === 'photo1') {
      setFormData(prev => ({ ...prev, photo1: null }));
      setPhoto1Preview(null);
    } else {
      setFormData(prev => ({ ...prev, photo2: null }));
      setPhoto2Preview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDuplicateError(null);
    const newErrors: Record<string, string> = {};

    // 1. Employee ID (or Phone, if no Employee ID) Validation
    if (!formData.empId.trim() && !formData.phone.trim()) {
      newErrors.empId = t.errEmpIdRequired;
    } else if (idCheckStatus === 'invalid') {
      newErrors.empId = hasNoEmpId
        ? 'This Phone Number was not found in company records.'
        : 'This Employee ID was not found in company records.';
    } else if (idCheckStatus === 'checking') {
      newErrors.empId = 'Please wait, checking eligibility...';
    }

    // 2. Full Name Validation
    if (!formData.empName.trim()) {
      newErrors.empName = t.errEmpNameRequired;
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
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (checkData.hasForm1) {
          setDuplicateError(`${identityLabel} has already submitted Submit DIY Kondo kit. Duplicate submissions are not allowed.`);
          setIsSubmitting(false);
          return;
        }
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
        setDuplicateError(errData.error || 'Failed to submit Submit DIY Kondo kit.');
        setIsSubmitting(false);
        return;
      }

      // Save refId for thank you page
      const generatedRefId = 'KANDO-2026-' + Math.floor(1000 + Math.random() * 9000);
      setFormData(prev => ({ ...prev, refId: generatedRefId }));

      navigateTo('thankyou1');
    } catch (err) {
      console.error('Submission error:', err);
      // Fallback redirect if backend offline
      navigateTo('thankyou1');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '24px 12px', maxWidth: '900px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        {/* BANNER-STYLE TITLE — echoes the ribbon banner on the campaign fill-in card */}
        <div style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #0A1A4A 0%, #081745 100%)',
          border: '1.5px solid #D1B07B',
          borderRadius: '10px',
          padding: '10px 28px',
          marginBottom: '14px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
        }}>
          <h1 className="heading-font" style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', color: 'white', margin: 0 }}>
            {t.form1Title}
          </h1>
        </div>
        <p style={{ color: '#A0B2D6', fontSize: '0.95rem' }}>
          {t.form1Subtitle}
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

      <form onSubmit={handleSubmit} className="glass-card form-card-panel" style={{ borderRadius: '20px', width: '100%', boxSizing: 'border-box', position: 'relative', overflow: 'hidden' }}>

        {/* Dashed inner frame + corner star doodles — fill-in-card feel */}
        <div style={{
          position: 'absolute', inset: '10px',
          border: '1.5px dashed rgba(209, 176, 123, 0.3)',
          borderRadius: '14px',
          pointerEvents: 'none'
        }} />
        <Star size={16} color="#D1B07B" fill="#D1B07B" style={{ position: 'absolute', top: '18px', right: '22px', opacity: 0.6 }} />
        <Star size={12} color="#D1B07B" fill="#D1B07B" style={{ position: 'absolute', bottom: '18px', left: '22px', opacity: 0.5 }} />

        {/* EMPLOYEE DETAILS SECTION */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.15rem', color: '#D1B07B', marginBottom: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <StepBadge n={1} />
            {t.sec1EmployeeDetailsTitle}
          </h2>

          <div className="form-fields-grid">
            <div style={{ minWidth: 0 }}>
              <label style={{ display: 'block', color: 'var(--label-muted)', fontSize: '0.85rem', marginBottom: '6px' }}>Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="e.g. Yamaha Motor India"
                style={{
                  width: '100%', minWidth: 0, padding: '12px 14px', borderRadius: '10px', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)',
                  color: 'var(--text-main)', outline: 'none'
                }}
              />
            </div>

            <div style={{ minWidth: 0 }}>
              <label style={{ display: 'block', color: 'var(--label-muted)', fontSize: '0.85rem', marginBottom: '6px' }}>{t.empId} {!hasNoEmpId && '*'}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={formData.empId}
                  disabled={formData.phone.trim().length > 0}
                  onChange={e => setFormData(prev => ({ ...prev, empId: e.target.value }))}
                  placeholder="e.g. YMI-1049"
                  style={{
                    width: '100%', minWidth: 0, padding: '12px 40px 12px 14px', borderRadius: '10px', boxSizing: 'border-box',
                    background: formData.phone.trim() ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.06)',
                    border: errors.empId ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.2)',
                    color: formData.phone.trim() ? '#64748B' : 'white', outline: 'none'
                  }}
                />
                {!hasNoEmpId && formData.empId.trim() && (
                  <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                    {idCheckStatus === 'checking' && <Loader2 size={16} color="#94A3B8" className="animate-spin" />}
                    {idCheckStatus === 'valid' && <CheckCircle size={16} color="#4ADE80" />}
                    {idCheckStatus === 'invalid' && <AlertTriangle size={16} color="#EF4444" />}
                  </span>
                )}
              </div>
              <p style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '4px' }}>
                Don't have an Employee ID? Leave this blank and enter your Phone Number below.
              </p>
              {errors.empId && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.empId}</p>}
            </div>

            <div style={{ minWidth: 0 }}>
              <label style={{ display: 'block', color: 'var(--label-muted)', fontSize: '0.85rem', marginBottom: '6px' }}>Phone Number {hasNoEmpId && '*'}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  value={formData.phone}
                  disabled={formData.empId.trim().length > 0}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Only if you have no Employee ID"
                  style={{
                    width: '100%', minWidth: 0, padding: '12px 40px 12px 14px', borderRadius: '10px', boxSizing: 'border-box',
                    background: formData.empId.trim() ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: formData.empId.trim() ? '#64748B' : 'white', outline: 'none'
                  }}
                />
                {hasNoEmpId && formData.phone.trim() && (
                  <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                    {idCheckStatus === 'checking' && <Loader2 size={16} color="#94A3B8" className="animate-spin" />}
                    {idCheckStatus === 'valid' && <CheckCircle size={16} color="#4ADE80" />}
                    {idCheckStatus === 'invalid' && <AlertTriangle size={16} color="#EF4444" />}
                  </span>
                )}
              </div>
            </div>

            <div style={{ minWidth: 0 }}>
              <label style={{ display: 'block', color: 'var(--label-muted)', fontSize: '0.85rem', marginBottom: '6px' }}>{t.fullName} *</label>
              <input
                type="text"
                value={formData.empName}
                onChange={e => setFormData(prev => ({ ...prev, empName: e.target.value }))}
                placeholder="e.g. Rahul Sharma"
                style={{
                  width: '100%', minWidth: 0, padding: '12px 14px', borderRadius: '10px', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.06)', border: errors.empName ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.2)',
                  color: 'var(--text-main)', outline: 'none'
                }}
              />
              {errors.empName && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.empName}</p>}
            </div>

            <div style={{ minWidth: 0 }}>
              <label style={{ display: 'block', color: 'var(--label-muted)', fontSize: '0.85rem', marginBottom: '6px' }}>Department</label>
              <input
                type="text"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                placeholder="e.g. Marketing"
                style={{
                  width: '100%', minWidth: 0, padding: '12px 14px', borderRadius: '10px', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)',
                  color: 'var(--text-main)', outline: 'none'
                }}
              />
            </div>

            <div style={{ minWidth: 0 }}>
              <label style={{ display: 'block', color: 'var(--label-muted)', fontSize: '0.85rem', marginBottom: '6px' }}>Location</label>
              <input
                type="text"
                value={formData.city}
                onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="e.g. Surajpur / Chennai"
                style={{
                  width: '100%', minWidth: 0, padding: '12px 14px', borderRadius: '10px', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)',
                  color: 'var(--text-main)', outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* MEDIA ASSETS UPLOAD SECTION */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.15rem', color: '#D1B07B', marginBottom: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <StepBadge n={2} />
            {t.sec2UploadPhotosTitle}
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '16px' }}>
            {t.sec2UploadPhotosDesc}
          </p>

          <div className="form-photos-grid">

            {/* PHOTO 1 */}
            <div>
              <label style={{ display: 'block', color: 'var(--label-muted)', fontSize: '0.85rem', marginBottom: '6px' }}>
                {t.photo1Label}
              </label>
              {photo1Preview ? (
                <div style={{ position: 'relative', height: '160px', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid #D1B07B' }}>
                  <img src={photo1Preview} alt="Preview 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => handleRemovePhoto('photo1')} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', padding: '6px', color: 'white', cursor: 'pointer' }}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  height: '160px', borderRadius: '12px', border: '2px dashed rgba(209, 176, 123, 0.4)',
                  background: 'rgba(209, 176, 123, 0.04)', cursor: 'pointer', textAlign: 'center', padding: '16px'
                }}>
                  <ImageIcon size={28} color="#D1B07B" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--label-muted)', marginTop: '8px' }}>Click to select Photo 1</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>All photo formats supported (Max 5MB)</span>
                  <input type="file" accept="image/*,.png,.jpg,.jpeg,.gif,.webp,.heic,.heif,.bmp,.svg,.tiff" onChange={e => handlePhotoChange(e, 'photo1')} style={{ display: 'none' }} />
                </label>
              )}
              {errors.photo1 && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.photo1}</p>}
            </div>

            {/* PHOTO 2 */}
            <div>
              <label style={{ display: 'block', color: 'var(--label-muted)', fontSize: '0.85rem', marginBottom: '6px' }}>
                {t.photo2Label}
              </label>
              {photo2Preview ? (
                <div style={{ position: 'relative', height: '160px', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid #D1B07B' }}>
                  <img src={photo2Preview} alt="Preview 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => handleRemovePhoto('photo2')} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', padding: '6px', color: 'white', cursor: 'pointer' }}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  height: '160px', borderRadius: '12px', border: '2px dashed rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.02)', cursor: 'pointer', textAlign: 'center', padding: '16px'
                }}>
                  <Upload size={28} color="#A0B2D6" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--label-muted)', marginTop: '8px' }}>Click to select Photo 2</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>All photo formats supported (Max 5MB)</span>
                  <input type="file" accept="image/*,.png,.jpg,.jpeg,.gif,.webp,.heic,.heif,.bmp,.svg,.tiff" onChange={e => handlePhotoChange(e, 'photo2')} style={{ display: 'none' }} />
                </label>
              )}
              {errors.photo2 && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.photo2}</p>}
            </div>

          </div>

          {/* OPTIONAL VIDEO UPLOAD IN FORM 1 */}
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', color: 'var(--label-muted)', fontSize: '0.85rem', marginBottom: '6px' }}>
              {t.sec2UploadVideoTitle}
            </label>
            {videoPreview ? (
              <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', border: '1.5px solid #D1B07B', background: 'black' }}>
                <video src={videoPreview} controls style={{ width: '100%', maxHeight: '260px', display: 'block' }} />
                <button
                  type="button"
                  onClick={handleRemoveVideo}
                  style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '50%', padding: '6px', color: 'white', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                height: '140px', borderRadius: '12px', border: '2px dashed rgba(209, 176, 123, 0.4)',
                background: 'rgba(209, 176, 123, 0.04)', cursor: 'pointer', textAlign: 'center', padding: '16px'
              }}>
                <FileVideo size={32} color="#D1B07B" />
                <span style={{ fontSize: '0.85rem', color: 'var(--label-muted)', marginTop: '8px', fontWeight: 600 }}>Click to select Kando Video (Max 40MB)</span>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>All video formats supported (MP4, MOV, WEBM, AVI, MKV, WMV, etc. Max 40MB)</span>
                <input type="file" accept="video/*,.mp4,.mov,.webm,.avi,.mkv,.wmv,.flv,.m4v,.3gp,.ts" onChange={handleVideoChange} style={{ display: 'none' }} />
              </label>
            )}
            {errors.video && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.video}</p>}
          </div>
        </div>

        {/* CONSENTS & SUBMIT */}
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.15rem', color: '#D1B07B', marginBottom: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <StepBadge n={3} />
            Consent &amp; Submit
          </h2>
        </div>
        <div style={{ marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Terms & Conditions */}
          <div>
            <label style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer',
              padding: '12px', borderRadius: '10px',
              border: errors.dataConsent ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.1)',
              background: errors.dataConsent ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.02)'
            }}>
              <input type="checkbox" checked={dataConsent}
                onChange={e => { setDataConsent(e.target.checked); if (e.target.checked) setErrors(prev => ({ ...prev, dataConsent: '' })); }}
                style={{ accentColor: '#D1B07B', width: '18px', height: '18px', flexShrink: 0, marginTop: '2px' }} />
              <span style={{ color: 'var(--label-muted)', fontSize: '0.87rem', lineHeight: 1.5 }}>
                I agree to the{' '}
                <a href={`/${language}/terms`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: '#D1B07B', textDecoration: 'underline' }}>
                  Terms &amp; Conditions
                </a>{' '}
                and{' '}
                <a href={`/${language}/privacy`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: '#D1B07B', textDecoration: 'underline' }}>
                  Privacy Policy
                </a>. *
              </span>
            </label>
            {errors.dataConsent && (
              <p style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertTriangle size={13} /> {errors.dataConsent}
              </p>
            )}
          </div>

          {/* Media Consent */}
          <div>
            <label style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer',
              padding: '12px', borderRadius: '10px',
              border: errors.mediaConsent ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.1)',
              background: errors.mediaConsent ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.02)'
            }}>
              <input type="checkbox" checked={mediaConsent}
                onChange={e => { setMediaConsent(e.target.checked); if (e.target.checked) setErrors(prev => ({ ...prev, mediaConsent: '' })); }}
                style={{ accentColor: '#D1B07B', width: '18px', height: '18px', flexShrink: 0, marginTop: '2px' }} />
              <span style={{ color: 'var(--label-muted)', fontSize: '0.87rem', lineHeight: 1.5 }}>
                I grant Yamaha permission to feature my submission photos in internal publications. *
              </span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !dataConsent || !mediaConsent}
          style={{
            width: '100%', padding: '16px', borderRadius: '14px',
            background: 'linear-gradient(90deg, #D1B07B 0%, #0072FF 100%)',
            border: 'none', color: 'white', fontSize: '1.05rem', fontWeight: 800,
            cursor: (isSubmitting || !dataConsent || !mediaConsent) ? 'not-allowed' : 'pointer',
            boxShadow: '0 6px 20px rgba(209, 176, 123, 0.4)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: '8px',
            opacity: (isSubmitting || !dataConsent || !mediaConsent) ? 0.5 : 1
          }}
        >
          {isSubmitting ? 'Submitting...' : 'SUBMIT DIY KONDO KIT'}
          <CheckCircle size={18} />
        </button>

      </form>
    </div>
  );
};
