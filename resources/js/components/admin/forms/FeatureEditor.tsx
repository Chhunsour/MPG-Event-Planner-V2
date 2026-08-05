import { useState } from "react";
import { Plus } from "lucide-react";

interface FeatureEditorProps {
  name: string;
  langCode: string;
  features: string[];
  max?: number;
  canAdd?: boolean;
}

export default function FeatureEditor({
  name,
  langCode,
  features,
  max = 8,
  canAdd = true,
}: FeatureEditorProps) {
  const [items, setItems] = useState<string[]>(() => {
    const padded = [...features];
    while (padded.length < 3) padded.push("");
    return padded.slice(0, max);
  });

  const updateItem = (index: number, value: string) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const addItem = () => {
    if (items.length < max) {
      setItems((prev) => [...prev, ""]);
    }
  };

  return (
    <div className="mt-6 border-t border-line pt-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-muted">Features</h3>
          <p className="text-[11px] text-faint">Use short, concrete points.</p>
        </div>
        {canAdd && items.length < max && (
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-deep"
          >
            <Plus className="h-3.5 w-3.5" />
            Add feature
          </button>
        )}
      </div>
      <div className="space-y-2">
        {items.map((value, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="w-6 shrink-0 text-right text-xs font-bold text-faint">
              {String(i + 1).padStart(2, "0")}
            </span>
            <input
              type="text"
              name={`${name}[${i}][label_${langCode}]`}
              value={value}
              maxLength={160}
              placeholder="Feature or included deliverable"
              onChange={(e) => updateItem(i, e.target.value)}
              className="flex-1 border border-line-strong px-3 py-2 text-sm text-ink-text outline-none focus:border-brand"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
