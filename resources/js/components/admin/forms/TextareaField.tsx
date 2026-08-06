interface TextareaFieldProps {
  label: string;
  name: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  showCount?: boolean;
  error?: string;
  hint?: string;
  onChange?: (value: string) => void;
}

export default function TextareaField({
  label,
  name,
  value,
  defaultValue,
  placeholder,
  rows = 4,
  maxLength,
  showCount,
  error,
  hint,
  onChange,
}: TextareaFieldProps) {
  const currentValue = value !== undefined ? value : (defaultValue ?? "");
  const count = currentValue.length;
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-muted"
      >
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={currentValue}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        aria-invalid={error ? "true" : undefined}
        className={`w-full resize-y border px-3 py-2 text-sm leading-relaxed text-ink-text outline-none transition-colors hover:border-slate-400 focus:border-brand ${
          error ? "border-red-500" : "border-line-strong"
        }`}
      />
      <div className="mt-1 flex items-center justify-between">
        {hint ? <p className="text-[11px] text-faint">{hint}</p> : <span />}
        {showCount && maxLength && (
          <span className={`text-[11px] tabular-nums ${count > maxLength * 0.9 ? "text-red-500" : "text-faint"}`}>
            {count}/{maxLength}
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}
