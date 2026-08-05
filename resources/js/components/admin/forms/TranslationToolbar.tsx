import { useState } from "react";
import { Languages, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

interface TranslationToolbarProps {
  entity: "service" | "project" | "blog";
  entityId?: number;
  fields: Record<string, string>;
  onTranslated: (results: Record<string, Record<string, string>>) => void;
}


export default function TranslationToolbar({
  entity,
  entityId,
  fields,
  onTranslated,
}: TranslationToolbarProps) {
  const [status, setStatus] = useState<"idle" | "translating" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    setStatus("translating");
    setError(null);

    try {
      const res = await fetch("/admin/translations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ?? "",
        },
        body: JSON.stringify({
          entity,
          entity_id: entityId,
          field: "all",
          fields,
        }),
      });

      const data = await res.json();

      if (res.ok || res.status === 207) {
        setStatus("done");
        if (data.data) {
          onTranslated(data.data);
        }
      } else {
        setStatus("error");
        setError(data.message ?? "Translation failed");
      }
    } catch {
      setStatus("error");
      setError("Network error");
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 border-l-[3px] border-sky-600 bg-brand-tint px-4 py-3">
      <div className="flex items-center gap-2">
        <Languages className="h-4 w-4 text-brand" />
        <div>
          <strong className="text-sm font-semibold text-muted">Translations</strong>
          <p className="text-[11px] text-muted">
            English is the source language. Review translations before publishing.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {status === "done" && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-accent">
            <CheckCircle2 className="h-3.5 w-3.5" />
            READY
          </span>
        )}
        {status === "error" && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-red-500">
            <AlertCircle className="h-3.5 w-3.5" />
            FAILED
          </span>
        )}
        {status === "translating" && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-brand">
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            TRANSLATING
          </span>
        )}
        <button
          type="button"
          onClick={handleTranslate}
          disabled={status === "translating"}
          className="border border-line-strong bg-paper px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-sky-400 hover:text-brand disabled:opacity-50"
        >
          {status === "error" ? "Retry translation" : "Translate all"}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
