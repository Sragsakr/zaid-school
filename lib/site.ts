const FALLBACK_SITE_URL = "https://zaid-school.vercel.app";

function normalize(url: string): string {
  return url.replace(/\/+$/, "");
}

export const SITE_URL = normalize(
  process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL
);

export const SITE_NAME = "مجمع مدارس الشيخ زايد الرسمية لغات";
