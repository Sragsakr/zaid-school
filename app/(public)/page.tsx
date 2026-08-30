import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedNews, getSiteSettings } from "@/lib/data";
import NoticeBoard from "@/components/NoticeBoard";
import HeroCarousel from "@/components/HeroCarousel";
import NewsCard from "@/components/NewsCard";
import CompactNewsItem from "@/components/CompactNewsItem";
import CategorySection from "@/components/CategorySection";
import { CATEGORY_LIST } from "@/lib/categories";
import type { NewsItem } from "@/lib/types";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 60;

const CAROUSEL_SIZE = 5;
const FEATURED_SIDE_COUNT = 4;

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
  const [news, settings] = await Promise.all([
    getPublishedNews(),
    getSiteSettings(),
  ]);

  const withImages = news.filter((item) => item.image_url);
  const featured = withImages.filter((item) => item.featured_in_carousel);
  const carouselItems = (featured.length > 0 ? featured : withImages).slice(
    0,
    CAROUSEL_SIZE
  );
  const carouselIds = new Set(carouselItems.map((item) => item.id));
  const remaining = news.filter((item) => !carouselIds.has(item.id));

  const [lead, ...restAfterLead] = remaining;
  const featuredSide = restAfterLead.slice(0, FEATURED_SIDE_COUNT);
  const featuredIds = new Set(
    [lead, ...featuredSide].filter(Boolean).map((item) => (item as NewsItem).id)
  );

  const sectioned = remaining.filter((item) => !featuredIds.has(item.id));

  const announcements = news
    .filter((item) => item.category === "announcements")
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col gap-10">
      <h1 className="sr-only">{settings.school_name} — نشرة الأخبار الرسمية</h1>

      <nav aria-label="اختصارات سريعة" className="flex flex-wrap gap-2">
        {CATEGORY_LIST.map((cat) => (
          <Link
            key={cat.key}
            href={`/category/${cat.key}`}
            className="flex items-center min-h-11 rounded-full border border-ink/15 bg-white px-4 font-utility text-sm text-ink hover:border-maroon hover:text-maroon transition-colors"
          >
            {cat.label}
          </Link>
        ))}
      </nav>

      {carouselItems.length > 0 ? (
        <HeroCarousel items={carouselItems} />
      ) : news.length === 0 ? (
        <p className="font-body text-ink/60">لا توجد أخبار منشورة حاليًا.</p>
      ) : null}

      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-10">
          {lead ? (
            <section className="grid gap-6 md:grid-cols-[3fr_2fr]">
              <NewsCard item={lead} />
              {featuredSide.length > 0 ? (
                <div className="flex flex-col gap-4 divide-y divide-ink/10">
                  {featuredSide.map((item) => (
                    <div key={item.id} className="pt-4 first:pt-0">
                      <CompactNewsItem item={item} />
                    </div>
                  ))}
                </div>
              ) : null}
            </section>
          ) : null}

          {CATEGORY_LIST.map((cat) => (
            <CategorySection
              key={cat.key}
              category={cat.key}
              items={sectioned
                .filter((item) => item.category === cat.key)
                .slice(0, 3)}
            />
          ))}
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <NoticeBoard announcements={announcements} />
        </div>
      </div>
    </div>
  );
}
