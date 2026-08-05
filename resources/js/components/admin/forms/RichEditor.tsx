import { useRef, useState, useEffect } from "react";
import { Bold, Italic, List, ListOrdered, Quote, Link as LinkIcon } from "lucide-react";

interface RichEditorProps {
  name: string;
  defaultValue?: string;
  placeholder?: string;
}

const TOOLBAR_ACTIONS = [
  { cmd: "bold", icon: Bold, label: "Bold" },
  { cmd: "italic", icon: Italic, label: "Italic" },
  { cmd: "insertUnorderedList", icon: List, label: "Bullet list" },
  { cmd: "insertOrderedList", icon: ListOrdered, label: "Numbered list" },
  { cmd: "formatBlock", value: "blockquote", icon: Quote, label: "Quote" },
] as const;

export default function RichEditor({ name, defaultValue = "", placeholder }: RichEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (ref.current && defaultValue && !ref.current.innerHTML) {
      ref.current.innerHTML = defaultValue;
    }
  }, [defaultValue]);

  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    syncValue();
    ref.current?.focus();
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      document.execCommand("createLink", false, url);
      syncValue();
    }
  };

  const syncValue = () => {
    if (hiddenRef.current && ref.current) {
      hiddenRef.current.value = ref.current.innerHTML;
    }
  };

  return (
    <div className={`border ${focused ? "border-brand" : "border-line-strong"}`}>
      <div className="flex flex-wrap items-center gap-1 border-b border-line bg-paper-tint px-2 py-1.5">
        {TOOLBAR_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.cmd}
              type="button"
              onClick={() => exec(action.cmd, "value" in action ? action.value : undefined)}
              className="flex h-7 w-7 items-center justify-center text-muted hover:bg-slate-200"
              title={action.label}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          );
        })}
        <button
          type="button"
          onClick={insertLink}
          className="flex h-7 w-7 items-center justify-center text-muted hover:bg-slate-200"
          title="Insert link"
        >
          <LinkIcon className="h-3.5 w-3.5" />
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          syncValue();
        }}
        onInput={syncValue}
        className="min-h-30 px-3 py-2 text-sm leading-relaxed text-ink-text outline-none [&_a]:text-brand [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-line-strong [&_blockquote]:pl-3 [&_blockquote]:italic [&_h2]:mt-4 [&_h2]:text-base [&_h2]:font-bold [&_h3]:mt-3 [&_h3]:text-sm [&_h3]:font-bold [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
      />
      <input ref={hiddenRef} type="hidden" name={name} defaultValue={defaultValue} />
      <style>{`
        [contenteditable][data-placeholder]:empty::before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
