import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

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
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-100 flex flex-col gap-2.5">
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

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };
  const Icon = icons[item.type];
  const styles = {
    success: { bg: "bg-white", border: "border-l-4 border-l-green-500", icon: "text-green-500", text: "text-gray-800" },
    error: { bg: "bg-white", border: "border-l-4 border-l-red-500", icon: "text-red-500", text: "text-gray-800" },
    info: { bg: "bg-white", border: "border-l-4 border-l-blue-500", icon: "text-blue-500", text: "text-gray-800" },
  };
  const s = styles[item.type];

  return (
    <div
      className={`flex items-center gap-3 rounded-lg ${s.bg} ${s.border} px-4 py-3 shadow-lg ring-1 ring-black/5 transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
      }`}
      role="alert"
    >
      <Icon className={`h-5 w-5 shrink-0 ${s.icon}`} aria-hidden="true" />
      <span className={`text-sm font-medium ${s.text}`}>{item.message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="ml-1 shrink-0 text-gray-400 transition-colors hover:text-gray-600"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
