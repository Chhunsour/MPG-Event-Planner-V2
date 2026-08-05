import { useState, type ReactNode } from "react";

interface ConfirmButtonProps {
  onConfirm: () => void;
  message: string;
  children: ReactNode;
  className?: string;
  danger?: boolean;
}

export default function ConfirmButton({
  onConfirm,
  message,
  children,
  className = "",
  danger = false,
}: ConfirmButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="text-xs text-muted">{message}</span>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            setConfirming(false);
          }}
          className={`text-xs font-semibold ${danger ? "text-red-600 hover:text-red-700" : "text-brand hover:text-brand-deep"}`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-xs font-semibold text-muted hover:text-muted"
        >
          No
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className={className}
    >
      {children}
    </button>
  );
}
