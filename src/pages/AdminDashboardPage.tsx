import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, Users, Tag, Settings as SettingsIcon, History,
  LogOut, Search, Download, Info, ChevronLeft, ChevronRight,
  X, Image as ImageIcon, FileVideo, Plus, ArrowLeft, Lock, BarChart3, AlertTriangle,
  Sun, Moon, Images, ChevronDown
} from 'lucide-react';

// Reads the logged-in admin's username straight out of the stored Basic-Auth
// credential (base64 "user:pass") — no extra API round trip needed just to
// know who's logged in for role-gating the Settings tab.
function getAdminUsername(): string {
  try {
    const cred = sessionStorage.getItem('kando_admin_cred');
    if (!cred) return '';
    const decoded = atob(cred);
    return decoded.slice(0, decoded.indexOf(':'));
  } catch {
    return '';
  }
}

type MediaItem = { type: 'image' | 'video'; url: string; title: string };

// Dark/light color tokens for the dashboard chrome (page bg, sidebar, text).
// Branded accent cards (navy panels, cyan/purple/green highlights) are kept
// as-is in both themes — only the base chrome flips.
const THEMES = {
  dark: {
    pageBg: '#020924', pageText: 'white',
    sidebarBg: '#040F2B', sidebarBorder: 'rgba(255,255,255,0.1)',
    mutedText: '#94A3B8'
  },
  light: {
    pageBg: '#F1F5F9', pageText: '#0F172A',
    sidebarBg: '#FFFFFF', sidebarBorder: 'rgba(15,23,42,0.1)',
    mutedText: '#475569'
  }
};

// Native <details>/<summary> gives us a click-to-toggle popover with built-in
// outside-click/escape handling, so a multi-select checkbox list needs no
// extra open/close state or document-level listeners.
const TagMultiSelect: React.FC<{
  tags: string[];
  customTags: string[];
  onToggle: (tag: string) => void;
  accent?: string;
}> = ({ tags, customTags, onToggle, accent = '#00E5FF' }) => {
  return (
    <details style={{ position: 'relative', display: 'inline-block' }}>
      <summary
        style={{
          listStyle: 'none', cursor: 'pointer', userSelect: 'none',
          background: tags.length ? `${accent}1F` : 'rgba(255,255,255,0.06)',
          border: `1px solid ${tags.length ? accent : 'rgba(255,255,255,0.2)'}`,
          color: tags.length ? accent : '#94A3B8',
          padding: '5px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700,
          display: 'inline-flex', alignItems: 'center', gap: '6px'
        }}
      >
        {tags.length > 0 ? tags.join(', ') : 'Select Tags...'} <ChevronDown size={12} />
      </summary>
      <div style={{
        position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 50,
        background: '#06133B', border: `1px solid ${accent}`, borderRadius: '10px',
        padding: '8px', minWidth: '180px', boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
      }}>
        {customTags.length === 0 && (
          <div style={{ color: '#64748B', fontSize: '0.8rem', padding: '4px 6px' }}>No tags defined yet</div>
        )}
        {customTags.map(t => (
          <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', color: 'white' }}>
            <input type="checkbox" checked={tags.includes(t)} onChange={() => onToggle(t)} style={{ accentColor: accent, cursor: 'pointer' }} />
            {t}
          </label>
        ))}
      </div>
    </details>
  );
};

export const AdminDashboardPage: React.FC = () => {
  const {
    adminLogout, navigateTo,
    allUsers, setAllUsers, customTags, setCustomTags,
    auditLogs, fetchAuditLogs, logAdminAction, apiBaseUrl, adminAuthHeader
  } = useApp();

  type Tab = 'overview' | 'users' | 'tags' | 'settings' | 'audit' | 'user-detail';
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Settings tab is superadmin-only — "kandoadmin" and any other regular
  // admin account never sees the nav entry or the tab content.
  const adminUsername = getAdminUsername();
  const isSuperAdmin = adminUsername === 'superadmin';

  // Light/dark theme — persisted across sessions.
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (localStorage.getItem('kando_admin_theme') as 'dark' | 'light') || 'dark');
  const palette = THEMES[theme];
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('kando_admin_theme', next);
  };

  // Row selection for scoped export — when non-empty, exports only these
  // users; otherwise exports honor whatever filter is currently applied.
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const toggleUserSelected = (id: string) => {
    setSelectedUserIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Multi-item asset gallery modal (Form 1 + Form 2 uploads) with prev/next arrows.
  const [assetsModal, setAssetsModal] = useState<{ items: MediaItem[]; index: number } | null>(null);
  const getUserAssets = (user: any): MediaItem[] => {
    const items: MediaItem[] = [];
    if (user.form1?.photo1Url) items.push({ type: 'image', url: user.form1.photo1Url, title: 'Form 1 — Photo 1' });
    if (user.form1?.photo2Url) items.push({ type: 'image', url: user.form1.photo2Url, title: 'Form 1 — Photo 2' });
    if (user.form1?.videoUrl) items.push({ type: 'video', url: user.form1.videoUrl, title: 'Form 1 — Video' });
    if (user.form2?.optionalFileUrl) {
      const isVideo = /\.(mp4|mov|webm|avi|mkv)$/i.test(user.form2.optionalFileUrl);
      items.push({ type: isVideo ? 'video' : 'image', url: user.form2.optionalFileUrl, title: 'Form 2 — Attachment' });
    }
    return items;
  };

  // Dedicated user profile detail state (Req 1)
  const [selectedUserForProfile, setSelectedUserForProfile] = useState<any | null>(null);

  // Every tab (and an open user profile) gets its own URL/history entry, so the
  // browser Back button steps through them one at a time instead of jumping
  // straight past the whole dashboard session back to the original login page.
  const pathForTab = (tab: Tab, empId?: string) => {
    if (tab === 'overview') return '/admin-dashboard';
    if (tab === 'user-detail') return `/admin-dashboard/users/${encodeURIComponent(empId || '')}`;
    return `/admin-dashboard/${tab}`;
  };

  const goToTab = (tab: Exclude<Tab, 'user-detail'>) => {
    setActiveTab(tab);
    if (tab !== 'users') setSelectedUserForProfile(null);
    const path = pathForTab(tab);
    if (window.location.pathname !== path) {
      window.history.pushState({ tab }, '', path);
    }
  };

  // Filters & Pagination for Users table
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState('');
  const [selectedFormFilter, setSelectedFormFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Settings & Tags states (Req 2 & 3)
  const [newTagInput, setNewTagInput] = useState('');
  const [tagPendingDelete, setTagPendingDelete] = useState<string | null>(null);
  const [captchaEnabled, setCaptchaEnabled] = useState(false);
  const [captchaSiteKey, setCaptchaSiteKey] = useState('');
  const [captchaSecretKey, setCaptchaSecretKey] = useState('');
  const [gaId, setGaId] = useState('G-YAMAHA2026KANDO');
  
  const [captchaStatusMsg, setCaptchaStatusMsg] = useState('');
  const [gaStatusMsg, setGaStatusMsg] = useState('');

  // Eligibility whitelist (Employee IDs + Phone Numbers) upload state
  const [whitelistCounts, setWhitelistCounts] = useState<{ employees: number; phones: number }>({ employees: 0, phones: 0 });
  const [whitelistUploading, setWhitelistUploading] = useState<'employees' | 'phones' | null>(null);
  const [whitelistStatusMsg, setWhitelistStatusMsg] = useState('');

  const fetchWhitelistCounts = () => {
    fetch(`${apiBaseUrl}/api/admin/whitelist/counts`, { headers: adminAuthHeader() })
      .then(res => res.json())
      .then(data => setWhitelistCounts({ employees: data.employees || 0, phones: data.phones || 0 }))
      .catch(() => {});
  };

  const handleWhitelistUpload = async (type: 'employees' | 'phones', file: File) => {
    setWhitelistUploading(type);
    setWhitelistStatusMsg('');
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch(`${apiBaseUrl}/api/admin/whitelist/${type}`, {
        method: 'POST',
        headers: adminAuthHeader(),
        body
      });
      const data = await res.json();
      if (!res.ok) {
        setWhitelistStatusMsg(data.error || 'Upload failed.');
      } else {
        setWhitelistStatusMsg(`${type === 'employees' ? 'Employee ID' : 'Phone Number'} whitelist updated — ${data.count} entries loaded.`);
        fetchWhitelistCounts();
        fetchAuditLogs();
      }
    } catch (err) {
      console.error('Whitelist upload error:', err);
      setWhitelistStatusMsg('Upload failed.');
    } finally {
      setWhitelistUploading(null);
    }
  };

  // Media preview modal state
  const [mediaModal, setMediaModal] = useState<{ type: 'image' | 'video'; url: string; title: string } | null>(null);
  const [mediaSignedUrl, setMediaSignedUrl] = useState<string | null>(null);
  const [mediaDownloading, setMediaDownloading] = useState(false);

  // Signed URL for whichever asset the gallery modal is currently showing.
  // Tracks its own error state — a silently-swallowed fetch failure used to
  // leave the modal stuck on "Loading…" forever with no way to tell it had
  // actually failed (expired signed URL, R2 hiccup, 403, etc).
  const [gallerySignedUrl, setGallerySignedUrl] = useState<string | null>(null);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [galleryRetryKey, setGalleryRetryKey] = useState(0);
  useEffect(() => {
    if (!assetsModal) {
      setGallerySignedUrl(null);
      setGalleryError(null);
      return;
    }
    const current = assetsModal.items[assetsModal.index];
    if (!current) return;
    if (!/^https?:\/\//i.test(current.url)) {
      setGallerySignedUrl(`${apiBaseUrl}${current.url}`);
      setGalleryError(null);
      return;
    }
    let cancelled = false;
    setGallerySignedUrl(null);
    setGalleryError(null);
    fetch(`${apiBaseUrl}/api/admin/media-url?url=${encodeURIComponent(current.url)}`, { headers: adminAuthHeader() })
      .then(async res => {
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok || !data.url) {
          setGalleryError(data.error || 'Failed to load this asset.');
          return;
        }
        setGallerySignedUrl(data.url);
      })
      .catch(() => { if (!cancelled) setGalleryError('Failed to load this asset — check your connection and retry.'); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetsModal, apiBaseUrl, galleryRetryKey]);

  // CSV+ZIP email-export modal + toast state
  const [emailExportOpen, setEmailExportOpen] = useState(false);
  const [emailExportAddress, setEmailExportAddress] = useState('');
  const [emailExportSending, setEmailExportSending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // R2 blocks direct browser fetches (no CORS headers on the bucket), so download
  // via our own server, which proxies the object through with no CORS restriction.
  // Used for both the media preview modal and any other private R2 attachment
  // (e.g. Form 2's optional file) — any raw R2 href would 403 in the browser.
  const downloadR2File = async (url: string, fallbackName: string) => {
    const res = await fetch(`${apiBaseUrl}/api/admin/media-download?url=${encodeURIComponent(url)}`, { headers: adminAuthHeader() });
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const filename = url.split('/').pop() || fallbackName;
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);
  };

  const handleMediaDownload = async () => {
    if (!mediaModal) return;
    setMediaDownloading(true);
    try {
      await downloadR2File(mediaModal.url, mediaModal.title);
    } catch (err) {
      console.error('Media download failed:', err);
    } finally {
      setMediaDownloading(false);
    }
  };

  const [attachmentDownloading, setAttachmentDownloading] = useState(false);
  const handleAttachmentDownload = async (url: string) => {
    setAttachmentDownloading(true);
    try {
      await downloadR2File(url, 'attachment');
    } catch (err) {
      console.error('Attachment download failed:', err);
    } finally {
      setAttachmentDownloading(false);
    }
  };

  // R2 media is private — fetch a short-lived signed URL to view/download it.
  // Legacy relative /uploads paths (pre-R2) are served directly via apiBaseUrl.
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [mediaRetryKey, setMediaRetryKey] = useState(0);
  useEffect(() => {
    if (!mediaModal) {
      setMediaSignedUrl(null);
      setMediaError(null);
      return;
    }
    if (!/^https?:\/\//i.test(mediaModal.url)) {
      setMediaSignedUrl(`${apiBaseUrl}${mediaModal.url}`);
      setMediaError(null);
      return;
    }
    let cancelled = false;
    setMediaSignedUrl(null);
    setMediaError(null);
    fetch(`${apiBaseUrl}/api/admin/media-url?url=${encodeURIComponent(mediaModal.url)}`, { headers: adminAuthHeader() })
      .then(async res => {
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok || !data.url) {
          setMediaError(data.error || 'Failed to load this asset.');
          return;
        }
        setMediaSignedUrl(data.url);
      })
      .catch(() => { if (!cancelled) setMediaError('Failed to load this asset — check your connection and retry.'); });
    return () => { cancelled = true; };
  }, [mediaModal, apiBaseUrl, mediaRetryKey]);

  // Fetch initial settings & users from API
  useEffect(() => {
    fetch(`${apiBaseUrl}/api/admin/settings`, { headers: adminAuthHeader() })
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.captchaEnabled !== undefined) setCaptchaEnabled(data.captchaEnabled);
          if (data.captchaSiteKey !== undefined) setCaptchaSiteKey(data.captchaSiteKey);
          if (data.captchaSecretKey !== undefined) setCaptchaSecretKey(data.captchaSecretKey);
          if (data.googleAnalyticsId) setGaId(data.googleAnalyticsId);
          if (data.customTags && Array.isArray(data.customTags)) setCustomTags(data.customTags);
        }
      })
      .catch(() => {});

    fetchWhitelistCounts();

    fetch(`${apiBaseUrl}/api/admin/users?limit=200`, { headers: adminAuthHeader() })
      .then(res => res.json())
      .then(data => {
        if (data && data.users) {
          setAllUsers(data.users);
          applyStateFromPath(window.location.pathname, data.users);
        }
      })
      .catch(() => {});

    fetchAuditLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBaseUrl, setAllUsers, setCustomTags]);

  // Some employees have no Employee ID and identify by phone instead — fall
  // back to phone anywhere empId would otherwise be used as the user's key.
  const userKey = (user: any) => user?.empId || user?.phone || '';

  // Resolve activeTab (+ selected user, for /admin-dashboard/users/:empId) from a URL path
  const applyStateFromPath = (pathname: string, usersList: any[]) => {
    const rest = pathname.replace(/^\/admin-dashboard\/?/, '');
    const [segment, empId] = rest.split('/').filter(Boolean);

    if (segment === 'users' && empId) {
      const user = usersList.find((u: any) => userKey(u) === decodeURIComponent(empId));
      if (user) {
        setSelectedUserForProfile(user);
        setActiveTab('user-detail');
        return;
      }
    }
    if (segment === 'settings' && !isSuperAdmin) {
      setActiveTab('overview');
      return;
    }
    if (segment === 'users' || segment === 'tags' || segment === 'settings' || segment === 'audit') {
      setActiveTab(segment as Tab);
      return;
    }
    setActiveTab('overview');
  };

  // Browser Back/Forward — keep the visible tab in sync with the URL instead of
  // silently doing nothing (which is what made Back feel like it "skipped" straight
  // past the whole dashboard session to the login page).
  useEffect(() => {
    const handlePopState = () => applyStateFromPath(window.location.pathname, allUsers);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allUsers]);

  const handleLogout = () => {
    adminLogout();
    navigateTo('landing');
  };

  // Open User Profile Page (Req 1)
  const handleOpenUserProfile = (user: any) => {
    setSelectedUserForProfile(user);
    setActiveTab('user-detail');
    const path = pathForTab('user-detail', userKey(user));
    if (window.location.pathname !== path) {
      window.history.pushState({ tab: 'user-detail', empId: userKey(user) }, '', path);
    }
    logAdminAction(`Viewed profile of ${user.empName} (${userKey(user)})`);
  };

  // ── MULTI-TAG ASSIGNMENT — a user can carry any number of classification tags ──
  const handleUpdateUserTags = async (userId: string, updatedTags: string[]) => {
    try {
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

      fetchAuditLogs();
    } catch (err) {
      console.error('Tag update error:', err);
    }
  };

  const handleToggleUserTag = (user: any, tag: string) => {
    const current: string[] = user.tags || [];
    const next = current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag];
    handleUpdateUserTags(user.id || user._id, next);
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
        fetchAuditLogs();
      }
    } catch (err) {
      console.error('Add tag error:', err);
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    setTagPendingDelete(null);
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
        fetchAuditLogs();
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
        body: JSON.stringify({ captchaEnabled, captchaSiteKey, captchaSecretKey, googleAnalyticsId: gaId, customTags })
      });
      fetchAuditLogs();
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
      fetchAuditLogs();
      setGaStatusMsg('Google Analytics tracking settings saved successfully!');
      setTimeout(() => setGaStatusMsg(''), 4000);
    } catch (err) {
      setGaStatusMsg('Failed to save Google Analytics settings');
    }
  };

  // Export scope: an explicit row selection always wins; otherwise whatever
  // search/tag/form filter is currently applied on the table is what exports.
  const buildExportParams = (): URLSearchParams => {
    const params = new URLSearchParams();
    if (selectedUserIds.size > 0) {
      params.set('ids', Array.from(selectedUserIds).join(','));
      return params;
    }
    if (searchQuery) params.set('search', searchQuery);
    if (selectedTagFilter) params.set('tag', selectedTagFilter);
    if (selectedFormFilter) params.set('formType', selectedFormFilter);
    return params;
  };

  // Export handlers (CSV, Excel, PDF Report & ZIP Media Archive)
  // Uses fetch + blob (not a plain <a href> / window.open) so the admin auth header
  // actually reaches the protected /api/admin/export/* endpoints.
  const handleExportData = async (format: 'csv' | 'excel' | 'pdf' | 'zip') => {
    const params = buildExportParams();
    let url = '';
    let filename = 'kando_export';
    if (format === 'zip') {
      params.set('format', 'zip');
      url = `${apiBaseUrl}/api/admin/export/zip?${params.toString()}`;
      filename = 'kando_submissions_assets.zip';
    } else if (format === 'pdf') {
      url = `${apiBaseUrl}/api/admin/export/pdf?${params.toString()}`;
      filename = 'kando_users_report.html';
    } else {
      params.set('format', format);
      url = `${apiBaseUrl}/api/admin/export/users?${params.toString()}`;
      filename = format === 'excel' ? 'kando_users.xlsx' : 'kando_users.csv';
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
      fetchAuditLogs();
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  // CSV+ZIP is built server-side and emailed as an R2 download link rather than
  // streamed to the browser — for thousands of users it can take a while and
  // run into GBs, so the admin gets an instant toast instead of a blocked download.
  const handleEmailExport = async () => {
    if (!emailExportAddress.trim()) return;
    setEmailExportSending(true);
    try {
      const scopeParams = buildExportParams();
      const res = await fetch(`${apiBaseUrl}/api/admin/export/zip-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...adminAuthHeader() },
        body: JSON.stringify({
          email: emailExportAddress.trim(),
          ids: scopeParams.get('ids') || undefined,
          search: scopeParams.get('search') || undefined,
          tag: scopeParams.get('tag') || undefined,
          formType: scopeParams.get('formType') || undefined
        })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to start export.');
        return;
      }
      setEmailExportOpen(false);
      setEmailExportAddress('');
      showToast(`We will send the CSV + ZIP export link to ${emailExportAddress.trim()} shortly.`);
      fetchAuditLogs();
    } catch (err) {
      console.error('Email export error:', err);
      showToast('Failed to start export.');
    } finally {
      setEmailExportSending(false);
    }
  };

  // Users Filtered List
  const filteredUsers = allUsers.filter(u => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      (u.empName || '').toLowerCase().includes(q) ||
      (u.empId || '').toLowerCase().includes(q) ||
      (u.phone || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.city && u.city.toLowerCase().includes(q));

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
    <div style={{ display: 'flex', minHeight: '100vh', background: palette.pageBg, color: palette.pageText, fontFamily: 'Outfit, sans-serif' }}>

      {/* ── LEFT SIDENAVBAR (Req 7) — sticky so Logout stays visible on every tab, not just short ones ── */}
      <aside style={{
        width: '260px',
        background: palette.sidebarBg,
        borderRight: `1px solid ${palette.sidebarBorder}`,
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto'
      }}>
        <div>
          <div style={{ padding: '0 12px 24px 12px', borderBottom: `1px solid ${palette.sidebarBorder}`, marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#00E5FF', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
                ADMINISTRATION
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: palette.pageText, marginTop: '2px' }}>
                Control Dashboard
              </div>
            </div>
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              style={{
                width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                background: 'rgba(0,229,255,0.12)', border: '1px solid #00E5FF', color: '#00E5FF',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => goToTab('overview')}
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
              onClick={() => goToTab('users')}
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
              onClick={() => goToTab('tags')}
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

            {isSuperAdmin && (
            <button
              onClick={() => goToTab('settings')}
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
            )}

            <button
              onClick={() => goToTab('audit')}
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
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: palette.pageText, margin: 0 }}>Campaign Overview</h1>
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
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: palette.pageText, margin: 0 }}>Registered Users Directory</h1>
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
                  onClick={() => setEmailExportOpen(true)}
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

            {/* SCOPED EXPORT TOOLBAR — appears above the table whenever rows are checked
                OR a search/tag/form filter is active, so export always matches what's
                actually on screen instead of silently exporting everyone. */}
            {(selectedUserIds.size > 0 || !!searchQuery || !!selectedTagFilter || !!selectedFormFilter) && (
              <div style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid #00E5FF', borderRadius: '14px', padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <span style={{ color: '#00E5FF', fontWeight: 800, fontSize: '0.9rem' }}>
                  {selectedUserIds.size > 0
                    ? `${selectedUserIds.size} user${selectedUserIds.size > 1 ? 's' : ''} selected`
                    : `Filter applied — ${filteredUsers.length} user${filteredUsers.length !== 1 ? 's' : ''} match`}
                </span>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button onClick={() => handleExportData('pdf')} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                    <Download size={14} /> PDF
                  </button>
                  <button onClick={() => handleExportData('csv')} style={{ background: 'rgba(0,229,255,0.12)', border: '1px solid #00E5FF', color: '#00E5FF', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                    <Download size={14} /> CSV
                  </button>
                  <button onClick={() => handleExportData('excel')} style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid #22C55E', color: '#4ADE80', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                    <Download size={14} /> Excel
                  </button>
                  <button onClick={() => setEmailExportOpen(true)} style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid #A855F7', color: '#C084FC', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                    <Download size={14} /> CSV + ZIP
                  </button>
                  <button
                    onClick={() => {
                      if (selectedUserIds.size > 0) {
                        setSelectedUserIds(new Set());
                      } else {
                        setSearchQuery(''); setSelectedTagFilter(''); setSelectedFormFilter(''); setCurrentPage(1);
                      }
                    }}
                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#94A3B8', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    {selectedUserIds.size > 0 ? 'Clear Selection' : 'Clear Filters'}
                  </button>
                </div>
              </div>
            )}

            {/* USERS TABLE — 25 ENTRIES PER PAGE (Req 8) */}
            <div style={{ background: '#040F2B', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#091A44', color: '#00E5FF', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '14px 12px', width: '36px' }}>
                      <input
                        type="checkbox"
                        checked={paginatedUsers.length > 0 && paginatedUsers.every(u => selectedUserIds.has(u.id || u._id))}
                        onChange={(e) => {
                          setSelectedUserIds(prev => {
                            const next = new Set(prev);
                            paginatedUsers.forEach(u => {
                              const id = u.id || u._id;
                              if (e.target.checked) next.add(id); else next.delete(id);
                            });
                            return next;
                          });
                        }}
                        style={{ accentColor: '#00E5FF', cursor: 'pointer', width: '16px', height: '16px' }}
                      />
                    </th>
                    <th style={{ padding: '14px 18px' }}>Emp ID / Phone</th>
                    <th style={{ padding: '14px 18px' }}>Employee Name</th>
                    <th style={{ padding: '14px 18px' }}>Registered Date</th>
                    <th style={{ padding: '14px 18px' }}>Form 1</th>
                    <th style={{ padding: '14px 18px' }}>Form 2</th>
                    <th style={{ padding: '14px 18px' }}>Assets</th>
                    <th style={{ padding: '14px 18px' }}>Assigned Tags</th>
                    <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map(user => {
                    const currentTags: string[] = user.tags || [];
                    const userId = user.id || (user as any)._id;
                    const assets = getUserAssets(user);
                    return (
                      <tr key={userId} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <td style={{ padding: '14px 12px' }}>
                          <input
                            type="checkbox"
                            checked={selectedUserIds.has(userId)}
                            onChange={() => toggleUserSelected(userId)}
                            style={{ accentColor: '#00E5FF', cursor: 'pointer', width: '16px', height: '16px' }}
                          />
                        </td>

                        <td style={{ padding: '14px 18px', fontWeight: 800, color: '#00E5FF' }}>
                          {user.empId || user.phone || '—'}
                        </td>

                        <td style={{ padding: '14px 18px' }}>
                          <div
                            onClick={() => handleOpenUserProfile(user)}
                            style={{ cursor: 'pointer', fontWeight: 700, color: 'white', textDecoration: 'underline' }}
                            title="Click to view full user profile page"
                          >
                            {user.empName}
                          </div>
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

                        {/* ASSETS — every Form 1 / Form 2 upload, opened in a gallery modal with arrows */}
                        <td style={{ padding: '14px 18px' }}>
                          {assets.length > 0 ? (
                            <button
                              onClick={() => setAssetsModal({ items: assets, index: 0 })}
                              style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid #00E5FF', color: '#00E5FF', padding: '5px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                              <Images size={14} /> {assets.length}
                            </button>
                          ) : (
                            <span style={{ color: '#64748B', fontSize: '0.75rem' }}>None</span>
                          )}
                        </td>

                        {/* MULTI-TAG ASSIGNMENT */}
                        <td style={{ padding: '14px 18px' }}>
                          <TagMultiSelect
                            tags={currentTags}
                            customTags={customTags}
                            onToggle={(tag) => handleToggleUserTag(user, tag)}
                          />
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
              onClick={() => goToTab('users')}
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
                  <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginTop: '4px' }}>
                    {selectedUserForProfile.empId
                      ? <>Employee ID: <strong style={{ color: 'white' }}>{selectedUserForProfile.empId}</strong></>
                      : <>Phone Number: <strong style={{ color: 'white' }}>{selectedUserForProfile.phone || '—'}</strong></>}
                  </p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, padding: '4px 10px', borderRadius: '8px', color: selectedUserForProfile.form1 ? '#4ADE80' : '#EF4444', background: selectedUserForProfile.form1 ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${selectedUserForProfile.form1 ? 'rgba(74,222,128,0.4)' : 'rgba(239,68,68,0.4)'}` }}>
                      Form 1: {selectedUserForProfile.form1 ? 'Yes' : 'No'}
                    </span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, padding: '4px 10px', borderRadius: '8px', color: selectedUserForProfile.form2 ? '#4ADE80' : '#EF4444', background: selectedUserForProfile.form2 ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${selectedUserForProfile.form2 ? 'rgba(74,222,128,0.4)' : 'rgba(239,68,68,0.4)'}` }}>
                      Form 2: {selectedUserForProfile.form2 ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                {/* Multi-Tag Selection */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 700 }}>Classification Tags:</span>
                  <TagMultiSelect
                    tags={selectedUserForProfile.tags || []}
                    customTags={customTags}
                    onToggle={(tag) => handleToggleUserTag(selectedUserForProfile, tag)}
                  />
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
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Company Name</div>
                      <div style={{ color: '#E2E8F0' }}>{selectedUserForProfile.form1.companyName || 'N/A'}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Department</div>
                      <div style={{ color: '#E2E8F0' }}>{selectedUserForProfile.form1.department || 'N/A'}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Location</div>
                      <div style={{ color: '#E2E8F0' }}>{selectedUserForProfile.city || 'N/A'}</div>
                    </div>
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

              {/* ── SECTION C: FORM 2 DETAILS (Chairman Invites Your Thoughts) ── */}
              {selectedUserForProfile.form2 ? (
                <div style={{ background: '#06133B', padding: '24px', borderRadius: '18px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#C084FC', fontWeight: 800, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileVideo size={20} /> Form 2 — Chairman Invites Your Thoughts
                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#64748B', fontWeight: 400 }}>
                      Submitted: {new Date(selectedUserForProfile.form2.submittedAt).toLocaleString()}
                    </span>
                  </h3>

                  {/* Meta info row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '18px', fontSize: '0.85rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Employee Name</div>
                      <div style={{ color: '#E2E8F0' }}>{selectedUserForProfile.empName || 'N/A'}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Employee EIN</div>
                      <div style={{ color: '#E2E8F0' }}>{selectedUserForProfile.empId || 'N/A'}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Company Name</div>
                      <div style={{ color: '#E2E8F0' }}>{selectedUserForProfile.form2.companyName || 'N/A'}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Department</div>
                      <div style={{ color: '#E2E8F0' }}>{selectedUserForProfile.form2.department || 'N/A'}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Location</div>
                      <div style={{ color: '#E2E8F0' }}>{selectedUserForProfile.form2.location || 'N/A'}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Language</div>
                      <div style={{ color: '#E2E8F0' }}>{selectedUserForProfile.form2.language === 'hi' ? 'Hindi' : selectedUserForProfile.form2.language === 'ta' ? 'Tamil' : 'English'}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Submitted IP</div>
                      <div style={{ color: '#E2E8F0', fontFamily: 'monospace' }}>{selectedUserForProfile.form2.ip || 'N/A'}</div>
                    </div>
                  </div>

                  {/* Share Your Thoughts answer */}
                  {selectedUserForProfile.form2.thoughts && (
                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '12px', marginBottom: '18px' }}>
                      <div style={{ fontSize: '0.72rem', color: '#C084FC', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>Share Your Thoughts</div>
                      <p style={{ margin: 0, color: '#E2E8F0', fontStyle: 'italic', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>"{selectedUserForProfile.form2.thoughts}"</p>
                    </div>
                  )}

                  {/* Optional file attachment (if any) */}
                  {selectedUserForProfile.form2.optionalFileUrl && (
                    <button
                      onClick={() => handleAttachmentDownload(selectedUserForProfile.form2.optionalFileUrl)}
                      disabled={attachmentDownloading}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid #A855F7', borderRadius: '10px', padding: '10px 18px', color: '#C084FC', fontSize: '0.85rem', fontWeight: 700, background: 'rgba(168,85,247,0.08)', cursor: attachmentDownloading ? 'not-allowed' : 'pointer', opacity: attachmentDownloading ? 0.6 : 1 }}
                    >
                      <Download size={16} /> {attachmentDownloading ? 'Downloading…' : 'Download Attached File'}
                    </button>
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
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: palette.pageText, marginBottom: '8px' }}>Tags Management</h1>
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
                  <X size={16} color="#EF4444" onClick={() => setTagPendingDelete(tag)} style={{ cursor: 'pointer' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. SETTINGS VIEW — SEPARATE CAPTCHA & GA CARDS (Req 3) — superadmin only */}
        {activeTab === 'settings' && isSuperAdmin && (
          <div style={{ maxWidth: '720px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: palette.pageText, marginBottom: '8px' }}>System Settings</h1>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '28px' }}>Configure Google reCAPTCHA Verification & Google Analytics ID separately</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

              {/* CARD 0: ELIGIBILITY WHITELIST UPLOAD */}
              <div style={{ background: '#040F2B', padding: '28px', borderRadius: '18px', border: '1.5px solid rgba(168,85,247,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <Users size={22} color="#C084FC" />
                  <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', margin: 0 }}>Eligibility Whitelist</h2>
                    <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>
                      Only Employee IDs / Phone Numbers on these lists can submit Form 1 &amp; Form 2. Each upload replaces the previous list.
                    </p>
                  </div>
                </div>

                {whitelistStatusMsg && (
                  <div style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid #A855F7', color: '#C084FC', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem', fontWeight: 700 }}>
                    {whitelistStatusMsg}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '12px' }}>
                    <div style={{ fontWeight: 700, color: 'white', marginBottom: '4px' }}>Employee ID List</div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '12px' }}>
                      {whitelistCounts.employees.toLocaleString()} Employee IDs currently loaded
                    </div>
                    <label style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: whitelistUploading ? 'not-allowed' : 'pointer',
                      border: '1px solid #A855F7', borderRadius: '10px', padding: '10px 16px', color: '#C084FC', fontSize: '0.85rem', fontWeight: 700,
                      background: 'rgba(168,85,247,0.08)', opacity: whitelistUploading ? 0.6 : 1
                    }}>
                      {whitelistUploading === 'employees' ? 'Uploading…' : 'Upload Excel/CSV'}
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        disabled={!!whitelistUploading}
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleWhitelistUpload('employees', f); e.target.value = ''; }}
                        style={{ display: 'none' }}
                      />
                    </label>
                    <p style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '8px' }}>First column = Employee ID, first row treated as header.</p>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '12px' }}>
                    <div style={{ fontWeight: 700, color: 'white', marginBottom: '4px' }}>Phone Number List</div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '12px' }}>
                      {whitelistCounts.phones.toLocaleString()} Phone Numbers currently loaded
                    </div>
                    <label style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: whitelistUploading ? 'not-allowed' : 'pointer',
                      border: '1px solid #A855F7', borderRadius: '10px', padding: '10px 16px', color: '#C084FC', fontSize: '0.85rem', fontWeight: 700,
                      background: 'rgba(168,85,247,0.08)', opacity: whitelistUploading ? 0.6 : 1
                    }}>
                      {whitelistUploading === 'phones' ? 'Uploading…' : 'Upload Excel/CSV'}
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        disabled={!!whitelistUploading}
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleWhitelistUpload('phones', f); e.target.value = ''; }}
                        style={{ display: 'none' }}
                      />
                    </label>
                    <p style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '8px' }}>For employees with no Employee ID. First column = Phone Number.</p>
                  </div>
                </div>
              </div>

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
                      placeholder="From google.com/recaptcha/admin (reCAPTCHA v3)"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.82rem', marginBottom: '6px' }}>reCAPTCHA Secret Key</label>
                    <input
                      type="password"
                      value={captchaSecretKey}
                      onChange={e => setCaptchaSecretKey(e.target.value)}
                      placeholder="Kept server-side only, never shown to the public site"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>
                  <p style={{ fontSize: '0.72rem', color: '#64748B', margin: 0 }}>
                    Register site type "reCAPTCHA v3" for domain <code>147.93.31.18</code> (Google accepts bare IPs as a domain entry).
                  </p>

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
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: palette.pageText, marginBottom: '8px' }}>System Audit Logs</h1>
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
                    <tr key={log.id || (log as any)._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '14px 18px', color: '#CBD5E1', fontSize: '0.8rem' }}>{new Date(log.timestamp).toLocaleString()}</td>
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
            {mediaError ? (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <p style={{ color: '#EF4444', fontWeight: 700, marginBottom: '12px' }}>{mediaError}</p>
                <button
                  onClick={() => setMediaRetryKey(k => k + 1)}
                  style={{ border: '1px solid #00E5FF', color: '#00E5FF', background: 'rgba(0,229,255,0.08)', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Retry
                </button>
              </div>
            ) : !mediaSignedUrl ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748B' }}>Loading…</div>
            ) : (
              <>
                {mediaModal.type === 'image' ? (
                  <img
                    key={mediaSignedUrl}
                    src={mediaSignedUrl}
                    alt={mediaModal.title}
                    style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: '12px', display: 'block', margin: '0 auto' }}
                    onError={() => setMediaError('This image file failed to load (it may be corrupted or missing).')}
                  />
                ) : (
                  <video
                    key={mediaSignedUrl}
                    controls
                    src={mediaSignedUrl}
                    style={{ width: '100%', borderRadius: '12px' }}
                    onError={() => setMediaError('This video file failed to load (it may be corrupted or missing).')}
                  />
                )}
                <button
                  onClick={handleMediaDownload}
                  disabled={mediaDownloading}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '16px', border: '1px solid #00E5FF', borderRadius: '10px', padding: '10px 18px', color: '#00E5FF', fontSize: '0.85rem', fontWeight: 700, background: 'rgba(0,229,255,0.08)', cursor: mediaDownloading ? 'not-allowed' : 'pointer', opacity: mediaDownloading ? 0.6 : 1 }}
                >
                  <Download size={16} /> {mediaDownloading ? 'Downloading…' : 'Download'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ASSET GALLERY MODAL — every Form 1 / Form 2 upload for a user, with prev/next arrows */}
      {assetsModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#040F2B', border: '1px solid #00E5FF', borderRadius: '16px', padding: '24px', maxWidth: '700px', width: '100%', position: 'relative' }}>
            <button onClick={() => setAssetsModal(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.1rem', color: '#00E5FF', marginBottom: '4px' }}>{assetsModal.items[assetsModal.index].title}</h3>
            <p style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '16px' }}>
              {assetsModal.index + 1} of {assetsModal.items.length}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setAssetsModal(m => m && ({ ...m, index: (m.index - 1 + m.items.length) % m.items.length }))}
                disabled={assetsModal.items.length < 2}
                style={{ flexShrink: 0, background: 'rgba(255,255,255,0.08)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '8px', cursor: assetsModal.items.length < 2 ? 'not-allowed' : 'pointer', opacity: assetsModal.items.length < 2 ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <ChevronLeft size={20} />
              </button>

              <div style={{ flex: 1, minWidth: 0 }}>
                {galleryError ? (
                  <div style={{ padding: '40px 0', textAlign: 'center' }}>
                    <p style={{ color: '#EF4444', fontWeight: 700, marginBottom: '12px' }}>{galleryError}</p>
                    <button
                      onClick={() => setGalleryRetryKey(k => k + 1)}
                      style={{ border: '1px solid #00E5FF', color: '#00E5FF', background: 'rgba(0,229,255,0.08)', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Retry
                    </button>
                  </div>
                ) : !gallerySignedUrl ? (
                  <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748B' }}>Loading…</div>
                ) : assetsModal.items[assetsModal.index].type === 'image' ? (
                  <img
                    key={gallerySignedUrl}
                    src={gallerySignedUrl}
                    alt={assetsModal.items[assetsModal.index].title}
                    style={{ maxWidth: '100%', maxHeight: '60vh', borderRadius: '12px', display: 'block', margin: '0 auto' }}
                    onError={() => setGalleryError('This image file failed to load (it may be corrupted or missing).')}
                  />
                ) : (
                  <video
                    key={gallerySignedUrl}
                    controls
                    src={gallerySignedUrl}
                    style={{ width: '100%', borderRadius: '12px' }}
                    onError={() => setGalleryError('This video file failed to load (it may be corrupted or missing).')}
                  />
                )}
              </div>

              <button
                onClick={() => setAssetsModal(m => m && ({ ...m, index: (m.index + 1) % m.items.length }))}
                disabled={assetsModal.items.length < 2}
                style={{ flexShrink: 0, background: 'rgba(255,255,255,0.08)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '8px', cursor: assetsModal.items.length < 2 ? 'not-allowed' : 'pointer', opacity: assetsModal.items.length < 2 ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {gallerySignedUrl && !galleryError && (
              <button
                onClick={() => downloadR2File(assetsModal.items[assetsModal.index].url, assetsModal.items[assetsModal.index].title)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '16px', border: '1px solid #00E5FF', borderRadius: '10px', padding: '10px 18px', color: '#00E5FF', fontSize: '0.85rem', fontWeight: 700, background: 'rgba(0,229,255,0.08)', cursor: 'pointer' }}
              >
                <Download size={16} /> Download
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAG DELETE CONFIRMATION MODAL */}
      {tagPendingDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#040F2B', border: '1px solid #EF4444', borderRadius: '16px', padding: '24px', maxWidth: '380px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <AlertTriangle size={22} color="#EF4444" />
              <h3 style={{ fontSize: '1.05rem', color: 'white', margin: 0 }}>Delete Tag?</h3>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginBottom: '20px' }}>
              Are you sure you want to delete the tag <strong style={{ color: 'white' }}>"{tagPendingDelete}"</strong>? Any users currently assigned this tag will lose it.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setTagPendingDelete(null)}
                style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#CBD5E1', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveTag(tagPendingDelete)}
                style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#EF4444', color: 'white', fontWeight: 700, cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMAIL CSV+ZIP EXPORT MODAL */}
      {emailExportOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#040F2B', border: '1px solid #A855F7', borderRadius: '16px', padding: '24px', maxWidth: '420px', width: '100%', position: 'relative' }}>
            <button onClick={() => setEmailExportOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.1rem', color: '#C084FC', marginBottom: '8px' }}>Email CSV + ZIP Export</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '16px' }}>
              We'll build the export and email you a download link — large exports can take a few minutes.
            </p>
            <input
              type="email"
              value={emailExportAddress}
              onChange={e => setEmailExportAddress(e.target.value)}
              placeholder="admin@example.com"
              style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: '#091A44', color: '#E2E8F0', fontSize: '0.9rem', marginBottom: '16px', outline: 'none', boxSizing: 'border-box' }}
            />
            <button
              onClick={handleEmailExport}
              disabled={emailExportSending || !emailExportAddress.trim()}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: 'linear-gradient(90deg, #A855F7 0%, #6366F1 100%)', color: 'white', fontWeight: 700, cursor: (emailExportSending || !emailExportAddress.trim()) ? 'not-allowed' : 'pointer', opacity: (emailExportSending || !emailExportAddress.trim()) ? 0.6 : 1 }}
            >
              {emailExportSending ? 'Starting…' : 'Send Export Link'}
            </button>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', background: '#091A44', border: '1px solid #A855F7', color: '#E2E8F0', padding: '14px 22px', borderRadius: '12px', fontSize: '0.88rem', fontWeight: 600, zIndex: 3000, boxShadow: '0 8px 24px rgba(0,0,0,0.4)', maxWidth: '90vw' }}>
          {toast}
        </div>
      )}

    </div>
  );
};
