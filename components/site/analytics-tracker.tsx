'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

function getSessionId(): string {
  try {
    let sid = sessionStorage.getItem('mpg_sid');
    if (!sid) {
      sid = 'sid_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      sessionStorage.setItem('mpg_sid', sid);
    }
    return sid;
  } catch {
    return 'sid_anonymous';
  }
}

function parseDevice(ua: string): { browser: string; os: string; device_type: string } {
  let browser = 'Other';
  let os = 'Other';
  let device_type = 'desktop';

  if (/mobile/i.test(ua)) device_type = 'mobile';
  else if (/tablet|ipad/i.test(ua)) device_type = 'tablet';

  if (/chrome|crios/i.test(ua) && !/edg|opr\//i.test(ua)) browser = 'Chrome';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/edg/i.test(ua)) browser = 'Edge';
  else if (/opera|opr\//i.test(ua)) browser = 'Opera';

  if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/mac os x/i.test(ua)) os = 'macOS';
  else if (/windows/i.test(ua)) os = 'Windows';
  else if (/linux/i.test(ua)) os = 'Linux';

  return { browser, os, device_type };
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  const trackEvent = (path: string) => {
    try {
      // Do not track admin routes or API endpoints
      if (path.startsWith('/admin') || path.startsWith('/api')) return;

      const consent = localStorage.getItem('mpg_cookie_consent');
      // If user has not consented, do not track detailed cookies
      if (consent !== 'accepted') return;

      const sid = getSessionId();
      const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
      const { browser, os, device_type } = parseDevice(ua);
      const referrer = typeof document !== 'undefined' ? document.referrer : '';
      const localeMatch = path.match(/^\/(en|km|zh)/);
      const locale = localeMatch ? localeMatch[1] : 'en';

      const payload = {
        session_id: sid,
        event_type: 'page_view',
        path,
        referrer: referrer || 'Direct',
        browser,
        os,
        device_type,
        locale,
        metadata: {
          screen_width: typeof window !== 'undefined' ? window.innerWidth : 0,
          screen_height: typeof window !== 'undefined' ? window.innerHeight : 0,
        },
      };

      // Non-blocking beacon or fetch
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon('/api/analytics/track', blob);
      } else {
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Ignore client telemetry errors
    }
  };

  useEffect(() => {
    if (pathname && pathname !== lastTrackedPath.current) {
      lastTrackedPath.current = pathname;
      trackEvent(pathname);
    }
  }, [pathname]);

  useEffect(() => {
    const handleConsentChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ consent: string }>;
      if (customEvent.detail?.consent === 'accepted' && pathname) {
        trackEvent(pathname);
      }
    };

    window.addEventListener('mpg_consent_changed', handleConsentChange);
    return () => window.removeEventListener('mpg_consent_changed', handleConsentChange);
  }, [pathname]);

  return null;
}
