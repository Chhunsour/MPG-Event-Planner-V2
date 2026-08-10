import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { deleteMedia, uploadMedia } from '../../actions';

export default async function MediaPage() {
  const supabase = await createClient();
  const { data } = await supabase.storage.from('cms-media').list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
  return <><div className="flex items-end justify-between gap-4"><h1 className="t-heading text-4xl">Media library</h1><form action={uploadMedia} encType="multipart/form-data" className="flex items-center gap-3"><input type="file" name="file" accept="image/jpeg,image/png,image/webp" required className="max-w-[220px] text-sm" /><button type="submit" className="btn btn-primary">Upload</button></form></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{(data ?? []).filter((file) => file.name).map((file) => { const path = file.name; const src = supabase.storage.from('cms-media').getPublicUrl(path).data.publicUrl; return <article key={path} className="border border-line bg-white p-3"><div className="relative aspect-square bg-paper-tint"><Image src={src} alt={path} fill className="object-contain" sizes="(max-width: 768px) 50vw, 25vw" /></div><div className="flex items-center justify-between gap-3 pt-3"><span className="truncate text-xs text-muted">{path}</span><form action={deleteMedia.bind(null, path)}><button type="submit" className="text-xs font-bold text-red-700">Delete</button></form></div></article>; })}</div></>;
}
