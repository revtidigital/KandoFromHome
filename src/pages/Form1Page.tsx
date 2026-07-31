import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Upload, Image as ImageIcon, AlertTriangle, X, CheckCircle } from 'lucide-react';

export const Form1Page: React.FC = () => {
  const { t, formData, setFormData, navigateTo, language, apiBaseUrl } = useApp();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [photo1Preview, setPhoto1Preview] = useState<string | null>(null);
  const [photo2Preview, setPhoto2Preview] = useState<string | null>(null);

  const [dataConsent, setDataConsent] = useState(true);
  const [mediaConsent, setMediaConsent] = useState(true);

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

  // File Upload Handler with Max 10MB per Image Limit (Req 4)
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'photo1' | 'photo2') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size limit: Max 10MB per image
    const MAX_PHOTO_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_PHOTO_SIZE) {
      setErrors(prev => ({ ...prev, [field]: 'Photo size exceeds 10MB limit. Please choose a smaller image.' }));
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

    // 6. Photo Validation
    if (!formData.photo1) {
      newErrors.photo1 = 'At least Photo 1 is required.';
    }

    // 7. Privacy Policy Consent
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

      // 2. Check if user already submitted Form 1 (1 User = 1 Submission Validation Req 4)
      const checkRes = await fetch(`${apiBaseUrl}/api/check-submission?empId=${encodeURIComponent(formData.empId.trim())}&email=${encodeURIComponent(formData.email.trim())}`);
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (checkData.hasForm1) {
          setDuplicateError(`User (${formData.empId}) has already submitted Form 1. Duplicate submissions are not allowed.`);
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
      body.append('ceoReflection', formData.ceoReflection || '');
      body.append('language', language);

      if (formData.photo1) body.append('photo1', formData.photo1);
      if (formData.photo2) body.append('photo2', formData.photo2);

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
        <h1 className="heading-font" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'white', marginBottom: '8px' }}>
          {t.form1Title}
        </h1>
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

      <form onSubmit={handleSubmit} className="glass-card form-card-panel" style={{ borderRadius: '20px', width: '100%', boxSizing: 'border-box' }}>
        
        {/* PERSONAL DETAILS SECTION */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.15rem', color: '#00E5FF', marginBottom: '16px', fontWeight: 700 }}>
            1. Employee & Family Details
          </h2>

          <div className="form-fields-grid">
            <div style={{ minWidth: 0 }}>
              <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '6px' }}>{t.fullName} *</label>
              <input
                type="text"
                value={formData.empName}
                onChange={e => setFormData(prev => ({ ...prev, empName: e.target.value }))}
                placeholder="e.g. Rahul Sharma"
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
                placeholder="e.g. YMI-1049"
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
              <div style={{ display: 'flex', gap: '6px', minWidth: 0, width: '100%' }}>
                <select
                  value={countryCode}
                  onChange={e => setCountryCode(e.target.value)}
                  style={{
                    padding: '12px 6px', borderRadius: '10px',
                    background: '#040F2B', border: '1px solid rgba(255,255,255,0.2)',
                    color: '#00E5FF', fontWeight: 700, outline: 'none', cursor: 'pointer', fontSize: '0.85rem',
                    flexShrink: 0, width: '85px'
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
                  placeholder="9876543210"
                  style={{
                    flex: 1, minWidth: 0, width: '100%', padding: '12px 12px', borderRadius: '10px', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.06)', border: errors.phone ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.2)',
                    color: 'white', outline: 'none', fontSize: '0.9rem'
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
                placeholder="e.g. Surajpur / Chennai"
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
                placeholder="e.g. 4"
                style={{
                  width: '100%', minWidth: 0, padding: '12px 14px', borderRadius: '10px', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white', outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* MEDIA ASSETS UPLOAD SECTION */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.15rem', color: '#00E5FF', marginBottom: '8px', fontWeight: 700 }}>
            2. Upload Photos (Max 2 Photos, Max 10MB each)
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '16px' }}>
            Upload up to 2 high-resolution photos of your family Kando DIY Wall (All image formats supported).
          </p>

          <div className="form-photos-grid">
            
            {/* PHOTO 1 */}
            <div>
              <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '6px' }}>
                Photo 1 (Required, Max 10MB) *
              </label>
              {photo1Preview ? (
                <div style={{ position: 'relative', height: '160px', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid #00E5FF' }}>
                  <img src={photo1Preview} alt="Preview 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => handleRemovePhoto('photo1')} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', padding: '6px', color: 'white', cursor: 'pointer' }}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  height: '160px', borderRadius: '12px', border: '2px dashed rgba(0, 229, 255, 0.4)',
                  background: 'rgba(0, 229, 255, 0.04)', cursor: 'pointer', textAlign: 'center', padding: '16px'
                }}>
                  <ImageIcon size={28} color="#00E5FF" />
                  <span style={{ fontSize: '0.85rem', color: '#CBD5E1', marginTop: '8px' }}>Click to select Photo 1</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>All image formats (Max 10MB)</span>
                  <input type="file" accept="image/*" onChange={e => handlePhotoChange(e, 'photo1')} style={{ display: 'none' }} />
                </label>
              )}
              {errors.photo1 && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.photo1}</p>}
            </div>

            {/* PHOTO 2 */}
            <div>
              <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '6px' }}>
                Photo 2 (Optional, Max 10MB)
              </label>
              {photo2Preview ? (
                <div style={{ position: 'relative', height: '160px', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid #00E5FF' }}>
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
                  <span style={{ fontSize: '0.85rem', color: '#CBD5E1', marginTop: '8px' }}>Click to select Photo 2</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>All image formats (Max 10MB)</span>
                  <input type="file" accept="image/*" onChange={e => handlePhotoChange(e, 'photo2')} style={{ display: 'none' }} />
                </label>
              )}
              {errors.photo2 && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.photo2}</p>}
            </div>

          </div>
        </div>

        {/* CEO REFLECTION */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '6px' }}>
            Reflection Message (Share your Kando Experience)
          </label>
          <textarea
            rows={3}
            value={formData.ceoReflection}
            onChange={e => setFormData(prev => ({ ...prev, ceoReflection: e.target.value }))}
            placeholder="Share a short note about creating this Kando DIY wall with your family..."
            style={{
              width: '100%', padding: '12px 14px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)',
              color: 'white', outline: 'none', resize: 'vertical'
            }}
          />
        </div>

        {/* CONSENTS & SUBMIT */}
        <div style={{ marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#CBD5E1', fontSize: '0.85rem' }}>
            <input type="checkbox" checked={dataConsent} onChange={e => setDataConsent(e.target.checked)} style={{ accentColor: '#00E5FF' }} />
            I agree to the Terms & Conditions and Privacy Policy. *
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#CBD5E1', fontSize: '0.85rem' }}>
            <input type="checkbox" checked={mediaConsent} onChange={e => setMediaConsent(e.target.checked)} style={{ accentColor: '#00E5FF' }} />
            I grant Yamaha permission to feature my submission photos in internal publications.
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%', padding: '16px', borderRadius: '14px',
            background: 'linear-gradient(90deg, #00C6FF 0%, #0072FF 100%)',
            border: 'none', color: 'white', fontSize: '1.05rem', fontWeight: 800,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            boxShadow: '0 6px 20px rgba(0, 198, 255, 0.4)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}
        >
          {isSubmitting ? 'Submitting...' : 'SUBMIT FORM 1'}
          <CheckCircle size={18} />
        </button>

      </form>
    </div>
  );
};
