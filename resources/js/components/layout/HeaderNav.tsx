import { useCallback, useEffect, useRef, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import type { Locale } from "@/config/site";
import { ArrowRight, ChevronDown, Mail, Check } from "lucide-react";
import BrandMark from "@/components/layout/BrandMark";

interface HeaderNavProps {
  locale: Locale;
  dict: {
    home: string;
    about: string;
    services: string;
    projects: string;
    blog?: string;
    contact: string;
    requestQuote: string;
    langSelect: string;
    menu: string;
    openMenu: string;
    closeMenu: string;
    mainNav: string;
  };
}

const LANGUAGES = [
  { code: "en", label: "EN", full: "English", flag: "/images/flags/uk.svg" },
  { code: "km", label: "ខ្មែរ", full: "ភាសាខ្មែរ", flag: "/images/flags/cambodia.svg" },
  { code: "zh", label: "中文", full: "简体中文", flag: "/images/flags/china.svg" },
] as const;

export default function HeaderNav({ locale, dict }: HeaderNavProps) {
  const { url } = usePage();
  const pathname = url;

  const [menuOpen, setMenuOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled])",
    );
    focusables?.[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const navItems = [
    { label: dict.home, href: `/${locale}` },
    { label: dict.services, href: `/${locale}/services` },
    { label: dict.projects, href: `/${locale}/projects` },
    { label: dict.blog || "Blog", href: `/${locale}/blog` },
    { label: dict.about, href: `/${locale}/about` },
  ];

  const isActive = useCallback(
    (href: string) =>
      href === `/${locale}` ? pathname === href : pathname.startsWith(href),
    [pathname, locale],
  );

  const localeHref = (next: string) => {
    if (!pathname) return `/${next}`;
    const segments = pathname.split("/");
    segments[1] = next;
    return segments.join("/") || `/${next}`;
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,height,box-shadow] duration-200 ${
        solid
          ? "border-b border-line bg-paper shadow-[0_1px_12px_rgb(6_24_43/0.08)]"
          : "bg-transparent"
      }`}
    >
      <div
        className={`shell flex items-center justify-between gap-4 transition-[height] duration-200 ${
          solid ? "h-16" : "h-19"
        }`}
      >
        <Link
          href={`/${locale}`}
          className="flex shrink-0 items-center"
          aria-label={`MPG Event Planner — ${dict.home}`}
        >
          <img
            src="/images/mpg-logo.png"
            alt="MPG Event Planner"
            width={366}
            height={121}
            className={`w-auto object-contain transition-[height,filter] duration-200 ${
              solid ? "h-7.5" : "h-8.5 brightness-0 invert"
            }`}
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label={dict.mainNav}
        >
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`t-label group relative py-2 transition-colors duration-200 ${
                  solid
                    ? active
                      ? "text-brand"
                      : "text-ink-text/75 hover:text-brand"
                    : "text-white/80 hover:text-white"
                } ${!solid && active ? "text-white" : ""}`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent-bright transition-transform duration-200 ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Language Switcher & Primary Contact Button */}
        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitch
            locale={locale}
            localeHref={localeHref}
            label={dict.langSelect}
            solid={solid}
          />

          <Link
            href={`/${locale}/contact`}
            aria-current={isActive(`/${locale}/contact`) ? "page" : undefined}
            className={`btn h-11.5 min-h-0 px-5 text-xs ${
              solid ? "btn-outline" : "btn-onblue"
            }`}
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            {dict.contact}
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center lg:hidden">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className={`flex h-11 items-center gap-2.5 border px-3.5 transition-colors duration-200 ${
              solid
                ? "border-line-strong text-ink-text"
                : "border-white/45 text-white"
            }`}
          >
            <span className="t-meta" aria-hidden="true">
              {dict.menu}
            </span>
            <svg width="20" height="12" viewBox="0 0 20 12" aria-hidden="true" fill="none">
              <path d="M0 1h20M0 6h20M0 11h13" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="sr-only">{dict.openMenu}</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={dict.mainNav}
          ref={panelRef}
          className="fixed inset-0 z-50 flex flex-col bg-ink text-white lg:hidden"
        >
          <div className="flex h-19 shrink-0 items-center justify-between border-b border-white/15 px-5 sm:px-8">
            <img
              src="/images/mpg-logo.png"
              alt="MPG Event Planner"
              width={366}
              height={121}
              className="h-8 w-auto object-contain brightness-0 invert"
            />
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                triggerRef.current?.focus();
              }}
              className="flex h-11 w-11 items-center justify-center border border-white/30 text-white"
            >
              <span className="sr-only">{dict.closeMenu}</span>
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="none">
                <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>

          <nav
            className="flex-1 overflow-y-auto px-5 sm:px-8"
            aria-label={dict.mainNav}
          >
            {[
              ...navItems,
              { label: dict.contact, href: `/${locale}/contact` },
            ].map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="group flex items-center gap-5 border-b border-white/12 py-5"
                >
                  <BrandMark className={`h-4 w-4 ${active ? "opacity-100" : "opacity-45"}`} />
                  <span
                    className={`t-display-sm flex-1 ${active ? "text-accent-bright" : "text-white"}`}
                  >
                    {item.label}
                  </span>
                  <ArrowRight
                    className="h-4 w-4 text-white/35 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </nav>

          <div className="shrink-0 space-y-5 border-t border-white/15 px-5 py-6 sm:px-8">
            <Link
              href={`/${locale}/contact`}
              className="btn btn-onink btn-lg w-full"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {dict.contact}
            </Link>

            <div>
              <p className="t-meta mb-2.5 text-white/50">{dict.langSelect}</p>
              <LanguageSwitch
                locale={locale}
                localeHref={localeHref}
                label={dict.langSelect}
                solid={false}
                mobile
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function LanguageSwitch({
  locale,
  localeHref,
  label,
  solid,
  mobile = false,
}: {
  locale: Locale;
  localeHref: (next: string) => string;
  label: string;
  solid: boolean;
  mobile?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const activeLanguage = LANGUAGES.find((lang) => lang.code === locale) ?? LANGUAGES[0];

  return (
    <div className={`relative ${mobile ? "w-full" : ""}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between gap-2.5 border px-3 py-2 text-xs font-bold tracking-wider transition-all duration-200 ${
          mobile
            ? "w-full border-white/25 bg-white/5 text-white"
            : solid
              ? "border-line-strong bg-paper text-ink-text hover:border-brand hover:text-brand"
              : "border-white/35 bg-white/10 text-white backdrop-blur-xs hover:border-white hover:bg-white/20"
        }`}
        aria-label={label}
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <img
            src={activeLanguage.flag}
            alt=""
            width={20}
            height={14}
            className="h-3.5 w-5 object-cover"
          />
          <span>{mobile ? activeLanguage.full : activeLanguage.label}</span>
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180 text-brand" : "text-faint"
          }`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className={`absolute z-50 overflow-hidden border p-1 shadow-2xl transition-all duration-200 ${
              mobile
                ? "bottom-full left-0 mb-2 w-full border-white/25 bg-ink text-white"
                : "right-0 top-full mt-1.5 min-w-44 border-line-strong bg-paper text-ink-text shadow-xl"
            }`}
          >
            {LANGUAGES.map((lang) => {
              const active = locale === lang.code;
              return (
                <Link
                  key={lang.code}
                  href={localeHref(lang.code)}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between gap-3 px-3 py-2.5 text-xs font-semibold transition-colors ${
                    active
                      ? "bg-brand text-white font-bold"
                      : mobile
                        ? "text-white/80 hover:bg-white/10 hover:text-white"
                        : "text-muted hover:bg-paper-tint hover:text-ink-text"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={lang.flag}
                      alt=""
                      width={20}
                      height={14}
                      className="h-3.5 w-5 object-cover"
                    />
                    <span>{lang.full}</span>
                  </div>
                  {active && <Check className="h-3.5 w-3.5 shrink-0" />}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
