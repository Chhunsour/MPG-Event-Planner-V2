export function SectionHeading({ index, eyebrow, title, inverse = false }: { index?: string; eyebrow: string; title: string; inverse?: boolean }) {
  return (
    <div className={`section-heading ${inverse ? 'section-heading--inverse' : ''}`} data-reveal>
      <div className="section-heading__meta">
        {index && <span>{index}</span>}
        <i aria-hidden="true" />
        <p>{eyebrow}</p>
      </div>
      <h2>{title}</h2>
    </div>
  );
}
