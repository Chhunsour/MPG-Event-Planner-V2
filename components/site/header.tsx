'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { localeLabels, type Locale } from '@/lib/types';
import { ui } from '@/lib/i18n';

export function SiteHeader({ locale }: { locale: Locale }) {
  const labels = ui[locale];
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);
  const localeMeta: Record<Locale, { flag: string; code: string }> = {
    en: { flag: '/images/flags/uk.svg', code: 'EN' },
    km: { flag: '/images/flags/cambodia.svg', code: 'KM' },
    zh: { flag: '/images/flags/china.svg', code: 'ZH' },
  };
  const links = [
    [labels.about, 'about'],
    [labels.services, 'services'],
    [labels.projects, 'projects'],
    [labels.blog, 'blog'],
  ] as const;

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!languageOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!languageRef.current?.contains(event.target as Node)) setLanguageOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLanguageOpen(false);
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [languageOpen]);

  const localizedPath = (code: Locale) => pathname.replace(/^\/(en|km|zh)(?=\/|$)/, `/${code}`);

  return (
    <header className="site-header">
      <div className="site-header__bar shell">
        <Link href={`/${locale}`} className="brand-mark" aria-label="MPG Event Planner home">
          <Image src="/images/mpg-logo.png" alt="MPG Event Planner" width={183} height={61} preload />
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          {links.map(([label, href]) => {
            const active = pathname.startsWith(`/${locale}/${href}`);
            return <Link key={href} href={`/${locale}/${href}`} className="site-nav__link" aria-current={active ? 'page' : undefined}>{label}</Link>;
          })}
        </nav>

        <div className="site-header__actions">
          <div className="locale-switch" data-open={languageOpen} ref={languageRef}>
            <button
              type="button"
              className="locale-switch__trigger"
              onClick={() => setLanguageOpen((value) => !value)}
              aria-expanded={languageOpen}
              aria-controls="language-menu"
              aria-label={`${labels.language}: ${localeLabels[locale]}`}
            >
              <Image src={localeMeta[locale].flag} alt="" width={24} height={16} />
              <span>{localeMeta[locale].code}</span>
              <i aria-hidden="true" />
            </button>
            <div id="language-menu" className="locale-switch__menu" aria-label={labels.language}>
              {(['en', 'km', 'zh'] as Locale[]).map((code) => (
                <Link
                  key={code}
                  href={localizedPath(code)}
                  aria-current={code === locale ? 'true' : undefined}
                  onClick={() => setLanguageOpen(false)}
                >
                  <Image src={localeMeta[code].flag} alt="" width={24} height={16} />
                  <span><strong>{localeLabels[code]}</strong><small>{localeMeta[code].code}</small></span>
                  {code === locale && <i aria-hidden="true">✓</i>}
                </Link>
              ))}
            </div>
          </div>
          <Link href={`/${locale}/contact`} className="site-header__cta">{labels.enquire}<span aria-hidden="true">↗</span></Link>
          <button className="menu-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'}>
            <span /><span />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="mobile-menu" data-open={open} aria-hidden={!open}>
        <div className="mobile-menu__inner shell">
          <p className="micro-label">MPG / Phnom Penh</p>
          <nav aria-label="Mobile navigation">
            {links.map(([label, href], index) => <Link key={href} href={`/${locale}/${href}`} onClick={() => setOpen(false)} style={{ '--menu-delay': `${100 + index * 55}ms` } as CSSProperties}><span>0{index + 1}</span>{label}<i>↗</i></Link>)}
          </nav>
          <Link href={`/${locale}/contact`} className="cta-island" onClick={() => setOpen(false)}><span>{labels.enquire}</span><i aria-hidden="true">↗</i></Link>
        </div>
      </div>
    </header>
  );
}
