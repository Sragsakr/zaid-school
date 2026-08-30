import { getPublishedNews } from "@/lib/data";
import NoticeBoard from "@/components/NoticeBoard";
import HeroCarousel from "@/components/HeroCarousel";
import NewsCard from "@/components/NewsCard";
import CompactNewsItem from "@/components/CompactNewsItem";
import CategorySection from "@/components/CategorySection";
import { CATEGORY_LIST } from "@/lib/categories";
import type { NewsItem } from "@/lib/types";

export const revalidate = 60;

const CAROUSEL_SIZE = 5;
const FEATURED_SIDE_COUNT = 4;

export default async function HomePage() {
  const news = await getPublishedNews();

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
