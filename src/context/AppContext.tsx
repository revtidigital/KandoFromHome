import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';

export interface SubmissionRecord {
  id: string;
  refId: string;
  empId: string;
  empName: string;
  email: string;
  phone: string;
  city: string;
  familyMembers: number;
  tags?: string[];
  form1?: {
    photo1Url: string;
    photo2Url?: string;
    ceoReflection?: string;
    submittedAt: string;
  };
  form2?: {
    videoUrl: string;
    submittedAt: string;
  };
  status: 'Pending' | 'Shortlisted' | 'Featured' | 'Flagged';
  submittedAt: string;
  language: Language;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  username: string;
  ip: string;
  detail: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  t: typeof translations['en'];
  
  formData: {
    empName: string;
    empId: string;
    email: string;
    phone: string;
    city: string;
    familyMembers: string;
    video: File | null;
    photo1: File | null;
    photo2: File | null;
    refId: string;
    ceoReflection: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<AppContextType['formData']>>;
  
  submissions: SubmissionRecord[];
  fetchSubmissions: (page?: number, search?: string, tag?: string) => Promise<void>;
  updateUserTags: (id: string, tags: string[]) => Promise<void>;
  auditLogs: AuditLog[];
  fetchAuditLogs: () => Promise<void>;
  
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
  adminAuthHeader: () => Record<string, string>;
  logAdminAction: (detail: string) => void;

  allUsers: any[];
  setAllUsers: React.Dispatch<React.SetStateAction<any[]>>;
  customTags: string[];
  setCustomTags: React.Dispatch<React.SetStateAction<string[]>>;
  addAuditLog: (detail: string) => void;

  navigateTo: (view: string, langOverride?: Language) => void;
  apiBaseUrl: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Admin views are English-only — they use a clean path (/admin-login, /admin-dashboard)
// instead of the language-prefixed hash used by the public-facing pages.
const ADMIN_CLEAN_VIEWS = ['admin-login', 'admin-dashboard'];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Parse initial state from URL hash e.g. #en/home or #hi/form1
  const parseHash = () => {
    const cleanPath = window.location.pathname.replace(/^\//, '');
    // Prefix match so deep links / refreshes like /admin-dashboard/users/EMP123
    // still resolve to the admin-dashboard view (AdminDashboardPage owns the
    // rest of that path itself and restores the exact tab/user from it).
    const matchedAdminView = ADMIN_CLEAN_VIEWS.find(
      v => cleanPath === v || cleanPath.startsWith(`${v}/`)
    );
    if (matchedAdminView) {
      return { lang: 'en' as Language, view: matchedAdminView };
    }

    const hash = window.location.hash.replace('#', '');
    const parts = hash.split('/').filter(Boolean);
    const savedLang = (localStorage.getItem('kando_lang') as Language) || 'en';
    let lang: Language = savedLang;
    let view = 'landing';

    if (parts.length > 0) {
      if (['en', 'hi', 'ta'].includes(parts[0])) {
        lang = parts[0] as Language;
        if (parts[1]) view = parts[1];
      } else {
        view = parts[0];
      }
    }
    return { lang, view };
  };

  const initial = parseHash();
  const [language, setLanguageState] = useState<Language>(initial.lang);
  const [currentView, setCurrentView] = useState<string>(initial.view);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return !!sessionStorage.getItem('kando_admin_cred');
  });

  // Real admin login — verifies the entered credentials against the backend
  // (protected by nginx + Express Basic Auth) before granting dashboard access.
  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    const encoded = btoa(`${username}:${password}`);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/overview`, {
        headers: { Authorization: `Basic ${encoded}` }
      });
      if (res.ok) {
        sessionStorage.setItem('kando_admin_cred', encoded);
        setIsAdminLoggedIn(true);
        fetch(`${API_BASE_URL}/api/admin/audit-log`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Basic ${encoded}` },
          body: JSON.stringify({ detail: 'Logged in to Admin Dashboard' })
        }).catch(() => {});
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const adminLogout = () => {
    const cred = sessionStorage.getItem('kando_admin_cred');
    if (cred) {
      fetch(`${API_BASE_URL}/api/admin/audit-log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Basic ${cred}` },
        body: JSON.stringify({ detail: 'Logged out of Admin Dashboard' })
      }).catch(() => {});
    }
    sessionStorage.removeItem('kando_admin_cred');
    setIsAdminLoggedIn(false);
  };

  const adminAuthHeader = (): Record<string, string> => {
    const cred = sessionStorage.getItem('kando_admin_cred');
    return cred ? { Authorization: `Basic ${cred}` } : {};
  };

  const logAdminAction = (detail: string) => {
    const cred = sessionStorage.getItem('kando_admin_cred');
    if (!cred) return;
    fetch(`${API_BASE_URL}/api/admin/audit-log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${cred}` },
      body: JSON.stringify({ detail })
    }).catch(() => {});
  };

  const [formData, setFormData] = useState({
    empName: '',
    empId: '',
    email: '',
    phone: '',
    city: '',
    familyMembers: '',
    video: null as File | null,
    photo1: null as File | null,
    photo2: null as File | null,
    refId: '',
    ceoReflection: ''
  });

  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Sync state with URL hash change (Enables Browser Back/Forward buttons!)
  useEffect(() => {
    const handleHashChange = () => {
      const { lang, view } = parseHash();
      setLanguageState(lang);
      setCurrentView(view);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when navigating — GUARANTEED REAL-TIME URL HASH SYNC
  const updateUrlHash = (lang: Language, view: string) => {
    if (ADMIN_CLEAN_VIEWS.includes(view)) {
      // Admin views use a clean, language-free path in the address bar
      const targetPath = `/${view}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
      return;
    }
    if (ADMIN_CLEAN_VIEWS.includes(window.location.pathname.replace(/^\//, ''))) {
      window.history.pushState(null, '', '/');
    }
    const newHash = `#${lang}/${view}`;
    if (window.location.hash !== newHash) {
      window.location.hash = newHash;
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kando_lang', lang);
    updateUrlHash(lang, currentView);
  };

  const navigateTo = (view: string, langOverride?: Language) => {
    const targetLang = langOverride || language;
    if (langOverride) {
      setLanguageState(langOverride);
      localStorage.setItem('kando_lang', langOverride);
    }
    setCurrentView(view);
    updateUrlHash(targetLang, view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch Users & Submissions from API
  const fetchSubmissions = async (page = 1, search = '', tag = '') => {
    try {
      const query = new URLSearchParams({ page: String(page), limit: '25', search, tag });
      const res = await fetch(`${API_BASE_URL}/api/admin/users?${query}`, { headers: adminAuthHeader() });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.users || []);
      }
    } catch (err) {
      console.warn('Backend API connection pending, using local state:', err);
    }
  };

  // Fetch Audit Logs (Append-Only)
  const fetchAuditLogs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/audit-logs`, { headers: adminAuthHeader() });
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data || []);
      }
    } catch (err) {
      console.warn('Audit log fetch error:', err);
    }
  };

  // Update User Tags
  const updateUserTags = async (id: string, tags: string[]) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}/tags`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...adminAuthHeader() },
        body: JSON.stringify({ tags })
      });
      if (res.ok) {
        fetchSubmissions();
        fetchAuditLogs();
      }
    } catch (err) {
      console.error('Error updating tags:', err);
    }
  };

  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [customTags, setCustomTags] = useState<string[]>(['Shortlisted', 'Featured', 'Flagged', 'Verified']);

  const addAuditLog = (detail: string) => {
    const newLog: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      username: 'Admin',
      ip: '147.93.31.18',
      detail
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const t = translations[language];

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      currentView,
      setCurrentView,
      t,
      formData,
      setFormData,
      submissions,
      fetchSubmissions,
      updateUserTags,
      auditLogs,
      fetchAuditLogs,
      isAdminLoggedIn,
      setIsAdminLoggedIn,
      adminLogin,
      adminLogout,
      adminAuthHeader,
      logAdminAction,
      allUsers,
      setAllUsers,
      customTags,
      setCustomTags,
      addAuditLog,
      navigateTo,
      apiBaseUrl: API_BASE_URL
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
