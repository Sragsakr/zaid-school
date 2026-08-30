import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "نشرة الأخبار الرسمية للمدرسة",
    template: "%s",
  },
  description: "نشرة الأخبار الرسمية للمدرسة — الأخبار والفعاليات والإعلانات.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
