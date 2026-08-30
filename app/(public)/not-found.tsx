import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "الصفحة غير موجودة",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 flex flex-col items-center gap-4 text-center">
      <p className="font-display text-6xl text-gold">٤٠٤</p>
      <h1 className="font-display text-2xl sm:text-3xl text-ink">
        عذرًا، الصفحة غير موجودة
      </h1>
      <p className="font-body text-ink/70">
        الصفحة التي تبحث عنها غير متاحة، وربما تم نقلها أو حذفها.
      </p>
      <Link
        href="/"
        className="mt-2 flex items-center min-h-11 rounded-md bg-ink text-paper font-utility text-sm px-6 hover:bg-ink/90 transition-colors"
      >
        العودة إلى الرئيسية
      </Link>
    </div>
  );
}
