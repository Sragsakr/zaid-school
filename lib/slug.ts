export function slugify(title: string): string {
  const arabicSafe = title
    .trim()
    .replace(/[ً-ٟ]/g, "") // strip Arabic diacritics
    .replace(/[^\p{L}\p{N}\s-]/gu, "") // keep letters (incl. Arabic), numbers, spaces, hyphens
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return arabicSafe || `khabar-${Date.now()}`;
}
