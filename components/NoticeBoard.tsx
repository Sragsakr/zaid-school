import Link from "next/link";
import type { NewsItem } from "@/lib/types";
import { formatRelativeArabic } from "@/lib/format-date";

const ROTATIONS = ["-2deg", "1.5deg", "-1deg"];

export default function NoticeBoard({
  announcements,
}: {
  announcements: NewsItem[];
}) {
  if (announcements.length === 0) return null;

  return (
    <aside
      aria-label="لوحة الإعلانات"
      className="bg-maroon/5 border border-maroon/20 rounded-lg p-5"
    >
      <h2 className="font-display text-2xl text-maroon mb-4">
        لوحة الإعلانات
      </h2>
      <ul className="flex flex-col gap-4">
        {announcements.map((item, i) => (
          <li
            key={item.id}
            className="pin-note relative bg-white shadow-md p-4 rounded-sm"
            style={
              {
                "--pin-rotation": ROTATIONS[i % ROTATIONS.length],
              } as React.CSSProperties
            }
          >
            <span className="pin-dot absolute inset-0 pointer-events-none" />
            <Link
              href={`/news/${item.slug}`}
              className="font-body font-medium text-ink hover:text-maroon transition-colors"
            >
              {item.title}
            </Link>
            <time
              dateTime={item.created_at}
              className="block font-utility text-xs text-ink/50 mt-2"
            >
              {formatRelativeArabic(item.created_at)}
            </time>
          </li>
        ))}
      </ul>
    </aside>
  );
}
