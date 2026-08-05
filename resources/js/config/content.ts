import type { Locale } from "@/config/site";

export type ServiceKey =
  | "grand_opening"
  | "product_launch"
  | "groundbreaking"
  | "roadshow"
  | "seminar"
  | "rental";

export interface ServiceEntry {
  key: ServiceKey;
  num: string;
  image: string;
}

export const services: ServiceEntry[] = [
  { key: "grand_opening", num: "01", image: "/images/mpg/hero-main.webp" },
  { key: "product_launch", num: "02", image: "/images/mpg/project-5.webp" },
  { key: "groundbreaking", num: "03", image: "/images/mpg/service-groundbreaking.webp" },
  { key: "roadshow", num: "04", image: "/images/mpg/service-roadshow.webp" },
  { key: "seminar", num: "05", image: "/images/mpg/service-seminar.webp" },
  { key: "rental", num: "06", image: "/images/mpg/service-rental.webp" },
];

export function serviceHref(entry: ServiceEntry, locale: Locale | string) {
  return `/${locale}/services/${entry.key.replace("_", "-")}`;
}

export const heroImage = "/images/mpg/contact-quote.webp";
export const flagshipImage = "/images/mpg/project-1.webp";
export const aboutImage = "/images/mpg/service-rental.webp";
export const contactImage = "/images/mpg/service-seminar.webp";
export const teamImage = "/images/mpg/about-team.png";

export type WorkCategory =
  | "grand_opening"
  | "corporate"
  | "launch"
  | "exhibition"
  | "rental";

export interface WorkEntry {
  id: string;
  category: WorkCategory;
  image: string;
  key: string;
  span: "wide" | "tall" | "standard";
}

export const work: WorkEntry[] = [
  { id: "outdoor-grand-opening", category: "grand_opening", image: "/images/mpg/project-1.webp", key: "outdoor_opening", span: "wide" },
  { id: "indoor-grand-opening", category: "grand_opening", image: "/images/mpg/hero-main.webp", key: "indoor_opening", span: "standard" },
  { id: "corporate-ceremony", category: "corporate", image: "/images/mpg/contact-quote.webp", key: "corporate_ceremony", span: "standard" },
  { id: "product-launch", category: "launch", image: "/images/mpg/project-5.webp", key: "product_launch", span: "tall" },
  { id: "conference", category: "corporate", image: "/images/mpg/service-seminar.webp", key: "conference", span: "standard" },
  { id: "exhibition-booth", category: "exhibition", image: "/images/mpg/service-roadshow.webp", key: "exhibition", span: "standard" },
  { id: "groundbreaking", category: "grand_opening", image: "/images/mpg/service-groundbreaking.webp", key: "groundbreaking", span: "wide" },
  { id: "production-rig", category: "rental", image: "/images/mpg/service-rental.webp", key: "production", span: "standard" },
];
