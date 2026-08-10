import { PageIntro } from '@/components/site/page-intro';
import { messages, ui } from '@/lib/i18n';
import type { Locale } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  const copy = messages[locale].privacy;
  return <><PageIntro eyebrow={ui[locale].contact} title={copy.title} description={copy.content} /><section className="band-lg"><div className="shell content-rich"><p>{copy.content}</p><h2>{locale === 'en' ? 'Questions' : locale === 'km' ? 'សំណួរ' : '问题'}</h2><p>hello@mpgeventplanner.com</p></div></section></>;
}
