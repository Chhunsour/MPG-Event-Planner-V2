import en from "@/locales/en.json";
import km from "@/locales/km.json";
import zh from "@/locales/zh.json";
import { siteConfig, type Locale } from "@/config/site";

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = {
  en,
  km: km as Dictionary,
  zh: zh as Dictionary,
};

export const getDictionary = (locale: Locale): Dictionary =>
  dictionaries[locale] ?? dictionaries[siteConfig.defaultLocale];
