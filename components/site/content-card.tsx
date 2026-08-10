import Link from 'next/link';
import { localized, publicImageUrl } from '@/lib/content';
import { createClient } from '@/lib/supabase/server';
import type { BlogPost, Locale, Project, Service } from '@/lib/types';
import { SiteImage } from '@/components/site/image';
import { ui } from '@/lib/i18n';

type ContentCardProps = {
  item: Service | Project | BlogPost;
  locale: Locale;
  type: 'service' | 'project' | 'blog';
  index?: number;
};

export async function ContentCard({ item, locale, type, index = 0 }: ContentCardProps) {
  const supabase = await createClient();
  const bucket = type === 'service' ? 'services' : type === 'project' ? 'projects' : 'blog';
  const href = type === 'service' ? 'services' : type === 'project' ? 'projects' : 'blog';
  const image = publicImageUrl(supabase, bucket, item.cover_image);
  const title = localized(item.title, locale);
  const description = localized(type === 'blog' ? (item as BlogPost).excerpt : (item as Service | Project).description, locale);
  const category = type === 'blog' ? (item as BlogPost).category : type === 'project' ? (item as Project).category : null;
  const labels = ui[locale];

  return (
    <Link href={`/${locale}/${href}/${item.slug}`} className={`editorial-card editorial-card--${type}`} data-reveal data-spotlight>
      <div className="editorial-card__image"><SiteImage src={image} alt={localized(item.image_alt, locale, title)} priority={index === 0} /></div>
      <div className="editorial-card__body">
        <div className="editorial-card__meta"><p>{type === 'blog' ? category ?? 'MPG Blog' : type === 'project' ? category ?? labels.projects : labels.services}</p></div>
        <h2>{title}</h2>
        <p className="editorial-card__description">{description}</p>
        <span className="editorial-card__arrow">{labels.readMore}<i aria-hidden="true">↗</i></span>
      </div>
    </Link>
  );
}
