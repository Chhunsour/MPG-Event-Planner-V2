import { useRef, useState } from "react";
import { Upload, Trash2 } from "lucide-react";

interface ImageUploaderProps {
  name: string;
  removeName?: string;
  initialPath?: string | null;
  initialAlt?: string;
  altName?: string;
  altValue?: string;
  onFileChange?: (file: File | null) => void;
  onAltChange?: (value: string) => void;
}

export default function ImageUploader({
  name,
  initialPath,
  initialAlt,
  altName,
  altValue,
  onFileChange,
  onAltChange,
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
        <div className="relative overflow-hidden border border-line bg-paper-tint">
          <img
            src={preview}
            alt={initialAlt ?? ""}
            className="max-h-64 w-full object-contain"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 flex items-center gap-1 bg-paper/90 px-2 py-1 text-xs font-semibold text-red-600 shadow-sm hover:bg-paper"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex min-h-40 flex-col items-center justify-center gap-2 border border-dashed border-line-strong bg-paper-tint text-faint transition-colors hover:border-brand hover:text-brand"
        >
          <Upload className="h-6 w-6" />
          <span className="text-sm font-medium">Click to upload an image</span>
        </button>
      )}

      {fileName && (
        <p className="text-xs text-muted">{fileName}</p>
      )}

      {altName && (
        <div>
          <label
            htmlFor={altName}
            className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-muted"
          >
            Alt text
          </label>
          <input
            id={altName}
            name={altName}
            type="text"
            value={altValue ?? initialAlt ?? ""}
            placeholder="Describe the image for accessibility"
            onChange={onAltChange ? (e) => onAltChange(e.target.value) : undefined}
            className="w-full border border-line-strong px-3 py-2 text-sm text-ink-text outline-none focus:border-brand"
          />
        </div>
      )}
    </div>
  );
}
