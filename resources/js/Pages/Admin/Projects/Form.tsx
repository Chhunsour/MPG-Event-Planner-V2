import { Link, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import TextField from "@/components/admin/forms/TextField";
import TextareaField from "@/components/admin/forms/TextareaField";
import RichEditor from "@/components/admin/forms/RichEditor";
import LangTabs from "@/components/admin/forms/LangTabs";
import ImageUploader from "@/components/admin/forms/ImageUploader";
import PublishingPanel from "@/components/admin/forms/PublishingPanel";
import TranslationToolbar from "@/components/admin/forms/TranslationToolbar";
import FeatureEditor from "@/components/admin/forms/FeatureEditor";
import SelectField from "@/components/admin/forms/SelectField";

interface ProjectImage {
  id: number;
  path: string;
  alt_en: string | null;
  width: number;
  height: number;
  display_order: number;
}

interface ProjectFeature {
  label_en: string;
  label_km: string | null;
  label_zh: string | null;
}

interface Project {
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
  client_name: string | null;
  location: string | null;
  category: string | null;
  slug: string;
  year: number | null;
  service_id: number | null;
  cover_image: string | null;
  cover_image_alt: string | null;
  is_published: boolean;
  is_featured: boolean;
  published_at: string | null;
  display_order: number;
  author_name: string | null;
  seo_title: string | null;
  seo_description: string | null;
  updated_at: string | null;
  images: ProjectImage[];
  features: ProjectFeature[];
}

interface ServiceOption {
  id: number;
  title_en: string;
}

interface ProjectsFormProps {
  project: Project;
  services: ServiceOption[];
}

export default function ProjectsForm({ project, services }: ProjectsFormProps) {
  const isEdit = project.exists;

  const { data, setData, processing } = useForm({
    title_en: project.title_en ?? "",
    title_km: project.title_km ?? "",
    title_zh: project.title_zh ?? "",
    short_description_en: project.short_description_en ?? "",
    short_description_km: project.short_description_km ?? "",
    short_description_zh: project.short_description_zh ?? "",
    description_en: project.description_en ?? "",
    description_km: project.description_km ?? "",
    description_zh: project.description_zh ?? "",
    client_name: project.client_name ?? "",
    location: project.location ?? "",
    category: project.category ?? "",
    slug: project.slug ?? "",
    year: project.year ?? "",
    service_id: project.service_id ?? "",
    cover_image: null as File | null,
    remove_cover_image: false,
    cover_image_alt: project.cover_image_alt ?? "",
    is_published: project.is_published ?? false,
    is_featured: project.is_featured ?? false,
    display_order: project.display_order ?? 1,
    author_name: project.author_name ?? "",
    seo_title: project.seo_title ?? "",
    seo_description: project.seo_description ?? "",
  });

  const handleTranslated = (results: Record<string, Record<string, string>>) => {
    const updates: Partial<typeof data> = {};
    if (results.title) {
      if (results.title.km) updates.title_km = results.title.km;
      if (results.title.zh || results.title["zh-CN"]) updates.title_zh = results.title.zh || results.title["zh-CN"];
    }
    if (results.short_description) {
      if (results.short_description.km) updates.short_description_km = results.short_description.km;
      if (results.short_description.zh || results.short_description["zh-CN"]) updates.short_description_zh = results.short_description.zh || results.short_description["zh-CN"];
    }
    if (results.description) {
      if (results.description.km) updates.description_km = results.description.km;
      if (results.description.zh || results.description["zh-CN"]) updates.description_zh = results.description.zh || results.description["zh-CN"];
    }
    setData((prev) => ({ ...prev, ...updates }));
  };

  const [galleryRemoved, setGalleryRemoved] = useState<number[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { cover_image, remove_cover_image, ...rest } = data;
    const payload = { ...rest } as Record<string, string | number | boolean | File | null>;
    if (cover_image) payload.cover_image = cover_image;
    if (remove_cover_image) payload.remove_cover_image = true;
    if (isEdit) {
      router.put(`/admin/projects/${project.id}`, payload, {
        preserveScroll: true,
        forceFormData: true,
        onSuccess: () => {
          setData("cover_image", null);
          setData("remove_cover_image", false);
        },
      });
    } else {
      router.post("/admin/projects", payload, { forceFormData: true });
    }
  };

  const translationFields = {
    title: data.title_en,
    short_description: data.short_description_en,
    description: data.description_en,
  };

  const removeGalleryImage = (id: number) => {
    setGalleryRemoved((prev) => [...prev, id]);
  };

  const visibleImages = project.images?.filter((img) => !galleryRemoved.includes(img.id)) ?? [];

  return (
    <AdminLayout title={isEdit ? "Edit project" : "Create project"}>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
        {/* Back link + header */}
        <div>
          <Link href="/admin/projects" className="text-xs font-semibold text-muted hover:text-brand">← Projects</Link>
          <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-faint">Project editor</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink-text">{isEdit ? "Edit project" : "Create a project"}</h2>
          <p className="mt-1 text-sm text-muted">Focus on the outcome, the client, and strong imagery.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Title + meta */}
            <div className="border border-line bg-paper p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Project name" name="title_en" value={data.title_en} required
                  placeholder="e.g. Annual gala 2024"
                  onChange={(v) => setData("title_en", v)} />
                <TextField label="Client" name="client_name" value={data.client_name}
                  placeholder="Client or organisation name"
                  onChange={(v) => setData("client_name", v)} />
                <TextField label="Location" name="location" value={data.location}
                  placeholder="City, venue"
                  onChange={(v) => setData("location", v)} />
                <TextField label="Year" name="year" value={String(data.year)}
                  placeholder="2024"
                  onChange={(v) => setData("year", v)} />
              </div>
            </div>

            {/* Translation toolbar */}
            <TranslationToolbar
              entity="project"
              entityId={project.id ?? undefined}
              fields={translationFields}
              onTranslated={handleTranslated}
            />

            {/* Content with lang tabs */}
            <div className="border border-line bg-paper p-5">
              <div className="mb-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-faint">Project content</p>
                <h3 className="text-base font-bold text-ink-text">Describe the work</h3>
              </div>

              <LangTabs group="project">
                {({ code, label }) => (
                  <div className="space-y-4 py-4">
                    {code !== "en" && (
                      <TextField
                        label={`${label} project name`}
                        name={`title_${code}`}
                        value={data[`title_${code}` as keyof typeof data] as string}
                        onChange={(v) => setData(`title_${code}` as keyof typeof data, v)}
                      />
                    )}
                    <TextareaField
                      label={`${label} short description`}
                      name={`short_description_${code}`}
                      value={data[`short_description_${code}` as keyof typeof data] as string}
                      rows={3}
                      maxLength={500}
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
                        placeholder="Describe the project scope, challenges, and results."
                      />
                    </div>
                    <FeatureEditor
                      name="features"
                      langCode={code}
                      features={project.features?.map((f) => f[`label_${code}` as keyof ProjectFeature] as string ?? "") ?? []}
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
              </div>
              <ImageUploader
                name="cover_image"
                removeName="remove_cover_image"
                initialPath={project.cover_image ? `/storage/${project.cover_image}` : null}
                initialAlt={project.cover_image_alt ?? ""}
                altName="cover_image_alt"
                altValue={data.cover_image_alt}
                onFileChange={(file) => {
                  setData("cover_image", file);
                  if (!file) setData("remove_cover_image", true);
                }}
                onAltChange={(v) => setData("cover_image_alt", v)}
              />
            </div>

            {/* Gallery */}
            <div className="border border-line bg-paper p-5">
              <div className="mb-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-faint">Gallery</p>
                <h3 className="text-base font-bold text-ink-text">Project images</h3>
                <p className="text-xs text-muted">Upload multiple images. They appear in the project gallery on the website.</p>
              </div>

              {visibleImages.length > 0 && (
                <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {visibleImages.map((img) => (
                    <div key={img.id} className="group relative overflow-hidden border border-line">
                      <img src={`/storage/${img.path}`} alt={img.alt_en ?? ""}
                        className="h-24 w-full object-cover" />
                      <button type="button" onClick={() => removeGalleryImage(img.id)}
                        className="absolute right-1 top-1 bg-paper/90 p-1 text-red-500 opacity-0 transition-opacity group-hover:opacity-100">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      {galleryRemoved.includes(img.id) && (
                        <input type="hidden" name={`gallery_removed[]`} value={img.id} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-muted">
                  Add images
                </label>
                <input type="file" name="gallery[]" accept="image/*" multiple
                  className="block w-full text-sm text-muted file:mr-3 file:border-0 file:bg-brand-tint file:px-4 file:py-2 file:text-xs file:font-semibold file:text-brand-deep hover:file:bg-sky-100" />
              </div>
            </div>

            {/* Advanced settings */}
            <div className="border border-line bg-paper p-5">
              <div className="mb-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-faint">Advanced</p>
                <h3 className="text-base font-bold text-ink-text">SEO & metadata</h3>
              </div>
              <div className="space-y-4">
                <TextField label="Slug" name="slug" value={data.slug} onChange={(v) => setData("slug", v)} />
                <TextField label="Category" name="category" value={data.category} onChange={(v) => setData("category", v)} />
                <div className="max-w-75">
                  <SelectField
                    label="Service"
                    name="service_id"
                    value={String(data.service_id)}
                    options={[
                      { value: "", label: "— No service —" },
                      ...services.map((s) => ({ value: String(s.id), label: s.title_en })),
                    ]}
                    onChange={(v) => setData("service_id", v)}
                  />
                </div>
                <TextField label="SEO title" name="seo_title" value={data.seo_title} maxLength={60} onChange={(v) => setData("seo_title", v)} />
                <TextareaField label="SEO description" name="seo_description" value={data.seo_description} rows={2} maxLength={160} onChange={(v) => setData("seo_description", v)} />
                <TextField label="Author" name="author_name" value={data.author_name} onChange={(v) => setData("author_name", v)} />
                <div className="flex items-center gap-2">
                  <input id="is_featured" type="checkbox" checked={data.is_featured}
                    onChange={(e) => setData("is_featured", e.target.checked)}
                    className="h-4 w-4 rounded border-line-strong text-brand" />
                  <label htmlFor="is_featured" className="text-sm text-muted">Featured project</label>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <PublishingPanel
                isPublished={data.is_published}
                publishedAt={project.published_at}
                updatedAt={project.updated_at}
              >
                <div className="flex items-center gap-2">
                  <input id="is_published" type="checkbox" checked={data.is_published}
                    onChange={(e) => setData("is_published", e.target.checked)}
                    className="h-4 w-4 rounded border-line-strong text-brand" />
                  <label htmlFor="is_published" className="text-sm text-muted">Published</label>
                </div>
                <button type="submit" disabled={processing}
                  className="bg-brand px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-deep disabled:opacity-50">
                  {isEdit ? "Save project" : "Create project"}
                </button>
                {isEdit && (
                  <form method="POST" action={`/admin/projects/${project.id}`} onSubmit={(e) => { if (!confirm("Archive this project?")) e.preventDefault(); }}>
                    <input type="hidden" name="_method" value="DELETE" />
                    <button type="submit" className="text-xs font-semibold text-red-500 hover:text-red-600">
                      Archive project
                    </button>
                  </form>
                )}
              </PublishingPanel>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
