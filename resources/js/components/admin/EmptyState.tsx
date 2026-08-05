import { type ReactNode } from "react";

interface EmptyStateProps {
  mark: string;
  title: string;
  description: string;
  action?: ReactNode;
  small?: boolean;
}

export default function EmptyState({ mark, title, description, action, small }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${small ? "py-8" : "py-16"}`}>
      <div className="mb-4 flex h-12 w-12 items-center justify-center bg-paper-tint text-[10px] font-bold tracking-wider text-faint">
        {mark}
      </div>
      <h2 className="text-lg font-bold text-ink-text">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
