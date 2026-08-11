import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/lib/types';
import { ui } from '@/lib/i18n';
import { getSiteSettings } from '@/lib/content';
import { LocationMapCard } from '@/components/site/location-map-card';

export async function SiteFooter({ locale }: { locale: Locale }) {
  const labels = ui[locale];
  const settings = await getSiteSettings();
  const links = [[labels.about, 'about'], [labels.services, 'services'], [labels.projects, 'projects'], [labels.blog, 'blog']] as const;
  return (
    <footer className="site-footer">
      <div className="shell site-footer__lead" data-reveal>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-5">
            <LocationMapCard locale={locale} />
          </div>
          <div className="lg:col-span-7 space-y-5">
            <p className="micro-label micro-label--light">Your event starts here</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">{labels.footer}</h2>
            <div className="pt-2">
              <Link href={`/${locale}/contact`} className="cta-island cta-island--light"><span>{labels.getStarted}</span><i aria-hidden="true">↗</i></Link>
            </div>
          </div>
        </div>
      </div>
      <div className="shell site-footer__grid">
        <div className="site-footer__brand">
          <Image src="/images/mpg-logo.png" alt="MPG Event Planner" width={183} height={61} />
          <p>Event planning and production<br />Phnom Penh, Cambodia</p>

          <div className="site-footer__socials">
            {/* Telegram */}
            <a
              href={settings.telegram || 'https://t.me/mpgeventplanner'}
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram"
              title="Telegram"
              className="site-footer__social-btn"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .54-1.43.53-.47-.01-1.37-.27-2.04-.49-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.02-.75 3.99-1.73 6.66-2.87 8.01-3.43 3.81-1.59 4.6-1.87 5.12-1.88.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.16-.04.25z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a
              href={settings.facebook || 'https://facebook.com/mpgeventplanner'}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              title="Facebook"
              className="site-footer__social-btn"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.69c0-2.47 1.47-3.83 3.72-3.83 1.08 0 2.21.19 2.21.19v2.43h-1.25c-1.22 0-1.6.76-1.6 1.54V12h2.73l-.44 3h-2.29v6.8c4.56-.93 8-4.96 8-9.8z"/>
              </svg>
            </a>

            {/* Gmail */}
            <a
              href={`mailto:${settings.company_email || 'hello@mpgeventplanner.com'}`}
              aria-label="Gmail"
              title="Gmail / Email"
              className="site-footer__social-btn"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a
              href={settings.instagram || 'https://instagram.com/mpgeventplanner'}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              title="Instagram"
              className="site-footer__social-btn"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* TikTok */}
            <a
              href={settings.tiktok || 'https://tiktok.com/@mpgeventplanner'}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              title="TikTok"
              className="site-footer__social-btn"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.98-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.57-1.33 1.54-1.34 2.53a3.52 3.52 0 001.32 2.75c.9.72 2.15.93 3.24.63 1.11-.29 2.05-1.1 2.45-2.15.22-.55.28-1.15.28-1.74.02-4.96.01-9.92.01-14.88z"/>
              </svg>
            </a>
          </div>
        </div>
        <nav aria-label="Footer navigation">{links.map(([label, href]) => <Link key={href} href={`/${locale}/${href}`}>{label}</Link>)}</nav>
        <div className="site-footer__contact">
          <a href={`mailto:${settings.company_email}`}>{settings.company_email}</a>
          {settings.phone && <a href={`tel:${settings.phone.replace(/[^+\d]/g, '')}`}>{settings.phone}</a>}
          {settings.telegram && <a href={settings.telegram} target="_blank" rel="noreferrer">Telegram</a>}
          {settings.instagram && <a href={settings.instagram} target="_blank" rel="noreferrer">Instagram</a>}
          {settings.facebook && <a href={settings.facebook} target="_blank" rel="noreferrer">Facebook</a>}
          <Link href={`/${locale}/privacy`}>Privacy</Link>
          <Link href="/admin/login">Admin</Link>
        </div>
      </div>
      <div className="shell site-footer__legal"><span>© {new Date().getFullYear()} MPG Event Planner</span><span>Planned here. Remembered everywhere.</span></div>
    </footer>
  );
}
