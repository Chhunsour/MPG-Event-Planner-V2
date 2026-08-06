import { type ReactNode, useEffect, useRef, useState } from "react";
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
  User,
  ChevronDown,
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

interface FlashProps {
  status?: string | null;
  success?: string | null;
  error?: string | null;
  info?: string | null;
  warning?: string | null;
  timestamp?: number | null;
}

const NAV_ITEMS = [
  { route: "admin.dashboard", label: "Dashboard", icon: LayoutDashboard, section: "dashboard" },
  { route: "admin.services.index", label: "Services", icon: Briefcase, section: "services" },
  { route: "admin.projects.index", label: "Projects", icon: FolderKanban, section: "projects" },
  { route: "admin.blog.index", label: "Blog Posts", icon: FileText, section: "blog" },
  { route: "admin.messages.index", label: "Messages", icon: Mail, section: "messages" },
  { route: "admin.media.index", label: "Media", icon: ImageIcon, section: "media" },
  { route: "admin.settings", label: "Settings", icon: Settings, section: "settings" },
] as const;

export default function AdminLayout({ title, actions, children }: AdminLayoutProps) {
  const { url, props } = usePage<{
    auth: AuthUser | null;
    status?: string | null;
    flash?: FlashProps | null;
    errors?: Record<string, string>;
  }>();
  const auth = props.auth;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { toast } = useToast();
  const lastProcessedKey = useRef<string | number | null>(null);

  useEffect(() => {
    const flash = props.flash;
    const key = flash?.timestamp ?? props.status ?? null;

    if (key !== null && key !== lastProcessedKey.current) {
      lastProcessedKey.current = key;

      if (flash?.success) {
        toast(flash.success, "success");
      } else if (flash?.error) {
        toast(flash.error, "error");
      } else if (flash?.info) {
        toast(flash.info, "info");
      } else if (flash?.warning) {
        toast(flash.warning, "info");
      } else if (props.status && typeof props.status === "string" && props.status.trim()) {
        toast(props.status, "success");
      }
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

  return (
    <div className="min-h-screen bg-paper-tint text-ink-text antialiased">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 border-b border-line bg-paper shadow-xs">
        {/* Main Navbar */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Brand Logo & Mobile Toggle */}
          <div className="flex items-center gap-6 py-3.5">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-muted hover:text-ink-text lg:hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <img
                src="/images/mpg-logo.png"
                alt="MPG Event Planner"
                className="h-9 w-auto object-contain"
              />
              <span className="hidden rounded bg-brand-tint px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-deep sm:inline-block">
                Studio
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex lg:items-center lg:gap-1" aria-label="Global navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active =
                currentSection === item.section ||
                (item.section === "dashboard" && url === "/admin/dashboard");
              return (
                <Link
                  key={item.route}
                  href={`/admin/${item.section === "dashboard" ? "dashboard" : item.section}`}
                  className={`relative flex items-center gap-2 px-3.5 py-4 text-xs font-bold transition-colors ${
                    active
                      ? "text-brand"
                      : "text-muted hover:text-ink-text"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {active && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-brand" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions & User Dropdown */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 border border-line-strong px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-brand hover:text-brand sm:inline-flex"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>View website</span>
            </Link>

            {/* User menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 border border-line px-2.5 py-1.5 text-xs font-medium text-ink-text hover:bg-paper-tint"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-tint text-brand">
                  <User className="h-3.5 w-3.5" />
                </div>
                <span className="hidden max-w-[130px] truncate text-xs font-semibold sm:inline-block">
                  {auth?.name || auth?.email || "Admin"}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted" />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 z-20 mt-2 w-56 border border-line bg-paper p-2 shadow-lg">
                    <div className="border-b border-line px-3 py-2">
                      <p className="text-xs font-bold text-ink-text">{auth?.name || "Administrator"}</p>
                      <p className="truncate text-[11px] text-faint">{auth?.email}</p>
                    </div>
                    <Link
                      href="/admin/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted hover:bg-paper-tint hover:text-ink-text"
                    >
                      <Settings className="h-3.5 w-3.5" />
                      Settings
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-line bg-paper px-4 py-3 lg:hidden">
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active =
                  currentSection === item.section ||
                  (item.section === "dashboard" && url === "/admin/dashboard");
                return (
                  <Link
                    key={item.route}
                    href={`/admin/${item.section === "dashboard" ? "dashboard" : item.section}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-brand-tint text-brand"
                        : "text-muted hover:bg-paper-tint hover:text-ink-text"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center gap-2 border border-line px-3 py-2 text-xs font-semibold text-muted"
              >
                <ExternalLink className="h-4 w-4" />
                View website
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Page Title & Actions Sub-Header Bar */}
      <div className="border-b border-line bg-paper px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <h1 className="text-xl font-bold tracking-tight text-ink-text">{title}</h1>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>

      {/* Main Page Content Container */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
