import type { SupabaseClient } from '@supabase/supabase-js';
import { SiteImage } from './image';
import { publicImageUrl } from '@/lib/content';
import type { Database } from '@/lib/types';

export function Gallery({ client, bucket, images, alt }: { client: SupabaseClient<Database>; bucket: string; images: string[]; alt: string }) {
  if (!images.length) return null;
  return <div className="mt-10 grid gap-4 sm:grid-cols-2">{images.map((path) => <div key={path} className="frame relative aspect-[4/3]"><SiteImage src={publicImageUrl(client, bucket, path)} alt={alt} /></div>)}</div>;
}
