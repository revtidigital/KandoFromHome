import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileVideo, AlertTriangle, X, CheckCircle } from 'lucide-react';

export const Form2Page: React.FC = () => {
  const { t, formData, setFormData, navigateTo, language, apiBaseUrl } = useApp();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [dataConsent, setDataConsent] = useState(true);

  const [countryCode, setCountryCode] = useState('+91');
  const [rawPhone, setRawPhone] = useState(formData.phone ? formData.phone.replace(/^\+\d+\s*/, '') : '');

  const COUNTRY_CODES = [
    { code: '+91', flag: '🇮🇳', country: 'India' },
    { code: '+44', flag: '🇬🇧', country: 'UK' },
    { code: '+1',  flag: '🇺🇸', country: 'USA' },
    { code: '+81', flag: '🇯🇵', country: 'Japan' },
    { code: '+971',flag: '🇦🇪', country: 'UAE' },
    { code: '+65', flag: '🇸🇬', country: 'Singapore' }
  ];

  // Video File Change Handler with Max 40MB Limit (Req 4 & 17)
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size limit: Max 40MB for video
    const MAX_VIDEO_SIZE = 40 * 1024 * 1024; // 40MB
    if (file.size > MAX_VIDEO_SIZE) {
      setErrors(prev => ({ ...prev, video: 'Video size exceeds maximum allowed limit of 40MB.' }));
      return;
    }

    setErrors(prev => ({ ...prev, video: '' }));
    const objectUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, video: file }));
    setVideoPreview(objectUrl);
  };

  const handleRemoveVideo = () => {
    setFormData(prev => ({ ...prev, video: null }));
    setVideoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDuplicateError(null);
    const newErrors: Record<string, string> = {};

    // 1. Employee ID Validation
    if (!formData.empId.trim()) {
      newErrors.empId = 'Employee ID is required.';
    }

    // 2. Full Name Validation
    if (!formData.empName.trim()) {
      newErrors.empName = 'Full Employee Name is required.';
    }

    // 3. Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g. name@yamaha-motor.co.in).';
    }

    // 4. Phone 10-Digit Validation (without +91)
    const digitsOnly = rawPhone.replace(/\D/g, '');
    if (!digitsOnly || digitsOnly.length !== 10) {
      newErrors.phone = 'Phone number must be exactly 10 digits without country code.';
    }

    // 5. City Validation
    if (!formData.city.trim()) {
      newErrors.city = 'City / Plant Location is required.';
    }

    // 6. Video File Validation
    if (!formData.video) {
      newErrors.video = 'Video file is required (Max 40MB).';
    }

    // 7. Consent Validation
    if (!dataConsent) {
      newErrors.dataConsent = 'You must accept the data privacy policy.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const fullFormattedPhone = `${countryCode} ${digitsOnly}`;
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
    <div className="container" style={{ padding: '40px 20px', maxWidth: '850px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 className="heading-font" style={{ fontSize: '2.2rem', color: 'white', marginBottom: '8px' }}>
          {t.form2Title}
        </h1>
        <p style={{ color: '#A0B2D6', fontSize: '1rem' }}>
          {t.form2Subtitle}
        </p>
      </div>

      {duplicateError && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1.5px solid #EF4444',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#FCA5A5'
        }}>
          <AlertTriangle color="#EF4444" size={24} />
          <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{duplicateError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card form-card-panel" style={{ borderRadius: '20px' }}>
        
        {/* PERSONAL DETAILS SECTION */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#00E5FF', marginBottom: '20px', fontWeight: 700 }}>
            1. Employee & Family Details
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '6px' }}>{t.fullName} *</label>
              <input
                type="text"
                value={formData.empName}
                onChange={e => setFormData(prev => ({ ...prev, empName: e.target.value }))}
                placeholder="e.g. Priya Sundaram"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '10px', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.06)', border: errors.empName ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.2)',
                  color: 'white', outline: 'none'
                }}
              />
              {errors.empName && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.empName}</p>}
            </div>

            <div>
              <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '6px' }}>{t.empId} *</label>
              <input
                type="text"
                value={formData.empId}
                onChange={e => setFormData(prev => ({ ...prev, empId: e.target.value }))}
                placeholder="e.g. YMI-2281"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '10px', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.06)', border: errors.empId ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.2)',
                  color: 'white', outline: 'none'
                }}
              />
              {errors.empId && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.empId}</p>}
            </div>

            <div>
              <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '6px' }}>{t.officialEmail} *</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="name@yamaha-motor.co.in"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '10px', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.06)', border: errors.email ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.2)',
                  color: 'white', outline: 'none'
                }}
              />
              {errors.email && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.email}</p>}
            </div>

            <div>
              <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '6px' }}>{t.phoneNumber} * (10 Digits)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={countryCode}
                  onChange={e => setCountryCode(e.target.value)}
                  style={{
                    padding: '12px 10px', borderRadius: '10px',
                    background: '#040F2B', border: '1px solid rgba(255,255,255,0.2)',
                    color: '#00E5FF', fontWeight: 700, outline: 'none', cursor: 'pointer', fontSize: '0.9rem'
                  }}
                >
                  {COUNTRY_CODES.map(c => (
                    <option key={c.code} value={c.code} style={{ background: '#040F2B', color: 'white' }}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  maxLength={10}
                  value={rawPhone}
                  onChange={e => setRawPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9444123456"
                  style={{
                    flex: 1, padding: '12px 14px', borderRadius: '10px', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.06)', border: errors.phone ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.2)',
                    color: 'white', outline: 'none', fontSize: '0.95rem'
                  }}
                />
              </div>
              {errors.phone && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.phone}</p>}
            </div>

            <div>
              <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '6px' }}>{t.cityLocation} *</label>
              <input
                type="text"
                value={formData.city}
                onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="e.g. Chennai Plant"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '10px', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.06)', border: errors.city ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.2)',
                  color: 'white', outline: 'none'
                }}
              />
              {errors.city && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.city}</p>}
            </div>

            <div>
              <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '6px' }}>{t.familyMembersCount}</label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.familyMembers}
                onChange={e => setFormData(prev => ({ ...prev, familyMembers: e.target.value }))}
                placeholder="e.g. 3"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '10px', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white', outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* VIDEO UPLOAD SECTION (Max 1 video, Max 40MB limit) */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#00E5FF', marginBottom: '8px', fontWeight: 700 }}>
            2. Upload Kando Video (Max 1 Video, Max 40MB) *
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '20px' }}>
            Upload 1 video of your family making the DIY Craft Wall (MP4, WEBM, MOV, etc. Max 40MB limit).
          </p>

          {videoPreview ? (
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1.5px solid #00E5FF', background: 'black' }}>
              <video src={videoPreview} controls style={{ width: '100%', maxHeight: '360px', display: 'block' }} />
              <button
                type="button"
                onClick={handleRemoveVideo}
                style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '50%', padding: '8px', color: 'white', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <label style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              height: '220px', borderRadius: '16px', border: '2px dashed rgba(0, 229, 255, 0.4)',
              background: 'rgba(0, 229, 255, 0.04)', cursor: 'pointer', textAlign: 'center', padding: '24px'
            }}>
              <FileVideo size={40} color="#00E5FF" />
              <span style={{ fontSize: '1rem', color: 'white', marginTop: '12px', fontWeight: 700 }}>Click to select Kando Video</span>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '4px' }}>All video formats supported (Strict Max Limit: 40MB)</span>
              <input type="file" accept="video/*" onChange={handleVideoChange} style={{ display: 'none' }} />
            </label>
          )}

          {errors.video && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '6px' }}>{errors.video}</p>}
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
          {isSubmitting ? 'Uploading Video...' : 'SUBMIT FORM 2'}
          <CheckCircle size={18} />
        </button>

      </form>
    </div>
  );
};
