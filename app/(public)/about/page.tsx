import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 60;

const description = `تعرّف على ${SITE_NAME} — نبذة عن المدرسة وبيانات التواصل الرسمية.`;

export const metadata: Metadata = {
  title: "عن المدرسة",
  description,
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: "عن المدرسة",
    description,
    url: `${SITE_URL}/about`,
    siteName: SITE_NAME,
    locale: "ar_EG",
    type: "website",
  },
};

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const hasContact = settings.phone || settings.email || settings.address;
  const hasSocial = settings.facebook_page_url || settings.facebook_group_url;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 flex flex-col gap-8">
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "عن المدرسة" }]} />

      <div className="text-center flex flex-col gap-2">
        <h1 className="font-display text-3xl text-ink">عن {settings.school_name}</h1>
      </div>

      {settings.about_text ? (
        <p className="font-body text-ink/90 leading-relaxed whitespace-pre-line">
          {settings.about_text}
        </p>
      ) : (
        <p className="font-body text-ink/60 text-center">
          لم تتم إضافة نبذة عن المدرسة بعد.
        </p>
      )}

      {hasContact || hasSocial ? (
        <div className="bg-white border border-ink/10 rounded-lg p-6 flex flex-col gap-2">
          <h2 className="font-display text-xl text-ink mb-2">بيانات التواصل</h2>
          {settings.phone ? (
            <p className="font-utility text-sm text-ink/80">هاتف: {settings.phone}</p>
          ) : null}
          {settings.email ? (
            <p className="font-utility text-sm text-ink/80">
              البريد الإلكتروني: {settings.email}
            </p>
          ) : null}
          {settings.address ? (
            <p className="font-utility text-sm text-ink/80">العنوان: {settings.address}</p>
          ) : null}
          {hasSocial ? (
            <div className="flex gap-4 pt-2">
              {settings.facebook_page_url ? (
                <a
                  href={settings.facebook_page_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-maroon hover:underline font-utility text-sm"
                >
                  صفحة الفيسبوك
                </a>
              ) : null}
              {settings.facebook_group_url ? (
                <a
                  href={settings.facebook_group_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-maroon hover:underline font-utility text-sm"
                >
                  مجموعة الفيسبوك
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {settings.dedication_text ? (
        <div className="text-center">
          <Link href="/dedication" className="font-utility text-sm text-ink/50 hover:text-maroon transition-colors">
            إهداء ←
          </Link>
        </div>
      ) : null}
    </div>
  );
}
