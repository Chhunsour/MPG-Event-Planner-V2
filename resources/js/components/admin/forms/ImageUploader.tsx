import { useRef, useState } from "react";
import { Upload, Trash2, Zap } from "lucide-react";

interface ImageUploaderProps {
  name: string;
  removeName?: string;
  initialPath?: string | null;
  onFileChange?: (file: File | null) => void;
}

export default function ImageUploader({
  name,
  initialPath,
  onFileChange,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(initialPath ?? null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setFileName(file.name);
    onFileChange?.(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName(null);
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
        <div className="relative overflow-hidden rounded-lg border border-line bg-paper-tint">
          <img
            src={preview}
            alt=""
            className="max-h-48 w-full object-contain"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 flex items-center gap-1 rounded bg-paper/90 px-2 py-1 text-xs font-semibold text-red-600 shadow-sm hover:bg-paper"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line-strong bg-paper-tint text-faint transition-colors hover:border-brand hover:text-brand"
        >
          <Upload className="h-5 w-5" />
          <span className="text-xs font-medium">Click to upload image</span>
        </button>
      )}

      <div className="flex flex-col gap-1">
        {fileName && (
          <p className="text-xs font-medium text-ink-text">
            Selected: <span className="text-brand font-semibold">{fileName}</span>
          </p>
        )}
        <p className="flex items-center gap-1.5 text-[11px] text-faint">
          <Zap className="h-3 w-3 text-accent-bright" />
          <span>Auto-converts JPG / PNG to WebP to save data & speed up load time.</span>
        </p>
      </div>
    </div>
  );
}
