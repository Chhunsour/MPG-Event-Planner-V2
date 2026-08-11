'use client';

import { useState } from 'react';
import type { MouseEvent } from 'react';

async function fetchTranslation(source: string, target: 'km' | 'zh', format: 'text' | 'html'): Promise<string> {
  const res = await fetch('/api/admin/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source, target, format }),
  });
  const data = (await res.json()) as { value?: string; error?: string };
  if (!res.ok || data.error) throw new Error(data.error ?? 'Translation failed');
  return data.value ?? '';
}

export function TranslationButton({ source, target, targetField, format = 'text' }: { source: string; target: 'km' | 'zh'; targetField: string; format?: 'text' | 'html' }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function translate(event: MouseEvent<HTMLButtonElement>) {
    const form = event.currentTarget.closest('form');
    setBusy(true);
    setError(null);
    try {
      const sourceValue = (form?.elements.namedItem(source) as HTMLInputElement | HTMLTextAreaElement | null)?.value ?? '';
      if (!sourceValue.trim()) return;
      const translatedText = await fetchTranslation(sourceValue, target, format);
      const field = form?.elements.namedItem(targetField) as HTMLInputElement | HTMLTextAreaElement | null;
      if (field) {
        field.value = translatedText;
        field.dispatchEvent(new Event('input', { bubbles: true }));
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Translation failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="admin-translation-btn-wrapper">
      <button type="button" onClick={translate} disabled={busy} className="admin-translate-btn">
        {busy ? 'Translating…' : `EN → ${target.toUpperCase()}`}
      </button>
      {error && <span className="admin-translation-error" title={error}>⚠️ {error}</span>}
    </span>
  );
}

export function AutoTranslateAllButton() {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function translateAll(event: MouseEvent<HTMLButtonElement>) {
    const form = event.currentTarget.closest('form');
    if (!form) return;
    setBusy(true);

    const fieldsToTranslate: Array<{ source: string; targetKM: string; targetZH: string; format: 'text' | 'html' }> = [
      { source: 'title_en', targetKM: 'title_km', targetZH: 'title_zh', format: 'text' },
      { source: 'excerpt_en', targetKM: 'excerpt_km', targetZH: 'excerpt_zh', format: 'html' },
      { source: 'description_en', targetKM: 'description_km', targetZH: 'description_zh', format: 'html' },
      { source: 'content_en', targetKM: 'content_km', targetZH: 'content_zh', format: 'html' },
      { source: 'seo_title_en', targetKM: 'seo_title_km', targetZH: 'seo_title_zh', format: 'text' },
      { source: 'seo_description_en', targetKM: 'seo_description_km', targetZH: 'seo_description_zh', format: 'html' },
      { source: 'image_alt_en', targetKM: 'image_alt_km', targetZH: 'image_alt_zh', format: 'text' },
    ];

    let count = 0;
    const active = fieldsToTranslate.filter((item) => {
      const val = (form.elements.namedItem(item.source) as HTMLInputElement | HTMLTextAreaElement | null)?.value ?? '';
      return Boolean(val.trim());
    });

    if (active.length === 0) {
      setStatus('Write English fields first!');
      setBusy(false);
      setTimeout(() => setStatus(null), 3000);
      return;
    }

    try {
      for (const item of active) {
        const sourceVal = (form.elements.namedItem(item.source) as HTMLInputElement | HTMLTextAreaElement | null)?.value ?? '';
        if (!sourceVal.trim()) continue;

        count++;
        setStatus(`Translating field ${count}/${active.length}…`);

        const [kmValue, zhValue] = await Promise.all([
          fetchTranslation(sourceVal, 'km', item.format),
          fetchTranslation(sourceVal, 'zh', item.format),
        ]);

        const kmField = form.elements.namedItem(item.targetKM) as HTMLInputElement | HTMLTextAreaElement | null;
        if (kmField && kmValue) {
          kmField.value = kmValue;
          kmField.dispatchEvent(new Event('input', { bubbles: true }));
        }

        const zhField = form.elements.namedItem(item.targetZH) as HTMLInputElement | HTMLTextAreaElement | null;
        if (zhField && zhValue) {
          zhField.value = zhValue;
          zhField.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
      setStatus('✨ Auto-translation complete!');
    } catch (err) {
      console.error(err);
      setStatus('Error during translation');
    } finally {
      setBusy(false);
      setTimeout(() => setStatus(null), 4000);
    }
  }

  return (
    <div className="admin-auto-translate-all">
      <button type="button" onClick={translateAll} disabled={busy} className="btn btn-outline admin-auto-translate-all-btn flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span>{busy ? status ?? 'Translating all…' : 'Auto Translate All (KM & ZH)'}</span>
      </button>
      {!busy && status && <span className="admin-auto-translate-status">{status}</span>}
    </div>
  );
}
