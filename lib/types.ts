import type { CategoryKey } from "./categories";

export type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: CategoryKey;
  image_url: string | null;
  published: boolean;
  featured_in_carousel: boolean;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = {
  id: number;
  school_name: string;
  logo_url: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  facebook_page_url: string | null;
  facebook_group_url: string | null;
  about_text: string | null;
  developer_name: string | null;
  developer_email: string | null;
  developer_phone: string | null;
  developer_bio: string | null;
  developer_photo_url: string | null;
  dedication_text: string | null;
  updated_at: string;
};

export type NewsImage = {
  id: string;
  news_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      news: {
        Row: NewsItem;
        Insert: Partial<NewsItem> & {
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          category: CategoryKey;
        };
        Update: Partial<NewsItem>;
        Relationships: [];
      };
      site_settings: {
        Row: SiteSettings;
        Insert: Partial<SiteSettings>;
        Update: Partial<SiteSettings>;
        Relationships: [];
      };
      news_images: {
        Row: NewsImage;
        Insert: Partial<NewsImage> & {
          news_id: string;
          image_url: string;
        };
        Update: Partial<NewsImage>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
