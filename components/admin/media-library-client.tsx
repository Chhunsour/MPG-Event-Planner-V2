'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { AdminSubmitButton } from './admin-submit-button';
import { DeleteButton } from './delete-button';

type MediaFile = {
  name: string;
  url: string;
};

export function MediaUploader({ action }: { action: (formData: FormData) => Promise<void> }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedName(file.name);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedName(null);
      setPreviewUrl(null);
    }
  };

  return (
    <form action={action} encType="multipart/form-data" className="flex items-center gap-3 flex-wrap">
      {previewUrl && (
        <div className="w-10 h-10 rounded overflow-hidden relative border border-slate-200 bg-black/10 shrink-0">
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}

      <label className="admin-upload-label cursor-pointer flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-md bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
        <span>📷 {selectedName ? selectedName : 'Choose image file…'}</span>
        <input
          ref={fileInputRef}
          type="file"
          name="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          required
          className="sr-only"
        />
      </label>

      <AdminSubmitButton pendingLabel="Uploading…">Upload Asset</AdminSubmitButton>
    </form>
  );
}

export function MediaCard({ file, deleteAction }: { file: MediaFile; deleteAction: () => Promise<void> }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(file.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col group">
      <div className="relative aspect-square bg-slate-900 overflow-hidden">
        <Image
          src={file.url}
          alt={file.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>

      <footer className="p-3 flex flex-col gap-2 bg-slate-50 border-t border-slate-100 mt-auto">
        <span className="text-xs font-bold text-slate-800 truncate" title={file.name}>
          {file.name}
        </span>

        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={handleCopy}
            className="text-[11px] font-bold px-2 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded cursor-pointer transition-colors"
          >
            {copied ? '✓ Copied Link!' : '📋 Copy URL'}
          </button>

          <DeleteButton action={deleteAction} itemName={file.name} />
        </div>
      </footer>
    </article>
  );
}
