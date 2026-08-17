'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, X } from 'lucide-react';
import { messages } from '@/lib/i18n';
import type { Locale } from '@/lib/types';

export function CookieConsent({ locale = 'en' }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);
  const copy = (messages[locale] as unknown as { cookies?: { title: string; message: string; accept: string; essential: string; privacy: string } })?.cookies ?? {
    title: 'Cookie & Analytics Preferences',
    message: 'We use lightweight cookies to analyze website traffic and optimize your event planning experience.',
    accept: 'Accept All',
    essential: 'Essential Only',
    privacy: 'Privacy Policy',
  };

  useEffect(() => {
    // Check if consent has already been chosen
    try {
      const stored = localStorage.getItem('mpg_cookie_consent');
      const hasCookie = document.cookie.split('; ').some((item) => item.startsWith('mpg_cookie_consent='));
      if (!stored && !hasCookie) {
        // Show after a subtle delay so it does not distract the initial hero impression
        const timer = setTimeout(() => {
          setVisible(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleChoice = (choice: 'accepted' | 'declined') => {
    try {
      localStorage.setItem('mpg_cookie_consent', choice);
      const maxAge = choice === 'accepted' ? 31536000 : 86400 * 30; // 1 year vs 30 days
      document.cookie = `mpg_cookie_consent=${choice}; max-age=${maxAge}; path=/; SameSite=Lax`;

      if (choice === 'accepted') {
        window.dispatchEvent(new CustomEvent('mpg_consent_changed', { detail: { consent: 'accepted' } }));
      }
    } catch {
      // Fallback
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-[999] max-w-[380px] animate-in fade-in slide-in-from-bottom-5 duration-500"
    >
      <div className="bg-white/96 backdrop-blur-xl border border-slate-900/10 text-slate-900 shadow-[0_24px_50px_-10px_rgba(6,20,33,0.18),0_4px_16px_rgba(6,20,33,0.06)] rounded-2xl p-5 relative overflow-hidden">
        {/* Subtle decorative green top highlight */}
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#1e9a2a] via-[#58d46b] to-[#1e9a2a]" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#1e9a2a]/10 border border-[#1e9a2a]/20 flex items-center justify-center text-[#1e9a2a] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 id="cookie-title" className="text-xs font-extrabold tracking-wide uppercase text-slate-900">
              {copy.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => handleChoice('declined')}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1 -mr-1 rounded-lg hover:bg-slate-100 cursor-pointer"
            aria-label="Dismiss cookie notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <p id="cookie-desc" className="mt-3 text-xs text-slate-600 leading-relaxed">
          {copy.message}{' '}
          <Link
            href={`/${locale}/privacy`}
            className="text-[#1e9a2a] hover:text-[#147a22] font-semibold underline underline-offset-2 transition-colors ml-0.5"
          >
            {copy.privacy}
          </Link>
        </p>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleChoice('accepted')}
            className="flex-1 bg-[#1e9a2a] hover:bg-[#147a22] text-white font-semibold text-xs py-2.5 px-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-center cursor-pointer"
          >
            {copy.accept}
          </button>
          <button
            type="button"
            onClick={() => handleChoice('declined')}
            className="bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 font-medium text-xs py-2.5 px-3 rounded-xl border border-slate-200/80 transition-all duration-200 cursor-pointer"
          >
            {copy.essential}
          </button>
        </div>
      </div>
    </aside>
  );
}
