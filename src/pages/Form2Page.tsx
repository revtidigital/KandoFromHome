import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, CheckCircle, Upload, Loader2 } from 'lucide-react';

export const Form2Page: React.FC = () => {
  const { t, formData, setFormData, navigateTo, language, apiBaseUrl } = useApp();

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

      const body = new FormData();
      body.append('empId', cleanEmpId);
      body.append('phone', cleanPhone);
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

  const inputStyle = (hasError?: string) => ({
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    boxSizing: 'border-box' as const,
    background: 'rgba(255,255,255,0.06)',
    border: hasError ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.2)',
    color: 'white',
    outline: 'none',
    fontSize: '0.95rem'
  });

  return (
    <div className="container" style={{ padding: '24px 12px', maxWidth: '850px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h1 className="heading-font" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'white', marginBottom: '8px' }}>
          Chairman Invites Your Thoughts
        </h1>
        <p style={{ color: '#A0B2D6', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
          10 Years from now, what must our brand be doing to ensure future customers still choose us over anyone else?
        </p>
      </div>

      {duplicateError && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)', border: '1.5px solid #EF4444',
          borderRadius: '12px', padding: '14px', marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '12px', color: '#FCA5A5'
        }}>
          <AlertTriangle color="#EF4444" size={24} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{duplicateError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card form-card-panel" style={{ borderRadius: '20px', width: '100%', boxSizing: 'border-box' }}>

        {/* SECTION 1 — EMPLOYEE DETAILS */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.1rem', color: '#00E5FF', marginBottom: '16px', fontWeight: 700 }}>
            Employee Details
          </h2>

          <div className="form-fields-grid">
            {/* Company Name */}
            <div style={{ minWidth: 0 }}>
              <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '6px' }}>Company Name</label>
              <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)}
                placeholder="e.g. Yamaha Motor India" style={inputStyle()} />
            </div>

            {/* Employee EIN (ID) */}
            <div style={{ minWidth: 0 }}>
              <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '6px' }}>Employee EIN {!hasNoEmpId && '*'}</label>
              <div style={{ position: 'relative' }}>
                <input type="text" value={formData.empId}
                  disabled={formData.phone.trim().length > 0}
                  onChange={e => setFormData(prev => ({ ...prev, empId: e.target.value }))}
                  placeholder="e.g. YMI-2281"
                  style={{ ...inputStyle(errors.empId), paddingRight: '40px', opacity: formData.phone.trim() ? 0.5 : 1 }} />
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

            {/* Phone Number (only if no Employee ID) */}
            <div style={{ minWidth: 0 }}>
              <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '6px' }}>Phone Number {hasNoEmpId && '*'}</label>
              <div style={{ position: 'relative' }}>
                <input type="tel" value={formData.phone}
                  disabled={formData.empId.trim().length > 0}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Only if you have no Employee ID"
                  style={{ ...inputStyle(), paddingRight: '40px', opacity: formData.empId.trim() ? 0.5 : 1 }} />
                {hasNoEmpId && formData.phone.trim() && (
                  <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                    {idCheckStatus === 'checking' && <Loader2 size={16} color="#94A3B8" className="animate-spin" />}
                    {idCheckStatus === 'valid' && <CheckCircle size={16} color="#4ADE80" />}
                    {idCheckStatus === 'invalid' && <AlertTriangle size={16} color="#EF4444" />}
                  </span>
                )}
              </div>
            </div>

            {/* Employee Name */}
            <div style={{ minWidth: 0 }}>
              <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '6px' }}>Employee Name *</label>
              <input type="text" value={formData.empName}
                onChange={e => setFormData(prev => ({ ...prev, empName: e.target.value }))}
                placeholder="e.g. Priya Sundaram" style={inputStyle(errors.empName)} />
              {errors.empName && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.empName}</p>}
            </div>

            {/* Department */}
            <div style={{ minWidth: 0 }}>
              <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '6px' }}>Department</label>
              <input type="text" value={department} onChange={e => setDepartment(e.target.value)}
                placeholder="e.g. Marketing" style={inputStyle()} />
            </div>

            {/* Location */}
            <div style={{ minWidth: 0 }}>
              <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '6px' }}>Location</label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Chennai Plant" style={inputStyle()} />
            </div>
          </div>
        </div>

        {/* SECTION 2 — SHARE YOUR THOUGHTS */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.1rem', color: '#00E5FF', marginBottom: '8px', fontWeight: 700 }}>
            Share Your Thoughts *
          </h2>
          <p style={{ color: '#E2E8F0', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '12px', lineHeight: 1.5 }}>
            "10 Years from now, what must our brand be doing to ensure (future) customer still chose us over anyone else."
          </p>
          <textarea
            rows={6}
            maxLength={2000}
            value={thoughts}
            onChange={e => setThoughts(e.target.value)}
            placeholder="Share your thoughts here... (Max 2000 characters)"
            style={{
              width: '100%', padding: '14px', borderRadius: '12px', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.06)',
              border: errors.thoughts ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.2)',
              color: 'white', outline: 'none', resize: 'vertical', fontSize: '0.95rem'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            {errors.thoughts
              ? <p style={{ color: '#EF4444', fontSize: '0.75rem' }}>{errors.thoughts}</p>
              : <span />}
            <span style={{ fontSize: '0.75rem', color: thoughts.length > 1800 ? '#F59E0B' : '#64748B' }}>
              {thoughts.length}/2000
            </span>
          </div>
        </div>

        {/* SECTION 3 — OPTIONAL FILE UPLOAD */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.1rem', color: '#00E5FF', marginBottom: '8px', fontWeight: 700 }}>
            Browse (Optional)
          </h2>
          <p style={{ color: '#A0B2D6', fontSize: '0.85rem', marginBottom: '12px' }}>Max Size: 50MB</p>
          <label style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '16px',
            borderRadius: '12px', border: errors.optionalFile ? '2px dashed #EF4444' : '2px dashed rgba(255,255,255,0.2)',
            cursor: 'pointer', background: 'rgba(255,255,255,0.03)', color: '#CBD5E1', fontSize: '0.9rem'
          }}>
            <Upload size={20} color="#00E5FF" />
            <span>
              {optionalFile ? optionalFile.name : 'Click to browse file (any format, max 50MB)'}
            </span>
            <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
          </label>
          {errors.optionalFile && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.optionalFile}</p>}
          {optionalFile && (
            <p style={{ color: '#4ADE80', fontSize: '0.8rem', marginTop: '6px' }}>
              ✓ {optionalFile.name} ({(optionalFile.size / (1024 * 1024)).toFixed(2)} MB)
            </p>
          )}
        </div>

        {/* CONSENT */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{
            display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer',
            padding: '14px', borderRadius: '12px',
            border: errors.dataConsent ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.1)',
            background: errors.dataConsent ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.03)'
          }}>
            <input
              type="checkbox" checked={dataConsent}
              onChange={e => { setDataConsent(e.target.checked); if (e.target.checked) setErrors(prev => ({ ...prev, dataConsent: '' })); }}
              style={{ accentColor: '#00E5FF', width: '18px', height: '18px', flexShrink: 0, marginTop: '2px' }}
            />
            <span style={{ color: '#CBD5E1', fontSize: '0.87rem', lineHeight: 1.5 }}>
              I agree to the{' '}
              <a href={`/${language}/terms`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: '#00E5FF', textDecoration: 'underline' }}>
                Terms &amp; Conditions
              </a>{' '}
              and{' '}
              <a href={`/${language}/privacy`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: '#00E5FF', textDecoration: 'underline' }}>
                Privacy Policy
              </a>. My response may be shared internally at Yamaha. *
            </span>
          </label>
          {errors.dataConsent && (
            <p style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertTriangle size={14} /> {errors.dataConsent}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !dataConsent}
          style={{
            width: '100%', padding: '16px', borderRadius: '14px',
            background: 'linear-gradient(90deg, #A855F7 0%, #6366F1 100%)',
            border: 'none', color: 'white', fontSize: '1.05rem', fontWeight: 800,
            cursor: (isSubmitting || !dataConsent) ? 'not-allowed' : 'pointer',
            boxShadow: '0 6px 20px rgba(168, 85, 247, 0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            opacity: (isSubmitting || !dataConsent) ? 0.5 : 1
          }}
        >
          {isSubmitting ? 'Submitting...' : 'SUBMIT — Chairman\'s Invitation'}
          <CheckCircle size={18} />
        </button>

      </form>
    </div>
  );
};
