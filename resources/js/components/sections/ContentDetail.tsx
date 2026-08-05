import { Link } from "@inertiajs/react";
import { ArrowLeft, ArrowRight, Check, MapPin, CalendarDays, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/config/site";
import type { ApiProject, ApiService } from "@/lib/types";

type DetailKind = "project" | "service";

interface ContentDetailProps {
  locale: Locale;
  kind: DetailKind;
  item: ApiProject | ApiService;
  related: ApiProject[] | ApiService[];
  labels: {
    back: string;
    related: string;
    features: string;
    gallery: string;
    inquire: string;
    projectIndex: string;
    serviceIndex: string;
    location: string;
    year: string;
  };
}

function isProject(item: ApiProject | ApiService): item is ApiProject {
  return "cover_image" in item;
}

export default function ContentDetail({ locale, kind, item, related, labels }: ContentDetailProps) {
  const project = isProject(item) ? item : null;
  const image = project ? project.cover_image : (item as ApiService).image;
  const imageAlt = project ? project.cover_image_alt : (item as ApiService).image_alt;
  const features = project ? project.features ?? [] : (item as ApiService).capabilities ?? [];
  const description = item.description || `<p>${item.short_description ?? ""}</p>`;
  const contactHref = `/${locale}/contact${kind === "service" ? `?type=${item.slug}` : ""}`;

  return (
    <article>
      <header className="detail-hero bg-ink text-white">
        <div className="shell">
          <Link href={`/${locale}/${kind === "project" ? "projects" : "services"}`} className="detail-back text-on-blue">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {labels.back}
          </Link>
          <div className="grid gap-10 pt-12 lg:grid-cols-12 lg:items-end lg:gap-16 lg:pt-20">
            <div className="lg:col-span-7">
              <p className="t-meta text-accent-on-blue">{kind === "project" ? labels.projectIndex : labels.serviceIndex}</p>
              <h1 className="t-display-lg mt-4 max-w-[13ch] text-white">{item.title}</h1>
              {item.short_description && <p className="t-lead mt-6 max-w-[58ch] text-on-blue">{item.short_description}</p>}
            </div>
            {image && (
              <figure className="frame aspect-4/3 lg:col-span-5 lg:aspect-5/4">
                <img src={image} alt={imageAlt ?? item.title} className="h-full w-full object-cover" />
              </figure>
            )}
          </div>
        </div>
      </header>

      <div className="shell band-lg">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-8">
            <div className="content-rich" dangerouslySetInnerHTML={{ __html: description }} />

            {features.length > 0 && (
              <section className="mt-14 border-t border-line pt-8" aria-labelledby="detail-features">
                <p className="t-meta text-faint">{labels.features}</p>
                <h2 id="detail-features" className="t-display-sm mt-3">{kind === "project" ? "Key points" : "What is included"}</h2>
                <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
                  {features.map((feature) => (
                    <li key={feature} className="flex gap-3 border-b border-line py-3 text-ink-text">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-accent-deep" aria-hidden="true" />
                      <span className="t-body">{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {project?.gallery && project.gallery.length > 0 && (
              <section className="mt-14 border-t border-line pt-8" aria-labelledby="detail-gallery">
                <p className="t-meta text-faint">{labels.gallery}</p>
                <h2 id="detail-gallery" className="t-display-sm mt-3">A closer look</h2>
                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  {project.gallery.map((galleryImage) => (
                    <figure key={galleryImage.id} className="frame aspect-4/3">
                      <img src={galleryImage.url} alt={galleryImage.alt} className="h-full w-full object-cover" />
                    </figure>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="detail-aside lg:sticky lg:top-28">
              {project && (project.location || project.year) && (
                <dl className="grid gap-4 border-b border-line pb-6 sm:grid-cols-2 lg:grid-cols-1">
                  {project.location && <div className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 text-brand" aria-hidden="true" /><div><dt className="t-meta text-faint">{labels.location}</dt><dd className="t-body mt-1">{project.location}</dd></div></div>}
                  {project.year && <div className="flex gap-3"><CalendarDays className="mt-0.5 h-4 w-4 text-brand" aria-hidden="true" /><div><dt className="t-meta text-faint">{labels.year}</dt><dd className="t-body mt-1">{project.year}</dd></div></div>}
                </dl>
              )}
              <div className="pt-6">
                <p className="t-body max-w-[34ch] text-muted">Tell us what you are planning and we will shape the production around your venue, audience, and timeline.</p>
                <Link href={contactHref} className="btn btn-primary mt-6">{labels.inquire}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <section className="band bg-paper-tint" aria-labelledby="related-content">
          <div className="shell">
            <div className="flex items-end justify-between gap-6 border-b border-line pb-5">
              <div><p className="t-meta text-faint">{labels.related}</p><h2 id="related-content" className="t-display-sm mt-2">More to explore</h2></div>
              <Link href={`/${locale}/${kind === "project" ? "projects" : "services"}`} className="link-rule hidden sm:flex">View all<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.slice(0, 3).map((entry) => {
                const entryProject = isProject(entry);
                const entryImage = entryProject ? (entry as ApiProject).cover_image : (entry as ApiService).image;
                return <Link key={entry.id} href={`/${locale}/${entryProject ? "projects" : "services"}/${entry.slug}`} className="group block" data-pressable>
                  {entryImage && <figure className="frame aspect-4/3"><img src={entryImage} alt={entryProject ? (entry as ApiProject).cover_image_alt ?? entry.title : (entry as ApiService).image_alt ?? entry.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" /></figure>}
                  <div className="flex items-start justify-between gap-4 border-b border-line py-4"><h3 className="t-heading">{entry.title}</h3><ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-brand transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></div>
                </Link>;
              })}
            </div>
          </div>
        </section>
      )}

      <section className="on-dark band-sm bg-brand text-white">
        <div className="shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between"><div><p className="t-meta text-on-blue">MPG Event Planner</p><h2 className="t-display-sm mt-2 text-white">Ready to plan the next one?</h2></div><Link href={contactHref} className="btn btn-onblue shrink-0">{labels.inquire}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
      </section>
    </article>
  );
}
