import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsByCategory } from "@/lib/data";
import { getCategoryInfo, CATEGORY_LIST } from "@/lib/categories";
import NewsCard from "@/components/NewsCard";

export const revalidate = 60;

export function generateStaticParams() {
  return CATEGORY_LIST.map((cat) => ({ category: cat.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const info = getCategoryInfo(category);
  if (!info) return { title: "تصنيف غير موجود" };

  return {
    title: info.label,
    description: `أحدث أخبار ${info.label} في المدرسة.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const info = getCategoryInfo(category);

  if (!info) {
    notFound();
  }

  const news = await getNewsByCategory(info.key);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col gap-8">
      <h1 className="sr-only">{info.label}</h1>

      {news.length === 0 ? (
        <p className="font-body text-ink/60">لا توجد أخبار في هذا التصنيف حاليًا.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {news.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
