import React from 'react';
import type { Locale } from '@/lib/types';

export type LocationMapCardProps = {
  locale?: Locale;
  mapUrl?: string;
  className?: string;
};

export function LocationMapCard({
  locale = 'en',
  mapUrl = 'https://maps.app.goo.gl/rh4vjfgoLsEMdvnV7',
  className = '',
}: LocationMapCardProps) {
  const embedUrl = 'https://maps.google.com/maps?q=11.5203646,104.8980894&hl=en&z=15&output=embed';

  const labels = {
    en: {
      title: '371 Garage / MPG Production Studio',
      address: 'Street 371, Phnom Penh, Cambodia',
      button: 'Open in Google Maps',
    },
    km: {
      title: '371 Garage / MPG Production Studio',
      address: 'ផ្លូវ ៣៧១ ភ្នំពេញ កម្ពុជា',
      button: 'បើកក្នុង Google Maps',
    },
    zh: {
      title: '371 Garage / MPG Production Studio',
      address: '柬埔寨金边 371 街',
      button: '在 Google Maps 中打开',
    },
  }[locale];

  return (
    <div className={`overflow-hidden bg-[#0a1926] border border-white/10 rounded-xl shadow-lg ${className}`}>
      {/* Header Bar */}
      <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0a1926]">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">{labels.title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{labels.address}</p>
        </div>
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white text-slate-900 hover:bg-slate-100 text-xs font-semibold rounded-lg transition-colors shadow-sm"
        >
          <span>{labels.button}</span>
          <span aria-hidden="true" className="text-xs">↗</span>
        </a>
      </div>

      {/* Standard Clean Google Map */}
      <div className="w-full h-[240px] sm:h-[280px]">
        <iframe
          title="MPG Event Location Google Map"
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}




