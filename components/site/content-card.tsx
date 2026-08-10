import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { localized, publicImageUrl } from '@/lib/content';
import { createClient } from '@/lib/supabase/server';
import type { BlogPost, Locale, Project, Service } from '@/lib/types';
import { SiteImage } from '@/components/site/image';

type ContentCardProps = {
  item: Service | Project | BlogPost;
  locale: Locale;
  type: 'service' | 'project' | 'blog';
};

export async function ContentCard({ item, locale, type }: ContentCardProps) {
  const supabase = await createClient();
  const bucket = type === 'service' ? 'services' : type === 'project' ? 'projects' : 'blog';
  const href = type === 'service' ? 'services' : type === 'project' ? 'projects' : 'blog';
  const image = publicImageUrl(supabase, bucket, item.cover_image);
  const title = localized(item.title, locale);
  const description = localized(type === 'blog' ? (item as BlogPost).excerpt : (item as Service | Project).description, locale);
  const category = type === 'blog' ? (item as BlogPost).category : type === 'project' ? (item as Project).category : null;

  return (
    <Link href={`/${locale}/${href}/${item.slug}`} className="group block">
      <div className="frame relative aspect-[4/3]"><SiteImage src={image} alt={localized(item.image_alt, locale, title)} /></div>
      <div className="mt-4 flex items-start justify-between gap-5 border-t border-[var(--line)] pt-4">
        <div><p className="t-meta text-[var(--mpg-green-deep)]">{type === 'blog' ? category ?? 'MPG Journal' : type === 'project' ? category ?? 'Project' : 'Capability'}</p><h2 className="t-heading mt-2">{title}</h2><p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{description}</p></div>
        <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-[var(--mpg-blue)] transition group-hover:-translate-y-1 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
