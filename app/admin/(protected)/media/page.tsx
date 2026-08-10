import Image from 'next/image';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminSubmitButton } from '@/components/admin/admin-submit-button';
import { DeleteButton } from '@/components/admin/delete-button';
import { createClient } from '@/lib/supabase/server';
import { deleteMedia, uploadMedia } from '../../actions';

export default async function MediaPage() {
  const supabase = await createClient();
  const { data } = await supabase.storage.from('cms-media').list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
  const files = (data ?? []).filter((file) => file.name);
  const uploader = <form action={uploadMedia} encType="multipart/form-data" className="admin-upload"><label><span>Choose image</span><input type="file" name="file" accept="image/jpeg,image/png,image/webp" required /></label><AdminSubmitButton pendingLabel="Uploading…">Upload</AdminSubmitButton></form>;
  return <><AdminPageHeader eyebrow="Assets" title="Media library" description="Upload reusable images for website content. JPG, PNG, and WebP files up to 10 MB are supported." action={uploader} /><div className="admin-media-grid">{files.length ? files.map((file) => { const path = file.name; const src = supabase.storage.from('cms-media').getPublicUrl(path).data.publicUrl; return <article key={path}><div><Image src={src} alt={path} fill sizes="(max-width: 768px) 50vw, 25vw" /></div><footer><span title={path}>{path}</span><DeleteButton action={deleteMedia.bind(null, path)} itemName={path} /></footer></article>; }) : <div className="admin-empty"><span aria-hidden="true">▧</span><h2>No media uploaded</h2><p>Choose an image above to add the first reusable asset.</p></div>}</div></>;
}
