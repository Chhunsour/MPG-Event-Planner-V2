import type { Json } from '@/lib/types';
import { localized } from '@/lib/content';
import { TranslationButton } from './translation-button';

type Kind = 'service' | 'project' | 'blog';
type Action = (formData: FormData) => Promise<void>;

function value(data: Json | undefined, locale: 'en' | 'km' | 'zh') { return localized(data, locale); }

function LocalizedField({ label, name, initial, html = false }: { label: string; name: string; initial?: Json; html?: boolean }) {
  const Tag = html ? 'textarea' : 'input';
  return <fieldset className="space-y-2">
    <legend className="text-sm font-bold">{label}</legend>
    <div className="grid gap-3 md:grid-cols-3">
      {(['en', 'km', 'zh'] as const).map((locale) => <label key={locale} className="space-y-1 text-xs font-semibold text-muted">
        <span>{locale.toUpperCase()}</span>
        <Tag name={`${name}_${locale}`} defaultValue={value(initial, locale)} rows={html ? 8 : undefined} required={locale === 'en' && name === 'title'} className="w-full border border-line bg-white px-3 py-2 text-sm text-ink-text" />
      </label>)}
    </div>
    {name !== 'seo_title' && <div className="flex gap-3"><TranslationButton source={`${name}_en`} target="km" targetField={`${name}_km`} format={html ? 'html' : 'text'} /><TranslationButton source={`${name}_en`} target="zh" targetField={`${name}_zh`} format={html ? 'html' : 'text'} /></div>}
  </fieldset>;
}

export function ContentForm({ kind, action, item }: { kind: Kind; action: Action; item?: Record<string, unknown> }) {
  const title = item?.title as Json | undefined;
  const description = item?.description as Json | undefined;
  const content = item?.content as Json | undefined;
  const excerpt = item?.excerpt as Json | undefined;
  return <form action={action} encType="multipart/form-data" className="space-y-8">
    <input type="hidden" name="id" value={String(item?.id ?? '')} />
    <div className="grid gap-5 md:grid-cols-2">
      <label className="space-y-1 text-sm font-bold">Slug<input name="slug" defaultValue={String(item?.slug ?? '')} placeholder="generated-from-english-title" className="w-full border border-line px-3 py-2 font-normal" /></label>
      <label className="space-y-1 text-sm font-bold">Tags<input name="tags" defaultValue={Array.isArray(item?.tags) ? item.tags.join(', ') : ''} placeholder="wedding, corporate" className="w-full border border-line px-3 py-2 font-normal" /></label>
    </div>
    <LocalizedField label="Title" name="title" initial={title} />
    {kind === 'blog' && <LocalizedField label="Excerpt" name="excerpt" initial={excerpt} html />}
    <LocalizedField label="Description" name="description" initial={description} html />
    <LocalizedField label="Content" name="content" initial={content} html />
    {kind !== 'service' && <div className="grid gap-5 md:grid-cols-2">
      <label className="space-y-1 text-sm font-bold">Category<input name="category" defaultValue={String(item?.category ?? '')} className="w-full border border-line px-3 py-2 font-normal" /></label>
      {kind === 'project' ? <><label className="space-y-1 text-sm font-bold">Client<input name="client_name" defaultValue={String(item?.client_name ?? '')} className="w-full border border-line px-3 py-2 font-normal" /></label><label className="space-y-1 text-sm font-bold">Location<input name="location" defaultValue={String(item?.location ?? '')} className="w-full border border-line px-3 py-2 font-normal" /></label><label className="space-y-1 text-sm font-bold">Event date<input type="date" name="event_date" defaultValue={String(item?.event_date ?? '')} className="w-full border border-line px-3 py-2 font-normal" /></label></> : <label className="space-y-1 text-sm font-bold">Author<input name="author_name" defaultValue={String(item?.author_name ?? '')} className="w-full border border-line px-3 py-2 font-normal" /></label>}
    </div>}
    {kind === 'service' && <label className="space-y-1 text-sm font-bold">Display order<input type="number" name="display_order" defaultValue={String(item?.display_order ?? 0)} className="w-full border border-line px-3 py-2 font-normal" /></label>}
    {kind === 'project' && <label className="space-y-1 text-sm font-bold">Display order<input type="number" name="display_order" defaultValue={String(item?.display_order ?? 0)} className="w-full border border-line px-3 py-2 font-normal" /></label>}
    <details className="border-t border-line pt-5"><summary className="cursor-pointer text-sm font-bold">Advanced SEO and accessibility</summary><div className="mt-5 space-y-8"><LocalizedField label="SEO title" name="seo_title" initial={item?.seo_title as Json | undefined} /><LocalizedField label="SEO description" name="seo_description" initial={item?.seo_description as Json | undefined} html /><LocalizedField label="Image alt text" name="image_alt" initial={item?.image_alt as Json | undefined} /></div></details>
    <div className="grid gap-5 md:grid-cols-2">
      <div className="space-y-3"><label className="block space-y-1 text-sm font-bold">Cover image<input type="file" name="cover_image" accept="image/jpeg,image/png,image/webp" className="block w-full border border-line px-3 py-2 font-normal" /></label>{kind !== 'blog' && <label className="block space-y-1 text-sm font-bold">Gallery images<input type="file" name="gallery_images" multiple accept="image/jpeg,image/png,image/webp" className="block w-full border border-line px-3 py-2 font-normal" /></label>}</div>
      <div className="flex items-end gap-5 pb-2"><label className="flex gap-2 text-sm font-bold"><input type="checkbox" name="is_published" defaultChecked={Boolean(item?.is_published)} /> Published</label>{kind === 'project' && <label className="flex gap-2 text-sm font-bold"><input type="checkbox" name="is_featured" defaultChecked={Boolean(item?.is_featured)} /> Featured</label>}</div>
    </div>
    <button className="btn btn-primary" type="submit">Save {kind}</button>
  </form>;
}
