import Link from "next/link";
import type { NewsItem } from "@/lib/types";
import { formatRelativeArabic } from "@/lib/format-date";
import CategoryTag from "./CategoryTag";
import SafeImage from "./SafeImage";

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-ink/10 bg-white transition-all hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-lg">
      <Link href={`/news/${item.slug}`} className="flex h-full flex-col">
        {item.image_url ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink/5">
            <SafeImage
              src={item.image_url}
              alt={item.image_alt || item.title}
              fill
              sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ) : null}
        <div className="flex flex-1 flex-col gap-3 p-5">
          <CategoryTag category={item.category} />
          <h3 className="font-display text-xl leading-snug text-ink">{item.title}</h3>
          <p className="line-clamp-3 flex-1 font-body text-sm leading-7 text-ink/70">{item.excerpt}</p>
          <time dateTime={item.created_at} className="font-utility text-xs text-ink/50">
            {formatRelativeArabic(item.created_at)}
          </time>
        </div>
      </Link>
    </article>
  );
}
