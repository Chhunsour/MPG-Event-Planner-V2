interface LanguageTrackProps {
  en?: string | null;
  km?: string | null;
  zh?: string | null;
}

export default function LanguageTrack({ en, km, zh }: LanguageTrackProps) {
  const langs = [
    { code: "EN", ready: !!en },
    { code: "KM", ready: !!km },
    { code: "ZH", ready: !!zh },
  ];

  return (
    <div className="flex gap-1" title="Translation coverage">
      {langs.map((lang) => (
        <span
          key={lang.code}
          className={`px-1.5 py-0.5 text-[10px] font-bold ${
            lang.ready
              ? "bg-brand text-white"
              : "bg-paper-tint text-faint"
          }`}
        >
          {lang.code}
        </span>
      ))}
    </div>
  );
}
