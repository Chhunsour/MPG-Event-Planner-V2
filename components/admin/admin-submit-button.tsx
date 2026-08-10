'use client';

import { useFormStatus } from 'react-dom';

export function AdminSubmitButton({ children, pendingLabel = 'Saving…', className = 'btn btn-primary' }: { children: React.ReactNode; pendingLabel?: string; className?: string }) {
  const { pending } = useFormStatus();
  return <button className={className} type="submit" disabled={pending} aria-disabled={pending}>{pending ? pendingLabel : children}</button>;
}
