import type { MetadataRoute } from "next";
import { createStaticClient } from "@/lib/supabase/static";
import { CATEGORY_LIST } from "@/lib/categories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("news")
    .select("slug, updated_at")
    .eq("published", true);

  const newsUrls: MetadataRoute.Sitemap = (data ?? []).map((item) => ({
    url: `${siteUrl}/news/${item.slug}`,
    lastModified: item.updated_at,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryUrls: MetadataRoute.Sitemap = CATEGORY_LIST.map((cat) => ({
    url: `${siteUrl}/category/${cat.key}`,
    changeFrequency: "daily",
    priority: 0.5,
  }));

  return [
    {
      url: siteUrl,
      changeFrequency: "daily",
      priority: 1,
    },
    ...categoryUrls,
    ...newsUrls,
  ];
}
