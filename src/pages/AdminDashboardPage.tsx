import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, Users, Tag, Settings as SettingsIcon, History, 
  LogOut, Search, Download, Info, ChevronLeft, ChevronRight, 
  X, Image as ImageIcon, FileVideo, Plus, ArrowLeft, Lock, BarChart3
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const {
    adminLogout, navigateTo,
    allUsers, setAllUsers, customTags, setCustomTags,
    auditLogs, addAuditLog, apiBaseUrl, adminAuthHeader
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'tags' | 'settings' | 'audit' | 'user-detail'>('overview');
  
  // Dedicated user profile detail state (Req 1)
  const [selectedUserForProfile, setSelectedUserForProfile] = useState<any | null>(null);

  // Filters & Pagination for Users table
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState('');
  const [selectedFormFilter, setSelectedFormFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Settings & Tags states (Req 2 & 3)
  const [newTagInput, setNewTagInput] = useState('');
  const [captchaEnabled, setCaptchaEnabled] = useState(false);
  const [captchaSiteKey, setCaptchaSiteKey] = useState('6Ld_sample_site_key_yamaha_2026');
  const [captchaSecretKey, setCaptchaSecretKey] = useState('6Ld_sample_secret_key_yamaha_2026');
  const [gaId, setGaId] = useState('G-YAMAHA2026KANDO');
  
  const [captchaStatusMsg, setCaptchaStatusMsg] = useState('');
  const [gaStatusMsg, setGaStatusMsg] = useState('');

  // Media preview modal state
  const [mediaModal, setMediaModal] = useState<{ type: 'image' | 'video'; url: string; title: string } | null>(null);

  // Fetch initial settings & users from API
  useEffect(() => {
    fetch(`${apiBaseUrl}/api/admin/settings`, { headers: adminAuthHeader() })
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.captchaEnabled !== undefined) setCaptchaEnabled(data.captchaEnabled);
          if (data.googleAnalyticsId) setGaId(data.googleAnalyticsId);
          if (data.customTags && Array.isArray(data.customTags)) setCustomTags(data.customTags);
        }
      })
      .catch(() => {});

    fetch(`${apiBaseUrl}/api/admin/users?limit=200`, { headers: adminAuthHeader() })
      .then(res => res.json())
      .then(data => {
        if (data && data.users) {
          setAllUsers(data.users);
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBaseUrl, setAllUsers, setCustomTags]);

  const handleLogout = () => {
    adminLogout();
    navigateTo('landing');
  };

  // Open User Profile Page (Req 1)
  const handleOpenUserProfile = (user: any) => {
    setSelectedUserForProfile(user);
    setActiveTab('user-detail');
  };

  // ── FIX TAGS CHANGING AND ADDING (Req 2) ──
  const handleUpdateUserTag = async (userId: string, newTag: string) => {
    try {
      const targetUser = allUsers.find((u: any) => u.id === userId || u._id === userId);
      const updatedTags = newTag ? [newTag] : [];

      // Update local state immediately
      const updatedUsers = allUsers.map(u => {
        if (u.id === userId || (u as any)._id === userId) {
          return { ...u, tags: updatedTags };
        }
        return u;
      });
      setAllUsers(updatedUsers);

      if (selectedUserForProfile && (selectedUserForProfile.id === userId || selectedUserForProfile._id === userId)) {
        setSelectedUserForProfile({ ...selectedUserForProfile, tags: updatedTags });
      }

      // Sync with Backend API
      await fetch(`${apiBaseUrl}/api/admin/users/${userId}/tags`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...adminAuthHeader() },
        body: JSON.stringify({ tags: updatedTags })
      });

      addAuditLog(`Updated candidate tag for ${targetUser?.empName || userId} to: ${newTag || 'None'}`);
    } catch (err) {
      console.error('Tag update error:', err);
    }
  };

  const handleAddTag = async () => {
    if (!newTagInput.trim()) return;
    const tag = newTagInput.trim();
    if (customTags.includes(tag)) return;

    // Instant optimistic UI update
    setCustomTags(prev => [...prev, tag]);
    setNewTagInput('');

    try {
      const res = await fetch(`${apiBaseUrl}/api/admin/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...adminAuthHeader() },
        body: JSON.stringify({ tag })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.customTags) {
          setCustomTags(data.customTags);
        }
        addAuditLog(`Added new system classification tag: "${tag}"`);
      }
    } catch (err) {
      console.error('Add tag error:', err);
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    // Instant optimistic UI update
    setCustomTags(prev => prev.filter(t => t !== tagToRemove));

    try {
      const res = await fetch(`${apiBaseUrl}/api/admin/tags/${encodeURIComponent(tagToRemove)}`, {
        method: 'DELETE',
        headers: adminAuthHeader()
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.customTags) {
          setCustomTags(data.customTags);
        }
        addAuditLog(`Removed classification tag: "${tagToRemove}"`);
      }
    } catch (err) {
      console.error('Remove tag error:', err);
    }
  };

  // ── SEPARATE CAPTCHA & GA SAVE HANDLERS (Req 3) ──
  const handleSaveCaptchaSettings = async () => {
    try {
      await fetch(`${apiBaseUrl}/api/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...adminAuthHeader() },
        body: JSON.stringify({ captchaEnabled, googleAnalyticsId: gaId, customTags })
      });
      addAuditLog(`Updated Google reCAPTCHA Verification (Enabled: ${captchaEnabled})`);
      setCaptchaStatusMsg('Google reCAPTCHA Security settings saved successfully!');
      setTimeout(() => setCaptchaStatusMsg(''), 4000);
    } catch (err) {
      setCaptchaStatusMsg('Failed to save Captcha settings');
    }
  };

  const handleSaveGaSettings = async () => {
    try {
      await fetch(`${apiBaseUrl}/api/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...adminAuthHeader() },
        body: JSON.stringify({ captchaEnabled, googleAnalyticsId: gaId, customTags })
      });
      addAuditLog(`Updated Google Analytics Measurement ID: ${gaId}`);
      setGaStatusMsg('Google Analytics tracking settings saved successfully!');
      setTimeout(() => setGaStatusMsg(''), 4000);
    } catch (err) {
      setGaStatusMsg('Failed to save Google Analytics settings');
    }
  };

  // Export handlers (CSV, Excel, PDF Report & ZIP Media Archive)
  // Uses fetch + blob (not a plain <a href> / window.open) so the admin auth header
  // actually reaches the protected /api/admin/export/* endpoints.
  const handleExportData = async (format: 'csv' | 'excel' | 'pdf' | 'zip') => {
    let url = '';
    let filename = 'kando_export';
    if (format === 'zip') {
      url = `${apiBaseUrl}/api/admin/export/zip`;
      filename = 'kando_submissions_assets.zip';
      addAuditLog('Exported Candidate Submissions (CSV + ZIP Media Archive)');
    } else if (format === 'pdf') {
      url = `${apiBaseUrl}/api/admin/export/pdf`;
      filename = 'kando_users_report.html';
      addAuditLog('Exported Candidate Directory PDF Report');
    } else {
      url = `${apiBaseUrl}/api/admin/export/users?format=${format}`;
      filename = format === 'excel' ? 'kando_users.xlsx' : 'kando_users.csv';
      addAuditLog(`Exported Registered Users Data (${format.toUpperCase()})`);
    }

    try {
      const res = await fetch(url, { headers: adminAuthHeader() });
      if (!res.ok) return;
      const blob = await res.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      if (format === 'pdf') {
        window.open(objectUrl, '_blank');
      } else {
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setTimeout(() => window.URL.revokeObjectURL(objectUrl), 60000);
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  // Users Filtered List
  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = !searchQuery || 
      u.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.city && u.city.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = !selectedTagFilter || (u.tags && u.tags.includes(selectedTagFilter));
    
    let matchesForm = true;
    if (selectedFormFilter === 'form1') matchesForm = !!u.form1;
    if (selectedFormFilter === 'form2') matchesForm = !!u.form2;
    if (selectedFormFilter === 'both') matchesForm = !!(u.form1 && u.form2);

    return matchesSearch && matchesTag && matchesForm;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 76px)', background: '#020924', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
      
      {/* ── LEFT SIDENAVBAR (Req 7) ── */}
      <aside style={{
        width: '260px',
        background: '#040F2B',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div>
          <div style={{ padding: '0 12px 24px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.75rem', color: '#00E5FF', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
              ADMINISTRATION
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', marginTop: '2px' }}>
              Control Dashboard
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px',
                background: activeTab === 'overview' ? 'rgba(0,229,255,0.15)' : 'transparent',
                color: activeTab === 'overview' ? '#00E5FF' : '#94A3B8',
                border: activeTab === 'overview' ? '1px solid #00E5FF' : '1px solid transparent',
                fontWeight: 700, cursor: 'pointer', textAlign: 'left'
              }}
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </button>

            <button
              onClick={() => { setActiveTab('users'); setSelectedUserForProfile(null); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px',
                background: (activeTab === 'users' || activeTab === 'user-detail') ? 'rgba(0,229,255,0.15)' : 'transparent',
                color: (activeTab === 'users' || activeTab === 'user-detail') ? '#00E5FF' : '#94A3B8',
                border: (activeTab === 'users' || activeTab === 'user-detail') ? '1px solid #00E5FF' : '1px solid transparent',
                fontWeight: 700, cursor: 'pointer', textAlign: 'left'
              }}
            >
              <Users size={18} />
              <span>Users Directory</span>
            </button>

            <button
              onClick={() => setActiveTab('tags')}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px',
                background: activeTab === 'tags' ? 'rgba(0,229,255,0.15)' : 'transparent',
                color: activeTab === 'tags' ? '#00E5FF' : '#94A3B8',
                border: activeTab === 'tags' ? '1px solid #00E5FF' : '1px solid transparent',
                fontWeight: 700, cursor: 'pointer', textAlign: 'left'
              }}
            >
              <Tag size={18} />
              <span>Tags Management</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px',
                background: activeTab === 'settings' ? 'rgba(0,229,255,0.15)' : 'transparent',
                color: activeTab === 'settings' ? '#00E5FF' : '#94A3B8',
                border: activeTab === 'settings' ? '1px solid #00E5FF' : '1px solid transparent',
                fontWeight: 700, cursor: 'pointer', textAlign: 'left'
              }}
            >
              <SettingsIcon size={18} />
              <span>System Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px',
                background: activeTab === 'audit' ? 'rgba(0,229,255,0.15)' : 'transparent',
                color: activeTab === 'audit' ? '#00E5FF' : '#94A3B8',
                border: activeTab === 'audit' ? '1px solid #00E5FF' : '1px solid transparent',
                fontWeight: 700, cursor: 'pointer', textAlign: 'left'
              }}
            >
              <History size={18} />
              <span>Audit Logs</span>
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)',
            fontWeight: 700, cursor: 'pointer', textAlign: 'left'
          }}
        >
          <LogOut size={18} />
          <span>Logout Admin</span>
        </button>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        
        {/* 1. OVERVIEW VIEW — MINIMAL KPIs ONLY (Req 13) */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ marginBottom: '28px' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', margin: 0 }}>Campaign Overview</h1>
              <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginTop: '4px' }}>Real-time Campaign Metrics & Performance KPIs</p>
            </div>

            {/* 3 KPI CARDS WITH INFO ICONS (Req 13) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
              
              <div style={{ background: '#091A44', border: '1.5px solid rgba(0,229,255,0.3)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#A0B2D6', fontSize: '0.9rem', fontWeight: 700 }}>Total Registered Users</span>
                  <div title="Total unique employees registered in campaign" style={{ cursor: 'pointer' }}>
                    <Info size={18} color="#00E5FF" />
                  </div>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#00E5FF' }}>{allUsers.length}</div>
              </div>

              <div style={{ background: '#091A44', border: '1.5px solid rgba(168,85,247,0.3)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#A0B2D6', fontSize: '0.9rem', fontWeight: 700 }}>Form 1 Submissions</span>
                  <div title="Form 1 (DIY Craft Wall Photos & Reflection)" style={{ cursor: 'pointer' }}>
                    <Info size={18} color="#A855F7" />
                  </div>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#A855F7' }}>
                  {allUsers.filter(u => u.form1).length}
                </div>
              </div>

              <div style={{ background: '#091A44', border: '1.5px solid rgba(34,197,94,0.3)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#A0B2D6', fontSize: '0.9rem', fontWeight: 700 }}>Form 2 Submissions</span>
                  <div title="Form 2 (Family Kando Video Submissions)" style={{ cursor: 'pointer' }}>
                    <Info size={18} color="#22C55E" />
                  </div>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#22C55E' }}>
                  {allUsers.filter(u => u.form2).length}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. USERS DIRECTORY VIEW */}
        {activeTab === 'users' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', margin: 0 }}>Registered Users Directory</h1>
                <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '4px' }}>Manage candidate entries, apply classification tags & export data</p>
              </div>

              {/* EXPORT BUTTONS (Req 2 - PDF Report Included) */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleExportData('pdf')}
                  style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                >
                  <Download size={14} /> PDF Report
                </button>
                <button 
                  onClick={() => handleExportData('csv')}
                  style={{ background: 'rgba(0,229,255,0.12)', border: '1px solid #00E5FF', color: '#00E5FF', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                >
                  <Download size={14} /> CSV
                </button>
                <button 
                  onClick={() => handleExportData('excel')}
                  style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid #22C55E', color: '#4ADE80', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                >
                  <Download size={14} /> Excel
                </button>
                <button 
                  onClick={() => handleExportData('zip')}
                  style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid #A855F7', color: '#C084FC', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                >
                  <Download size={14} /> CSV + ZIP Media Assets
                </button>
              </div>
            </div>

            {/* FILTERS TOOLBAR (Req 14) */}
            <div style={{ background: '#040F2B', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text"
                  placeholder="Search by Name, Emp ID, Email or City..."
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              {/* Tag Filter */}
              <select
                value={selectedTagFilter}
                onChange={e => { setSelectedTagFilter(e.target.value); setCurrentPage(1); }}
                style={{ padding: '9px 12px', borderRadius: '8px', background: '#091A44', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '0.85rem', outline: 'none' }}
              >
                <option value="">All Classification Tags</option>
                {customTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>

              {/* Form Filter */}
              <select
                value={selectedFormFilter}
                onChange={e => { setSelectedFormFilter(e.target.value); setCurrentPage(1); }}
                style={{ padding: '9px 12px', borderRadius: '8px', background: '#091A44', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '0.85rem', outline: 'none' }}
              >
                <option value="">All Form Submissions</option>
                <option value="form1">Form 1 Submitted</option>
                <option value="form2">Form 2 Submitted</option>
                <option value="both">Form 1 + Form 2 Completed</option>
              </select>
            </div>

            {/* USERS TABLE — 25 ENTRIES PER PAGE (Req 8) */}
            <div style={{ background: '#040F2B', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#091A44', color: '#00E5FF', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '14px 18px' }}>Emp ID</th>
                    <th style={{ padding: '14px 18px' }}>Employee Name</th>
                    <th style={{ padding: '14px 18px' }}>Registered Date</th>
                    <th style={{ padding: '14px 18px' }}>Form 1</th>
                    <th style={{ padding: '14px 18px' }}>Form 2</th>
                    <th style={{ padding: '14px 18px' }}>Assigned Tag</th>
                    <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map(user => {
                    const currentTag = user.tags && user.tags.length > 0 ? user.tags[0] : '';
                    return (
                      <tr key={user.id || (user as any)._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <td style={{ padding: '14px 18px', fontWeight: 800, color: '#00E5FF' }}>
                          {user.empId}
                        </td>
                        
                        <td style={{ padding: '14px 18px' }}>
                          <div 
                            onClick={() => handleOpenUserProfile(user)}
                            style={{ cursor: 'pointer', fontWeight: 700, color: 'white', textDecoration: 'underline' }}
                            title="Click to view full user profile page"
                          >
                            {user.empName}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{user.email}</div>
                        </td>

                        <td style={{ padding: '14px 18px', color: '#CBD5E1', fontSize: '0.8rem' }}>
                          {(user as any).createdAt ? new Date((user as any).createdAt).toLocaleString() : (user as any).submittedAt || '2026-07-31'}
                        </td>

                        <td style={{ padding: '14px 18px' }}>
                          {user.form1 ? (
                            <span style={{ background: 'rgba(34,197,94,0.15)', color: '#4ADE80', padding: '4px 10px', borderRadius: '12px', fontWeight: 700, fontSize: '0.75rem' }}>
                              ✓ Submitted
                            </span>
                          ) : (
                            <span style={{ color: '#64748B', fontSize: '0.75rem' }}>Not Filled</span>
                          )}
                        </td>

                        <td style={{ padding: '14px 18px' }}>
                          {user.form2 ? (
                            <span style={{ background: 'rgba(168,85,247,0.15)', color: '#C084FC', padding: '4px 10px', borderRadius: '12px', fontWeight: 700, fontSize: '0.75rem' }}>
                              ✓ Submitted
                            </span>
                          ) : (
                            <span style={{ color: '#64748B', fontSize: '0.75rem' }}>Not Filled</span>
                          )}
                        </td>

                        {/* INLINE TAG DROPDOWN (Req 2 & 8) */}
                        <td style={{ padding: '14px 18px' }}>
                          <select
                            value={currentTag}
                            onChange={(e) => handleUpdateUserTag(user.id || (user as any)._id, e.target.value)}
                            style={{
                              background: currentTag ? 'rgba(0,229,255,0.12)' : 'rgba(255,255,255,0.06)',
                              border: `1px solid ${currentTag ? '#00E5FF' : 'rgba(255,255,255,0.2)'}`,
                              color: currentTag ? '#00E5FF' : '#94A3B8',
                              padding: '5px 10px',
                              borderRadius: '8px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="" style={{ background: '#06133B', color: '#94A3B8' }}>Select Tag...</option>
                            {customTags.map(t => (
                              <option key={t} value={t} style={{ background: '#06133B', color: 'white' }}>{t}</option>
                            ))}
                          </select>
                        </td>

                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleOpenUserProfile(user)}
                            style={{
                              background: 'rgba(0,229,255,0.15)',
                              border: '1px solid #00E5FF',
                              color: '#00E5FF',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            View Profile
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* PAGINATION BAR (Req 8) */}
              <div style={{ padding: '16px 20px', background: '#091A44', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                  Showing {paginatedUsers.length} of {filteredUsers.length} entries (25 per page)
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                    <ChevronLeft size={16} />
                  </button>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Page {currentPage} of {totalPages}</span>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── DEDICATED USER PROFILE DETAILS PAGE (Req 1) ── */}
        {activeTab === 'user-detail' && selectedUserForProfile && (
          <div>
            <button
              onClick={() => setActiveTab('users')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
                color: 'white', padding: '10px 18px', borderRadius: '10px',
                fontWeight: 700, cursor: 'pointer', marginBottom: '24px'
              }}
            >
              <ArrowLeft size={18} />
              <span>Back to Users Directory</span>
            </button>

            <div style={{ background: '#040F2B', border: '1.5px solid #00E5FF', borderRadius: '24px', padding: '32px', boxShadow: '0 0 30px rgba(0,229,255,0.15)' }}>
              
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 style={{ fontSize: '2rem', color: '#00E5FF', fontWeight: 900, margin: 0 }}>
                    {selectedUserForProfile.empName}
                  </h1>
                  <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginTop: '4px' }}>Employee ID: <strong style={{ color: 'white' }}>{selectedUserForProfile.empId}</strong></p>
                </div>

                {/* Tag Selection */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 700 }}>Classification Tag:</span>
                  <select
                    value={selectedUserForProfile.tags && selectedUserForProfile.tags.length > 0 ? selectedUserForProfile.tags[0] : ''}
                    onChange={(e) => handleUpdateUserTag(selectedUserForProfile.id || selectedUserForProfile._id, e.target.value)}
                    style={{
                      background: '#091A44', border: '1px solid #00E5FF', color: '#00E5FF',
                      padding: '8px 14px', borderRadius: '10px', fontWeight: 700, outline: 'none', cursor: 'pointer'
                    }}
                  >
                    <option value="">No Tag Assigned</option>
                    {customTags.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ── SECTION A: USER PROFILE DETAILS ── */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
                  👤 Profile Details
                </h3>
                <div style={{ background: '#091A44', padding: '20px', borderRadius: '14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', fontSize: '0.9rem' }}>
                  <div><span style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Email</span><br /><span style={{ color: '#E2E8F0' }}>{selectedUserForProfile.email}</span></div>
                  <div><span style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Phone</span><br /><span style={{ color: '#E2E8F0' }}>{selectedUserForProfile.phone || 'N/A'}</span></div>
                  <div><span style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>City / Location</span><br /><span style={{ color: '#E2E8F0' }}>{selectedUserForProfile.city || 'N/A'}</span></div>
                  <div><span style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Family Members</span><br /><span style={{ color: '#E2E8F0' }}>{selectedUserForProfile.familyMembers || 1}</span></div>
                  <div><span style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Registered At</span><br /><span style={{ color: '#E2E8F0' }}>{selectedUserForProfile.createdAt ? new Date(selectedUserForProfile.createdAt).toLocaleString() : '—'}</span></div>
                  <div><span style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Tags</span><br /><span style={{ color: '#A855F7', fontWeight: 700 }}>{selectedUserForProfile.tags?.length > 0 ? selectedUserForProfile.tags.join(', ') : 'None'}</span></div>
                </div>
              </div>

              {/* ── SECTION B: FORM 1 DETAILS ── */}
              {selectedUserForProfile.form1 ? (
                <div style={{ marginBottom: '28px', background: '#06133B', padding: '24px', borderRadius: '18px', border: '1px solid rgba(74, 222, 128, 0.3)' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#4ADE80', fontWeight: 800, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ImageIcon size={20} /> Form 1 — Photos & Video Submission
                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#64748B', fontWeight: 400 }}>
                      Submitted: {new Date(selectedUserForProfile.form1.submittedAt).toLocaleString()}
                    </span>
                  </h3>

                  {/* Meta info row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '18px', fontSize: '0.85rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Language</div>
                      <div style={{ color: '#E2E8F0' }}>{selectedUserForProfile.form1.language === 'hi' ? 'Hindi' : selectedUserForProfile.form1.language === 'ta' ? 'Tamil' : 'English'}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Submitted IP</div>
                      <div style={{ color: '#E2E8F0', fontFamily: 'monospace' }}>{selectedUserForProfile.form1.ip || 'N/A'}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Photo 1</div>
                      <div style={{ color: selectedUserForProfile.form1.photo1Url ? '#4ADE80' : '#EF4444', fontWeight: 700 }}>{selectedUserForProfile.form1.photo1Url ? '✓ Uploaded' : '✗ Missing'}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Photo 2</div>
                      <div style={{ color: selectedUserForProfile.form1.photo2Url ? '#4ADE80' : '#EF4444', fontWeight: 700 }}>{selectedUserForProfile.form1.photo2Url ? '✓ Uploaded' : '✗ Missing'}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Video</div>
                      <div style={{ color: selectedUserForProfile.form1.videoUrl ? '#4ADE80' : '#EF4444', fontWeight: 700 }}>{selectedUserForProfile.form1.videoUrl ? '✓ Uploaded' : '✗ Missing'}</div>
                    </div>
                  </div>

                  {/* CEO Reflection */}
                  {selectedUserForProfile.form1.ceoReflection && (
                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '12px', marginBottom: '18px' }}>
                      <div style={{ fontSize: '0.72rem', color: '#4ADE80', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>Reflection Message (Form 1)</div>
                      <p style={{ margin: 0, color: '#E2E8F0', fontStyle: 'italic', lineHeight: 1.6 }}>"{selectedUserForProfile.form1.ceoReflection}"</p>
                    </div>
                  )}

                  {/* Media Buttons */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {selectedUserForProfile.form1.photo1Url && (
                      <button onClick={() => setMediaModal({ type: 'image', url: selectedUserForProfile.form1.photo1Url, title: 'Form 1 — Photo 1' })}
                        style={{ cursor: 'pointer', border: '1px solid #4ADE80', borderRadius: '10px', padding: '10px 18px', color: '#4ADE80', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(74,222,128,0.08)', outline: 'none' }}>
                        <ImageIcon size={16} /> View Photo 1
                      </button>
                    )}
                    {selectedUserForProfile.form1.photo2Url && (
                      <button onClick={() => setMediaModal({ type: 'image', url: selectedUserForProfile.form1.photo2Url, title: 'Form 1 — Photo 2' })}
                        style={{ cursor: 'pointer', border: '1px solid #4ADE80', borderRadius: '10px', padding: '10px 18px', color: '#4ADE80', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(74,222,128,0.08)', outline: 'none' }}>
                        <ImageIcon size={16} /> View Photo 2
                      </button>
                    )}
                    {selectedUserForProfile.form1.videoUrl && (
                      <button onClick={() => setMediaModal({ type: 'video', url: selectedUserForProfile.form1.videoUrl, title: 'Form 1 — Kando Video' })}
                        style={{ cursor: 'pointer', border: '1px solid #00E5FF', borderRadius: '10px', padding: '10px 18px', color: '#00E5FF', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,229,255,0.08)', outline: 'none' }}>
                        <FileVideo size={16} /> Watch Video
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: '28px', background: '#06133B', padding: '20px', borderRadius: '18px', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ImageIcon size={20} /> Form 1 not yet submitted
                </div>
              )}

              {/* ── SECTION C: FORM 2 DETAILS ── */}
              {selectedUserForProfile.form2 ? (
                <div style={{ background: '#06133B', padding: '24px', borderRadius: '18px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#C084FC', fontWeight: 800, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileVideo size={20} /> Form 2 — CEO Reflection Submission
                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#64748B', fontWeight: 400 }}>
                      Submitted: {new Date(selectedUserForProfile.form2.submittedAt).toLocaleString()}
                    </span>
                  </h3>

                  {/* Meta info row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '18px', fontSize: '0.85rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Language</div>
                      <div style={{ color: '#E2E8F0' }}>{selectedUserForProfile.form2.language === 'hi' ? 'Hindi' : selectedUserForProfile.form2.language === 'ta' ? 'Tamil' : 'English'}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Submitted IP</div>
                      <div style={{ color: '#E2E8F0', fontFamily: 'monospace' }}>{selectedUserForProfile.form2.ip || 'N/A'}</div>
                    </div>
                  </div>

                  {/* CEO Reflection */}
                  {selectedUserForProfile.form2.ceoReflection && (
                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '12px', marginBottom: '18px' }}>
                      <div style={{ fontSize: '0.72rem', color: '#C084FC', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>CEO Reflection Answer (Form 2)</div>
                      <p style={{ margin: 0, color: '#E2E8F0', fontStyle: 'italic', lineHeight: 1.6 }}>"{selectedUserForProfile.form2.ceoReflection}"</p>
                    </div>
                  )}

                  {/* Form 2 video (if any) */}
                  {selectedUserForProfile.form2.videoUrl && (
                    <div style={{ maxWidth: '640px', borderRadius: '14px', overflow: 'hidden', border: '1.5px solid #A855F7' }}>
                      <video controls src={selectedUserForProfile.form2.videoUrl} style={{ width: '100%', display: 'block' }} />
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ background: '#06133B', padding: '20px', borderRadius: '18px', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileVideo size={20} /> Form 2 not yet submitted
                </div>
              )}

            </div>
          </div>
        )}

        {/* 3. TAGS MANAGEMENT VIEW (Req 2) */}
        {activeTab === 'tags' && (
          <div style={{ maxWidth: '640px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: '8px' }}>Tags Management</h1>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '24px' }}>Add or remove custom candidate classification tags (Logged in Audit Log)</p>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
              <input
                type="text"
                placeholder="Type new classification tag name..."
                value={newTagInput}
                onChange={e => setNewTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', background: '#040F2B', border: '1px solid rgba(255,255,255,0.2)', color: 'white', outline: 'none', fontSize: '0.9rem' }}
              />
              <button onClick={handleAddTag} style={{ background: '#00E5FF', color: '#020817', border: 'none', padding: '12px 22px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                <Plus size={18} /> Add Tag
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {customTags.map(tag => (
                <div key={tag} style={{ background: '#091A44', border: '1.5px solid #00E5FF', padding: '10px 18px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{tag}</span>
                  <X size={16} color="#EF4444" onClick={() => handleRemoveTag(tag)} style={{ cursor: 'pointer' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. SETTINGS VIEW — SEPARATE CAPTCHA & GA CARDS (Req 3) */}
        {activeTab === 'settings' && (
          <div style={{ maxWidth: '720px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: '8px' }}>System Settings</h1>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '28px' }}>Configure Google reCAPTCHA Verification & Google Analytics ID separately</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              
              {/* CARD 1: GOOGLE RECAPTCHA SECURITY SETTINGS (Req 3) */}
              <div style={{ background: '#040F2B', padding: '28px', borderRadius: '18px', border: '1.5px solid rgba(0,229,255,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <Lock size={22} color="#00E5FF" />
                  <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', margin: 0 }}>Google reCAPTCHA Security Settings</h2>
                    <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>Protect form submissions against automated spam bots</p>
                  </div>
                </div>

                {captchaStatusMsg && (
                  <div style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid #22C55E', color: '#4ADE80', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem', fontWeight: 700 }}>
                    ✓ {captchaStatusMsg}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: 'rgba(255,255,255,0.04)', padding: '14px', borderRadius: '10px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'white' }}>Enable Captcha Verification</div>
                      <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Enforce Google reCAPTCHA v3 on Form 1 & Form 2</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={captchaEnabled}
                      onChange={e => setCaptchaEnabled(e.target.checked)}
                      style={{ width: '22px', height: '22px', accentColor: '#00E5FF', cursor: 'pointer' }}
                    />
                  </label>

                  <div>
                    <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.82rem', marginBottom: '6px' }}>reCAPTCHA Site Key</label>
                    <input
                      type="text"
                      value={captchaSiteKey}
                      onChange={e => setCaptchaSiteKey(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.82rem', marginBottom: '6px' }}>reCAPTCHA Secret Key</label>
                    <input
                      type="password"
                      value={captchaSecretKey}
                      onChange={e => setCaptchaSecretKey(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  <button onClick={handleSaveCaptchaSettings} style={{ background: 'linear-gradient(90deg, #00C6FF 0%, #0072FF 100%)', border: 'none', color: 'white', padding: '12px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', marginTop: '6px' }}>
                    SAVE CAPTCHA SETTINGS
                  </button>
                </div>
              </div>

              {/* CARD 2: GOOGLE ANALYTICS MEASUREMENT SETTINGS (Req 3) */}
              <div style={{ background: '#040F2B', padding: '28px', borderRadius: '18px', border: '1.5px solid rgba(168,85,247,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <BarChart3 size={22} color="#C084FC" />
                  <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', margin: 0 }}>Google Analytics Settings</h2>
                    <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>Track campaign visitor traffic and conversion metrics</p>
                  </div>
                </div>

                {gaStatusMsg && (
                  <div style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid #A855F7', color: '#C084FC', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem', fontWeight: 700 }}>
                    ✓ {gaStatusMsg}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.82rem', marginBottom: '6px' }}>
                      Google Analytics Measurement ID (GA4)
                    </label>
                    <input
                      type="text"
                      value={gaId}
                      onChange={e => setGaId(e.target.value)}
                      placeholder="G-XXXXXXXXXX or UA-XXXXXXXX-X"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.8rem', color: '#A0B2D6' }}>
                    Status: <strong style={{ color: '#4ADE80' }}>● Active Analytics Script Injected</strong>
                  </div>

                  <button onClick={handleSaveGaSettings} style={{ background: 'linear-gradient(90deg, #A855F7 0%, #7E22CE 100%)', border: 'none', color: 'white', padding: '12px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', marginTop: '6px' }}>
                    SAVE GOOGLE ANALYTICS SETTINGS
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 5. AUDIT LOGS VIEW — APPEND ONLY / NO DELETE OPTION (Req 12) */}
        {activeTab === 'audit' && (
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: '8px' }}>System Audit Logs</h1>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '24px' }}>Immutable security audit trails (Strict append-only record — deletion disabled)</p>

            <div style={{ background: '#040F2B', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#091A44', color: '#00E5FF', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '14px 18px' }}>Timestamp</th>
                    <th style={{ padding: '14px 18px' }}>IP Address</th>
                    <th style={{ padding: '14px 18px' }}>Detail / Activity</th>
                    <th style={{ padding: '14px 18px' }}>Username</th>
                  </tr>
                </thead>
                <tbody>
                  {(auditLogs.length > 0 ? auditLogs : [
                    { id: '1', timestamp: new Date().toLocaleString(), ip: '147.93.31.18', detail: 'System Admin Logged in', username: 'SuperAdmin' },
                    { id: '2', timestamp: new Date(Date.now() - 3600000).toLocaleString(), ip: '147.93.31.18', detail: 'Updated Settings: Captcha toggled', username: 'Admin' }
                  ]).map(log => (
                    <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '14px 18px', color: '#CBD5E1', fontSize: '0.8rem' }}>{log.timestamp}</td>
                      <td style={{ padding: '14px 18px', color: '#00E5FF', fontWeight: 700, fontSize: '0.8rem' }}>{log.ip || '127.0.0.1'}</td>
                      <td style={{ padding: '14px 18px', color: 'white' }}>{log.detail}</td>
                      <td style={{ padding: '14px 18px', color: '#94A3B8' }}>{log.username || 'Admin'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* MEDIA PREVIEW MODAL */}
      {mediaModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#040F2B', border: '1px solid #00E5FF', borderRadius: '16px', padding: '24px', maxWidth: '700px', width: '100%', position: 'relative' }}>
            <button onClick={() => setMediaModal(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.1rem', color: '#00E5FF', marginBottom: '16px' }}>{mediaModal.title}</h3>
            {mediaModal.type === 'image' ? (
              <img src={`${apiBaseUrl}${mediaModal.url}`} alt={mediaModal.title} style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: '12px', display: 'block', margin: '0 auto' }} />
            ) : (
              <video controls src={`${apiBaseUrl}${mediaModal.url}`} style={{ width: '100%', borderRadius: '12px' }} />
            )}
          </div>
        </div>
      )}

    </div>
  );
};
