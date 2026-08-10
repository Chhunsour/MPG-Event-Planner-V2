import type { SupabaseClient } from '@supabase/supabase-js';
import { SiteImage } from './image';
import { publicImageUrl } from '@/lib/content';
import type { Database } from '@/lib/types';

export function Gallery({ client, bucket, images, alt }: { client: SupabaseClient<Database>; bucket: string; images: string[]; alt: string }) {
  if (!images.length) return null;
  return <div className="editorial-gallery">{images.map((path, index) => <figure key={path} className="editorial-gallery__item" data-reveal><SiteImage src={publicImageUrl(client, bucket, path)} alt={`${alt} — ${index + 1}`} /><figcaption>{String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</figcaption></figure>)}</div>;
}
