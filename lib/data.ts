import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import type { NewsImage, NewsItem, SiteSettings } from "@/lib/types";
import type { CategoryKey } from "@/lib/categories";

const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  school_name: "اسم المدرسة",
  logo_url: null,
  phone: null,
  email: null,
  address: null,
  facebook_page_url: null,
  facebook_group_url: null,
  about_text: null,
  developer_name: null,
  developer_email: null,
  developer_phone: null,
  developer_bio: null,
  developer_photo_url: null,
  dedication_text: null,
  updated_at: new Date().toISOString(),
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  return data ?? DEFAULT_SETTINGS;
}

export async function getPublishedNews(): Promise<NewsItem[]> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  return data ?? null;
}

export async function getNewsImages(newsId: string): Promise<NewsImage[]> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("news_images")
    .select("*")
    .eq("news_id", newsId)
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export async function getNewsByCategory(
  category: CategoryKey
): Promise<NewsItem[]> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("published", true)
    .eq("category", category)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function searchPublishedNews(query: string): Promise<NewsItem[]> {
  const normalizedQuery = query.trim().toLocaleLowerCase("ar");
  if (!normalizedQuery) return [];
  const news = await getPublishedNews();
  return news.filter((item) =>
    `${item.title} ${item.excerpt}`.toLocaleLowerCase("ar").includes(normalizedQuery)
  );
}

export async function getAllNewsForAdmin(): Promise<NewsItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  return data ?? [];
}
