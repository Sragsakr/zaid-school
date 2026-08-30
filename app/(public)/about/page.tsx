import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 60;
const description = `تعرّف على ${SITE_NAME} — نبذة عن المدرسة وبيانات التواصل الرسمية.`;
export const metadata: Metadata = { title: "عن المدرسة", description, alternates: { canonical: `${SITE_URL}/about` }, openGraph: { title: "عن المدرسة", description, url: `${SITE_URL}/about`, siteName: SITE_NAME, locale: "ar_EG", type: "website" } };

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const hasContact = settings.phone || settings.email || settings.address;
  const hasSocial = settings.facebook_page_url || settings.facebook_group_url;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "عن المدرسة" }]} />
      <header className="rounded-2xl bg-ink px-6 py-8 text-paper sm:px-10 sm:py-10"><p className="font-utility text-sm font-semibold text-gold">نبذة رسمية</p><h1 className="mt-2 font-display text-3xl sm:text-4xl">عن {settings.school_name}</h1></header>
      <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-start">
        <section className="rounded-2xl border border-ink/10 bg-white p-6 sm:p-8"><SectionHeading title="من نحن" />{settings.about_text ? <p className="mt-5 whitespace-pre-line font-body text-lg leading-loose text-ink/85">{settings.about_text}</p> : <p className="mt-5 font-body text-ink/60">لم تتم إضافة نبذة عن المدرسة بعد.</p>}</section>
        {hasContact || hasSocial ? <section className="rounded-2xl border border-ink/10 bg-white p-6 sm:p-8"><SectionHeading title="بيانات التواصل" /> <div className="mt-5 space-y-4 font-utility text-sm text-ink/80">{settings.phone ? <a href={`tel:${settings.phone}`} dir="ltr" className="block text-right hover:text-maroon">{settings.phone}</a> : null}{settings.email ? <a href={`mailto:${settings.email}`} dir="ltr" className="block text-right hover:text-maroon">{settings.email}</a> : null}{settings.address ? <p>{settings.address}</p> : null}{settings.facebook_page_url ? <a href={settings.facebook_page_url} target="_blank" rel="noopener noreferrer" className="block text-maroon hover:underline">صفحة المدرسة على فيسبوك</a> : null}{settings.facebook_group_url ? <a href={settings.facebook_group_url} target="_blank" rel="noopener noreferrer" className="block text-maroon hover:underline">مجموعة المدرسة على فيسبوك</a> : null}</div></section> : null}
      </div>
      {settings.dedication_text ? <Link href="/dedication" className="self-start font-utility text-sm text-ink/55 hover:text-maroon">إهداء ←</Link> : null}
    </div>
  );
}
