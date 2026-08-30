const RTF = new Intl.RelativeTimeFormat("ar", { numeric: "auto" });
const ARABIC_DATE = new Intl.DateTimeFormat("ar-EG", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function formatArabicDate(iso: string): string {
  return ARABIC_DATE.format(new Date(iso));
}

export function formatArabicDateTime(iso: string): string {
  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function formatRelativeArabic(iso: string): string {
  const date = new Date(iso);
  const diffMs = date.getTime() - Date.now();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (Math.abs(diffDays) < 1) {
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    if (Math.abs(diffHours) < 1) {
      const diffMinutes = Math.round(diffMs / (1000 * 60));
      return RTF.format(diffMinutes, "minute");
    }
    return RTF.format(diffHours, "hour");
  }

  if (Math.abs(diffDays) < 30) {
    return RTF.format(diffDays, "day");
  }

  return formatArabicDate(iso);
}

export function issueLine(): string {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) /
      86400000
  );
  const issueNumber = Math.max(1, Math.ceil(dayOfYear / 14));
  const weekday = new Intl.DateTimeFormat("ar-EG", { weekday: "long" }).format(
    now
  );
  return `العدد ${toArabicDigits(issueNumber)} · ${weekday} ${formatArabicDate(
    now.toISOString()
  )}`;
}

export function toArabicDigits(input: number | string): string {
  const digits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(input).replace(/[0-9]/g, (d) => digits[Number(d)]);
}
