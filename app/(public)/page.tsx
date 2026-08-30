import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedNews, getSiteSettings } from "@/lib/data";
import NoticeBoard from "@/components/NoticeBoard";
import HeroCarousel from "@/components/HeroCarousel";
import NewsCard from "@/components/NewsCard";
import CompactNewsItem from "@/components/CompactNewsItem";
import CategorySection from "@/components/CategorySection";
import SectionHeading from "@/components/SectionHeading";
import ServiceLinks from "@/components/ServiceLinks";
import { CATEGORY_LIST } from "@/lib/categories";
import type { NewsItem } from "@/lib/types";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 60;
const CAROUSEL_SIZE = 4;
const FEATURED_SIDE_COUNT = 3;

export const metadata: Metadata = {
  title: "الرئيسية",
  description: `آخر أخبار وفعاليات وإعلانات ${SITE_NAME}.`,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: SITE_NAME,
    description: `آخر أخبار وفعاليات وإعلانات ${SITE_NAME}.`,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ar_EG",
    type: "website",
  },
};

export default async function HomePage() {
  const [news, settings] = await Promise.all([getPublishedNews(), getSiteSettings()]);
  const carouselItems = selectCarouselItems(news);
  const carouselIds = new Set(carouselItems.map((item) => item.id));
  const remainingNews = news.filter((item) => !carouselIds.has(item.id));
  const [lead, ...sideNews] = remainingNews;
  const featuredSide = sideNews.slice(0, FEATURED_SIDE_COUNT);
  const featuredIds = new Set([lead, ...featuredSide].filter(Boolean).map((item) => (item as NewsItem).id));
  const sectionedNews = remainingNews.filter((item) => !featuredIds.has(item.id));
  const announcements = [...news]
    .filter((item) => item.category === "announcements")
    .sort(compareEditorialPriority)
    .slice(0, 3);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-8 sm:py-10">
      <h1 className="sr-only">{settings.school_name} — البوابة الرسمية</h1>

      {announcements[0] ? (
        <Link href={`/news/${announcements[0].slug}`} className="flex items-center justify-between gap-3 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 font-utility text-sm text-ink transition-colors hover:bg-gold/20">
          <span><strong className="ml-2 text-maroon">إعلان مهم</strong>{announcements[0].title}</span>
          <span aria-hidden="true" className="shrink-0 text-lg">←</span>
        </Link>
      ) : null}

      {carouselItems.length > 0 ? <HeroCarousel items={carouselItems} /> : null}
      {news.length === 0 ? <p className="font-body text-ink/60">لا توجد أخبار منشورة حاليًا.</p> : null}

      <ServiceLinks />

      {lead ? (
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
          <div className="flex flex-col gap-5">
            <SectionHeading eyebrow="آخر المستجدات" title="من أخبار المدرسة" href="/category/school" />
            <NewsCard item={lead} />
          </div>
          {featuredSide.length > 0 ? (
            <div className="flex flex-col gap-5">
              <SectionHeading title="أخبار تستحق القراءة" />
              <div className="flex flex-col divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white px-4">
                {featuredSide.map((item) => <div key={item.id} className="py-4 first:pt-5 last:pb-5"><CompactNewsItem item={item} /></div>)}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] lg:items-start">
        <div className="flex flex-col gap-12">
          {CATEGORY_LIST.map((category) => (
            <CategorySection
              key={category.key}
              category={category.key}
              items={sectionedNews.filter((item) => item.category === category.key).slice(0, 3)}
            />
          ))}
        </div>
        <div className="lg:sticky lg:top-24"><NoticeBoard announcements={announcements} /></div>
      </div>
    </div>
  );
}

function compareEditorialPriority(first: NewsItem, second: NewsItem) {
  const pinnedDifference = Number(second.pinned ?? false) - Number(first.pinned ?? false);
  if (pinnedDifference !== 0) return pinnedDifference;
  return (second.priority ?? 0) - (first.priority ?? 0);
}

function selectCarouselItems(news: NewsItem[]) {
  const withImages = news.filter((item) => item.image_url).sort(compareEditorialPriority);
  const featured = withImages.filter((item) => item.featured_in_carousel);
  return (featured.length > 0 ? featured : withImages).slice(0, CAROUSEL_SIZE);
}
