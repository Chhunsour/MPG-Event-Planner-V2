import Link from 'next/link';
import type { ReactNode } from 'react';

export function AdminPageHeader({ eyebrow, title, description, action, backHref }: { eyebrow?: string; title: string; description?: string; action?: ReactNode; backHref?: string }) {
  return (
    <div className="admin-page-head">
      <div>
        {backHref && <Link href={backHref} className="admin-back">← Back</Link>}
        {eyebrow && <p>{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <span>{description}</span>}
      </div>
      {action}
    </div>
  );
}
