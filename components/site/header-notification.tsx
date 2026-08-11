'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/types';
import type { Announcement } from '@/lib/content';

export function HeaderNotification({ locale, announcement }: { locale: Locale; announcement?: Announcement | null }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || announcement?.is_active === false) return null;

  const defaultMessages: Record<Locale, { text: string; action: string }> = {
    en: {
      text: 'Booking open for 2026 Corporate Ceremonies & Grand Openings across Cambodia!',
      action: 'Get Quote',
    },
    km: {
      text: 'បើកទទួលការកក់សម្រាប់ការរៀបចំកម្មវិធី និងពិធីបើកសម្ពោធឆ្នាំ ២០២៦!',
      action: 'ស្នើសុំតម្លៃ',
    },
    zh: {
      text: '2026年柬埔寨企业典礼与开业仪式策划现已全面开放预订！',
      action: '获取报价',
    },
  };

  const actionText: Record<Locale, string> = {
    en: 'Get Quote',
    km: 'ស្នើសុំតម្លៃ',
    zh: '获取报价',
  };

  const rawText = announcement?.title?.[locale] || announcement?.title?.en || defaultMessages[locale]?.text || defaultMessages.en.text;
  const activeText = rawText.replace(/^📢\s*/, '');
  const rawLink = announcement?.link || '/contact';
  const targetLink = rawLink.startsWith('/')
    ? `/${locale}${rawLink.replace(/^\/(en|km|zh)/, '')}`
    : rawLink;

  return (
    <aside className="header-notification" aria-label="Important Announcement">
      <div className="shell header-notification__inner">
        <div className="header-notification__content">
          <svg className="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <span className="header-notification__text">{activeText}</span>
          <Link href={targetLink} className="header-notification__link">
            <span>{actionText[locale] || 'Get Quote'}</span>
            <i aria-hidden="true">↗</i>
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="header-notification__close"
          aria-label="Dismiss notification"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
