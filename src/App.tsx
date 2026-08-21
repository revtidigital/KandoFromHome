import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { useGoogleAnalytics } from './hooks/useGoogleAnalytics';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { Form1Page } from './pages/Form1Page';
import { ThankYou1Page } from './pages/ThankYou1Page';
import { Form2Page } from './pages/Form2Page';
import { ThankYou2Page } from './pages/ThankYou2Page';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsConditionsPage } from './pages/TermsConditionsPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const MainRouter: React.FC = () => {
  const { currentView, isAdminLoggedIn, apiBaseUrl } = useApp();
  useGoogleAnalytics(apiBaseUrl, currentView);

  switch (currentView) {
    case 'landing':
      return <LandingPage />;
    case 'home':
      return <HomePage />;
    case 'form1':
      return <Form1Page />;
    case 'thankyou1':
      return <ThankYou1Page />;
    case 'form2':
      return <Form2Page />;
    case 'thankyou2':
      return <ThankYou2Page />;
    case 'privacy':
      return <PrivacyPolicyPage />;
    case 'terms':
      return <TermsConditionsPage />;
    case 'admin-login':
      return <AdminLoginPage />;
    case 'admin-dashboard':
      return isAdminLoggedIn ? <AdminDashboardPage /> : <AdminLoginPage />;
    default:
      return <LandingPage />;
  }
};

export function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}

export default App;
