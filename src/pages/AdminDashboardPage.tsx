import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
    mutedText: '#94A3B8',
    surface: '#040F2B', surfaceAlt: '#091A44', surfaceSoft: '#06133B',
    border: 'rgba(255,255,255,0.1)', borderStrong: 'rgba(255,255,255,0.2)', borderFaint: 'rgba(255,255,255,0.06)',
    inputBg: 'rgba(255,255,255,0.06)', subtleBg: 'rgba(255,255,255,0.04)',
    text: 'white', textMuted2: '#CBD5E1',
    // Bright cyan reads fine on the dark navy background.
    accentCyan: '#00E5FF', accentCyanRgb: '0,229,255'
  },
  light: {
    pageBg: '#F1F5F9', pageText: '#0F172A',
    sidebarBg: '#FFFFFF', sidebarBorder: 'rgba(15,23,42,0.1)',
    mutedText: '#475569',
    surface: '#FFFFFF', surfaceAlt: '#F8FAFC', surfaceSoft: '#FFFFFF',
    border: 'rgba(15,23,42,0.1)', borderStrong: 'rgba(15,23,42,0.18)', borderFaint: 'rgba(15,23,42,0.06)',
    inputBg: 'rgba(15,23,42,0.04)', subtleBg: 'rgba(15,23,42,0.035)',
    text: '#0F172A', textMuted2: '#334155',
    // Same bright cyan fails contrast on white (~1.5:1) — a darker cyan/teal
    // (~5.4:1 against white) keeps the brand color family but stays readable.
    accentCyan: '#0E7490', accentCyanRgb: '14,116,144'
  }
};

// Native <details>/<summary> gives us a click-to-toggle popover with built-in
// outside-click/escape handling. The popover itself is portaled to
// document.body and positioned with `fixed` coordinates computed from the
// summary's own bounding box — otherwise it inherits the table wrapper's
// `overflow: hidden` (and just gets clipped) and can't escape the page's
// bottom edge for rows near the end of a long list. Position is recomputed
// on open and flips upward when there isn't room below.
const TagMultiSelect: React.FC<{
  tags: string[];
  customTags: string[];
  onToggle: (tag: string) => void;
  accent?: string;
  palette: typeof THEMES['dark'];
}> = ({ tags, customTags, onToggle, accent, palette }) => {
  accent = accent || palette.accentCyan;
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; openUp: boolean } | null>(null);

  const MENU_WIDTH = 200;
  const MENU_MAX_HEIGHT = 260;

  const computePosition = () => {
    const el = detailsRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < MENU_MAX_HEIGHT && rect.top > spaceBelow;
    let left = rect.left;
    if (left + MENU_WIDTH > window.innerWidth - 8) left = window.innerWidth - MENU_WIDTH - 8;
    if (left < 8) left = 8;
    const top = openUp ? rect.top - 6 : rect.bottom + 6;
    setMenuPos({ top, left, openUp });
  };

  useEffect(() => {
    const el = detailsRef.current;
    if (!el) return;
    const onToggleEvent = () => {
      if (el.open) {
        computePosition();
      } else {
        setMenuPos(null);
      }
    };
    el.addEventListener('toggle', onToggleEvent);
    return () => el.removeEventListener('toggle', onToggleEvent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!menuPos) return;
    const reposition = () => computePosition();
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    return () => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!menuPos]);

  return (
    <details ref={detailsRef} style={{ position: 'relative', display: 'inline-block' }}>
      <summary
        style={{
          listStyle: 'none', cursor: 'pointer', userSelect: 'none',
          background: tags.length ? `${accent}1F` : palette.inputBg,
          border: `1px solid ${tags.length ? accent : palette.borderStrong}`,
          color: tags.length ? accent : palette.mutedText,
          padding: '5px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700,
          display: 'inline-flex', alignItems: 'center', gap: '6px'
        }}
      >
        {tags.length > 0 ? tags.join(', ') : 'Select Tags...'} <ChevronDown size={12} />
      </summary>
      {menuPos && createPortal(
        <div style={{
          position: 'fixed',
          top: menuPos.openUp ? undefined : menuPos.top,
          bottom: menuPos.openUp ? window.innerHeight - menuPos.top : undefined,
          left: menuPos.left, zIndex: 5000,
          background: palette.surfaceSoft, border: `1px solid ${accent}`, borderRadius: '10px',
          padding: '8px', width: `${MENU_WIDTH}px`, maxHeight: `${MENU_MAX_HEIGHT}px`, overflowY: 'auto',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
        }}>
          {customTags.length === 0 && (
            <div style={{ color: palette.mutedText, fontSize: '0.8rem', padding: '4px 6px' }}>No tags defined yet</div>
          )}
          {customTags.map(t => (
            <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', color: palette.text }}>
              <input type="checkbox" checked={tags.includes(t)} onChange={() => onToggle(t)} style={{ accentColor: accent, cursor: 'pointer' }} />
              {t}
            </label>
          ))}
        </div>,
        document.body
      )}
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

  // Which overview KPI card's submission list is expanded below the cards (null = none open).
  const [expandedOverviewForm, setExpandedOverviewForm] = useState<'total' | 'form1' | 'form2' | null>(null);
  const [overviewTablePage, setOverviewTablePage] = useState(1);
  const OVERVIEW_PAGE_SIZE = 25;

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
        const label = type === 'employees' ? 'Employee ID' : 'Phone Number';
        const parts = [`${label} whitelist updated — ${data.count} imported`];
        if (data.duplicatesSkipped) parts.push(`${data.duplicatesSkipped} duplicate row(s) skipped`);
        if (data.blankSkipped) parts.push(`${data.blankSkipped} blank row(s) skipped`);
        let msg = parts.join(', ') + '.';
        if (data.rejected?.length) {
          msg += ` ${data.rejected.length} row(s) rejected: ` +
            data.rejected.map((r: { value: string; reason: string }) => `${r.value} (${r.reason})`).join('; ');
        }
        setWhitelistStatusMsg(msg);
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

  // Fast path: ask our server for a short-lived signed R2 URL (small JSON call,
  // R2 itself sets Content-Disposition via ResponseContentDisposition) and let
  // the browser download straight from R2 — no full-object buffering through
  // our own server, which used to double the transfer time for large files.
  const downloadR2File = async (url: string, fallbackName: string) => {
    const res = await fetch(`${apiBaseUrl}/api/admin/media-url?download=1&url=${encodeURIComponent(url)}`, { headers: adminAuthHeader() });
    const data = await res.json();
    if (!res.ok || !data.url) throw new Error(data.error || 'Failed to get download link.');
    const filename = url.split('/').pop() || fallbackName;
    const link = document.createElement('a');
    link.href = data.url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
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

  // Form 2's optional file used to only offer a full download — now opens
  // instantly like Photo/Video: image/video go into the same preview modal,
  // anything else (e.g. PDF) opens in a new tab via a fast signed URL.
  const [attachmentOpening, setAttachmentOpening] = useState(false);
  const handleAttachmentView = async (url: string) => {
    if (/\.(mp4|mov|webm|mkv)$/i.test(url)) {
      setMediaModal({ type: 'video', url, title: 'Form 2 — Attachment' });
      return;
    }
    if (/\.(jpe?g|png|webp|gif|heic|heif)$/i.test(url)) {
      setMediaModal({ type: 'image', url, title: 'Form 2 — Attachment' });
      return;
    }
    setAttachmentOpening(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/admin/media-url?url=${encodeURIComponent(url)}`, { headers: adminAuthHeader() });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Failed to open file.');
      window.open(data.url, '_blank', 'noopener');
    } catch (err) {
      console.error('Attachment view failed:', err);
    } finally {
      setAttachmentOpening(false);
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
    // replace: true — logging out must not leave the dashboard as a
    // forward-navigable history entry (Back would otherwise land back on
    // /admin-dashboard's URL, even though the route guard in App.tsx already
    // redirects to the login page once isAdminLoggedIn is false).
    navigateTo('landing', undefined, true);
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

  // Whenever the filtered result set changes (search/tag/form filter edited,
  // or the underlying user list refreshes), prune any selected ids down to
  // the intersection with what's currently filtered — a user no longer
  // matching the active filters must not silently stay "selected" for bulk
  // actions/exports just because they were checked before the filter changed.
  useEffect(() => {
    setSelectedUserIds(prev => {
      if (prev.size === 0) return prev;
      const visibleIds = new Set(filteredUsers.map(u => u.id || (u as any)._id));
      let changed = false;
      const next = new Set<string>();
      prev.forEach(id => {
        if (visibleIds.has(id)) next.add(id);
        else changed = true;
      });
      return changed ? next : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedTagFilter, selectedFormFilter, allUsers]);

  // Export scope size used to drive button disabled-state + messaging: an
  // explicit selection wins, otherwise it's whatever the filters currently
  // match. Zero either way means there's nothing to export.
  const exportScopeCount = selectedUserIds.size > 0 ? selectedUserIds.size : filteredUsers.length;
  const canExport = exportScopeCount > 0;

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
              <div style={{ fontSize: '0.75rem', color: palette.accentCyan, fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
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
                background: `rgba(${palette.accentCyanRgb},0.12)`, border: `1px solid ${palette.accentCyan}`, color: palette.accentCyan,
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
                background: activeTab === 'overview' ? `rgba(${palette.accentCyanRgb},0.15)` : 'transparent',
                color: activeTab === 'overview' ? palette.accentCyan : palette.mutedText,
                border: activeTab === 'overview' ? `1px solid ${palette.accentCyan}` : '1px solid transparent',
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
                background: (activeTab === 'users' || activeTab === 'user-detail') ? `rgba(${palette.accentCyanRgb},0.15)` : 'transparent',
                color: (activeTab === 'users' || activeTab === 'user-detail') ? palette.accentCyan : palette.mutedText,
                border: (activeTab === 'users' || activeTab === 'user-detail') ? `1px solid ${palette.accentCyan}` : '1px solid transparent',
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
                background: activeTab === 'tags' ? `rgba(${palette.accentCyanRgb},0.15)` : 'transparent',
                color: activeTab === 'tags' ? palette.accentCyan : palette.mutedText,
                border: activeTab === 'tags' ? `1px solid ${palette.accentCyan}` : '1px solid transparent',
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
                background: activeTab === 'settings' ? `rgba(${palette.accentCyanRgb},0.15)` : 'transparent',
                color: activeTab === 'settings' ? palette.accentCyan : palette.mutedText,
                border: activeTab === 'settings' ? `1px solid ${palette.accentCyan}` : '1px solid transparent',
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
                background: activeTab === 'audit' ? `rgba(${palette.accentCyanRgb},0.15)` : 'transparent',
                color: activeTab === 'audit' ? palette.accentCyan : palette.mutedText,
                border: activeTab === 'audit' ? `1px solid ${palette.accentCyan}` : '1px solid transparent',
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
              <p style={{ color: palette.mutedText, fontSize: '0.9rem', marginTop: '4px' }}>Real-time Campaign Metrics & Performance KPIs</p>
            </div>

            {/* 3 KPI CARDS WITH INFO ICONS (Req 13) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
              
              <div
                onClick={() => { setExpandedOverviewForm(prev => prev === 'total' ? null : 'total'); setOverviewTablePage(1); }}
                title="Click to view all registered users"
                style={{
                  background: palette.surfaceAlt,
                  border: expandedOverviewForm === 'total' ? `1.5px solid ${palette.accentCyan}` : `1.5px solid rgba(${palette.accentCyanRgb},0.3)`,
                  borderRadius: '16px', padding: '24px', cursor: 'pointer',
                  boxShadow: expandedOverviewForm === 'total' ? `0 0 0 3px rgba(${palette.accentCyanRgb},0.15)` : 'none',
                  transition: 'box-shadow 0.15s, border-color 0.15s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: palette.mutedText, fontSize: '0.9rem', fontWeight: 700 }}>Total Registered Users</span>
                  <div title="Total unique employees registered in campaign">
                    <Info size={18} color={palette.accentCyan} />
                  </div>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: palette.accentCyan }}>{allUsers.length}</div>
                <div style={{ fontSize: '0.75rem', color: palette.accentCyan, fontWeight: 700, marginTop: '6px' }}>
                  {expandedOverviewForm === 'total' ? '▲ Hide submissions' : '▼ View submissions'}
                </div>
              </div>

              <div
                onClick={() => { setExpandedOverviewForm(prev => prev === 'form1' ? null : 'form1'); setOverviewTablePage(1); }}
                title="Click to view all Form 1 submissions"
                style={{
                  background: palette.surfaceAlt,
                  border: expandedOverviewForm === 'form1' ? '1.5px solid #A855F7' : '1.5px solid rgba(168,85,247,0.3)',
                  borderRadius: '16px', padding: '24px', cursor: 'pointer',
                  boxShadow: expandedOverviewForm === 'form1' ? '0 0 0 3px rgba(168,85,247,0.15)' : 'none',
                  transition: 'box-shadow 0.15s, border-color 0.15s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: palette.mutedText, fontSize: '0.9rem', fontWeight: 700 }}>Form 1 Submissions</span>
                  <div title="Form 1 (DIY Craft Wall Photos & Reflection)">
                    <Info size={18} color="#A855F7" />
                  </div>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#A855F7' }}>
                  {allUsers.filter(u => u.form1).length}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#A855F7', fontWeight: 700, marginTop: '6px' }}>
                  {expandedOverviewForm === 'form1' ? '▲ Hide submissions' : '▼ View submissions'}
                </div>
              </div>

              <div
                onClick={() => { setExpandedOverviewForm(prev => prev === 'form2' ? null : 'form2'); setOverviewTablePage(1); }}
                title="Click to view all Form 2 submissions"
                style={{
                  background: palette.surfaceAlt,
                  border: expandedOverviewForm === 'form2' ? '1.5px solid #22C55E' : '1.5px solid rgba(34,197,94,0.3)',
                  borderRadius: '16px', padding: '24px', cursor: 'pointer',
                  boxShadow: expandedOverviewForm === 'form2' ? '0 0 0 3px rgba(34,197,94,0.15)' : 'none',
                  transition: 'box-shadow 0.15s, border-color 0.15s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: palette.mutedText, fontSize: '0.9rem', fontWeight: 700 }}>Form 2 Submissions</span>
                  <div title="Form 2 (Family Kando Video Submissions)">
                    <Info size={18} color="#22C55E" />
                  </div>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#22C55E' }}>
                  {allUsers.filter(u => u.form2).length}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#22C55E', fontWeight: 700, marginTop: '6px' }}>
                  {expandedOverviewForm === 'form2' ? '▲ Hide submissions' : '▼ View submissions'}
                </div>
              </div>

            </div>

            {/* EXPANDABLE SUBMISSIONS TABLE — shown below the KPI cards when a KPI card is clicked (Total / Form 1 / Form 2) */}
            {expandedOverviewForm && (() => {
              const formKey = expandedOverviewForm;
              const accent = formKey === 'total' ? palette.accentCyan : formKey === 'form1' ? '#A855F7' : '#22C55E';
              const label = formKey === 'total' ? 'Registered Users' : formKey === 'form1' ? 'Form 1 Submissions' : 'Form 2 Submissions';
              const allRows = formKey === 'total' ? allUsers : allUsers.filter(u => (u as any)[formKey]);
              const totalPages = Math.max(1, Math.ceil(allRows.length / OVERVIEW_PAGE_SIZE));
              const safePage = Math.min(overviewTablePage, totalPages);
              const rows = allRows.slice((safePage - 1) * OVERVIEW_PAGE_SIZE, safePage * OVERVIEW_PAGE_SIZE);
              return (
                <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: '16px', overflow: 'hidden', marginBottom: '32px' }}>
                  <div style={{ padding: '16px 20px', borderBottom: `1px solid ${palette.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: accent }}>
                      {label} ({allRows.length})
                    </h3>
                    <button
                      onClick={() => setExpandedOverviewForm(null)}
                      style={{ background: 'transparent', border: 'none', color: palette.mutedText, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
                    >
                      Close ✕
                    </button>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ background: palette.surfaceAlt, color: palette.accentCyan, borderBottom: `1px solid ${palette.border}` }}>
                          <th style={{ padding: '12px 18px', textAlign: 'left' }}>Emp ID / Phone</th>
                          <th style={{ padding: '12px 18px', textAlign: 'left' }}>Employee Name</th>
                          <th style={{ padding: '12px 18px', textAlign: 'left' }}>Department</th>
                          <th style={{ padding: '12px 18px', textAlign: 'left' }}>{formKey === 'total' ? 'Registered Date/Time' : 'Submitted Date/Time'}</th>
                          <th style={{ padding: '12px 18px', textAlign: 'left' }}>Status</th>
                          <th style={{ padding: '12px 18px', textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.length === 0 ? (
                          <tr>
                            <td colSpan={6} style={{ padding: '24px 18px', textAlign: 'center', color: palette.mutedText }}>
                              No {label.toLowerCase()} yet.
                            </td>
                          </tr>
                        ) : rows.map(user => {
                          const submittedAt = formKey === 'total'
                            ? ((user as any).createdAt || user.form1?.submittedAt || user.form2?.submittedAt)
                            : (user as any)[formKey]?.submittedAt;
                          const department = formKey === 'total'
                            ? (user.form1?.department || user.form2?.department || '—')
                            : ((user as any)[formKey]?.department || '—');
                          const userId = user.id || (user as any)._id;
                          const statusLabel = formKey !== 'total'
                            ? '✓ Submitted'
                            : (user.form1 && user.form2) ? '✓ Both Submitted'
                            : user.form1 ? 'Form 1 Only'
                            : user.form2 ? 'Form 2 Only'
                            : 'Pending';
                          const statusColor = formKey !== 'total'
                            ? accent
                            : (user.form1 && user.form2) ? '#22C55E'
                            : (user.form1 || user.form2) ? '#EAB308'
                            : '#64748B';
                          return (
                            <tr key={userId} style={{ borderBottom: `1px solid ${palette.borderFaint}` }}>
                              <td style={{ padding: '12px 18px', fontWeight: 800, color: palette.accentCyan }}>
                                {user.empId || user.phone || '—'}
                              </td>
                              <td style={{ padding: '12px 18px', fontWeight: 700, color: palette.text }}>
                                {user.empName}
                              </td>
                              <td style={{ padding: '12px 18px', color: palette.textMuted2 }}>
                                {department}
                              </td>
                              <td style={{ padding: '12px 18px', color: palette.textMuted2, fontSize: '0.8rem' }}>
                                {submittedAt ? new Date(submittedAt).toLocaleString() : '—'}
                              </td>
                              <td style={{ padding: '12px 18px' }}>
                                <span style={{ background: `${statusColor}26`, color: statusColor, padding: '4px 10px', borderRadius: '12px', fontWeight: 700, fontSize: '0.75rem' }}>
                                  {statusLabel}
                                </span>
                              </td>
                              <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                                <button
                                  onClick={() => handleOpenUserProfile(user)}
                                  style={{
                                    background: `rgba(${palette.accentCyanRgb},0.15)`,
                                    border: `1px solid ${palette.accentCyan}`,
                                    color: palette.accentCyan,
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
                  </div>

                  {/* PAGINATION — 25 users per page, matches Users Directory convention */}
                  {allRows.length > 0 && (
                    <div style={{ padding: '14px 20px', background: palette.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${palette.border}` }}>
                      <span style={{ fontSize: '0.8rem', color: palette.mutedText }}>
                        Showing {rows.length} of {allRows.length} entries ({OVERVIEW_PAGE_SIZE} per page)
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button onClick={() => setOverviewTablePage(p => Math.max(1, p - 1))} disabled={safePage === 1} style={{ background: palette.inputBg, border: 'none', color: palette.text, padding: '6px 12px', borderRadius: '6px', cursor: safePage === 1 ? 'default' : 'pointer', opacity: safePage === 1 ? 0.5 : 1 }}>
                          <ChevronLeft size={16} />
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Page {safePage} of {totalPages}</span>
                        <button onClick={() => setOverviewTablePage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} style={{ background: palette.inputBg, border: 'none', color: palette.text, padding: '6px 12px', borderRadius: '6px', cursor: safePage === totalPages ? 'default' : 'pointer', opacity: safePage === totalPages ? 0.5 : 1 }}>
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* 2. USERS DIRECTORY VIEW */}
        {activeTab === 'users' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: palette.pageText, margin: 0 }}>Registered Users Directory</h1>
                <p style={{ color: palette.mutedText, fontSize: '0.85rem', marginTop: '4px' }}>Manage candidate entries, apply classification tags & export data</p>
              </div>

              {/* EXPORT BUTTONS (Req 2 - PDF Report Included) — disabled whenever
                  there's nothing matching the current filter/selection to export. */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {!canExport && (
                  <span style={{ color: palette.mutedText, fontSize: '0.8rem', fontWeight: 700, marginRight: '4px' }}>
                    No matching users to export
                  </span>
                )}
                <button
                  onClick={() => handleExportData('pdf')}
                  disabled={!canExport}
                  style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, cursor: canExport ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', opacity: canExport ? 1 : 0.4 }}
                >
                  <Download size={14} /> PDF Report
                </button>
                <button
                  onClick={() => handleExportData('csv')}
                  disabled={!canExport}
                  style={{ background: `rgba(${palette.accentCyanRgb},0.12)`, border: `1px solid ${palette.accentCyan}`, color: palette.accentCyan, padding: '8px 14px', borderRadius: '8px', fontWeight: 700, cursor: canExport ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', opacity: canExport ? 1 : 0.4 }}
                >
                  <Download size={14} /> CSV
                </button>
                <button
                  onClick={() => handleExportData('excel')}
                  disabled={!canExport}
                  style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid #22C55E', color: '#4ADE80', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, cursor: canExport ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', opacity: canExport ? 1 : 0.4 }}
                >
                  <Download size={14} /> Excel
                </button>
                <button
                  onClick={() => setEmailExportOpen(true)}
                  disabled={!canExport}
                  style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid #A855F7', color: '#C084FC', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, cursor: canExport ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', opacity: canExport ? 1 : 0.4 }}
                >
                  <Download size={14} /> CSV + ZIP Media Assets
                </button>
              </div>
            </div>

            {/* FILTERS TOOLBAR (Req 14) */}
            <div style={{ background: palette.surface, padding: '16px', borderRadius: '14px', border: `1px solid ${palette.border}`, marginBottom: '20px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                <Search size={16} color={palette.mutedText} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text"
                  placeholder="Search by Name, Emp ID, Email or City..."
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '8px', background: palette.inputBg, border: `1px solid ${palette.border}`, color: palette.text, fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              {/* Tag Filter */}
              <select
                value={selectedTagFilter}
                onChange={e => { setSelectedTagFilter(e.target.value); setCurrentPage(1); }}
                style={{ padding: '9px 12px', borderRadius: '8px', background: palette.surfaceAlt, border: `1px solid ${palette.borderStrong}`, color: palette.text, fontSize: '0.85rem', outline: 'none' }}
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
                style={{ padding: '9px 12px', borderRadius: '8px', background: palette.surfaceAlt, border: `1px solid ${palette.borderStrong}`, color: palette.text, fontSize: '0.85rem', outline: 'none' }}
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
              <div style={{ background: `rgba(${palette.accentCyanRgb},0.1)`, border: `1px solid ${palette.accentCyan}`, borderRadius: '14px', padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <span style={{ color: palette.accentCyan, fontWeight: 800, fontSize: '0.9rem' }}>
                  {selectedUserIds.size > 0
                    ? `${selectedUserIds.size} user${selectedUserIds.size > 1 ? 's' : ''} selected`
                    : filteredUsers.length === 0
                      ? '0 users selected — no users match the current filters'
                      : `Filter applied — ${filteredUsers.length} user${filteredUsers.length !== 1 ? 's' : ''} match`}
                </span>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {canExport && (
                    <>
                      <button onClick={() => handleExportData('pdf')} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                        <Download size={14} /> PDF
                      </button>
                      <button onClick={() => handleExportData('csv')} style={{ background: `rgba(${palette.accentCyanRgb},0.12)`, border: `1px solid ${palette.accentCyan}`, color: palette.accentCyan, padding: '8px 14px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                        <Download size={14} /> CSV
                      </button>
                      <button onClick={() => handleExportData('excel')} style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid #22C55E', color: '#4ADE80', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                        <Download size={14} /> Excel
                      </button>
                      <button onClick={() => setEmailExportOpen(true)} style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid #A855F7', color: '#C084FC', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                        <Download size={14} /> CSV + ZIP
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      if (selectedUserIds.size > 0) {
                        setSelectedUserIds(new Set());
                      } else {
                        setSearchQuery(''); setSelectedTagFilter(''); setSelectedFormFilter(''); setCurrentPage(1);
                      }
                    }}
                    style={{ background: 'transparent', border: `1px solid ${palette.borderStrong}`, color: palette.mutedText, padding: '8px 14px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    {selectedUserIds.size > 0 ? 'Clear Selection' : 'Clear Filters'}
                  </button>
                </div>
              </div>
            )}

            {/* USERS TABLE — 25 ENTRIES PER PAGE (Req 8) */}
            <div style={{ background: palette.surface, borderRadius: '16px', border: `1px solid ${palette.border}`, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: palette.surfaceAlt, color: palette.accentCyan, borderBottom: `1px solid ${palette.border}` }}>
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
                        style={{ accentColor: palette.accentCyan, cursor: 'pointer', width: '16px', height: '16px' }}
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
                      <tr key={userId} style={{ borderBottom: `1px solid ${palette.borderFaint}` }}>
                        <td style={{ padding: '14px 12px' }}>
                          <input
                            type="checkbox"
                            checked={selectedUserIds.has(userId)}
                            onChange={() => toggleUserSelected(userId)}
                            style={{ accentColor: palette.accentCyan, cursor: 'pointer', width: '16px', height: '16px' }}
                          />
                        </td>

                        <td style={{ padding: '14px 18px', fontWeight: 800, color: palette.accentCyan }}>
                          {user.empId || user.phone || '—'}
                        </td>

                        <td style={{ padding: '14px 18px' }}>
                          <div
                            onClick={() => handleOpenUserProfile(user)}
                            style={{ cursor: 'pointer', fontWeight: 700, color: palette.text, textDecoration: 'underline' }}
                            title="Click to view full user profile page"
                          >
                            {user.empName}
                          </div>
                        </td>

                        <td style={{ padding: '14px 18px', color: palette.textMuted2, fontSize: '0.8rem' }}>
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
                              style={{ background: `rgba(${palette.accentCyanRgb},0.1)`, border: `1px solid ${palette.accentCyan}`, color: palette.accentCyan, padding: '5px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
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
                            palette={palette}
                          />
                        </td>

                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleOpenUserProfile(user)}
                            style={{
                              background: `rgba(${palette.accentCyanRgb},0.15)`,
                              border: `1px solid ${palette.accentCyan}`,
                              color: palette.accentCyan,
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
              <div style={{ padding: '16px 20px', background: palette.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${palette.border}` }}>
                <span style={{ fontSize: '0.8rem', color: palette.mutedText }}>
                  Showing {paginatedUsers.length} of {filteredUsers.length} entries (25 per page)
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ background: palette.inputBg, border: 'none', color: palette.text, padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                    <ChevronLeft size={16} />
                  </button>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Page {currentPage} of {totalPages}</span>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ background: palette.inputBg, border: 'none', color: palette.text, padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
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
                background: palette.inputBg, border: `1px solid ${palette.borderStrong}`,
                color: palette.text, padding: '10px 18px', borderRadius: '10px',
                fontWeight: 700, cursor: 'pointer', marginBottom: '24px'
              }}
            >
              <ArrowLeft size={18} />
              <span>Back to Users Directory</span>
            </button>

            <div style={{ background: palette.surface, border: `1.5px solid ${palette.accentCyan}`, borderRadius: '24px', padding: '32px', boxShadow: `0 0 30px rgba(${palette.accentCyanRgb},0.15))` }}>
              
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 style={{ fontSize: '2rem', color: palette.accentCyan, fontWeight: 900, margin: 0 }}>
                    {selectedUserForProfile.empName}
                  </h1>
                  <p style={{ color: palette.mutedText, fontSize: '0.9rem', marginTop: '4px' }}>
                    {selectedUserForProfile.empId
                      ? <>Employee ID: <strong style={{ color: palette.text }}>{selectedUserForProfile.empId}</strong></>
                      : <>Phone Number: <strong style={{ color: palette.text }}>{selectedUserForProfile.phone || '—'}</strong></>}
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
                  <span style={{ fontSize: '0.85rem', color: palette.mutedText, fontWeight: 700 }}>Classification Tags:</span>
                  <TagMultiSelect
                    tags={selectedUserForProfile.tags || []}
                    customTags={customTags}
                    onToggle={(tag) => handleToggleUserTag(selectedUserForProfile, tag)}
                    palette={palette}
                  />
                </div>
              </div>

              {/* ── SECTION B: FORM 1 DETAILS ── */}
              {selectedUserForProfile.form1 ? (
                <div style={{ marginBottom: '28px', background: palette.surfaceSoft, padding: '24px', borderRadius: '18px', border: '1px solid rgba(74, 222, 128, 0.3)' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#4ADE80', fontWeight: 800, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ImageIcon size={20} /> Form 1 — Photos & Video Submission
                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#64748B', fontWeight: 400 }}>
                      Submitted: {new Date(selectedUserForProfile.form1.submittedAt).toLocaleString()}
                    </span>
                  </h3>

                  {/* Meta info row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '18px', fontSize: '0.85rem' }}>
                    <div style={{ background: palette.subtleBg, padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Company Name</div>
                      <div style={{ color: palette.text }}>{selectedUserForProfile.form1.companyName || 'N/A'}</div>
                    </div>
                    <div style={{ background: palette.subtleBg, padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Department</div>
                      <div style={{ color: palette.text }}>{selectedUserForProfile.form1.department || 'N/A'}</div>
                    </div>
                    <div style={{ background: palette.subtleBg, padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Location</div>
                      <div style={{ color: palette.text }}>{selectedUserForProfile.city || 'N/A'}</div>
                    </div>
                    <div style={{ background: palette.subtleBg, padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Language</div>
                      <div style={{ color: palette.text }}>{selectedUserForProfile.form1.language === 'hi' ? 'Hindi' : selectedUserForProfile.form1.language === 'ta' ? 'Tamil' : 'English'}</div>
                    </div>
                    <div style={{ background: palette.subtleBg, padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Submitted IP</div>
                      <div style={{ color: palette.text, fontFamily: 'monospace' }}>{selectedUserForProfile.form1.ip || 'N/A'}</div>
                    </div>
                    <div style={{ background: palette.subtleBg, padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Photo 1</div>
                      <div style={{ color: selectedUserForProfile.form1.photo1Url ? '#4ADE80' : '#EF4444', fontWeight: 700 }}>{selectedUserForProfile.form1.photo1Url ? '✓ Uploaded' : '✗ Missing'}</div>
                    </div>
                    <div style={{ background: palette.subtleBg, padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Photo 2</div>
                      <div style={{ color: selectedUserForProfile.form1.photo2Url ? '#4ADE80' : '#EF4444', fontWeight: 700 }}>{selectedUserForProfile.form1.photo2Url ? '✓ Uploaded' : '✗ Missing'}</div>
                    </div>
                    <div style={{ background: palette.subtleBg, padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Video</div>
                      <div style={{ color: selectedUserForProfile.form1.videoUrl ? '#4ADE80' : '#EF4444', fontWeight: 700 }}>{selectedUserForProfile.form1.videoUrl ? '✓ Uploaded' : '✗ Missing'}</div>
                    </div>
                  </div>

                  {/* CEO Reflection */}
                  {selectedUserForProfile.form1.ceoReflection && (
                    <div style={{ background: palette.subtleBg, padding: '16px', borderRadius: '12px', marginBottom: '18px' }}>
                      <div style={{ fontSize: '0.72rem', color: '#4ADE80', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>Reflection Message (Form 1)</div>
                      <p style={{ margin: 0, color: palette.text, fontStyle: 'italic', lineHeight: 1.6 }}>"{selectedUserForProfile.form1.ceoReflection}"</p>
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
                        style={{ cursor: 'pointer', border: `1px solid ${palette.accentCyan}`, borderRadius: '10px', padding: '10px 18px', color: palette.accentCyan, fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', background: `rgba(${palette.accentCyanRgb},0.08)`, outline: 'none' }}>
                        <FileVideo size={16} /> Watch Video
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: '28px', background: palette.surfaceSoft, padding: '20px', borderRadius: '18px', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ImageIcon size={20} /> Form 1 not yet submitted
                </div>
              )}

              {/* ── SECTION C: FORM 2 DETAILS (Chairman Invites Your Thoughts) ── */}
              {selectedUserForProfile.form2 ? (
                <div style={{ background: palette.surfaceSoft, padding: '24px', borderRadius: '18px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#C084FC', fontWeight: 800, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileVideo size={20} /> Form 2 — Chairman Invites Your Thoughts
                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#64748B', fontWeight: 400 }}>
                      Submitted: {new Date(selectedUserForProfile.form2.submittedAt).toLocaleString()}
                    </span>
                  </h3>

                  {/* Meta info row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '18px', fontSize: '0.85rem' }}>
                    <div style={{ background: palette.subtleBg, padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Employee Name</div>
                      <div style={{ color: palette.text }}>{selectedUserForProfile.empName || 'N/A'}</div>
                    </div>
                    <div style={{ background: palette.subtleBg, padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Employee EIN</div>
                      <div style={{ color: palette.text }}>{selectedUserForProfile.empId || 'N/A'}</div>
                    </div>
                    <div style={{ background: palette.subtleBg, padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Company Name</div>
                      <div style={{ color: palette.text }}>{selectedUserForProfile.form2.companyName || 'N/A'}</div>
                    </div>
                    <div style={{ background: palette.subtleBg, padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Department</div>
                      <div style={{ color: palette.text }}>{selectedUserForProfile.form2.department || 'N/A'}</div>
                    </div>
                    <div style={{ background: palette.subtleBg, padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Location</div>
                      <div style={{ color: palette.text }}>{selectedUserForProfile.form2.location || 'N/A'}</div>
                    </div>
                    <div style={{ background: palette.subtleBg, padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Language</div>
                      <div style={{ color: palette.text }}>{selectedUserForProfile.form2.language === 'hi' ? 'Hindi' : selectedUserForProfile.form2.language === 'ta' ? 'Tamil' : 'English'}</div>
                    </div>
                    <div style={{ background: palette.subtleBg, padding: '12px', borderRadius: '10px' }}>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Submitted IP</div>
                      <div style={{ color: palette.text, fontFamily: 'monospace' }}>{selectedUserForProfile.form2.ip || 'N/A'}</div>
                    </div>
                  </div>

                  {/* Share Your Thoughts answer */}
                  {selectedUserForProfile.form2.thoughts && (
                    <div style={{ background: palette.subtleBg, padding: '16px', borderRadius: '12px', marginBottom: '18px' }}>
                      <div style={{ fontSize: '0.72rem', color: '#C084FC', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>Share Your Thoughts</div>
                      <p style={{ margin: 0, color: palette.text, fontStyle: 'italic', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>"{selectedUserForProfile.form2.thoughts}"</p>
                    </div>
                  )}

                  {/* Optional file attachment (if any) */}
                  {selectedUserForProfile.form2.optionalFileUrl && (
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleAttachmentView(selectedUserForProfile.form2.optionalFileUrl)}
                        disabled={attachmentOpening}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid #A855F7', borderRadius: '10px', padding: '10px 18px', color: '#C084FC', fontSize: '0.85rem', fontWeight: 700, background: 'rgba(168,85,247,0.08)', cursor: attachmentOpening ? 'not-allowed' : 'pointer', opacity: attachmentOpening ? 0.6 : 1 }}
                      >
                        <ImageIcon size={16} /> {attachmentOpening ? 'Opening…' : 'View Attached File'}
                      </button>
                      <button
                        onClick={() => handleAttachmentDownload(selectedUserForProfile.form2.optionalFileUrl)}
                        disabled={attachmentDownloading}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid #A855F7', borderRadius: '10px', padding: '10px 18px', color: '#C084FC', fontSize: '0.85rem', fontWeight: 700, background: 'rgba(168,85,247,0.08)', cursor: attachmentDownloading ? 'not-allowed' : 'pointer', opacity: attachmentDownloading ? 0.6 : 1 }}
                      >
                        <Download size={16} /> {attachmentDownloading ? 'Downloading…' : 'Download'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ background: palette.surfaceSoft, padding: '20px', borderRadius: '18px', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
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
            <p style={{ color: palette.mutedText, fontSize: '0.85rem', marginBottom: '24px' }}>Add or remove custom candidate classification tags (Logged in Audit Log)</p>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
              <input
                type="text"
                placeholder="Type new classification tag name..."
                value={newTagInput}
                onChange={e => setNewTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', background: palette.surface, border: `1px solid ${palette.borderStrong}`, color: palette.text, outline: 'none', fontSize: '0.9rem' }}
              />
              <button onClick={handleAddTag} style={{ background: palette.accentCyan, color: '#020817', border: 'none', padding: '12px 22px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                <Plus size={18} /> Add Tag
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {customTags.map(tag => (
                <div key={tag} style={{ background: palette.surfaceAlt, border: `1.5px solid ${palette.accentCyan}`, padding: '10px 18px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
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
            <p style={{ color: palette.mutedText, fontSize: '0.85rem', marginBottom: '28px' }}>Configure Google reCAPTCHA Verification & Google Analytics ID separately</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

              {/* CARD 0: ELIGIBILITY WHITELIST UPLOAD */}
              <div style={{ background: palette.surface, padding: '28px', borderRadius: '18px', border: '1.5px solid rgba(168,85,247,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <Users size={22} color="#C084FC" />
                  <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: palette.text, margin: 0 }}>Eligibility Whitelist</h2>
                    <p style={{ fontSize: '0.8rem', color: palette.mutedText, margin: 0 }}>
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
                  <div style={{ background: palette.subtleBg, padding: '16px', borderRadius: '12px' }}>
                    <div style={{ fontWeight: 700, color: palette.text, marginBottom: '4px' }}>Employee ID List</div>
                    <div style={{ fontSize: '0.8rem', color: palette.mutedText, marginBottom: '12px' }}>
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

                  <div style={{ background: palette.subtleBg, padding: '16px', borderRadius: '12px' }}>
                    <div style={{ fontWeight: 700, color: palette.text, marginBottom: '4px' }}>Phone Number List</div>
                    <div style={{ fontSize: '0.8rem', color: palette.mutedText, marginBottom: '12px' }}>
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
              <div style={{ background: palette.surface, padding: '28px', borderRadius: '18px', border: `1.5px solid rgba(${palette.accentCyanRgb},0.3))` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <Lock size={22} color={palette.accentCyan} />
                  <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: palette.text, margin: 0 }}>Google reCAPTCHA Security Settings</h2>
                    <p style={{ fontSize: '0.8rem', color: palette.mutedText, margin: 0 }}>Protect form submissions against automated spam bots</p>
                  </div>
                </div>

                {captchaStatusMsg && (
                  <div style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid #22C55E', color: '#4ADE80', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem', fontWeight: 700 }}>
                    ✓ {captchaStatusMsg}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: palette.subtleBg, padding: '14px', borderRadius: '10px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: palette.text }}>Enable Captcha Verification</div>
                      <div style={{ fontSize: '0.78rem', color: palette.mutedText }}>Enforce Google reCAPTCHA v3 on Form 1 & Form 2</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={captchaEnabled}
                      onChange={e => setCaptchaEnabled(e.target.checked)}
                      style={{ width: '22px', height: '22px', accentColor: palette.accentCyan, cursor: 'pointer' }}
                    />
                  </label>

                  <div>
                    <label style={{ display: 'block', color: palette.textMuted2, fontSize: '0.82rem', marginBottom: '6px' }}>reCAPTCHA Site Key</label>
                    <input
                      type="text"
                      value={captchaSiteKey}
                      onChange={e => setCaptchaSiteKey(e.target.value)}
                      placeholder="From google.com/recaptcha/admin (reCAPTCHA v3)"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: palette.inputBg, border: `1px solid ${palette.borderStrong}`, color: palette.text, fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: palette.textMuted2, fontSize: '0.82rem', marginBottom: '6px' }}>reCAPTCHA Secret Key</label>
                    <input
                      type="password"
                      value={captchaSecretKey}
                      onChange={e => setCaptchaSecretKey(e.target.value)}
                      placeholder="Kept server-side only, never shown to the public site"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: palette.inputBg, border: `1px solid ${palette.borderStrong}`, color: palette.text, fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>
                  <p style={{ fontSize: '0.72rem', color: '#64748B', margin: 0 }}>
                    Register site type "reCAPTCHA v3" for domain <code>147.93.31.18</code> (Google accepts bare IPs as a domain entry).
                  </p>

                  <button onClick={handleSaveCaptchaSettings} style={{ background: 'linear-gradient(90deg, #00C6FF 0%, #0072FF 100%)', border: 'none', color: palette.text, padding: '12px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', marginTop: '6px' }}>
                    SAVE CAPTCHA SETTINGS
                  </button>
                </div>
              </div>

              {/* CARD 2: GOOGLE ANALYTICS MEASUREMENT SETTINGS (Req 3) */}
              <div style={{ background: palette.surface, padding: '28px', borderRadius: '18px', border: '1.5px solid rgba(168,85,247,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <BarChart3 size={22} color="#C084FC" />
                  <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: palette.text, margin: 0 }}>Google Analytics Settings</h2>
                    <p style={{ fontSize: '0.8rem', color: palette.mutedText, margin: 0 }}>Track campaign visitor traffic and conversion metrics</p>
                  </div>
                </div>

                {gaStatusMsg && (
                  <div style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid #A855F7', color: '#C084FC', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem', fontWeight: 700 }}>
                    ✓ {gaStatusMsg}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', color: palette.textMuted2, fontSize: '0.82rem', marginBottom: '6px' }}>
                      Google Analytics Measurement ID (GA4)
                    </label>
                    <input
                      type="text"
                      value={gaId}
                      onChange={e => setGaId(e.target.value)}
                      placeholder="G-XXXXXXXXXX or UA-XXXXXXXX-X"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: palette.inputBg, border: `1px solid ${palette.borderStrong}`, color: palette.text, fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  <div style={{ background: palette.subtleBg, padding: '12px 14px', borderRadius: '8px', fontSize: '0.8rem', color: palette.mutedText }}>
                    Status: <strong style={{ color: '#4ADE80' }}>● Active Analytics Script Injected</strong>
                  </div>

                  <button onClick={handleSaveGaSettings} style={{ background: 'linear-gradient(90deg, #A855F7 0%, #7E22CE 100%)', border: 'none', color: palette.text, padding: '12px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', marginTop: '6px' }}>
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
            <p style={{ color: palette.mutedText, fontSize: '0.85rem', marginBottom: '24px' }}>Immutable security audit trails (Strict append-only record — deletion disabled)</p>

            <div style={{ background: palette.surface, borderRadius: '16px', border: `1px solid ${palette.border}`, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: palette.surfaceAlt, color: palette.accentCyan, borderBottom: `1px solid ${palette.border}` }}>
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
                    <tr key={log.id || (log as any)._id} style={{ borderBottom: `1px solid ${palette.borderFaint}` }}>
                      <td style={{ padding: '14px 18px', color: palette.textMuted2, fontSize: '0.8rem' }}>{new Date(log.timestamp).toLocaleString()}</td>
                      <td style={{ padding: '14px 18px', color: palette.accentCyan, fontWeight: 700, fontSize: '0.8rem' }}>{log.ip || '127.0.0.1'}</td>
                      <td style={{ padding: '14px 18px', color: palette.text }}>{log.detail}</td>
                      <td style={{ padding: '14px 18px', color: palette.mutedText }}>{log.username || 'Admin'}</td>
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
          <div style={{ background: palette.surface, border: `1px solid ${palette.accentCyan}`, borderRadius: '16px', padding: '24px', maxWidth: '700px', width: '100%', position: 'relative' }}>
            <button onClick={() => setMediaModal(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: palette.text, cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.1rem', color: palette.accentCyan, marginBottom: '16px' }}>{mediaModal.title}</h3>
            {mediaError ? (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <p style={{ color: '#EF4444', fontWeight: 700, marginBottom: '12px' }}>{mediaError}</p>
                <button
                  onClick={() => setMediaRetryKey(k => k + 1)}
                  style={{ border: `1px solid ${palette.accentCyan}`, color: palette.accentCyan, background: `rgba(${palette.accentCyanRgb},0.08)`, padding: '8px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Retry
                </button>
              </div>
            ) : !mediaSignedUrl ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748B' }}>Loading…</div>
            ) : (
              <>
                {/* Fixed-size frame — height/width never change with the media's own
                    dimensions, however large or small; object-fit: contain keeps the
                    full image/video visible inside it without cropping or distortion. */}
                <div style={{ width: '100%', height: '70vh', borderRadius: '12px', overflow: 'hidden', background: palette.subtleBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {mediaModal.type === 'image' ? (
                    <img
                      key={mediaSignedUrl}
                      src={mediaSignedUrl}
                      alt={mediaModal.title}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      onError={() => setMediaError('This image file failed to load (it may be corrupted or missing).')}
                    />
                  ) : (
                    <video
                      key={mediaSignedUrl}
                      controls
                      src={mediaSignedUrl}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      onError={() => setMediaError('This video file failed to load (it may be corrupted or missing).')}
                    />
                  )}
                </div>
                <button
                  onClick={handleMediaDownload}
                  disabled={mediaDownloading}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '16px', border: `1px solid ${palette.accentCyan}`, borderRadius: '10px', padding: '10px 18px', color: palette.accentCyan, fontSize: '0.85rem', fontWeight: 700, background: `rgba(${palette.accentCyanRgb},0.08)`, cursor: mediaDownloading ? 'not-allowed' : 'pointer', opacity: mediaDownloading ? 0.6 : 1 }}
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
          <div style={{ background: palette.surface, border: `1px solid ${palette.accentCyan}`, borderRadius: '16px', padding: '24px', maxWidth: '700px', width: '100%', position: 'relative' }}>
            <button onClick={() => setAssetsModal(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: palette.text, cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.1rem', color: palette.accentCyan, marginBottom: '4px' }}>{assetsModal.items[assetsModal.index].title}</h3>
            <p style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '16px' }}>
              {assetsModal.index + 1} of {assetsModal.items.length}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setAssetsModal(m => m && ({ ...m, index: (m.index - 1 + m.items.length) % m.items.length }))}
                disabled={assetsModal.items.length < 2}
                style={{ flexShrink: 0, background: palette.inputBg, border: 'none', color: palette.text, width: '36px', height: '36px', borderRadius: '8px', cursor: assetsModal.items.length < 2 ? 'not-allowed' : 'pointer', opacity: assetsModal.items.length < 2 ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <ChevronLeft size={20} />
              </button>

              <div style={{ flex: 1, minWidth: 0 }}>
                {galleryError ? (
                  <div style={{ padding: '40px 0', textAlign: 'center' }}>
                    <p style={{ color: '#EF4444', fontWeight: 700, marginBottom: '12px' }}>{galleryError}</p>
                    <button
                      onClick={() => setGalleryRetryKey(k => k + 1)}
                      style={{ border: `1px solid ${palette.accentCyan}`, color: palette.accentCyan, background: `rgba(${palette.accentCyanRgb},0.08)`, padding: '8px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Retry
                    </button>
                  </div>
                ) : !gallerySignedUrl ? (
                  <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748B' }}>Loading…</div>
                ) : (
                  // Fixed-size frame — height/width never change with the media's own
                  // dimensions; object-fit: contain keeps the full image/video visible
                  // inside it without cropping or distortion.
                  <div style={{ width: '100%', height: '60vh', borderRadius: '12px', overflow: 'hidden', background: palette.subtleBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {assetsModal.items[assetsModal.index].type === 'image' ? (
                      <img
                        key={gallerySignedUrl}
                        src={gallerySignedUrl}
                        alt={assetsModal.items[assetsModal.index].title}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        onError={() => setGalleryError('This image file failed to load (it may be corrupted or missing).')}
                      />
                    ) : (
                      <video
                        key={gallerySignedUrl}
                        controls
                        src={gallerySignedUrl}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        onError={() => setGalleryError('This video file failed to load (it may be corrupted or missing).')}
                      />
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => setAssetsModal(m => m && ({ ...m, index: (m.index + 1) % m.items.length }))}
                disabled={assetsModal.items.length < 2}
                style={{ flexShrink: 0, background: palette.inputBg, border: 'none', color: palette.text, width: '36px', height: '36px', borderRadius: '8px', cursor: assetsModal.items.length < 2 ? 'not-allowed' : 'pointer', opacity: assetsModal.items.length < 2 ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {gallerySignedUrl && !galleryError && (
              <button
                onClick={() => downloadR2File(assetsModal.items[assetsModal.index].url, assetsModal.items[assetsModal.index].title)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '16px', border: `1px solid ${palette.accentCyan}`, borderRadius: '10px', padding: '10px 18px', color: palette.accentCyan, fontSize: '0.85rem', fontWeight: 700, background: `rgba(${palette.accentCyanRgb},0.08)`, cursor: 'pointer' }}
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
          <div style={{ background: palette.surface, border: '1px solid #EF4444', borderRadius: '16px', padding: '24px', maxWidth: '380px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <AlertTriangle size={22} color="#EF4444" />
              <h3 style={{ fontSize: '1.05rem', color: palette.text, margin: 0 }}>Delete Tag?</h3>
            </div>
            <p style={{ color: palette.mutedText, fontSize: '0.88rem', marginBottom: '20px' }}>
              Are you sure you want to delete the tag <strong style={{ color: palette.text }}>"{tagPendingDelete}"</strong>? Any users currently assigned this tag will lose it.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setTagPendingDelete(null)}
                style={{ flex: 1, padding: '10px', borderRadius: '10px', border: `1px solid ${palette.borderStrong}`, background: 'transparent', color: palette.textMuted2, fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveTag(tagPendingDelete)}
                style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#EF4444', color: palette.text, fontWeight: 700, cursor: 'pointer' }}
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
          <div style={{ background: palette.surface, border: '1px solid #A855F7', borderRadius: '16px', padding: '24px', maxWidth: '420px', width: '100%', position: 'relative' }}>
            <button onClick={() => setEmailExportOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: palette.text, cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.1rem', color: '#C084FC', marginBottom: '8px' }}>Email CSV + ZIP Export</h3>
            <p style={{ color: palette.mutedText, fontSize: '0.85rem', marginBottom: '16px' }}>
              We'll build the export and email you a download link — large exports can take a few minutes.
            </p>
            <input
              type="email"
              value={emailExportAddress}
              onChange={e => setEmailExportAddress(e.target.value)}
              placeholder="admin@example.com"
              style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: `1px solid ${palette.border}`, background: palette.surfaceAlt, color: palette.text, fontSize: '0.9rem', marginBottom: '16px', outline: 'none', boxSizing: 'border-box' }}
            />
            <button
              onClick={handleEmailExport}
              disabled={emailExportSending || !emailExportAddress.trim()}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: 'linear-gradient(90deg, #A855F7 0%, #6366F1 100%)', color: palette.text, fontWeight: 700, cursor: (emailExportSending || !emailExportAddress.trim()) ? 'not-allowed' : 'pointer', opacity: (emailExportSending || !emailExportAddress.trim()) ? 0.6 : 1 }}
            >
              {emailExportSending ? 'Starting…' : 'Send Export Link'}
            </button>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', background: palette.surfaceAlt, border: '1px solid #A855F7', color: palette.text, padding: '14px 22px', borderRadius: '12px', fontSize: '0.88rem', fontWeight: 600, zIndex: 3000, boxShadow: '0 8px 24px rgba(0,0,0,0.4)', maxWidth: '90vw' }}>
          {toast}
        </div>
      )}

    </div>
  );
};
