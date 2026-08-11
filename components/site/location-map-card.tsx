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
      title: 'Event Location & Head Office',
      place: '371 Garage / MPG Production Studio',
      address: 'Street 371, Phnom Penh, Cambodia',
      button: 'Open in Google Maps',
    },
    km: {
      title: 'ទីតាំងរៀបចំកម្មវិធី និងការិយាល័យ',
      place: '371 Garage / MPG Production Studio',
      address: 'ផ្លូវ ៣៧១ ភ្នំពេញ កម្ពុជា',
      button: 'បើកក្នុង Google Maps',
    },
    zh: {
      title: '活动场地与总部地址',
      place: '371 Garage / MPG Production Studio',
      address: '柬埔寨金边 371 街',
      button: '在 Google Maps 中打开',
    },
  }[locale];

  return (
    <div className={`relative group bg-slate-900/90 border border-white/20 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-sky-500/50 ${className}`}>
      {/* Location Badge Header */}
      <div className="p-3.5 sm:p-4 bg-slate-950/80 border-b border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="truncate">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{labels.title}</h4>
            <p className="text-sm font-bold text-white truncate">{labels.place}</p>
          </div>
        </div>

        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center gap-1 shadow-md hover:scale-105"
        >
          <span>{labels.button}</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      {/* Embedded Interactive Google Map */}
      <div className="relative w-full h-[220px] sm:h-[260px] bg-slate-950">
        <iframe
          title="MPG Event Location Google Map"
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'contrast(1.05) saturate(1.1)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full opacity-90 hover:opacity-100 transition-opacity"
        />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 rounded-b-2xl" />
      </div>

      {/* Address Footer Bar */}
      <div className="px-4 py-2.5 bg-slate-950/90 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        <span className="truncate">{labels.address}</span>
        <span className="font-mono text-[10px] text-sky-400 shrink-0 ml-2">11.5204° N, 104.8981° E</span>
      </div>
    </div>
  );
}
