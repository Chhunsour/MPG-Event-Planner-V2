import { PageIntro } from '@/components/site/page-intro';
import { messages, ui } from '@/lib/i18n';
import type { Locale } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  const labels = ui[locale];
  const copy = messages[locale].about;

  return <><PageIntro eyebrow={copy.label || labels.about} title={copy.headline1 + ' ' + copy.headline2} description={copy.storyTitle} /><section className="band-lg"><div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]"><div className="frame relative aspect-[4/5]"><Image src="/images/mpg/about-team.png" alt={copy.imageAlt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" /></div><div><p className="t-display-sm max-w-xl">{copy.standardsTitle}</p><div className="mt-12 grid gap-5 border-t border-[var(--line)] pt-5 text-sm leading-7 text-[var(--text-muted)] sm:grid-cols-2">{copy.standards.map((standard) => <p key={standard.title}><strong className="block text-[var(--text)]">{standard.title}</strong>{standard.desc}</p>)}</div></div></div></section></>;
}
import Image from 'next/image';
