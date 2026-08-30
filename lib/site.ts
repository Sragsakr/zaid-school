const FALLBACK_SITE_URL = "https://zaid-school.vercel.app";

// Known-good production host. Any NEXT_PUBLIC_SITE_URL that resolves to a
// different host is a misconfiguration (e.g. a typo in the Vercel env var);
// trust it only when it matches a value we can rely on.
const TRUSTED_HOSTS = new Set([
  "zaid-school.vercel.app",
]);

function normalize(url: string): string {
  return url.replace(/\/+$/, "");
}

function isTrustedSiteUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return (
      (parsed.protocol === "https:" || parsed.protocol === "http:") &&
      TRUSTED_HOSTS.has(parsed.hostname)
    );
  } catch {
    return false;
  }
}

export const SITE_URL = normalize(
  isTrustedSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)
    ? process.env.NEXT_PUBLIC_SITE_URL
    : FALLBACK_SITE_URL
);

export const SITE_NAME = "مجمع مدارس الشيخ زايد الرسمية لغات";