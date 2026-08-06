import { Link } from "@inertiajs/react";
import { FileText, FolderKanban, Briefcase, Mail } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/admin/EmptyState";

interface DashboardProps {
  serviceCount: number;
  servicesPublished: number;
  servicesDraft: number;
  projectCount: number;
  projectsPublished: number;
  projectsDraft: number;
  blogCount: number;
  blogsPublished: number;
  blogsDraft: number;
  newRequests: number;
  unreadRequests: number;
  recentRequests: Array<{
    id: number;
    customer_name: string;
    event_type: string;
    status: string;
    created_at: string;
  }>;
  recentServices: Array<{
    id: number;
    title_en: string;
    is_published: boolean;
    updated_at: string | null;
  }>;
  recentProjects: Array<{
    id: number;
    title_en: string;
    is_published: boolean;
    updated_at: string | null;
  }>;
  recentPosts: Array<{
    id: number;
    title_en: string;
    is_published: boolean;
    updated_at: string | null;
  }>;
}

function timeAgo(date: string | null): string {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

function ActivityRow({
  mark,
  title,
  type,
  isPublished,
  updatedAt,
  href,
}: {
  mark: string;
  title: string;
  type: string;
  isPublished: boolean;
  updatedAt: string | null;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 border-b border-line py-3 last:border-0 hover:bg-paper-tint"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-paper-tint text-[9px] font-bold text-muted">
        {mark}
      </span>
      <span className="flex-1 min-w-0">
        <strong className="block truncate text-sm text-ink-text">{title}</strong>
        <small className="text-[11px] text-faint">{type} · {timeAgo(updatedAt)}</small>
      </span>
      <StatusBadge status={isPublished ? "published" : "draft"} />
    </Link>
  );
}

export default function Dashboard(props: DashboardProps) {
  const hasRecentWork =
    props.recentServices.length > 0 ||
    props.recentProjects.length > 0 ||
    props.recentPosts.length > 0;

  const cards = [
    {
      label: "Services",
      count: props.serviceCount,
      detail: `${props.servicesPublished} published · ${props.servicesDraft} drafts`,
      href: "/admin/services",
      icon: Briefcase,
      lead: true,
    },
    {
      label: "Projects",
      count: props.projectCount,
      detail: `${props.projectsPublished} published · ${props.projectsDraft} drafts`,
      href: "/admin/projects",
      icon: FolderKanban,
    },
    {
      label: "Blog posts",
      count: props.blogCount,
      detail: `${props.blogsPublished} published · ${props.blogsDraft} drafts`,
      href: "/admin/blog",
      icon: FileText,
    },
    {
      label: "Messages",
      count: props.newRequests,
      detail: `${props.unreadRequests} unread enquiries`,
      href: "/admin/messages",
      icon: Mail,
    },
  ];

  return (
    <AdminLayout
      title="Dashboard"
      actions={
        <>
          <Link href="/admin/blog/create" className="border border-line-strong px-3 py-2 text-xs font-semibold text-muted hover:border-line-strong">
            Write post
          </Link>
          <Link href="/admin/projects/create" className="bg-brand px-3 py-2 text-xs font-semibold text-white hover:bg-brand-deep">
            New project
          </Link>
        </>
      }
    >
      {/* Metric Cards Grid */}
      <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Content overview">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className={`group flex flex-col gap-1 border p-4 transition-all hover:shadow-md ${
                card.lead ? "border-sky-200 bg-brand-tint" : "border-line bg-paper"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-faint">{card.label}</span>
                <Icon className="h-4 w-4 text-faint group-hover:text-sky-500" />
              </div>
              <strong className="text-2xl font-bold text-ink-text">{card.count}</strong>
              <span className="text-[11px] text-muted">{card.detail}</span>
            </Link>
          );
        })}
      </section>

      {/* Two-column grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent work */}
        <section className="border border-line bg-paper">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-faint">Recent work</p>
              <h2 className="text-base font-bold text-ink-text">Content touched lately</h2>
            </div>
            <Link href="/admin/services" className="text-xs font-semibold text-brand hover:text-brand-deep">
              View libraries
            </Link>
          </div>
          <div className="px-5">
            {hasRecentWork ? (
              <>
                {props.recentServices.map((s) => (
                  <ActivityRow key={`svc-${s.id}`} mark="SVC" title={s.title_en} type="Service" isPublished={s.is_published} updatedAt={s.updated_at} href={`/admin/services/${s.id}/edit`} />
                ))}
                {props.recentProjects.map((p) => (
                  <ActivityRow key={`prj-${p.id}`} mark="PRJ" title={p.title_en} type="Project" isPublished={p.is_published} updatedAt={p.updated_at} href={`/admin/projects/${p.id}/edit`} />
                ))}
                {props.recentPosts.map((p) => (
                  <ActivityRow key={`post-${p.id}`} mark="POST" title={p.title_en} type="Blog" isPublished={p.is_published} updatedAt={p.updated_at} href={`/admin/blog/${p.id}/edit`} />
                ))}
              </>
            ) : (
              <EmptyState
                mark="START"
                title="Your workspace is clear"
                description="Create a service, project, or post to begin."
                small
              />
            )}
          </div>
        </section>

        {/* Latest messages */}
        <section className="border border-line bg-paper">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-faint">Inbox</p>
              <h2 className="text-base font-bold text-ink-text">Latest messages</h2>
            </div>
            <Link href="/admin/messages" className="text-xs font-semibold text-brand hover:text-brand-deep">
              Open inbox
            </Link>
          </div>
          <div className="px-5">
            {props.recentRequests.length === 0 ? (
              <EmptyState
                mark="INBOX"
                title="No enquiries yet"
                description="New quotation requests will appear here."
                small
              />
            ) : (
              props.recentRequests.map((req) => (
                <Link
                  key={req.id}
                  href={`/admin/messages/${req.id}`}
                  className="flex items-center gap-3 border-b border-line py-3 last:border-0 hover:bg-paper-tint"
                >
                  <span className="flex-1 min-w-0">
                    <strong className="block truncate text-sm text-ink-text">{req.customer_name}</strong>
                    <small className="text-[11px] text-faint">
                      {req.event_type.replace(/_/g, " ")} · {timeAgo(req.created_at)}
                    </small>
                  </span>
                  <StatusBadge status={req.status === "new" ? "scheduled" : "draft"} />
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
