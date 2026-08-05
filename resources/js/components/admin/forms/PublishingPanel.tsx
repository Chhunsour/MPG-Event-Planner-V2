import { type ReactNode } from "react";

interface PublishingPanelProps {
  isPublished: boolean;
  publishedAt?: string | null;
  updatedAt?: string | null;
  children?: ReactNode;
}

export default function PublishingPanel({
  isPublished,
  publishedAt,
  updatedAt,
  children,
}: PublishingPanelProps) {
  return (
    <div className="border-t-2 border-sky-600 bg-paper shadow-sm">
      <div className="flex items-center justify-between gap-3 p-5">
        <div>
          <h2 className="text-base font-bold text-ink-text">Publishing</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            {isPublished
              ? publishedAt
                ? `Scheduled for ${new Date(publishedAt).toLocaleDateString()}`
                : "Live on the website"
              : "Draft — not visible on the website"}
          </p>
          {updatedAt && (
            <p className="mt-1 text-[11px] text-faint">
              Last updated {new Date(updatedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 p-5 pt-0">
        {children}
      </div>
    </div>
  );
}
