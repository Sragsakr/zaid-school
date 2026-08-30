import type { CategoryKey } from "./categories";

export type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: CategoryKey;
  image_url: string | null;
  image_alt: string | null;
  published: boolean;
  featured_in_carousel: boolean;
  pinned: boolean;
  priority: number;
  event_at: string | null;
  location: string | null;
  audience: string | null;
  cta_label: string | null;
  cta_url: string | null;
  publish_at: string | null;
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

export type AdminRole = "editor" | "publisher" | "super_admin";

export type AdminProfile = {
  id: string;
  email: string | null;
  role: AdminRole;
  created_at: string;
  updated_at: string;
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
      admin_profiles: {
        Row: AdminProfile;
        Insert: Pick<AdminProfile, "id" | "role"> & Partial<AdminProfile>;
        Update: Partial<AdminProfile>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      current_admin_role: {
        Args: Record<PropertyKey, never>;
        Returns: AdminRole | null;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
