import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

// Loads Google reCAPTCHA v3 only when the admin has actually configured and
// enabled it (via /api/public-settings) — stays completely inert otherwise,
// so no script loads and no token is required until keys are set.
export function useCaptcha(apiBaseUrl: string) {
  const [config, setConfig] = useState<{ enabled: boolean; siteKey: string }>({ enabled: false, siteKey: '' });
  const scriptLoaded = useRef(false);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/public-settings`)
      .then(res => res.json())
      .then(data => setConfig({ enabled: !!data.captchaEnabled, siteKey: data.captchaSiteKey || '' }))
      .catch(() => {});
  }, [apiBaseUrl]);

  useEffect(() => {
    if (!config.enabled || !config.siteKey || scriptLoaded.current) return;
    scriptLoaded.current = true;
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${config.siteKey}`;
    document.head.appendChild(script);
  }, [config]);

  // Returns '' when captcha is off/unconfigured — the backend only enforces
  // a token when it has captcha enabled with a matching secret key.
  const getCaptchaToken = async (action: string): Promise<string> => {
    if (!config.enabled || !config.siteKey || !window.grecaptcha) return '';
    return new Promise((resolve) => {
      window.grecaptcha!.ready(() => {
        window.grecaptcha!.execute(config.siteKey, { action }).then(resolve).catch(() => resolve(''));
      });
    });
  };

  return { captchaEnabled: config.enabled, getCaptchaToken };
}
