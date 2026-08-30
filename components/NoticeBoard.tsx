import Link from "next/link";
import type { NewsItem } from "@/lib/types";
import { formatRelativeArabic } from "@/lib/format-date";
import SectionHeading from "./SectionHeading";

export default function NoticeBoard({ announcements }: { announcements: NewsItem[] }) {
  if (announcements.length === 0) return null;

  return (
    <aside aria-label="الإعلانات المهمة" className="rounded-xl border border-maroon/15 bg-maroon/[0.04] p-5 sm:p-6">
      <SectionHeading title="الإعلانات المهمة" href="/category/announcements" />
      <ul className="mt-5 flex flex-col divide-y divide-maroon/10">
        {announcements.map((item) => (
          <li key={item.id} className="py-4 first:pt-0 last:pb-0">
            <Link href={`/news/${item.slug}`} className="group flex flex-col gap-2">
              <span className="font-body font-semibold leading-7 text-ink transition-colors group-hover:text-maroon">{item.title}</span>
              <time dateTime={item.created_at} className="font-utility text-xs text-ink/50">{formatRelativeArabic(item.created_at)}</time>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
