import { Link, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import { ExternalLink, ChevronDown } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import TextField from "@/components/admin/forms/TextField";
import TextareaField from "@/components/admin/forms/TextareaField";
import RichEditor from "@/components/admin/forms/RichEditor";
import LangTabs from "@/components/admin/forms/LangTabs";
import ImageUploader from "@/components/admin/forms/ImageUploader";
import PublishingPanel from "@/components/admin/forms/PublishingPanel";
import TranslationToolbar from "@/components/admin/forms/TranslationToolbar";
import FeatureEditor from "@/components/admin/forms/FeatureEditor";
import { useToast } from "@/components/ui/Toast";

interface Capability {
  label_en: string;
  label_km: string | null;
  label_zh: string | null;
}

interface Service {
  id: number | null;
  exists: boolean;
  title_en: string;
  title_km: string | null;
  title_zh: string | null;
  short_description_en: string;
  short_description_km: string | null;
  short_description_zh: string | null;
  description_en: string;
  description_km: string | null;
  description_zh: string | null;
  category: string | null;
  slug: string;
  image: string | null;
  image_alt: string | null;
  is_published: boolean;
  published_at: string | null;
  is_featured: boolean;
  display_order: number;
  author_name: string | null;
  seo_title: string | null;
  seo_description: string | null;
  updated_at: string | null;
  capabilities: Capability[];
}

interface ServicesFormProps {
  service: Service;
}

export default function ServicesForm({ service }: ServicesFormProps) {
  const isEdit = service.exists;
  const { toast } = useToast();

  const { data, setData, processing } = useForm({
    title_en: service.title_en ?? "",
    title_km: service.title_km ?? "",
    title_zh: service.title_zh ?? "",
    short_description_en: service.short_description_en ?? "",
    short_description_km: service.short_description_km ?? "",
    short_description_zh: service.short_description_zh ?? "",
    description_en: service.description_en ?? "",
    description_km: service.description_km ?? "",
    description_zh: service.description_zh ?? "",
    category: service.category ?? "",
    slug: service.slug ?? "",
    image: null as File | null,
    remove_image: false,
    image_alt: service.image_alt ?? "",
    is_published: service.is_published ?? false,
    is_featured: service.is_featured ?? false,
    display_order: service.display_order ?? 1,
    author_name: service.author_name ?? "",
    seo_title: service.seo_title ?? "",
    seo_description: service.seo_description ?? "",
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

  const [slugTouched, setSlugTouched] = useState(!!service.slug);

  const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");

  const handleTitleChange = (v: string) => {
    setData("title_en", v);
    if (!slugTouched) setData("slug", slugify(v));
  };

  const handleSlugChange = (v: string) => {
    setSlugTouched(true);
    setData("slug", v);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { image, remove_image, ...rest } = data;
    const payload = { ...rest } as Record<string, string | number | boolean | File | null>;
    if (image) payload.image = image;
    if (remove_image) payload.remove_image = true;
    if (isEdit) {
      router.put(`/admin/services/${service.id}`, payload, {
        preserveScroll: true,
        forceFormData: true,
        onSuccess: () => {
          setData("image", null);
          setData("remove_image", false);
        },
        onError: () => {
          toast("Failed to save service. Check the form for errors.", "error");
        },
      });
    } else {
      router.post("/admin/services", payload, {
        forceFormData: true,
        onError: () => {
          toast("Failed to create service. Check the form for errors.", "error");
        },
      });
    }
  };

  const translationFields = {
    title: data.title_en,
    short_description: data.short_description_en,
    description: data.description_en,
  };

  return (
    <AdminLayout title={isEdit ? "Edit service" : "Create service"}>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
        {/* Back link + header */}
        <div>
          <Link href="/admin/services" className="text-xs font-semibold text-muted hover:text-brand">← Services</Link>
          <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-faint">Service editor</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink-text">{isEdit ? "Edit service" : "Create a service"}</h2>
          <p className="mt-1 text-sm text-muted">Focus on what the service is, what clients receive, and one strong image.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Title */}
            <div className="border border-line bg-paper p-5">
              <TextField
                label="Service name"
                name="title_en"
                value={data.title_en}
                required
                placeholder="e.g. Grand opening production"
                onChange={handleTitleChange}
              />
            </div>

            {/* Translation toolbar */}
            <TranslationToolbar
              entity="service"
              entityId={service.id ?? undefined}
              fields={translationFields}
              onTranslated={handleTranslated}
            />

            {/* Content with lang tabs */}
            <div className="border border-line bg-paper p-5">
              <div className="mb-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-faint">Service content</p>
                <h3 className="text-base font-bold text-ink-text">Explain the offer</h3>
                <p className="text-xs text-muted">Keep the short description concise; use the full description for process and detail.</p>
              </div>

              <LangTabs group="service">
                {({ code, label }) => (
                  <div className="space-y-4 py-4">
                    {code !== "en" && (
                      <>
                        {!(data[`title_${code}` as keyof typeof data] as string) && (
                          <div className="rounded border border-sky-200 bg-brand-tint px-3 py-2 text-xs text-sky-800">
                            <strong>{label} translation is empty.</strong> Click <strong>"Translate all"</strong> in the toolbar above to generate service name and description translations automatically.
                          </div>
                        )}
                        <TextField
                          label={`${label} service name`}
                          name={`title_${code}`}
                          value={data[`title_${code}` as keyof typeof data] as string}
                          onChange={(v) => setData(`title_${code}` as keyof typeof data, v)}
                        />
                      </>
                    )}
                    <TextareaField
                      label={`${label} short description`}
                      name={`short_description_${code}`}
                      value={data[`short_description_${code}` as keyof typeof data] as string}
                      rows={3}
                      maxLength={500}
                      showCount
                      placeholder="Describe the value in one or two sentences"
                      onChange={(v) => setData(`short_description_${code}` as keyof typeof data, v)}
                    />
                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-muted">
                        {label} full description
                      </label>
                      <RichEditor
                        name={`description_${code}`}
                        value={data[`description_${code}` as keyof typeof data] as string}
                        onChange={(v) => setData(`description_${code}` as keyof typeof data, v)}
                        placeholder="Explain what is included, how the work happens, and what clients can expect."
                      />
                    </div>
                    <FeatureEditor
                      name="capabilities"
                      langCode={code}
                      features={service.capabilities?.map((c) => c[`label_${code}` as keyof Capability] as string ?? "") ?? []}
                      canAdd={code === "en"}
                    />
                  </div>
                )}
              </LangTabs>
            </div>

            {/* Cover image */}
            <div className="border border-line bg-paper p-5">
              <div className="mb-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-faint">Cover</p>
                <h3 className="text-base font-bold text-ink-text">Cover image</h3>
                <p className="text-xs text-muted">Alt text is generated and remains editable.</p>
              </div>
              <ImageUploader
                name="image"
                removeName="remove_image"
                initialPath={service.image ? `/storage/${service.image}` : null}
                initialAlt={service.image_alt ?? ""}
                altName="image_alt"
                altValue={data.image_alt}
                onFileChange={(file) => {
                  setData("image", file);
                  if (!file) setData("remove_image", true);
                }}
                onAltChange={(v) => setData("image_alt", v)}
              />
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
                <TextField label="Slug" name="slug" value={data.slug} placeholder="url-friendly-slug" onChange={handleSlugChange} />
                <TextField label="Category" name="category" value={data.category} placeholder="e.g. Corporate events" onChange={(v) => setData("category", v)} />
                <TextField label="SEO title" name="seo_title" value={data.seo_title} maxLength={60} showCount onChange={(v) => setData("seo_title", v)} />
                <TextareaField label="SEO description" name="seo_description" value={data.seo_description} rows={2} maxLength={160} showCount onChange={(v) => setData("seo_description", v)} />
                <TextField label="Author" name="author_name" value={data.author_name} onChange={(v) => setData("author_name", v)} />
                <div className="flex items-center gap-2">
                  <input id="is_featured" type="checkbox" checked={data.is_featured}
                    onChange={(e) => setData("is_featured", e.target.checked)}
                    className="h-4 w-4 rounded border-line-strong text-brand" />
                  <label htmlFor="is_featured" className="text-sm text-muted">Featured service</label>
                </div>
              </div>
            </details>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <PublishingPanel
                isPublished={data.is_published}
                publishedAt={service.published_at}
                updatedAt={service.updated_at}
              >
                <div className="flex items-center gap-2">
                  <input id="is_published" type="checkbox" checked={data.is_published}
                    onChange={(e) => setData("is_published", e.target.checked)}
                    className="h-4 w-4 rounded border-line-strong text-brand" />
                  <label htmlFor="is_published" className="text-sm text-muted">Published</label>
                </div>
                <button type="submit" disabled={processing}
                  className="btn btn-primary w-full disabled:opacity-50">
                  {isEdit ? "Save service" : "Create service"}
                </button>
                {isEdit && service.is_published && (
                  <Link href={`/en/services/${data.slug}`} className="flex items-center justify-center gap-1.5 text-xs font-semibold text-muted hover:text-brand">
                    <ExternalLink className="h-3.5 w-3.5" />
                    View on website
                  </Link>
                )}
                {isEdit && (
                  <button type="button" onClick={() => { if (confirm("Archive this service? It can be restored later.")) router.delete(`/admin/services/${service.id}`); }}
                    className="text-xs font-semibold text-red-500 hover:text-red-600">
                    Archive service
                  </button>
                )}
              </PublishingPanel>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
