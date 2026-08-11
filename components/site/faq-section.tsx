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
    <section className="faq-section py-20 bg-[#061421] text-white border-t border-white/10">
      <FaqJsonLd faqs={faqs} />
      <div className="shell max-w-4xl mx-auto">
        <div className="text-center mb-12">
          {eyebrow && (
            <p className="micro-label micro-label--light justify-center mb-3">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group bg-[#0b2031]/70 border border-white/10 rounded-xl p-5 sm:p-6 transition-all duration-200 hover:border-white/25 [&[open]]:bg-[#0b2031] [&[open]]:border-white/20 shadow-md"
            >
              <summary className="font-semibold text-base sm:text-lg text-white cursor-pointer flex items-center justify-between gap-4 list-none group-open:text-white select-none">
                <span className="pr-2">{faq.question}</span>
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-white/70 group-open:bg-[#58d46b]/15 group-open:text-[#58d46b] group-open:border-[#58d46b]/30 transition-colors">
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div className="mt-4 pt-4 border-t border-white/10 text-slate-300 text-sm sm:text-base leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

