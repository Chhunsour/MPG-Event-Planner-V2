import { Link, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import TextField from "@/components/admin/forms/TextField";
import TextareaField from "@/components/admin/forms/TextareaField";
import RichEditor from "@/components/admin/forms/RichEditor";
import LangTabs from "@/components/admin/forms/LangTabs";
import ImageUploader from "@/components/admin/forms/ImageUploader";
import PublishingPanel from "@/components/admin/forms/PublishingPanel";
import TranslationToolbar from "@/components/admin/forms/TranslationToolbar";

interface BlogPost {
  id: number | null;
  exists: boolean;
  title_en: string;
  title_km: string | null;
  title_zh: string | null;
  excerpt_en: string;
  excerpt_km: string | null;
  excerpt_zh: string | null;
  body_en: string;
  body_km: string | null;
  body_zh: string | null;
  category: string | null;
  slug: string;
  cover_image: string | null;
  cover_image_alt: string | null;
  is_published: boolean;
  published_at: string | null;
  display_order: number;
  author_name: string | null;
  seo_title: string | null;
  seo_description: string | null;
  updated_at: string | null;
}

interface BlogFormProps {
  post: BlogPost;
}

export default function BlogForm({ post }: BlogFormProps) {
  const isEdit = post.exists;

  const { data, setData, processing } = useForm({
    title_en: post.title_en ?? "",
    title_km: post.title_km ?? "",
    title_zh: post.title_zh ?? "",
    excerpt_en: post.excerpt_en ?? "",
    excerpt_km: post.excerpt_km ?? "",
    excerpt_zh: post.excerpt_zh ?? "",
    body_en: post.body_en ?? "",
    body_km: post.body_km ?? "",
    body_zh: post.body_zh ?? "",
    category: post.category ?? "",
    slug: post.slug ?? "",
    cover_image: null as File | null,
    remove_cover_image: false,
    cover_image_alt: post.cover_image_alt ?? "",
    is_published: post.is_published ?? false,
    display_order: post.display_order ?? 1,
    author_name: post.author_name ?? "",
    seo_title: post.seo_title ?? "",
    seo_description: post.seo_description ?? "",
  });

  const handleTranslated = (results: Record<string, Record<string, string>>) => {
    const updates: Partial<typeof data> = {};
    Object.entries(results).forEach(([field, langMap]) => {
      const cleanField = field.replace(/_en$/, "");
      const kmVal = langMap.km;
      const zhVal = langMap.zh || langMap["zh-CN"];
      if (kmVal) {
        (updates as Record<string, string>)[`${cleanField}_km`] = kmVal;
      }
      if (zhVal) {
        (updates as Record<string, string>)[`${cleanField}_zh`] = zhVal;
      }
    });
    setData((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { cover_image, remove_cover_image, ...rest } = data;
    const payload = { ...rest } as Record<string, string | number | boolean | File | null>;
    if (cover_image) payload.cover_image = cover_image;
    if (remove_cover_image) payload.remove_cover_image = true;
    if (isEdit) {
      router.put(`/admin/blog/${post.id}`, payload, {
        preserveScroll: true,
        forceFormData: true,
        onSuccess: () => {
          setData("cover_image", null);
          setData("remove_cover_image", false);
        },
      });
    } else {
      router.post("/admin/blog", payload, { forceFormData: true });
    }
  };

  const translationFields = {
    title: data.title_en,
    excerpt: data.excerpt_en,
    body: data.body_en,
  };

  return (
    <AdminLayout title={isEdit ? "Edit post" : "Create post"}>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
        {/* Back link + header */}
        <div>
          <Link href="/admin/blog" className="text-xs font-semibold text-muted hover:text-brand">← Blog</Link>
          <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-faint">Post editor</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink-text">{isEdit ? "Edit post" : "Create a post"}</h2>
          <p className="mt-1 text-sm text-muted">Write a clear title, a useful excerpt, and the full body.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Title */}
            <div className="border border-line bg-paper p-5">
              <TextField label="Post title" name="title_en" value={data.title_en} required
                placeholder="e.g. How to plan a corporate gala"
                onChange={(v) => setData("title_en", v)} />
            </div>

            {/* Translation toolbar */}
            <TranslationToolbar
              entity="blog"
              entityId={post.id ?? undefined}
              fields={translationFields}
              onTranslated={handleTranslated}
            />

            {/* Content with lang tabs */}
            <div className="border border-line bg-paper p-5">
              <div className="mb-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-faint">Post content</p>
                <h3 className="text-base font-bold text-ink-text">Write the post</h3>
              </div>

              <LangTabs group="blog">
                {({ code, label }) => (
                  <div className="space-y-4 py-4">
                    {code !== "en" && (
                      <>
                        {!(data[`title_${code}` as keyof typeof data] as string) && (
                          <div className="rounded border border-sky-200 bg-brand-tint px-3 py-2 text-xs text-sky-800">
                            <strong>{label} translation is empty.</strong> Click <strong>"Translate all"</strong> in the toolbar above to generate translations from English automatically.
                          </div>
                        )}
                        <TextField
                          label={`${label} title`}
                          name={`title_${code}`}
                          value={data[`title_${code}` as keyof typeof data] as string}
                          onChange={(v) => setData(`title_${code}` as keyof typeof data, v)}
                        />
                      </>
                    )}
                    <TextareaField
                      label={`${label} excerpt`}
                      name={`excerpt_${code}`}
                      value={data[`excerpt_${code}` as keyof typeof data] as string}
                      rows={2}
                      maxLength={300}
                      onChange={(v) => setData(`excerpt_${code}` as keyof typeof data, v)}
                    />
                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-muted">
                        {label} body
                      </label>
                      <RichEditor
                        name={`body_${code}`}
                        value={data[`body_${code}` as keyof typeof data] as string}
                        onChange={(v) => setData(`body_${code}` as keyof typeof data, v)}
                        placeholder="Write the full post content here."
                      />
                    </div>
                  </div>
                )}
              </LangTabs>
            </div>

            {/* Advanced settings */}
            <details className="group border border-line bg-paper">
              <summary className="flex cursor-pointer select-none items-center justify-between p-5 text-left outline-none [&::-webkit-details-marker]:hidden">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-faint">Advanced</p>
                  <h3 className="text-base font-bold text-ink-text">SEO & metadata</h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-brand">
                  <span className="group-open:hidden">Show settings</span>
                  <span className="hidden group-open:inline">Hide settings</span>
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" />
                </div>
              </summary>
              <div className="space-y-4 border-t border-line p-5">
                <TextField label="Slug" name="slug" value={data.slug} onChange={(v) => setData("slug", v)} />
                <TextField label="Category" name="category" value={data.category} onChange={(v) => setData("category", v)} />
                <TextField label="SEO title" name="seo_title" value={data.seo_title} maxLength={60} onChange={(v) => setData("seo_title", v)} />
                <TextareaField label="SEO description" name="seo_description" value={data.seo_description} rows={2} maxLength={160} onChange={(v) => setData("seo_description", v)} />
                <TextField label="Author" name="author_name" value={data.author_name} onChange={(v) => setData("author_name", v)} />
              </div>
            </details>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <PublishingPanel
                isPublished={data.is_published}
                publishedAt={post.published_at}
                updatedAt={post.updated_at}
              >
                <div className="flex items-center gap-2">
                  <input id="is_published" type="checkbox" checked={data.is_published}
                    onChange={(e) => setData("is_published", e.target.checked)}
                    className="h-4 w-4 rounded border-line-strong text-brand" />
                  <label htmlFor="is_published" className="text-sm text-muted">Published</label>
                </div>
                <button type="submit" disabled={processing}
                  className="bg-brand px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-deep disabled:opacity-50">
                  {isEdit ? "Save post" : "Create post"}
                </button>
                {isEdit && (
                  <form method="POST" action={`/admin/blog/${post.id}`} onSubmit={(e) => { if (!confirm("Archive this post?")) e.preventDefault(); }}>
                    <input type="hidden" name="_method" value="DELETE" />
                    <button type="submit" className="text-xs font-semibold text-red-500 hover:text-red-600">
                      Archive post
                    </button>
                  </form>
                )}
              </PublishingPanel>

              {/* Cover image (Sidebar) */}
              <div className="border border-line bg-paper p-5">
                <div className="mb-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-faint">Cover</p>
                  <h3 className="text-base font-bold text-ink-text">Cover image</h3>
                </div>
                <ImageUploader
                  name="cover_image"
                  removeName="remove_cover_image"
                  initialPath={post.cover_image ? `/storage/${post.cover_image}` : null}
                  onFileChange={(file) => {
                    setData("cover_image", file);
                    if (!file) setData("remove_cover_image", true);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
