import { useForm } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import TextareaField from "@/components/admin/forms/TextareaField";
import SelectField from "@/components/admin/forms/SelectField";

interface Quotation {
  id: number;
  reference: string;
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

function FieldDisplay({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <strong className="block text-[11px] font-bold uppercase tracking-wider text-faint">{label}</strong>
      <span className="text-sm text-muted">{value || "—"}</span>
    </div>
  );
}

export default function MessagesShow({ quotation, statuses }: MessagesShowProps) {
  const { data, setData, put, processing } = useForm({
    status: quotation.status,
    internal_notes: quotation.internal_notes ?? "",
  });

  const isPhoneOnly = quotation.email.endsWith("@phone-only.invalid");

  return (
    <AdminLayout
      title={`Message ${quotation.reference}`}
      actions={
        <Link href="/admin/messages" className="border border-line-strong px-3 py-2 text-xs font-semibold text-muted hover:bg-paper-tint">
          Back to list
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Customer */}
        <div className="border border-line bg-paper">
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-base font-bold text-ink-text">Customer</h2>
          </div>
          <div className="grid gap-4 px-5 py-4 sm:grid-cols-2 lg:grid-cols-3">
            <FieldDisplay label="Name" value={quotation.customer_name} />
            <FieldDisplay label="Company" value={quotation.company_name} />
            <div>
              <strong className="block text-[11px] font-bold uppercase tracking-wider text-faint">Phone</strong>
              <a href={`tel:${quotation.phone}`} className="text-sm text-brand hover:underline">{quotation.phone}</a>
            </div>
            <div>
              <strong className="block text-[11px] font-bold uppercase tracking-wider text-faint">Email</strong>
              {isPhoneOnly ? (
                <span className="text-sm text-faint">Not provided — contact by phone</span>
              ) : (
                <a href={`mailto:${quotation.email}`} className="text-sm text-brand hover:underline">{quotation.email}</a>
              )}
            </div>
            <FieldDisplay label="Preferred contact" value={quotation.preferred_contact_method.charAt(0).toUpperCase() + quotation.preferred_contact_method.slice(1)} />
            <FieldDisplay label="Language" value={quotation.language.toUpperCase()} />
          </div>
        </div>

        {/* Event */}
        <div className="border border-line bg-paper">
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-base font-bold text-ink-text">Event</h2>
          </div>
          <div className="grid gap-4 px-5 py-4 sm:grid-cols-2 lg:grid-cols-3">
            <FieldDisplay label="Type" value={quotation.event_type.replace(/_/g, " ")} />
            <FieldDisplay label="Date" value={quotation.event_date ? new Date(quotation.event_date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "Not fixed"} />
            <FieldDisplay label="Location" value={quotation.event_location} />
            <FieldDisplay label="Guests" value={quotation.estimated_guests === "not_specified" ? "—" : quotation.estimated_guests} />
            <FieldDisplay label="Budget" value={quotation.estimated_budget === "not_specified" ? "—" : quotation.estimated_budget.replace(/_/g, " ")} />
          </div>
          <div className="px-5 pb-4">
            <strong className="block text-[11px] font-bold uppercase tracking-wider text-faint">Services requested</strong>
            {quotation.required_services && quotation.required_services.length > 0 ? (
              <span className="text-sm text-muted">{quotation.required_services.map((s) => s.replace(/_/g, " ")).join(", ")}</span>
            ) : (
              <span className="text-sm text-faint">None selected</span>
            )}
          </div>
          {quotation.additional_information && (
            <div className="px-5 pb-4">
              <strong className="block text-[11px] font-bold uppercase tracking-wider text-faint">Additional information</strong>
              <p className="mt-1 whitespace-pre-wrap text-sm text-muted">{quotation.additional_information}</p>
            </div>
          )}
        </div>

        {/* Internal */}
        <div className="border border-line bg-paper">
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-base font-bold text-ink-text">Internal</h2>
          </div>
          <div className="px-5 py-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                put(`/admin/messages/${quotation.id}`);
              }}
              className="space-y-4"
            >
              <div className="max-w-70">
                <SelectField
                  label="Status"
                  name="status"
                  value={data.status}
                  options={statuses.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
                  onChange={(v) => setData("status", v)}
                />
              </div>
              <TextareaField
                label="Internal notes"
                name="internal_notes"
                value={data.internal_notes}
                placeholder="Notes only visible here..."
                onChange={(v) => setData("internal_notes", v)}
                hint="Only visible here. Never shown to the customer."
              />
              <button
                type="submit"
                disabled={processing}
                className="bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-deep disabled:opacity-50"
              >
                Save
              </button>
            </form>
            <p className="mt-4 text-xs text-faint">
              Received {new Date(quotation.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })} at{" "}
              {new Date(quotation.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              {quotation.status_changed_at && (
                <> · status changed {new Date(quotation.status_changed_at).toLocaleDateString()}</>
              )}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
