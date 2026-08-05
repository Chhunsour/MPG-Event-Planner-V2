import { type ReactNode, useEffect, useState } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import {
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  FileText,
  Mail,
  Settings,
  Image as ImageIcon,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface AdminLayoutProps {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}

interface AuthUser {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

const NAV_ITEMS = [
  { route: "admin.dashboard", label: "Dashboard", icon: LayoutDashboard, section: "dashboard" },
  { route: "admin.services.index", label: "Services", icon: Briefcase, section: "services" },
  { route: "admin.projects.index", label: "Projects", icon: FolderKanban, section: "projects" },
  { route: "admin.blog.index", label: "Blog Posts", icon: FileText, section: "blog" },
  { route: "admin.messages.index", label: "Messages", icon: Mail, section: "messages" },
  { route: "admin.settings", label: "Settings", icon: Settings, section: "settings" },
] as const;

export default function AdminLayout({ title, actions, children }: AdminLayoutProps) {
  const { url, props } = usePage<{ auth: AuthUser | null; status?: string | null; errors?: Record<string, string> }>();
  const auth = props.auth;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const status = props.status;
    if (typeof status === "string" && status.trim()) {
      toast(status, "success");
    }

    const errors = props.errors;
    if (errors && typeof errors === "object" && !Array.isArray(errors) && Object.keys(errors).length > 0) {
      const count = Object.keys(errors).length;
      toast(`Please fix ${count} ${count === 1 ? "error" : "errors"} below.`, "error");
    }
  }, [props, toast]);

  const { post } = useForm();
  const handleLogout = () => post("/admin/logout");

  const currentSection = url.split("/")[2] ?? "";

  const sidebar = (
    <>
      <div className="flex items-center justify-center px-5 py-6">
        <img
          src="/images/mpg-logo.png"
          alt="MPG Event Planner"
          className="h-12 w-auto max-w-full object-contain"
        />
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3" aria-label="Admin sections">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = currentSection === item.section || (item.section === "dashboard" && url === "/admin/dashboard");
          return (
            <Link
              key={item.route}
              href={`/admin/${item.section === "dashboard" ? "dashboard" : item.section}`}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand text-white"
                  : "text-on-blue hover:bg-sidebar-raised hover:text-white"
              }`}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <Link
          href="/admin/media"
          aria-current={currentSection === "media" ? "page" : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
            currentSection === "media"
              ? "bg-brand text-white"
              : "text-on-blue hover:bg-sidebar-raised hover:text-white"
          }`}
        >
          <ImageIcon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
          <span>Media</span>
        </Link>
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <div className="mb-3 truncate text-xs text-on-blue/60">{auth?.email}</div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-paper-tint">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col bg-sidebar lg:flex">
        {sidebar}
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-60 flex-col bg-sidebar">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="absolute right-3 top-4 text-on-blue/60 hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col lg:pl-60">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-line bg-paper px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="text-muted lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-faint">
                MPG content studio
              </p>
              <h1 className="text-lg font-bold tracking-tight text-ink-text">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {actions}
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-brand px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-deep"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              View website
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 px-5 py-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
