'use client';

import Link from 'next/link';

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="admin-error" role="alert">
      <span aria-hidden="true">!</span>
      <p>Admin workspace</p>
      <h1>We couldn’t load this page</h1>
      <small>The connection may have been interrupted. Try again, or return to the dashboard.</small>
      <div><button type="button" className="btn btn-primary" onClick={reset}>Try again</button><Link href="/admin" className="btn btn-outline">Dashboard</Link></div>
    </section>
  );
}
