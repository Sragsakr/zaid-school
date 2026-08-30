import Link from "next/link";
import Image from "next/image";
import type { NewsItem } from "@/lib/types";
import { formatRelativeArabic } from "@/lib/format-date";
import CategoryTag from "./CategoryTag";

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden border border-ink/10 hover:shadow-md transition-shadow">
      <Link href={`/news/${item.slug}`} className="flex flex-col h-full">
        {item.image_url ? (
          <div className="relative w-full aspect-video bg-ink/5">
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}
        <div className="flex flex-col gap-2 p-4 flex-1">
          <CategoryTag category={item.category} />
          <h3 className="font-display text-xl leading-snug text-ink">
            {item.title}
          </h3>
          <p className="font-body text-sm text-ink/70 line-clamp-3 flex-1">
            {item.excerpt}
          </p>
          <time
            dateTime={item.created_at}
            className="font-utility text-xs text-ink/50 mt-2"
          >
            {formatRelativeArabic(item.created_at)}
          </time>
        </div>
      </Link>
    </article>
  );
}
