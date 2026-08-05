import { Link } from "@inertiajs/react";
import { ArrowLeft, Calendar, User } from "lucide-react";
import type { Locale } from "@/config/site";
import { getDictionary } from "@/lib/i18n";
import type { ApiBlogPost, ApiService } from "@/lib/types";
import AppLayout from "@/Layouts/AppLayout";
import SeoMeta from "@/components/seo/SeoMeta";

interface BlogPostProps {
  locale: Locale;
  post: ApiBlogPost;
  services: ApiService[];
}

export default function BlogPost({ locale, post, services }: BlogPostProps) {
  const dict = getDictionary(locale);

  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString(
        locale === "km" ? "km-KH" : locale === "zh" ? "zh-CN" : "en-US",
        { year: "numeric", month: "long", day: "numeric" }
      )
    : null;

  return (
    <>
      <SeoMeta
        title={post.seo_title || post.title}
        description={post.seo_description || post.excerpt || undefined}
        image={post.social_image || post.cover_image || undefined}
        locale={locale}
        path={`/blog/${post.slug}`}
        type="article"
        publishedAt={post.published_at || undefined}
      />
      <AppLayout locale={locale} dict={dict} services={services}>
        <section className="on-dark bg-ink pt-19">
          <div className="shell py-10 lg:py-14">
            <nav aria-label={dict.common.breadcrumb} className="mb-6">
              <ol className="t-meta flex flex-wrap gap-2 text-white/50">
                <li>
                  <Link href={`/${locale}`} className="transition-colors hover:text-white">
                    {dict.nav.home}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href={`/${locale}/blog`} className="transition-colors hover:text-white">
                    {dict.blog.title}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-white/80">{post.title}</li>
              </ol>
            </nav>

            <div className="t-meta mb-4 flex flex-wrap items-center gap-4 text-white/60">
              {date && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                  {dict.blog.publishedOn} {date}
                </span>
              )}
              {post.author_name && (
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" aria-hidden="true" />
                  {dict.blog.by} {post.author_name}
                </span>
              )}
            </div>

            <h1 className="t-display max-w-3xl text-white">{post.title}</h1>

            {post.excerpt && (
              <p className="t-lead mt-4 max-w-2xl text-white/70">{post.excerpt}</p>
            )}
          </div>
        </section>

        {post.cover_image && (
          <figure className="frame aspect-16/7 w-full lg:aspect-21/8">
            <img
              src={post.cover_image}
              alt={post.cover_image_alt || post.title}
              className="h-full w-full object-cover"
            />
          </figure>
        )}

        <article className="band bg-paper">
          <div className="shell">
            <div className="mx-auto max-w-3xl">
              {post.body && (
                <div
                  className="prose prose-lg max-w-none
                    prose-headings:font-bold prose-headings:text-ink-text
                    prose-p:text-muted prose-p:leading-relaxed
                    prose-a:text-brand prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-ink-text prose-strong:font-bold
                    prose-ul:text-muted prose-ol:text-muted
                    prose-li:marker:text-brand
                    [&_b]:font-bold [&_strong]:font-bold
                    [&_i]:italic [&_em]:italic
                    [&_u]:underline
                    [&_ul]:list-disc [&_ul]:pl-6
                    [&_ol]:list-decimal [&_ol]:pl-6
                    [&_li]:mb-1.5
                    [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-4
                    [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-3
                    [&_p]:mb-4 [&_p]:text-base [&_p]:leading-[1.8]"
                  dangerouslySetInnerHTML={{ __html: post.body }}
                />
              )}

              <div className="mt-12 border-t border-line pt-8">
                <Link
                  href={`/${locale}/blog`}
                  className="t-label group inline-flex items-center gap-2 text-brand transition-colors hover:text-brand-hover"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true" />
                  {dict.blog.backToList}
                </Link>
              </div>
            </div>
          </div>
        </article>
      </AppLayout>
    </>
  );
}
