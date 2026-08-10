'use client';

import { useState } from 'react';
import { translateField } from '@/app/admin/actions';

export function TranslationButton({ source, target, targetField, format = 'text' }: { source: string; target: 'km' | 'zh'; targetField: string; format?: 'text' | 'html' }) {
  const [busy, setBusy] = useState(false);
  async function translate() {
    setBusy(true);
    try {
      const form = document.querySelector('form');
      const sourceValue = (form?.elements.namedItem(source) as HTMLInputElement | HTMLTextAreaElement | null)?.value ?? '';
      const result = await translateField(sourceValue, target, format);
      const field = form?.elements.namedItem(targetField) as HTMLInputElement | HTMLTextAreaElement | null;
      if (field) field.value = result.value;
    } finally {
      setBusy(false);
    }
  }
  return <button type="button" onClick={translate} disabled={busy} className="text-xs font-bold uppercase tracking-wider text-brand disabled:opacity-50">{busy ? 'Translating…' : `EN → ${target.toUpperCase()}`}</button>;
}
