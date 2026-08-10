'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

function DeleteSubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" className="admin-danger-button" disabled={pending} aria-disabled={pending}>{pending ? 'Deleting…' : 'Delete permanently'}</button>;
}

export function DeleteButton({ action, itemName }: { action: () => Promise<void>; itemName: string }) {
  const [open, setOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);

  return (
    <>
      <button type="button" className="admin-delete-trigger" onClick={() => setOpen(true)}>Delete</button>
      {open && (
        <div className="admin-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <div className="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description">
            <p>Delete content</p>
            <h2 id="delete-title">Delete “{itemName}”?</h2>
            <span id="delete-description">This removes the item and its uploaded images. This action cannot be undone.</span>
            <div>
              <button ref={cancelRef} type="button" className="btn btn-outline" onClick={() => setOpen(false)}>Cancel</button>
              <form action={action}><DeleteSubmitButton /></form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
