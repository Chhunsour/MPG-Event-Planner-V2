import type { ReactNode } from 'react';

export function PageIntro({ eyebrow, title, description, children }: { eyebrow: string; title: string; description?: string; children?: ReactNode }) {
  return (
    <section className="page-intro">
      <div className="page-intro__glow" aria-hidden="true" />
      <div className="shell page-intro__grid">
        <div data-reveal>
          <p className="micro-label micro-label--light">{eyebrow}</p>
          <h1>{title}</h1>
        </div>
        <div className="page-intro__aside" data-reveal>
          {description && <p>{description}</p>}
          {children}
        </div>
      </div>
      <div className="page-intro__rule shell" aria-hidden="true"><span /></div>
    </section>
  );
}
