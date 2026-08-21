import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// Loads gtag.js only when the admin has configured a GA measurement ID (via
// /api/public-settings) — stays completely inert otherwise, same pattern as
// useCaptcha. Sends a page_view on every view change since this app has no
// react-router (navigation is a currentView string in AppContext).
export function useGoogleAnalytics(apiBaseUrl: string, currentView: string) {
  const gaIdRef = useRef<string>('');
  const scriptLoaded = useRef(false);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/public-settings`)
      .then(res => res.json())
      .then(data => {
        const id = data.googleAnalyticsId || '';
        if (!id || scriptLoaded.current) return;
        scriptLoaded.current = true;
        gaIdRef.current = id;

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag(...args: unknown[]) { window.dataLayer!.push(args); };
        window.gtag('js', new Date());
        // send_page_view: false — we send page_view manually below so
        // navigation (which never triggers a real URL change here) is tracked.
        window.gtag('config', id, { send_page_view: false });
        window.gtag('event', 'page_view', { page_title: currentView, page_path: `/${currentView}` });
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBaseUrl]);

  useEffect(() => {
    if (!gaIdRef.current || !window.gtag) return;
    window.gtag('event', 'page_view', { page_title: currentView, page_path: `/${currentView}` });
  }, [currentView]);
}
