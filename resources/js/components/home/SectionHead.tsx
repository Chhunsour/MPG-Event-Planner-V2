import type { ReactNode, ComponentType } from "react";

type Variant = "stacked" | "split" | "inline";

interface SectionHeadProps {
  num?: string;
  icon?: ComponentType<{ className?: string }>;
  label: string;
  title: ReactNode;
  lead?: string;
  action?: ReactNode;
  variant?: Variant;
  dark?: boolean;
}

export default function SectionHead({
  icon: Icon,
  label,
  title,
  lead,
  action,
  variant = "stacked",
  dark = false,
}: SectionHeadProps) {
  const titleTone = dark ? "text-white" : "text-ink-text";
  const leadTone = dark ? "text-white/70" : "text-muted";
  const labelTone = dark ? "text-white/60" : "text-muted";

  return (
    <header>
      <div className={`sec-head ${dark ? "sec-head--dark" : ""}`}>
        {Icon && (
          <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-brand/10 text-brand dark:bg-white/10 dark:text-accent-bright" aria-hidden="true">
            <Icon className="h-3.5 w-3.5 shrink-0" />
          </span>
        )}
        <span className="sec-head__tick" aria-hidden="true" />
        <p className={`t-meta ${labelTone}`}>{label}</p>
      </div>

      {variant === "split" && (
        <div className="mt-6 grid gap-x-14 gap-y-4 lg:grid-cols-12">
          <h2 className={`t-display lg:col-span-6 ${titleTone}`}>{title}</h2>
          {lead && (
            <p className={`t-lead self-end lg:col-span-5 lg:col-start-8 ${leadTone}`}>
              {lead}
            </p>
          )}
        </div>
      )}

      {variant === "inline" && (
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className={`t-display ${titleTone}`}>{title}</h2>
          {action}
        </div>
      )}

      {variant === "stacked" && (
        <div className="mt-6">
          <h2 className={`t-display max-w-[20ch] ${titleTone}`}>{title}</h2>
          {lead && (
            <p className={`t-lead mt-4 max-w-[54ch] ${leadTone}`}>{lead}</p>
          )}
          {action && <div className="mt-6">{action}</div>}
        </div>
      )}
    </header>
  );
}
