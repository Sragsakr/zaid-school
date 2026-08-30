import type { MetadataRoute } from "next";
import { createStaticClient } from "@/lib/supabase/static";
import { CATEGORY_LIST } from "@/lib/categories";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("news")
    .select("slug, updated_at")
    .eq("published", true)
    .lte("publish_at", new Date().toISOString());

  const newsUrls: MetadataRoute.Sitemap = (data ?? []).map((item) => ({
    url: `${SITE_URL}/news/${item.slug}`,
    lastModified: item.updated_at,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryUrls: MetadataRoute.Sitemap = CATEGORY_LIST.map((cat) => ({
    url: `${SITE_URL}/category/${cat.key}`,
    changeFrequency: "daily",
    priority: 0.5,
  }));

  return [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/dedication`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    ...categoryUrls,
    ...newsUrls,
  ];
}
