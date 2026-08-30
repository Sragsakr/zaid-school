import { getCategoryInfo } from "@/lib/categories";

const ACCENT_CLASSES: Record<string, string> = {
  navy: "bg-ink text-paper",
  gold: "bg-gold text-ink",
  maroon: "bg-maroon text-paper",
  teal: "bg-teal text-paper",
};

export default function CategoryTag({ category }: { category: string }) {
  const info = getCategoryInfo(category);
  if (!info) return null;

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-utility font-medium ${ACCENT_CLASSES[info.accent]}`}
    >
      {info.label}
    </span>
  );
}
