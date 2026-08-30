import Link from "next/link";
import type { NewsItem } from "@/lib/types";
import { formatRelativeArabic } from "@/lib/format-date";
import CategoryTag from "./CategoryTag";
import SafeImage from "./SafeImage";

export default function CompactNewsItem({ item }: { item: NewsItem }) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className="flex gap-3 items-start group"
    >
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-md overflow-hidden bg-ink/5 border border-ink/10">
        {item.image_url ? (
          <SafeImage
            src={item.image_url}
            alt={item.image_alt || item.title}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <CategoryTag category={item.category} />
        <h3 className="font-body font-medium text-ink leading-snug line-clamp-2 group-hover:text-maroon transition-colors">
          {item.title}
        </h3>
        <time
          dateTime={item.created_at}
          className="font-utility text-xs text-ink/50"
        >
          {formatRelativeArabic(item.created_at)}
        </time>
      </div>
    </Link>
  );
}
