import { createStaticClient } from "@/lib/supabase/static";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rssDate(iso: string): string {
  return new Date(iso).toUTCString();
}

export async function GET() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("news")
    .select("slug, title, excerpt, updated_at, created_at, publish_at")
    .eq("published", true)
    .lte("publish_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(20);

  const items = (data ?? [])
    .filter((item) => !item.publish_at || new Date(item.publish_at) <= new Date())
    .map((item) => {
      const url = `${SITE_URL}/news/${item.slug}`;
      const timestamp = item.publish_at || item.updated_at || item.created_at || "";
      return `<item>
  <title>${escapeXml(item.title)}</title>
  <link>${escapeXml(url)}</link>
  <guid isPermaLink="false">${escapeXml(url)}</guid>
  <description>${escapeXml(item.excerpt)}</description>
  <pubDate>${rssDate(timestamp)}</pubDate>
</item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>آخر أخبار وإعلانات وفعاليات المدرسة</description>
    <language>ar</language>
    <lastBuildDate>${rssDate(new Date().toISOString())}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(body, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}