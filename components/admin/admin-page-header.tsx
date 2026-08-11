import Link from 'next/link';
import type { ReactNode } from 'react';

export function AdminPageHeader({ eyebrow, title, description, action, backHref }: { eyebrow?: string; title: string; description?: string; action?: ReactNode; backHref?: string }) {
  if (backHref) {
    return (
      <div className="admin-page-head admin-page-head--compact">
        <div className="admin-page-head__title-row">
          <Link href={backHref} className="admin-back">← Back</Link>
          <span className="admin-divider">/</span>
          {eyebrow && <span className="admin-eyebrow-tag">{eyebrow}</span>}
          <h1 className="admin-title-compact">{title}</h1>
        </div>
        {action}
      </div>
    );
  }

  return (
    <div className="admin-page-head">
      <div>
        {eyebrow && <p>{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <span>{description}</span>}
      </div>
      {action}
    </div>
  );
}
