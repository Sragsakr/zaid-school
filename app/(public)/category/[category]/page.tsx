import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsByCategory } from "@/lib/data";
import { getCategoryInfo, CATEGORY_LIST } from "@/lib/categories";
import NewsCard from "@/components/NewsCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 60;

export function generateStaticParams() { return CATEGORY_LIST.map((category) => ({ category: category.key })); }

function categoryDescription(label: string): string { return `أحدث ${label} في ${SITE_NAME}.`; }

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const info = getCategoryInfo(category);
  if (!info) return { title: "تصنيف غير موجود", robots: { index: false, follow: false } };
  const description = categoryDescription(info.label);
  return { title: info.label, description, alternates: { canonical: `${SITE_URL}/category/${info.key}` }, openGraph: { title: info.label, description, url: `${SITE_URL}/category/${info.key}`, siteName: SITE_NAME, locale: "ar_EG", type: "website" } };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const info = getCategoryInfo(category);
  if (!info) notFound();
  const news = await getNewsByCategory(info.key);
  const breadcrumbJsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "الرئيسية", item: SITE_URL }, { "@type": "ListItem", position: 2, name: info.label, item: `${SITE_URL}/category/${info.key}` }] };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: info.label }]} />
      <header className="flex flex-col gap-3 rounded-2xl bg-ink px-6 py-8 text-paper sm:px-10">
        <p className="font-utility text-sm font-semibold text-gold">أرشيف المدرسة</p>
        <h1 className="font-display text-3xl sm:text-4xl">{info.label}</h1>
        <p className="max-w-2xl font-body leading-7 text-paper/75">{categoryDescription(info.label)}</p>
        <span className="font-utility text-sm text-paper/60">{news.length} {news.length === 1 ? "خبر منشور" : "أخبار منشورة"}</span>
      </header>
      {news.length === 0 ? <p className="font-body text-ink/60">لا توجد أخبار في هذا التصنيف حاليًا.</p> : <section className="flex flex-col gap-5"><SectionHeading title={`أحدث ${info.label}`} /><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{news.map((item) => <NewsCard key={item.id} item={item} />)}</div></section>}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </div>
  );
}
