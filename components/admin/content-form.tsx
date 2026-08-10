import Link from 'next/link';
import type { Json } from '@/lib/types';
import { localized } from '@/lib/content';
import { TranslationButton, AutoTranslateAllButton } from './translation-button';
import { AdminSubmitButton } from './admin-submit-button';

type Kind = 'service' | 'project' | 'blog';
type Action = (formData: FormData) => Promise<void>;

function value(data: Json | undefined, locale: 'en' | 'km' | 'zh') { return localized(data, locale); }

function LocalizedField({ label, name, initial, html = false, rows = 5 }: { label: string; name: string; initial?: Json; html?: boolean; rows?: number }) {
  const Tag = html ? 'textarea' : 'input';
  return <fieldset className="admin-localized-field">
    <legend>{label}</legend>
    <div>
      {(['en', 'km', 'zh'] as const).map((locale) => <label key={locale}>
        <span>{locale.toUpperCase()}</span>
        <Tag name={`${name}_${locale}`} defaultValue={value(initial, locale)} rows={html ? rows : undefined} required={locale === 'en' && name === 'title'} />
      </label>)}
    </div>
    {name !== 'seo_title' && <div className="admin-translation-actions"><TranslationButton source={`${name}_en`} target="km" targetField={`${name}_km`} format={html ? 'html' : 'text'} /><TranslationButton source={`${name}_en`} target="zh" targetField={`${name}_zh`} format={html ? 'html' : 'text'} /></div>}
  </fieldset>;
}

export function ContentForm({ kind, action, item }: { kind: Kind; action: Action; item?: Record<string, unknown> }) {
  const title = item?.title as Json | undefined;
  const description = item?.description as Json | undefined;
  const content = item?.content as Json | undefined;
  const excerpt = item?.excerpt as Json | undefined;
  const returnPath = `/admin/${kind === 'blog' ? 'blog' : kind + 's'}`;
  return <form action={action} encType="multipart/form-data" className="admin-form">
    <input type="hidden" name="id" value={String(item?.id ?? '')} />
    <div className="admin-form__header-bar">
      <p className="admin-form__intro">Write the English content first, then click <strong>Auto Translate All</strong> to translate everything to Khmer and Chinese at once.</p>
      <AutoTranslateAllButton />
    </div>

    <div className="admin-form__two-column">
      <label>Slug <small>Optional — generated from the English title</small><input name="slug" defaultValue={String(item?.slug ?? '')} placeholder="generated-from-english-title" /></label>
      <label>Tags <small>Separate tags with commas</small><input name="tags" defaultValue={Array.isArray(item?.tags) ? item.tags.join(', ') : ''} placeholder="corporate, grand opening" /></label>
    </div>
    <LocalizedField label="Title" name="title" initial={title} />
    {kind === 'blog' && <LocalizedField label="Excerpt" name="excerpt" initial={excerpt} html rows={4} />}
    {kind !== 'blog' && <LocalizedField label="Description" name="description" initial={description} html rows={4} />}
    <LocalizedField label="Main content" name="content" initial={content} html rows={10} />
    {kind !== 'service' && <div className="admin-form__two-column">
      <label>Category<input name="category" defaultValue={String(item?.category ?? '')} /></label>
      {kind === 'project' ? <><label>Client<input name="client_name" defaultValue={String(item?.client_name ?? '')} /></label><label>Location<input name="location" defaultValue={String(item?.location ?? '')} /></label><label>Event date<input type="date" name="event_date" defaultValue={String(item?.event_date ?? '')} /></label></> : <label>Author<input name="author_name" defaultValue={String(item?.author_name ?? '')} /></label>}
    </div>}
    {kind !== 'blog' && <label className="admin-form__order">Display order <small>Lower numbers appear first</small><input type="number" name="display_order" min="0" defaultValue={String(item?.display_order ?? 0)} /></label>}
    <details className="admin-form__advanced"><summary>SEO and accessibility</summary><div><LocalizedField label="SEO title" name="seo_title" initial={item?.seo_title as Json | undefined} /><LocalizedField label="SEO description" name="seo_description" initial={item?.seo_description as Json | undefined} html rows={4} /><LocalizedField label="Image alt text" name="image_alt" initial={item?.image_alt as Json | undefined} /></div></details>
    <div className="admin-form__media">
      <div><label>Cover image <small>{item?.cover_image ? 'Choose a file only to replace the current image' : 'JPG, PNG or WebP up to 10 MB'}</small><input type="file" name="cover_image" accept="image/jpeg,image/png,image/webp" /></label>{kind !== 'blog' && <label>Gallery images <small>New files are added to the existing gallery</small><input type="file" name="gallery_images" multiple accept="image/jpeg,image/png,image/webp" /></label>}</div>
      <div className="admin-form__checks"><label><input type="checkbox" name="is_published" defaultChecked={Boolean(item?.is_published)} /> Publish on the website</label>{kind === 'project' && <label><input type="checkbox" name="is_featured" defaultChecked={Boolean(item?.is_featured)} /> Feature on the homepage</label>}</div>
    </div>
    <div className="admin-form__footer"><AdminSubmitButton>Save {kind === 'blog' ? 'post' : kind}</AdminSubmitButton><Link href={returnPath} className="btn btn-outline">Cancel</Link></div>
  </form>;
}
