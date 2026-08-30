import Link from "next/link";
import type { NewsItem } from "@/lib/types";
import { getCategoryInfo } from "@/lib/categories";
import NewsCard from "./NewsCard";

const ACCENT_BORDER: Record<string, string> = {
  navy: "border-ink",
  gold: "border-gold",
  maroon: "border-maroon",
  teal: "border-teal",
};

export default function CategorySection({
  category,
  items,
}: {
  category: string;
  items: NewsItem[];
}) {
  const info = getCategoryInfo(category);
  if (!info || items.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <div
        className={`flex items-center justify-between border-b-2 pb-2 ${ACCENT_BORDER[info.accent]}`}
      >
        <h2 className="font-display text-2xl text-ink">{info.label}</h2>
        <Link
          href={`/category/${info.key}`}
          className="font-utility text-sm text-ink/60 hover:text-maroon transition-colors"
        >
          عرض الكل ←
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
