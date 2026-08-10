import Image from 'next/image';
import Link from 'next/link';
import { localized, publicImageUrl } from '@/lib/content';
import { createClient } from '@/lib/supabase/server';
import type { Json } from '@/lib/types';
import { removeContent } from '@/app/admin/actions';
import { DeleteButton } from './delete-button';

type Kind = 'service' | 'project' | 'blog';
type ContentItem = {
  id: number;
  slug: string;
  title: Json;
  cover_image: string | null;
  is_published: boolean;
  updated_at: string;
};

const config = {
  service: { route: 'services', table: 'services', bucket: 'services', singular: 'service' },
  project: { route: 'projects', table: 'projects', bucket: 'projects', singular: 'project' },
  blog: { route: 'blog', table: 'blog_posts', bucket: 'blog', singular: 'post' },
} as const;

export async function AdminContentList({ kind, items }: { kind: Kind; items: ContentItem[] }) {
  const supabase = await createClient();
  const settings = config[kind];

  if (!items.length) {
    return (
      <div className="admin-empty">
        <span aria-hidden="true">＋</span>
        <h2>No {settings.singular}s yet</h2>
        <p>Create the first {settings.singular} to start building this section of the website.</p>
        <Link href={`/admin/${settings.route}/new`} className="btn btn-primary">Create {settings.singular}</Link>
      </div>
    );
  }

  return (
    <div className="admin-content-list">
      {items.map((item) => {
        const title = localized(item.title, 'en', 'Untitled');
        const image = publicImageUrl(supabase, settings.bucket, item.cover_image);
        return (
          <article key={item.id} className="admin-content-row">
            <div className="admin-content-row__image">
              {image ? <Image src={image} alt="" fill sizes="80px" /> : <span>No image</span>}
            </div>
            <div className="admin-content-row__main">
              <div><span className={item.is_published ? 'is-live' : 'is-draft'}>{item.is_published ? 'Published' : 'Draft'}</span><small>Updated {new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(item.updated_at))}</small></div>
              <h2>{title}</h2>
              <p>/{item.slug}</p>
            </div>
            <div className="admin-content-row__actions">
              <Link href={`/admin/${settings.route}/${item.id}/edit`} className="admin-edit-link">Edit</Link>
              <DeleteButton action={removeContent.bind(null, settings.table, String(item.id))} itemName={title} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
