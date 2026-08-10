import type { ReactNode } from 'react';

export function PageIntro({ eyebrow, title, description, children }: { eyebrow: string; title: string; description?: string; children?: ReactNode }) {
  return (
    <section className="bg-[var(--paper-tint)] py-16 lg:py-24">
      <div className="shell grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
        <div><p className="t-meta text-[var(--mpg-green-deep)]">{eyebrow}</p><h1 className="t-display-lg mt-4 max-w-3xl">{title}</h1></div>
        <div>{description && <p className="t-lead max-w-xl text-[var(--text-muted)]">{description}</p>}{children}</div>
      </div>
    </section>
  );
}

