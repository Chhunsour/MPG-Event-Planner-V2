export type Locale = 'en' | 'km' | 'zh';

export const locales: Locale[] = ['en', 'km', 'zh'];

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  km: 'ខ្មែរ',
  zh: '中文',
};

export type LocalizedText = Partial<Record<Locale, string>>;

type JsonPrimitive = string | number | boolean | null;
export type Json = JsonPrimitive | Json[] | { [key: string]: Json };

type ServiceRow = {
  id: number;
  slug: string;
  title: Json;
  description: Json;
  content: Json;
  cover_image: string | null;
  gallery: string[];
  display_order: number;
  is_published: boolean;
  published_at: string | null;
  seo_title: Json;
  seo_description: Json;
  image_alt: Json;
  tags: string[];
  created_at: string;
  updated_at: string;
};

type ProjectRow = {
  id: number;
  slug: string;
  title: Json;
  description: Json;
  content: Json;
  category: string | null;
  client_name: string | null;
  location: string | null;
  event_date: string | null;
  cover_image: string | null;
  gallery: string[];
  display_order: number;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
  seo_title: Json;
  seo_description: Json;
  image_alt: Json;
  tags: string[];
  created_at: string;
  updated_at: string;
};

type BlogPostRow = {
  id: number;
  slug: string;
  title: Json;
  excerpt: Json;
  content: Json;
  cover_image: string | null;
  category: string | null;
  tags: string[];
  author_name: string | null;
  is_published: boolean;
  published_at: string | null;
  seo_title: Json;
  seo_description: Json;
  image_alt: Json;
  created_at: string;
  updated_at: string;
};

type QuotationRow = {
  id: string;
  reference_code: string;
  customer_name: string;
  company_name: string | null;
  phone: string;
  email: string | null;
  preferred_contact_method: string;
  event_type: string;
  event_date: string | null;
  event_location: string;
  estimated_guests: string | null;
  estimated_budget: string | null;
  required_services: string[];
  additional_information: string | null;
  language: Locale;
  status: 'new' | 'contacted' | 'completed' | 'archived';
  is_read: boolean;
  internal_notes: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
};

type AnnouncementRow = {
  id: string;
  title: Json;
  link: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type TableDefinition<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDefinition<{
        id: string;
        display_name: string | null;
        is_admin: boolean;
        created_at: string;
        updated_at: string;
      }>;
      services: TableDefinition<ServiceRow>;
      projects: TableDefinition<ProjectRow>;
      blog_posts: TableDefinition<BlogPostRow>;
      quotations: TableDefinition<QuotationRow>;
      announcements: TableDefinition<AnnouncementRow>;
      translation_cache: TableDefinition<{
        cache_key: string;
        source_text: string;
        translated_text: string;
        target_locale: 'km' | 'zh';
        format: 'text' | 'html';
        created_at: string;
        updated_at: string;
      }>;
      site_settings: TableDefinition<{
        key: string;
        value: Json;
        updated_at: string;
      }>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Service = ServiceRow;
export type Project = ProjectRow;
export type BlogPost = BlogPostRow;
export type Quotation = QuotationRow;

