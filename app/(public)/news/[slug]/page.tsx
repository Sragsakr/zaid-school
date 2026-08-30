import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsByCategory, getNewsBySlug, getNewsImages } from "@/lib/data";
import { createStaticClient } from "@/lib/supabase/static";
import { getCategoryInfo } from "@/lib/categories";
import CategoryTag from "@/components/CategoryTag";
import ArticleGallery from "@/components/ArticleGallery";
import ShareButton from "@/components/ShareButton";
import SafeImage from "@/components/SafeImage";
import Breadcrumbs from "@/components/Breadcrumbs";
import NewsCard from "@/components/NewsCard";
import SectionHeading from "@/components/SectionHeading";
import { formatArabicDate, formatArabicDateTime } from "@/lib/format-date";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { safeHttpUrl } from "@/lib/safe-url";

export const revalidate = 60;

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase.from("news").select("slug").eq("published", true);
  return (data ?? []).map((row) => ({ slug: row.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) return { title: "الخبر غير موجود", robots: { index: false, follow: false } };
  const url = `${SITE_URL}/news/${item.slug}`;
  return { title: item.title, description: item.excerpt, alternates: { canonical: url }, openGraph: { title: item.title, description: item.excerpt, url, siteName: SITE_NAME, locale: "ar_EG", type: "article", publishedTime: item.created_at, modifiedTime: item.updated_at, images: item.image_url ? [{ url: item.image_url }] : undefined }, twitter: { card: "summary_large_image", title: item.title, description: item.excerpt, images: item.image_url ? [item.image_url] : undefined } };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) notFound();
  const [images, categoryNews] = await Promise.all([getNewsImages(item.id), getNewsByCategory(item.category)]);
  const articleUrl = `${SITE_URL}/news/${item.slug}`;
  const categoryInfo = getCategoryInfo(item.category);
  const relatedNews = categoryNews.filter((newsItem) => newsItem.id !== item.id).slice(0, 3);
  const ctaUrl = safeHttpUrl(item.cta_url);
  const articleJsonLd = { "@context": "https://schema.org", "@type": "NewsArticle", headline: item.title, description: item.excerpt, datePublished: item.created_at, dateModified: item.updated_at, image: item.image_url ? [item.image_url] : undefined, mainEntityOfPage: articleUrl, publisher: { "@type": "EducationalOrganization", name: SITE_NAME } };
  const breadcrumbJsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "الرئيسية", item: SITE_URL }, ...(categoryInfo ? [{ "@type": "ListItem", position: 2, name: categoryInfo.label, item: `${SITE_URL}/category/${categoryInfo.key}` }] : []), { "@type": "ListItem", position: categoryInfo ? 3 : 2, name: item.title, item: articleUrl }] };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <article className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, ...(categoryInfo ? [{ label: categoryInfo.label, href: `/category/${categoryInfo.key}` }] : []), { label: item.title }]} />
        <header className="mt-6 flex flex-col gap-4">
          <CategoryTag category={item.category} />
          <h1 className="font-display text-3xl leading-tight text-ink sm:text-5xl">{item.title}</h1>
          <p className="font-body text-lg leading-8 text-ink/70 sm:text-xl">{item.excerpt}</p>
          <div className="flex flex-wrap items-center justify-between gap-3 border-y border-ink/10 py-3"><time dateTime={item.created_at} className="font-utility text-sm text-ink/55">نُشر في {formatArabicDate(item.created_at)}</time><ShareButton url={articleUrl} title={item.title} /></div>
        </header>
        {item.event_at || item.location || item.audience ? (
          <dl className="mt-6 grid gap-3 rounded-xl border border-gold/30 bg-gold/10 p-5 font-utility text-sm sm:grid-cols-3">
            {item.event_at ? <div><dt className="text-ink/55">الموعد</dt><dd className="mt-1 font-semibold text-ink">{formatArabicDateTime(item.event_at)}</dd></div> : null}
            {item.location ? <div><dt className="text-ink/55">المكان</dt><dd className="mt-1 font-semibold text-ink">{item.location}</dd></div> : null}
            {item.audience ? <div><dt className="text-ink/55">موجّه إلى</dt><dd className="mt-1 font-semibold text-ink">{item.audience}</dd></div> : null}
          </dl>
        ) : null}
        {item.image_url ? <div className="relative mt-8 aspect-[16/10] w-full overflow-hidden rounded-2xl bg-ink/5"><SafeImage src={item.image_url} alt={item.image_alt || item.title} fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" priority /></div> : null}
        <div className="prose-school mt-8 max-w-[70ch] font-body text-lg leading-loose text-ink/90 whitespace-pre-line">{item.content}</div>
        {item.cta_label && ctaUrl ? <a href={ctaUrl} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-11 items-center rounded-lg bg-maroon px-6 font-utility text-sm font-semibold text-paper transition-colors hover:bg-ink">{item.cta_label} ↗</a> : null}
        <ArticleGallery images={images} />
      </article>
      {relatedNews.length > 0 ? <section className="mx-auto mt-14 max-w-6xl border-t border-ink/10 pt-8"><SectionHeading title="أخبار قد تهمك" href={categoryInfo ? `/category/${categoryInfo.key}` : "/"} /><div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{relatedNews.map((relatedItem) => <NewsCard key={relatedItem.id} item={relatedItem} />)}</div></section> : null}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </div>
  );
}
