type Status = "published" | "draft" | "scheduled" | "archived" | "new" | "read";

const STATUS_STYLES: Record<Status, string> = {
  published: "bg-accent/15 text-accent-deep",
  draft: "bg-paper-tint text-muted",
  scheduled: "bg-brand-tint text-brand",
  archived: "bg-paper-tint text-faint",
  new: "bg-brand-tint text-brand",
  read: "bg-paper-tint text-muted",
};

export default function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase() as Status;
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  const styles = STATUS_STYLES[normalized] ?? "bg-paper-tint text-muted";

  return (
    <span className={`inline-block px-2 py-0.5 text-[11px] font-semibold ${styles}`}>
      {label}
    </span>
  );
}
