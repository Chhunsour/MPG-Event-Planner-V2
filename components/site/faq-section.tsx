import React from 'react';
import { FaqJsonLd, type FaqItem } from '@/components/seo/json-ld';

export type FaqSectionProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  faqs: FaqItem[];
};

export function FaqSection({ eyebrow = 'FAQ', title, subtitle, faqs }: FaqSectionProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="faq-section py-16 bg-slate-950 text-white border-t border-white/10">
      <FaqJsonLd faqs={faqs} />
      <div className="shell max-w-4xl mx-auto">
        <div className="text-center mb-12">
          {eyebrow && <span className="micro-label micro-label--light mb-2 inline-block">{eyebrow}</span>}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">{title}</h2>
          {subtitle && <p className="text-slate-400 text-sm max-w-xl mx-auto">{subtitle}</p>}
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group bg-slate-900/60 border border-white/10 rounded-xl p-5 transition-all [&[open]]:bg-slate-900 [&[open]]:border-sky-500/40"
            >
              <summary className="font-semibold text-base sm:text-lg text-slate-100 cursor-pointer flex items-center justify-between gap-4 list-none group-open:text-sky-400">
                <span>{faq.question}</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform text-xl flex-shrink-0">
                  ↓
                </span>
              </summary>
              <div className="mt-3 pt-3 border-t border-white/5 text-slate-300 text-sm leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
