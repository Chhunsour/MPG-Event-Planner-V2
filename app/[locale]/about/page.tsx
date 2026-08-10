import Image from 'next/image';
import Link from 'next/link';
import { PageIntro } from '@/components/site/page-intro';
import { messages, ui } from '@/lib/i18n';
import type { Locale } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (raw === 'km' || raw === 'zh' ? raw : 'en') as Locale;
  const labels = ui[locale];
  const copy = messages[locale].about;
  const facts = locale === 'km' ? [['មូលដ្ឋាន', 'ភ្នំពេញ'], ['តំបន់សេវាកម្ម', 'ទូទាំងកម្ពុជា'], ['ឯកទេស', 'សាជីវកម្ម និងពិធីការ']] : locale === 'zh' ? [['总部', '金边'], ['服务范围', '柬埔寨全国'], ['专长', '企业活动与典礼']] : [['Base', 'Phnom Penh'], ['Reach', 'Across Cambodia'], ['Focus', 'Corporate & ceremonial']];
  const figureCaption = locale === 'km' ? 'នៅពីក្រោយកម្មវិធី / ក្រុមផលិតកម្ម MPG' : locale === 'zh' ? '幕后现场 / MPG 制作团队' : 'Behind the show / MPG production crew';
  const closing = locale === 'km' ? 'ក្រុមការងារតែមួយ គ្រប់គ្រងគ្រប់ជំហាន។' : locale === 'zh' ? '一个团队，掌控每一个环节。' : 'One team owns every cue.';

  return <>
    <PageIntro eyebrow={copy.label || labels.about} title={`${copy.headline1} ${copy.headline2}`} description={copy.storyTitle} />
    <section className="about-story">
      <div className="shell about-story__grid">
        <figure className="about-story__image" data-reveal><Image src="/images/mpg/about-team.png" alt={copy.imageAlt} fill preload className="object-cover" sizes="(max-width: 1024px) 100vw, 52vw" /><figcaption>{figureCaption}</figcaption></figure>
        <div className="about-story__copy" data-reveal>
          <p className="micro-label">{copy.storyLabel}</p>
          <h2>{copy.storyTitle}</h2>
          <p>{messages[locale].intro.description} {messages[locale].intro.para2}</p>
          <dl>{facts.map(([term, value]) => <div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}</dl>
        </div>
      </div>
    </section>
    <section className="standards-section">
      <div className="shell">
        <div className="standards-section__head" data-reveal><p className="micro-label">{copy.standardsLabel}</p><h2>{copy.standardsTitle}</h2></div>
        <ol>{copy.standards.map((standard, index) => <li key={standard.title} data-reveal><span>{String(index + 1).padStart(2, '0')}</span><h3>{standard.title}</h3><p>{standard.desc}</p></li>)}</ol>
      </div>
    </section>
    <section className="about-cta"><div className="shell" data-reveal><p>{copy.capabilitiesLabel}</p><h2>{closing}</h2><Link href={`/${locale}/contact`} className="cta-island cta-island--light"><span>{labels.enquire}</span><i>↗</i></Link></div></section>
  </>;
}
