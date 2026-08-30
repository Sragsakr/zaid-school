import Link from "next/link";
import type { NewsItem } from "@/lib/types";
import { getCategoryInfo } from "@/lib/categories";
import NewsCard from "./NewsCard";
import SectionHeading from "./SectionHeading";

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
    <section className="flex flex-col gap-5">
      <SectionHeading title={info.label} href={`/category/${info.key}`} />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => <NewsCard key={item.id} item={item} />)}
      </div>
      <Link href={`/category/${info.key}`} className="self-start rounded-md px-2 py-2 font-utility text-sm text-ink/75 hover:bg-ink/5 hover:text-maroon">
        استكشف كل {info.label} ←
      </Link>
    </section>
  );
}
