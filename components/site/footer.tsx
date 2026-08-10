import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/lib/types';
import { ui } from '@/lib/i18n';
import { getSiteSettings } from '@/lib/content';

export async function SiteFooter({ locale }: { locale: Locale }) {
  const labels = ui[locale];
  const settings = await getSiteSettings();
  const links = [[labels.about, 'about'], [labels.services, 'services'], [labels.projects, 'projects'], [labels.blog, 'blog']] as const;
  return (
    <footer className="site-footer">
      <div className="shell site-footer__lead" data-reveal>
        <p className="micro-label micro-label--light">Your event starts here</p>
        <div className="site-footer__statement">
          <h2>{labels.footer}</h2>
          <Link href={`/${locale}/contact`} className="cta-island cta-island--light"><span>{labels.getStarted}</span><i aria-hidden="true">↗</i></Link>
        </div>
      </div>
      <div className="shell site-footer__grid">
        <div className="site-footer__brand">
          <Image src="/images/mpg-logo.png" alt="MPG Event Planner" width={183} height={61} />
          <p>Event planning and production<br />Phnom Penh, Cambodia</p>
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
