export type CategoryKey =
  | "school"
  | "events"
  | "announcements"
  | "contests"
  | "results";

export interface CategoryInfo {
  key: CategoryKey;
  label: string;
  accent: "navy" | "gold" | "maroon" | "teal";
}

export const CATEGORIES: Record<CategoryKey, CategoryInfo> = {
  school: { key: "school", label: "أخبار المدرسة", accent: "navy" },
  events: { key: "events", label: "فعاليات", accent: "gold" },
  announcements: { key: "announcements", label: "إعلانات", accent: "maroon" },
  contests: { key: "contests", label: "مسابقات", accent: "teal" },
  results: { key: "results", label: "نتائج", accent: "navy" },
};

export const CATEGORY_LIST: CategoryInfo[] = Object.values(CATEGORIES);

export function isCategoryKey(value: string): value is CategoryKey {
  return value in CATEGORIES;
}

export function getCategoryInfo(key: string): CategoryInfo | undefined {
  return isCategoryKey(key) ? CATEGORIES[key] : undefined;
}
