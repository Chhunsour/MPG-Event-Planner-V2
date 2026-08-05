export interface ApiService {
  id: number;
  slug: string;
  category: string | null;
  title: string;
  short_description: string | null;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  image: string | null;
  image_alt: string | null;
  social_image: string | null;
  social_image_alt: string | null;
  is_featured: boolean;
  display_order: number;
  capabilities?: string[];
  updated_at: string | null;
}

export interface ApiGalleryImage {
  id: number;
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
}

export interface ApiProject {
  id: number;
  slug: string;
  category: string | null;
  title: string;
  description: string | null;
  short_description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  client_name: string | null;
  event_type: string | null;
  location: string | null;
  event_date: string | null;
  year: number | null;
  cover_image: string | null;
  cover_image_alt: string | null;
  social_image: string | null;
  social_image_alt: string | null;
  is_featured: boolean;
  display_order: number;
  service?: { slug: string; title: string } | null;
  technologies?: string[];
  gallery?: ApiGalleryImage[];
  features?: string[];
  updated_at: string | null;
}

export interface ApiBlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  category: string | null;
  tags: string[];
  cover_image: string | null;
  cover_image_alt: string | null;
  seo_title: string | null;
  seo_description: string | null;
  meta_description: string | null;
  social_image: string | null;
  social_image_alt: string | null;
  author_name: string | null;
  published_at: string | null;
  updated_at: string | null;
}
