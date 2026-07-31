import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Upload, FileVideo, Image as ImageIcon, CheckCircle, AlertTriangle, X, ArrowRight } from 'lucide-react';

export const Form1Page: React.FC = () => {
  const { t, formData, setFormData, navigateTo, submissions } = useApp();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  // File upload states
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [photo1Preview, setPhoto1Preview] = useState<string | null>(null);
  const [photo2Preview, setPhoto2Preview] = useState<string | null>(null);

  const [dataConsent, setDataConsent] = useState(true);
  const [mediaConsent, setMediaConsent] = useState(true);

  // File Change Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'photo1' | 'photo2') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 52428800) {
      setErrors(prev => ({ ...prev, [type]: 'File size exceeds maximum limit of 50MB.' }));
      return;
    }

    setErrors(prev => ({ ...prev, [type]: '' }));
    const objectUrl = URL.createObjectURL(file);

    if (type === 'video') {
      setFormData(prev => ({ ...prev, video: file }));
      setVideoPreview(objectUrl);
    } else if (type === 'photo1') {
      setFormData(prev => ({ ...prev, photo1: file }));
      setPhoto1Preview(objectUrl);
    } else if (type === 'photo2') {
      setFormData(prev => ({ ...prev, photo2: file }));
      setPhoto2Preview(objectUrl);
    }
  };

  const handleRemoveFile = (type: 'video' | 'photo1' | 'photo2') => {
    if (type === 'video') {
      setFormData(prev => ({ ...prev, video: null }));
      setVideoPreview(null);
    } else if (type === 'photo1') {
      setFormData(prev => ({ ...prev, photo1: null }));
      setPhoto1Preview(null);
    } else if (type === 'photo2') {
      setFormData(prev => ({ ...prev, photo2: null }));
      setPhoto2Preview(null);
    }
  };

  const handleSubmitForm1 = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.empName.trim()) newErrors.empName = 'Employee name is required.';
    if (!formData.empId.trim()) newErrors.empId = 'Employee ID is required.';
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid official email is required.';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
    if (!formData.city.trim()) newErrors.city = 'City / Plant location is required.';
    if (!formData.familyMembers) newErrors.familyMembers = 'Family members count is required.';

    if (!dataConsent) newErrors.dataConsent = 'You must accept the data privacy policy.';

    // Check Duplicate Employee ID against mock DB
    const existing = submissions.find(s => s.empId.toUpperCase() === formData.empId.trim().toUpperCase());
    if (existing) {
      setDuplicateError(`Employee ID "${formData.empId.trim()}" has already submitted entry ${existing.refId}. Multiple submissions are blocked.`);
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Generate unique reference ID
    const generatedRefId = 'KANDO-2026-' + Math.floor(1000 + Math.random() * 9000);
    setFormData(prev => ({ ...prev, refId: generatedRefId }));

    navigateTo('thankyou1');
  };

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '900px' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 className="heading-font" style={{ fontSize: '2.2rem', color: 'white', marginBottom: '8px' }}>
          {t.form1Title}
        </h1>
        <p style={{ color: '#A0B2D6', fontSize: '1rem' }}>
          {t.form1Subtitle}
        </p>
      </div>

      {/* DUPLICATE SUBMISSION ALERT MODAL */}
      {duplicateError && (
        <div style={{
          background: 'rgba(230, 0, 18, 0.15)',
          border: '1px solid #E60012',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
          color: '#FF8888'
        }}>
          <AlertTriangle size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FF4D4D', marginBottom: '4px' }}>
              Duplicate Submission Blocked
            </h4>
            <p style={{ fontSize: '0.95rem', color: 'white' }}>{duplicateError}</p>
          </div>
          <button 
            onClick={() => setDuplicateError(null)}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* MAIN FORM PANEL */}
      <form onSubmit={handleSubmitForm1} className="glass-panel" style={{ padding: '36px' }}>
        
        {/* SECTION 1: PERSONAL DETAILS */}
        <h3 className="heading-font" style={{
          fontSize: '1.3rem',
          color: '#00E5FF',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>1. Personal & Employment Information</span>
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px'
        }}>
          {/* Employee Name */}
          <div className="form-group">
            <label className="form-label">{t.empNameLabel}</label>
            <input 
              type="text" 
              className="form-input"
              placeholder={t.empNamePlaceholder}
              value={formData.empName}
              onChange={(e) => setFormData({ ...formData, empName: e.target.value })}
            />
            {errors.empName && <span style={{ color: '#FF4D4D', fontSize: '0.8rem' }}>{errors.empName}</span>}
          </div>

          {/* Employee ID */}
          <div className="form-group">
            <label className="form-label">{t.empIdLabel}</label>
            <input 
              type="text" 
              className="form-input"
              placeholder={t.empIdPlaceholder}
              value={formData.empId}
              onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
            />
            {errors.empId && <span style={{ color: '#FF4D4D', fontSize: '0.8rem' }}>{errors.empId}</span>}
          </div>

          {/* Official Email */}
          <div className="form-group">
            <label className="form-label">{t.emailLabel}</label>
            <input 
              type="email" 
              className="form-input"
              placeholder={t.emailPlaceholder}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <span style={{ color: '#FF4D4D', fontSize: '0.8rem' }}>{errors.email}</span>}
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label className="form-label">{t.phoneLabel}</label>
            <input 
              type="tel" 
              className="form-input"
              placeholder={t.phonePlaceholder}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            {errors.phone && <span style={{ color: '#FF4D4D', fontSize: '0.8rem' }}>{errors.phone}</span>}
          </div>

          {/* City / Plant */}
          <div className="form-group">
            <label className="form-label">{t.cityLabel}</label>
            <input 
              type="text" 
              className="form-input"
              placeholder={t.cityPlaceholder}
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            {errors.city && <span style={{ color: '#FF4D4D', fontSize: '0.8rem' }}>{errors.city}</span>}
          </div>

          {/* Family Count */}
          <div className="form-group">
            <label className="form-label">{t.familyCountLabel}</label>
            <input 
              type="number" 
              min="1"
              max="15"
              className="form-input"
              placeholder={t.familyCountPlaceholder}
              value={formData.familyMembers}
              onChange={(e) => setFormData({ ...formData, familyMembers: e.target.value })}
            />
            {errors.familyMembers && <span style={{ color: '#FF4D4D', fontSize: '0.8rem' }}>{errors.familyMembers}</span>}
          </div>
        </div>

        <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.1)', margin: '30px 0' }} />

        {/* SECTION 2: MEDIA UPLOADS */}
        <h3 className="heading-font" style={{
          fontSize: '1.3rem',
          color: '#00E5FF',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>2. {t.mediaUploadTitle}</span>
        </h3>
        <p style={{ color: '#A0B2D6', fontSize: '0.9rem', marginBottom: '24px' }}>
          {t.mediaUploadSubtitle}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* VIDEO DROPZONE */}
          <div className="form-group">
            <label className="form-label">
              <FileVideo size={16} color="#00C6FF" />
              {t.videoUploadLabel}
            </label>

            {videoPreview ? (
              <div style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid #00E5FF',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <video src={videoPreview} style={{ width: '80px', height: '55px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 600, color: 'white', fontSize: '0.9rem' }}>{formData.video?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#00E5FF' }}>
                      {(formData.video!.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                    </div>
                  </div>
                </div>
                <button type="button" onClick={() => handleRemoveFile('video')} style={{ background: 'none', border: 'none', color: '#FF4D4D', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
            ) : (
              <label style={{
                border: '2px dashed rgba(0, 229, 255, 0.4)',
                borderRadius: '16px',
                padding: '28px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                background: 'rgba(4, 14, 42, 0.4)',
                transition: 'all 0.25s ease'
              }}>
                <Upload size={32} color="#00E5FF" />
                <span style={{ fontSize: '0.95rem', color: 'white' }}>
                  {t.uploadDragDropText} <strong style={{ color: '#00E5FF' }}>{t.uploadBrowseText}</strong>
                </span>
                <span style={{ fontSize: '0.8rem', color: '#A0B2D6' }}>{t.maxSizeText}</span>
                <input type="file" accept="video/mp4,video/mov,video/avi" onChange={(e) => handleFileChange(e, 'video')} style={{ display: 'none' }} />
              </label>
            )}
            {errors.video && <span style={{ color: '#FF4D4D', fontSize: '0.8rem' }}>{errors.video}</span>}
          </div>

          {/* PHOTO 1 DROPZONE */}
          <div className="form-group">
            <label className="form-label">
              <ImageIcon size={16} color="#00E5FF" />
              {t.photo1UploadLabel}
            </label>

            {photo1Preview ? (
              <div style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid #00E5FF',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={photo1Preview} alt="Photo 1 preview" style={{ width: '70px', height: '55px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 600, color: 'white', fontSize: '0.9rem' }}>{formData.photo1?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#00E5FF' }}>
                      {(formData.photo1!.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                    </div>
                  </div>
                </div>
                <button type="button" onClick={() => handleRemoveFile('photo1')} style={{ background: 'none', border: 'none', color: '#FF4D4D', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
            ) : (
              <label style={{
                border: '2px dashed rgba(255, 255, 255, 0.25)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                background: 'rgba(4, 14, 42, 0.4)'
              }}>
                <Upload size={28} color="#A0B2D6" />
                <span style={{ fontSize: '0.9rem', color: 'white' }}>
                  {t.uploadDragDropText} <strong style={{ color: '#00E5FF' }}>{t.uploadBrowseText}</strong>
                </span>
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => handleFileChange(e, 'photo1')} style={{ display: 'none' }} />
              </label>
            )}
            {errors.photo1 && <span style={{ color: '#FF4D4D', fontSize: '0.8rem' }}>{errors.photo1}</span>}
          </div>

          {/* PHOTO 2 DROPZONE */}
          <div className="form-group">
            <label className="form-label">
              <ImageIcon size={16} color="#A855F7" />
              {t.photo2UploadLabel}
            </label>

            {photo2Preview ? (
              <div style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid #A855F7',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={photo2Preview} alt="Photo 2 preview" style={{ width: '70px', height: '55px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 600, color: 'white', fontSize: '0.9rem' }}>{formData.photo2?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#A855F7' }}>
                      {(formData.photo2!.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                    </div>
                  </div>
                </div>
                <button type="button" onClick={() => handleRemoveFile('photo2')} style={{ background: 'none', border: 'none', color: '#FF4D4D', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
            ) : (
              <label style={{
                border: '2px dashed rgba(255, 255, 255, 0.25)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                background: 'rgba(4, 14, 42, 0.4)'
              }}>
                <Upload size={28} color="#A0B2D6" />
                <span style={{ fontSize: '0.9rem', color: 'white' }}>
                  {t.uploadDragDropText} <strong style={{ color: '#A855F7' }}>{t.uploadBrowseText}</strong>
                </span>
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => handleFileChange(e, 'photo2')} style={{ display: 'none' }} />
              </label>
            )}
            {errors.photo2 && <span style={{ color: '#FF4D4D', fontSize: '0.8rem' }}>{errors.photo2}</span>}
          </div>
        </div>

        <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.1)', margin: '30px 0' }} />

        {/* SECTION 3: CONSENTS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          <label className="checkbox-container">
            <input 
              type="checkbox" 
              checked={dataConsent} 
              onChange={(e) => setDataConsent(e.target.checked)} 
            />
            <span className="custom-checkbox">
              {dataConsent && <CheckCircle size={14} color="white" />}
            </span>
            <span>{t.dataConsentText}</span>
          </label>
          {errors.dataConsent && <span style={{ color: '#FF4D4D', fontSize: '0.8rem' }}>{errors.dataConsent}</span>}

          <label className="checkbox-container">
            <input 
              type="checkbox" 
              checked={mediaConsent} 
              onChange={(e) => setMediaConsent(e.target.checked)} 
            />
            <span className="custom-checkbox">
              {mediaConsent && <CheckCircle size={14} color="white" />}
            </span>
            <span>{t.mediaConsentText}</span>
          </label>
        </div>

        {/* SUBMIT BUTTON */}
        <button 
          type="submit" 
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1.1rem' }}
        >
          <span>{t.submitForm1Btn}</span>
          <ArrowRight size={20} />
        </button>

      </form>
    </div>
  );
};
