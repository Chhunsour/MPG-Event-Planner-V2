import { useState, type ReactNode } from "react";

interface LangTabsProps {
  group: string;
  children: (lang: { code: string; label: string }) => ReactNode;
}

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "km", label: "Khmer" },
  { code: "zh", label: "Chinese" },
];

export default function LangTabs({ group, children }: LangTabsProps) {
  const [active, setActive] = useState("en");

  return (
    <div>
      <div className="flex border-b border-line" role="tablist">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            role="tab"
            aria-selected={active === lang.code}
            aria-controls={`panel-${group}-${lang.code}`}
            id={`tab-${group}-${lang.code}`}
            onClick={() => setActive(lang.code)}
            className={`relative px-4 py-2.5 text-xs font-semibold transition-colors ${
              active === lang.code
                ? "text-brand"
                : "text-muted hover:text-muted"
            }`}
          >
            {lang.label}
            {active === lang.code && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-brand" />
            )}
          </button>
        ))}
      </div>
      {LANGUAGES.map((lang) => (
        <div
          key={lang.code}
          role="tabpanel"
          id={`panel-${group}-${lang.code}`}
          aria-labelledby={`tab-${group}-${lang.code}`}
          hidden={active !== lang.code}
        >
          {children(lang)}
        </div>
      ))}
    </div>
  );
}
