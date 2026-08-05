interface SelectFieldProps {
  label: string;
  name: string;
  defaultValue?: string;
  value?: string;
  options: { value: string; label: string }[];
  error?: string;
  srOnly?: boolean;
  onChange?: (value: string) => void;
}

export default function SelectField({
  label,
  name,
  defaultValue,
  value,
  options,
  error,
  srOnly,
  onChange,
}: SelectFieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className={srOnly ? "sr-only" : "mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-muted"}
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        aria-invalid={error ? "true" : undefined}
        className={`w-full appearance-none border bg-paper bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%23475569%22%3E%3Cpath%20d%3D%22M5.293%207.293a1%201%200%20010-1.414l4-4a1%201%200%20011.414%200l4%204a1%201%200%2011-1.414%201.414L10%203.414%205.707%207.707a1%201%200%2001-1.414%200z%22%2F%3E%3C%2Fsvg%3E')] bg-size-[1.25rem] bg-position-[right_0.5rem_center] bg-no-repeat py-2 pl-3 pr-10 text-sm text-ink-text outline-none transition-colors focus:border-brand focus:shadow-[0_0_0_1px_var(--mpg-blue)] ${
          error ? "border-red-400" : "border-line-strong"
        }`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}
