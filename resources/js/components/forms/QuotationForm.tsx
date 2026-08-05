import { useId, useRef, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { AlertCircle, ArrowRight } from "lucide-react";
import type { Locale } from "@/config/site";
import type { Dictionary } from "@/lib/i18n";
import BrandMark from "@/components/layout/BrandMark";

type FormDict = Dictionary["contact_form"];

interface QuotationFormProps {
  locale: Locale;
  dict: FormDict;
}

const EVENT_TYPES = [
  "grand_opening",
  "product_launch",
  "groundbreaking",
  "roadshow",
  "seminar",
  "rental",
  "other",
] as const;

type FieldName = "name" | "phone" | "email";

export default function QuotationForm({ locale, dict }: QuotationFormProps) {
  const uid = useId();
  const summaryRef = useRef<HTMLDivElement>(null);
  const [isPending, setIsPending] = useState(false);

  const page = usePage<{ url: string }>();
  const searchParams = new URL(page.url, window.location.origin).searchParams;
  const requestedType = searchParams.get("type");
  const initialType = (EVENT_TYPES as readonly string[]).includes(
    requestedType ?? "",
  )
    ? (requestedType as string)
    : "other";

  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    eventType: initialType,
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  const set = (key: keyof typeof values) => (value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key in errors) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as FieldName];
        return next;
      });
    }
  };

  const validate = () => {
    const next: Partial<Record<FieldName, string>> = {};
    if (!values.name.trim()) next.name = dict.validation.name_required;
    if (!values.phone.trim()) next.phone = dict.validation.phone_required;
    if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      next.email = dict.validation.invalid_email;
    setErrors(next);
    return next;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const found = validate();
    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setIsPending(true);

    router.post("/api/quotation", {
      customer_name: values.name,
      phone: values.phone,
      email: values.email,
      preferred_contact_method: "telegram",
      event_type: values.eventType,
      event_location: "To be confirmed",
      additional_information: values.message,
      language: locale,
      consent: true,
      website_url: honeypot,
    }, {
      onSuccess: () => {
        router.visit(`/${locale}/thank-you`);
      },
      onError: (errors) => {
        setIsPending(false);
        if (errors.email) {
          setErrors({ email: dict.validation.invalid_email });
        }
        setFormError(dict.validation.server_error);
        requestAnimationFrame(() => summaryRef.current?.focus());
      },
    });
  };

  const errorList = Object.entries(errors);
  const showSummary = errorList.length > 0 || formError !== null;

  return (
    <form onSubmit={handleSubmit} noValidate className="border border-line">
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input
          id={`${uid}-website`}
          type="text"
          name="website_url"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div
        ref={summaryRef}
        tabIndex={-1}
        role={showSummary ? "alert" : undefined}
        className={showSummary ? "border-b border-line" : ""}
      >
        {showSummary && (
          <div className="flex gap-3 bg-[#fdf2f0] p-5">
            <AlertCircle
              className="mt-0.5 h-5 w-5 shrink-0 text-[#c0392b]"
              aria-hidden="true"
            />
            <div>
              <p className="t-label text-[#a8321f]">
                {formError ?? dict.validation.summary}
              </p>
              {errorList.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {errorList.map(([field, message]) => (
                    <li key={field} className="t-body text-[#a8321f]">
                      {message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      <Group title={dict.steps.details}>
        <Field
          id={`${uid}-name`}
          label={dict.labels.name}
          required
          error={errors.name}
        >
          <input
            id={`${uid}-name`}
            className="field"
            type="text"
            autoComplete="name"
            placeholder={dict.placeholders.name}
            value={values.name}
            onChange={(e) => set("name")(e.target.value)}
            aria-invalid={errors.name ? "true" : undefined}
            aria-describedby={errors.name ? `${uid}-name-error` : undefined}
            disabled={isPending}
          />
        </Field>

        <Field
          id={`${uid}-phone`}
          label={dict.labels.phone}
          required
          help={dict.helpers.phone}
          error={errors.phone}
        >
          <input
            id={`${uid}-phone`}
            className="field"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder={dict.placeholders.phone}
            value={values.phone}
            onChange={(e) => set("phone")(e.target.value)}
            aria-invalid={errors.phone ? "true" : undefined}
            aria-describedby={`${uid}-phone-help${errors.phone ? ` ${uid}-phone-error` : ""}`}
            disabled={isPending}
          />
        </Field>

        <Field
          id={`${uid}-email`}
          label={dict.labels.email}
          optionalLabel={dict.optional}
          help={dict.helpers.email}
          error={errors.email}
        >
          <input
            id={`${uid}-email`}
            className="field"
            type="email"
            autoComplete="email"
            placeholder={dict.placeholders.email}
            value={values.email}
            onChange={(e) => set("email")(e.target.value)}
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={`${uid}-email-help${errors.email ? ` ${uid}-email-error` : ""}`}
            disabled={isPending}
          />
        </Field>
      </Group>

      <Group title={dict.steps.event} last>
        <Field
          id={`${uid}-event-type`}
          label={dict.labels.event_type}
          optionalLabel={dict.optional}
        >
          <select
            id={`${uid}-event-type`}
            className="field"
            value={values.eventType}
            onChange={(e) => set("eventType")(e.target.value)}
            disabled={isPending}
          >
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {dict.options.event_types[type]}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id={`${uid}-message`}
          label={dict.labels.additional}
          optionalLabel={dict.optional}
          help={dict.helpers.additional}
        >
          <textarea
            id={`${uid}-message`}
            className="field min-h-30 resize-y"
            rows={4}
            placeholder={dict.placeholders.additional}
            value={values.message}
            onChange={(e) => set("message")(e.target.value)}
            aria-describedby={`${uid}-message-help`}
            disabled={isPending}
          />
        </Field>
      </Group>

      <div className="flex flex-col gap-4 border-t border-line bg-paper-tint p-6 sm:flex-row sm:items-center sm:justify-between lg:p-8">
        <p className="t-body text-muted">{dict.reply_note}</p>
        <button
          type="submit"
          className="btn btn-primary shrink-0"
          disabled={isPending}
        >
          {isPending ? dict.submitting : dict.submit}
          {!isPending && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>
    </form>
  );
}

function Group({
  title,
  children,
  last = false,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <section className={last ? "" : "border-b border-line"}>
      <h3 className="flex items-center gap-3 border-b border-line bg-paper-tint px-6 py-3.5 lg:px-8">
        <BrandMark className="h-4 w-4" />
        <span className="t-label text-ink-text">{title}</span>
      </h3>
      <div className="grid gap-5 p-6 sm:grid-cols-2 lg:p-8">{children}</div>
    </section>
  );
}

function Field({
  id,
  label,
  children,
  required = false,
  optionalLabel,
  help,
  error,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  required?: boolean;
  optionalLabel?: string;
  help?: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="t-label mb-2 block text-ink-text">
        {label}{" "}
        {required ? (
          <span className="text-[#c0392b]" aria-hidden="true">
            *
          </span>
        ) : (
          optionalLabel && (
            <span className="font-normal normal-case tracking-normal text-faint">
              ({optionalLabel})
            </span>
          )
        )}
      </label>
      {children}
      {help && (
        <p id={`${id}-help`} className="t-body mt-1.5 text-faint">
          {help}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          className="t-body mt-1.5 font-semibold text-[#c0392b]"
        >
          {error}
        </p>
      )}
    </div>
  );
}
