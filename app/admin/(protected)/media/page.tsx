import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { MediaUploader, MediaCard } from '@/components/admin/media-library-client';
import { createClient } from '@/lib/supabase/server';
import { deleteMedia, uploadMedia } from '../../actions';

export default async function MediaPage() {
  const supabase = await createClient();
  const { data } = await supabase.storage.from('cms-media').list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
  const files = (data ?? []).filter((file) => file.name && !file.name.startsWith('.'));

  return (
    <>
      <AdminPageHeader
        eyebrow="Assets"
        title="Media library"
        description="Upload reusable images for website content. JPG, PNG, and WebP files up to 10 MB are supported."
        action={<MediaUploader action={uploadMedia} />}
      />

      <div className="admin-media-grid">
        {files.length ? (
          files.map((file) => {
            const path = file.name;
            const url = supabase.storage.from('cms-media').getPublicUrl(path).data.publicUrl;
            return (
              <MediaCard
                key={path}
                file={{ name: path, url }}
                deleteAction={deleteMedia.bind(null, path)}
              />
            );
          })
        ) : (
          <div className="admin-empty col-span-full">
            <span aria-hidden="true">🖼️</span>
            <h2>No media uploaded yet</h2>
            <p>Choose an image above to add the first reusable asset for your website.</p>
          </div>
        )}
      </div>
    </>
  );
}
