import { type ReactNode } from "react";

interface TextFieldProps {
  label: string;
  name: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  showCount?: boolean;
  type?: string;
  error?: string;
  hint?: ReactNode;
  autoFocus?: boolean;
  onChange?: (value: string) => void;
}

export default function TextField({
  label,
  name,
  value,
  defaultValue,
  placeholder,
  required,
  maxLength,
  showCount,
  type = "text",
  error,
  hint,
  autoFocus,
  onChange,
}: TextFieldProps) {
  const currentValue = value !== undefined ? value : (defaultValue ?? "");
  const count = currentValue.length;
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-muted"
      >
        {label}
        {required && <span className="ml-1 text-[10px] text-red-500">Required</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={currentValue}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        autoFocus={autoFocus}
        autoComplete={type === "password" ? "current-password" : undefined}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        aria-invalid={error ? "true" : undefined}
        className={`w-full border px-3 py-2 text-sm text-ink-text outline-none transition-colors hover:border-slate-400 focus:border-brand ${
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
