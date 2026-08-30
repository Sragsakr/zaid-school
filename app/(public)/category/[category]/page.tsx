import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsByCategory } from "@/lib/data";
import { getCategoryInfo, CATEGORY_LIST } from "@/lib/categories";
import NewsCard from "@/components/NewsCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 60;

export function generateStaticParams() {
  return CATEGORY_LIST.map((cat) => ({ category: cat.key }));
}

function categoryDescription(label: string): string {
  return `أحدث ${label} في ${SITE_NAME}.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const info = getCategoryInfo(category);
  if (!info) {
    return { title: "تصنيف غير موجود", robots: { index: false, follow: false } };
  }

  const description = categoryDescription(info.label);
  const url = `${SITE_URL}/category/${info.key}`;

  return {
    title: info.label,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: info.label,
      description,
      url,
      siteName: SITE_NAME,
      locale: "ar_EG",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: info.label,
      description,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const info = getCategoryInfo(category);

  if (!info) {
    notFound();
  }

  const news = await getNewsByCategory(info.key);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: info.label,
        item: `${SITE_URL}/category/${info.key}`,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: info.label }]} />
        <h1 className="font-display text-3xl text-ink">{info.label}</h1>
        <p className="font-body text-ink/60">{categoryDescription(info.label)}</p>
      </div>

      {news.length === 0 ? (
        <p className="font-body text-ink/60">لا توجد أخبار في هذا التصنيف حاليًا.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {news.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </div>
  );
}
