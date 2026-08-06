import { useRef, useState } from "react";
import { Upload, Trash2, Zap, CheckCircle2 } from "lucide-react";

interface ImageUploaderProps {
  name: string;
  removeName?: string;
  initialPath?: string | null;
  onFileChange?: (file: File | null) => void;
}

interface WebpStats {
  originalSize: string;
  webpSize: string;
  bytesSaved: string;
  percentSaved: number;
}

function formatBytes(bytes: number): string {
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + " MB";
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + " KB";
  return bytes + " B";
}

export default function ImageUploader({
  name,
  initialPath,
  onFileChange,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(initialPath ?? null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [stats, setStats] = useState<WebpStats | null>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setFileName(file.name);
    onFileChange?.(file);

    // Compute WebP compression & exact size saved
    const origSize = file.size;
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const webpSize = blob.size;
              const saved = Math.max(0, origSize - webpSize);
              const pct = origSize > 0 ? Number(((saved / origSize) * 100).toFixed(1)) : 0;
              setStats({
                originalSize: formatBytes(origSize),
                webpSize: formatBytes(webpSize),
                bytesSaved: formatBytes(saved),
                percentSaved: pct,
              });
            }
          },
          "image/webp",
          0.82
        );
      }
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName(null);
    setStats(null);
    if (inputRef.current) inputRef.current.value = "";
    onFileChange?.(null);
  };

  return (
    <div className="grid gap-3">
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {preview ? (
        <div className="relative overflow-hidden rounded-xl border border-line bg-paper-tint shadow-sm">
          <img
            src={preview}
            alt=""
            className="max-h-52 w-full object-contain"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2.5 top-2.5 flex items-center gap-1.5 rounded-md bg-paper/90 px-2.5 py-1 text-xs font-semibold text-red-600 shadow-sm hover:bg-paper hover:text-red-700 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex min-h-36 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line-strong bg-paper-tint text-faint transition-colors hover:border-brand hover:text-brand"
        >
          <Upload className="h-6 w-6 text-brand" />
          <span className="text-xs font-bold text-ink-text">Click to upload cover image</span>
          <span className="text-[11px] text-faint">Supports JPG, PNG, GIF, WebP</span>
        </button>
      )}

      {/* Selected File Details & WebP Compression Stats */}
      <div className="space-y-2">
        {fileName && (
          <p className="text-xs font-medium text-ink-text">
            Selected File: <span className="text-brand font-bold">{fileName}</span>
          </p>
        )}

        {stats ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-emerald-200 bg-emerald-50/80 p-3 text-xs text-emerald-900 shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <div>
                <span className="font-bold text-emerald-950">WebP Compression Output: </span>
                <span className="font-mono text-emerald-800">
                  {stats.originalSize} ➔ <strong className="text-emerald-950 font-bold">{stats.webpSize}</strong>
                </span>
              </div>
            </div>
            <span className="self-start sm:self-center inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
              <Zap className="h-3 w-3" />
              {stats.percentSaved}% Data Saved ({stats.bytesSaved})
            </span>
          </div>
        ) : (
          <p className="flex items-center gap-1.5 text-[11px] text-faint">
            <Zap className="h-3 w-3 text-brand" />
            <span>Auto-converts JPG / PNG to WebP format to save payload size & accelerate page load.</span>
          </p>
        )}
      </div>
    </div>
  );
}
