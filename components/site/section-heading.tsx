export function SectionHeading({ index, eyebrow, title, inverse = false }: { index?: string; eyebrow: string; title: string; inverse?: boolean }) {
  return (
    <div className={`sec-head ${inverse ? 'sec-head--dark' : ''}`}>
      {index && <span className="sec-head__num">{index}</span>}
      <span className="sec-head__tick" />
      <div>
        <p className={`t-meta ${inverse ? 'text-[var(--mpg-green-bright)]' : 'text-[var(--mpg-green-deep)]'}`}>{eyebrow}</p>
        <h2 className={`t-display-sm mt-2 ${inverse ? 'text-white' : 'text-[var(--text)]'}`}>{title}</h2>
      </div>
    </div>
  );
}
