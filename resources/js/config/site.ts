export const siteConfig = {
  name: {
    en: "MPG Event Planner",
    km: "អឹមភីជី អ៊ីវេន ផ្លេនណឺ (MPG Event Planner)",
    zh: "MPG 活动策划 (MPG Event Planner)",
  },
  slogan: {
    en: "We Create, You Celebrate",
    km: "យើងបង្កើតឡើង អ្នកចូលរួមអបអរសាទរ",
    zh: "我们策划，您来庆祝",
  },
  description: {
    en: "MPG Event Planner is a Cambodia-based professional event planning and production company. We produce grand openings, corporate events, product launches, exhibitions and ceremonies.",
    km: "អឹមភីជី អ៊ីវេន ផ្លេនណឺ គឺជាក្រុមហ៊ុនរៀបចំ និងផលិតកម្មវិធីជាអាជីពនៅក្នុងប្រទេសកម្ពុជា។ យើងរៀបចំពិធីបើកសម្ពោធជាផ្លូវការ កម្មវិធីសាជីវកម្ម ការបើកដំណើរការផលិតផល ពិព័រណ៍ និងពិធីផ្សេងៗ។",
    zh: "MPG 活动策划是柬埔寨的专业活动策划与制作公司。我们承接开业典礼、企业活动、新品发布会、展览及各类仪式。",
  },
  contact: {
    phone: "[PHONE NUMBER]",
    phoneDisplay: "[PHONE NUMBER]",
    email: "[EMAIL ADDRESS]",
    address: {
      en: "[OFFICE ADDRESS], Phnom Penh, Cambodia",
      km: "[OFFICE ADDRESS], ភ្នំពេញ, ប្រទេសកម្ពុជា",
      zh: "[OFFICE ADDRESS], 金边, 柬埔寨",
    },
    telegram: "[TELEGRAM LINK]",
    facebook: "[FACEBOOK LINK]",
  },
  locales: ["en", "km", "zh"] as const,
  defaultLocale: "en" as const,
  url: import.meta.env.VITE_APP_URL || "http://localhost:8000",
};

export type Locale = (typeof siteConfig.locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  km: "ភាសាខ្មែរ",
  zh: "中文",
};

export const ogLocale: Record<Locale, string> = {
  en: "en_US",
  km: "km_KH",
  zh: "zh_CN",
};

export function isPlaceholder(value: string | undefined): boolean {
  return !value || /^\[.*\]$/.test(value.trim());
}
