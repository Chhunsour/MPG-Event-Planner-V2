import { useForm, Link } from "@inertiajs/react";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MessageSquare,
  Globe,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Tag,
  Clock,
  Save,
  ShieldCheck,
} from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import TextareaField from "@/components/admin/forms/TextareaField";
import SelectField from "@/components/admin/forms/SelectField";

interface Quotation {
  id: number;
  reference?: string | null;
  customer_name: string;
  company_name: string | null;
  phone: string;
  email: string;
  preferred_contact_method: string;
  language: string;
  event_type: string;
  event_date: string | null;
  event_location: string;
  estimated_guests: string;
  estimated_budget: string;
  required_services: string[] | null;
  additional_information: string | null;
  status: string;
  internal_notes: string | null;
  created_at: string;
  status_changed_at: string | null;
}

interface MessagesShowProps {
  quotation: Quotation;
  statuses: string[];
}

export default function MessagesShow({ quotation, statuses }: MessagesShowProps) {
  const refCode = quotation.reference || `MPG-${String(quotation.id).padStart(6, "0")}`;

  const { data, setData, put, processing } = useForm({
    status: quotation.status,
    internal_notes: quotation.internal_notes ?? "",
  });

  const isPhoneOnly = quotation.email?.endsWith("@phone-only.invalid");

  return (
    <AdminLayout
      title={`Quotation Request #${refCode}`}
      actions={
        <Link
          href="/admin/messages"
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-paper px-3.5 py-2 text-xs font-semibold text-ink-text shadow-sm transition-all hover:bg-paper-tint hover:border-brand/40"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Messages</span>
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Customer & Event Details */}
        <div className="space-y-6 lg:col-span-8">
          {/* Customer Details Card */}
          <div className="rounded-xl border border-line bg-paper shadow-sm">
            <div className="flex items-center gap-3 border-b border-line px-6 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <User className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-ink-text">Customer Information</h2>
                <p className="text-xs text-muted">Client contact details and communication preferences</p>
              </div>
            </div>

            <div className="grid gap-6 p-6 sm:grid-cols-2">
              <div>
                <strong className="block text-xs font-bold uppercase tracking-wider text-faint mb-1">Customer Name</strong>
                <span className="text-sm font-semibold text-ink-text">{quotation.customer_name}</span>
              </div>

              <div>
                <strong className="block text-xs font-bold uppercase tracking-wider text-faint mb-1">Company Name</strong>
                <span className="text-sm text-muted">{quotation.company_name || "—"}</span>
              </div>

              <div>
                <strong className="block text-xs font-bold uppercase tracking-wider text-faint mb-1">Phone Number</strong>
                <a href={`tel:${quotation.phone}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>{quotation.phone}</span>
                </a>
              </div>

              <div>
                <strong className="block text-xs font-bold uppercase tracking-wider text-faint mb-1">Email Address</strong>
                {isPhoneOnly ? (
                  <span className="text-sm text-faint italic">Phone contact preferred</span>
                ) : (
                  <a href={`mailto:${quotation.email}`} className="inline-flex items-center gap-1.5 text-sm text-brand hover:underline">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span>{quotation.email}</span>
                  </a>
                )}
              </div>

              <div>
                <strong className="block text-xs font-bold uppercase tracking-wider text-faint mb-1">Preferred Contact Method</strong>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-paper-tint px-2.5 py-1 text-xs font-medium text-ink-text">
                  <MessageSquare className="h-3 w-3 text-brand" />
                  <span>{quotation.preferred_contact_method ? quotation.preferred_contact_method.toUpperCase() : "—"}</span>
                </span>
              </div>

              <div>
                <strong className="block text-xs font-bold uppercase tracking-wider text-faint mb-1">Language</strong>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-paper-tint px-2.5 py-1 text-xs font-medium text-ink-text">
                  <Globe className="h-3 w-3 text-accent" />
                  <span>{quotation.language ? (quotation.language.toLowerCase() === "km" ? "KH" : quotation.language.toUpperCase()) : "EN"}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Event Details Card */}
          <div className="rounded-xl border border-line bg-paper shadow-sm">
            <div className="flex items-center gap-3 border-b border-line px-6 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Calendar className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-ink-text">Event Specification</h2>
                <p className="text-xs text-muted">Requested event parameters and service selections</p>
              </div>
            </div>

            <div className="grid gap-6 p-6 sm:grid-cols-3">
              <div>
                <strong className="block text-xs font-bold uppercase tracking-wider text-faint mb-1">Event Type</strong>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-brand/10 px-2.5 py-1 text-xs font-bold capitalize text-brand">
                  <Tag className="h-3 w-3" />
                  <span>{quotation.event_type ? quotation.event_type.replace(/_/g, " ") : "Other"}</span>
                </span>
              </div>

              <div>
                <strong className="block text-xs font-bold uppercase tracking-wider text-faint mb-1">Event Date</strong>
                <span className="text-sm font-medium text-ink-text">
                  {quotation.event_date
                    ? new Date(quotation.event_date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
                    : "Not fixed"}
                </span>
              </div>

              <div>
                <strong className="block text-xs font-bold uppercase tracking-wider text-faint mb-1">Location</strong>
                <span className="inline-flex items-center gap-1 text-sm text-muted">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-faint" />
                  <span>{quotation.event_location || "To be confirmed"}</span>
                </span>
              </div>

              <div>
                <strong className="block text-xs font-bold uppercase tracking-wider text-faint mb-1">Estimated Guests</strong>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-text">
                  <Users className="h-3.5 w-3.5 text-faint" />
                  <span>{quotation.estimated_guests === "not_specified" ? "—" : quotation.estimated_guests}</span>
                </span>
              </div>

              <div>
                <strong className="block text-xs font-bold uppercase tracking-wider text-faint mb-1">Budget Range</strong>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-text">
                  <DollarSign className="h-3.5 w-3.5 text-faint" />
                  <span>{quotation.estimated_budget === "not_specified" ? "—" : quotation.estimated_budget.replace(/_/g, " ")}</span>
                </span>
              </div>
            </div>

            {/* Requested Services Badges */}
            <div className="border-t border-line px-6 py-4">
              <strong className="block text-xs font-bold uppercase tracking-wider text-faint mb-2">Requested Services</strong>
              {quotation.required_services && quotation.required_services.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {quotation.required_services.map((svc, idx) => (
                    <span key={idx} className="rounded-md border border-line bg-paper-tint px-3 py-1 text-xs font-semibold text-ink-text">
                      {svc.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-faint italic">No specific services selected</span>
              )}
            </div>

            {/* Additional Information Box */}
            {quotation.additional_information && (
              <div className="border-t border-line px-6 py-4">
                <strong className="block text-xs font-bold uppercase tracking-wider text-faint mb-2">Additional Client Notes</strong>
                <div className="rounded-lg border border-line bg-paper-tint p-4 text-sm leading-relaxed text-muted">
                  <p className="whitespace-pre-wrap">{quotation.additional_information}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Internal Management */}
        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-xl border border-line bg-paper shadow-sm">
            <div className="flex items-center gap-3 border-b border-line px-6 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-text/10 text-ink-text">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-ink-text">Internal Workflow</h2>
                <p className="text-xs text-muted">Manage status and internal team notes</p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                put(`/admin/messages/${quotation.id}`);
              }}
              className="p-6 space-y-5"
            >
              <div>
                <SelectField
                  label="Request Status"
                  name="status"
                  value={data.status}
                  options={statuses.map((s) => ({
                    value: s,
                    label: s.replace(/_/g, " ").charAt(0).toUpperCase() + s.replace(/_/g, " ").slice(1),
                  }))}
                  onChange={(v) => setData("status", v)}
                />
              </div>

              <div>
                <TextareaField
                  label="Internal Staff Notes"
                  name="internal_notes"
                  value={data.internal_notes}
                  placeholder="Record call logs, quote details, or staff assignments..."
                  onChange={(v) => setData("internal_notes", v)}
                  hint="Visible to admin team only. Never displayed to clients."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-xs font-bold text-white shadow transition-all hover:bg-brand-deep disabled:opacity-50 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Internal Updates</span>
                </button>
              </div>
            </form>

            <div className="border-t border-line px-6 py-4 text-xs text-faint">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Received {new Date(quotation.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })} at{" "}
                  {new Date(quotation.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              {quotation.status_changed_at && (
                <p className="mt-1 text-[11px] text-faint">
                  Status last modified: {new Date(quotation.status_changed_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
