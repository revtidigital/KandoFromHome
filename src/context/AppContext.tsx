import React, { createContext, useContext, useState } from 'react';
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
  videoUrl: string;
  photo1Url: string;
  photo2Url: string;
  ceoReflection: string;
  status: 'Pending' | 'Shortlisted' | 'Featured' | 'Flagged';
  submittedAt: string;
  language: Language;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminUser: string;
  action: string;
  details: string;
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
  updateSubmissionStatus: (id: string, status: SubmissionRecord['status']) => void;
  auditLogs: AuditLog[];
  addAuditLog: (action: string, details: string) => void;
  
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  
  navigateTo: (view: string) => void;
}

const initialSubmissions: SubmissionRecord[] = [
  {
    id: 'sub-1',
    refId: 'KANDO-2026-8942',
    empId: 'YMI-1049',
    empName: 'Rahul Sharma',
    email: 'rahul.sharma@yamaha-motor.co.in',
    phone: '+91 98765 43210',
    city: 'Surajpur',
    familyMembers: 4,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-happy-family-decorating-a-christmas-tree-41525-large.mp4',
    photo1Url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800',
    photo2Url: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?auto=format&fit=crop&q=80&w=800',
    ceoReflection: 'Working together with my wife and 2 kids on the Yamaha craft wall brought immense joy. We learned about Kando together and felt proud to be part of the Yamaha family.',
    status: 'Shortlisted',
    submittedAt: '2026-07-28 10:30 AM',
    language: 'en'
  },
  {
    id: 'sub-2',
    refId: 'KANDO-2026-7721',
    empId: 'YMI-2281',
    empName: 'Priya Sundaram',
    email: 'priya.sundaram@yamaha-motor.co.in',
    phone: '+91 94441 23456',
    city: 'Chennai',
    familyMembers: 3,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-family-playing-together-in-the-living-room-41530-large.mp4',
    photo1Url: 'https://images.unsplash.com/photo-1581579438747-1dc8d1e05dd8?auto=format&fit=crop&q=80&w=800',
    photo2Url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=800',
    ceoReflection: 'சென்னை ஆலையில் நான் பணியாற்றி வரும் வேளையில், எனது குடும்பத்துடன் இந்த DIY கிட்டினைச் செய்தது மிகுந்த மகிழ்ச்சியளித்தது.',
    status: 'Featured',
    submittedAt: '2026-07-28 11:15 AM',
    language: 'ta'
  },
  {
    id: 'sub-3',
    refId: 'KANDO-2026-6410',
    empId: 'YMI-3304',
    empName: 'Amitabh Verma',
    email: 'amitabh.verma@yamaha-motor.co.in',
    phone: '+91 98112 99887',
    city: 'Gurgaon',
    familyMembers: 5,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-crafting-paper-shapes-42931-large.mp4',
    photo1Url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800',
    photo2Url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800',
    ceoReflection: 'बच्चों ने यामाहा लोगो और दिल के आकार के कटआउट्स को बहुत उत्साह के साथ चिपकाया। यह अनुभव हमारे लिए वास्तव में कांदो का अहसास था।',
    status: 'Pending',
    submittedAt: '2026-07-29 02:40 PM',
    language: 'hi'
  },
  {
    id: 'sub-4',
    refId: 'KANDO-2026-5290',
    empId: 'YMI-4112',
    empName: 'Karthik Subramanian',
    email: 'karthik.s@yamaha-motor.co.in',
    phone: '+91 97890 12345',
    city: 'Kanchipuram',
    familyMembers: 4,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-family-celebrating-together-41532-large.mp4',
    photo1Url: 'https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?auto=format&fit=crop&q=80&w=800',
    photo2Url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800',
    ceoReflection: 'Very inspiring event! The DIY wall decoration is now proudly displayed in our living room.',
    status: 'Shortlisted',
    submittedAt: '2026-07-29 04:10 PM',
    language: 'en'
  },
  {
    id: 'sub-5',
    refId: 'KANDO-2026-4109',
    empId: 'YMI-5590',
    empName: 'Deepak Chawla',
    email: 'deepak.c@yamaha-motor.co.in',
    phone: '+91 99998 77665',
    city: 'Faridabad',
    familyMembers: 3,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-happy-family-decorating-a-christmas-tree-41525-large.mp4',
    photo1Url: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?auto=format&fit=crop&q=80&w=800',
    photo2Url: 'https://images.unsplash.com/photo-1581579438747-1dc8d1e05dd8?auto=format&fit=crop&q=80&w=800',
    ceoReflection: 'A wonderful initiative by Yamaha Motor India. Loved spending quality time making memories.',
    status: 'Pending',
    submittedAt: '2026-07-30 09:20 AM',
    language: 'en'
  }
];

const initialLogs: AuditLog[] = [
  { id: 'log-1', timestamp: '2026-07-31 09:15 AM', adminUser: 'SuperAdmin (admin@yamaha.in)', action: 'LOGIN', details: 'Authenticated into Admin Portal successfully.' },
  { id: 'log-2', timestamp: '2026-07-31 09:30 AM', adminUser: 'SuperAdmin (admin@yamaha.in)', action: 'TAG_UPDATE', details: 'Updated status for YMI-2281 to "Featured".' },
  { id: 'log-3', timestamp: '2026-07-31 10:05 AM', adminUser: 'Reviewer (eval@yamaha.in)', action: 'EXPORT', details: 'Exported 5 records to CSV file.' }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('kando_lang') as Language;
    return saved || 'en';
  });

  const [currentView, setCurrentView] = useState<string>('landing');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

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

  const [submissions, setSubmissions] = useState<SubmissionRecord[]>(initialSubmissions);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialLogs);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kando_lang', lang);
  };

  const updateSubmissionStatus = (id: string, status: SubmissionRecord['status']) => {
    setSubmissions(prev => prev.map(item => item.id === id ? { ...item, status } : item));
    addAuditLog('TAG_UPDATE', `Updated entry ${id} status to "${status}".`);
  };

  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toLocaleString(),
      adminUser: 'Admin User',
      action,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const navigateTo = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      updateSubmissionStatus,
      auditLogs,
      addAuditLog,
      isAdminLoggedIn,
      setIsAdminLoggedIn,
      navigateTo
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
