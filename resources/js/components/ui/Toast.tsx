import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Check, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => dismiss(id), 3500);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Notification Container (Bottom Right Floating Position) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastBubble key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastBubble({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const config = {
    success: {
      icon: Check,
      badgeBg: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    },
    error: {
      icon: AlertCircle,
      badgeBg: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
    },
    info: {
      icon: Info,
      badgeBg: "bg-sky-500/20 text-sky-400 border border-sky-500/30",
    },
  };

  const { icon: Icon, badgeBg } = config[item.type];

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/95 px-4 py-2.5 shadow-2xl backdrop-blur-md transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-4 opacity-0 scale-95"
      }`}
      role="alert"
    >
      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${badgeBg}`}>
        <Icon className="h-3 w-3 stroke-[2.5]" />
      </div>

      <span className="text-xs font-semibold text-slate-100 tracking-wide pr-1">
        {item.message}
      </span>

      <button
        type="button"
        onClick={onDismiss}
        className="ml-auto rounded p-0.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        aria-label="Dismiss notification"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
