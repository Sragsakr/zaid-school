import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsBySlug, getNewsImages } from "@/lib/data";
import { createStaticClient } from "@/lib/supabase/static";
import { getCategoryInfo } from "@/lib/categories";
import CategoryTag from "@/components/CategoryTag";
import ArticleGallery from "@/components/ArticleGallery";
import ShareButton from "@/components/ShareButton";
import SafeImage from "@/components/SafeImage";
import Breadcrumbs from "@/components/Breadcrumbs";
import { formatArabicDate } from "@/lib/format-date";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 60;

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase.from("news").select("slug").eq("published", true);
  return (data ?? []).map((row) => ({ slug: row.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);

  if (!item) {
    return {
      title: "الخبر غير موجود",
      robots: { index: false, follow: false },
    };
  }

  const url = `${SITE_URL}/news/${item.slug}`;

  return {
    title: item.title,
    description: item.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: item.title,
      description: item.excerpt,
      url,
      siteName: SITE_NAME,
      locale: "ar_EG",
      type: "article",
      publishedTime: item.created_at,
      modifiedTime: item.updated_at,
      images: item.image_url ? [{ url: item.image_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.excerpt,
      images: item.image_url ? [item.image_url] : undefined,
    },
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);

  if (!item) {
    notFound();
  }

  const images = await getNewsImages(item.id);
  const articleUrl = `${SITE_URL}/news/${item.slug}`;
  const categoryInfo = getCategoryInfo(item.category);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: item.excerpt,
    datePublished: item.created_at,
    dateModified: item.updated_at,
    image: item.image_url ? [item.image_url] : undefined,
    mainEntityOfPage: articleUrl,
    publisher: { "@type": "EducationalOrganization", name: SITE_NAME },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: SITE_URL },
      categoryInfo
        ? {
            "@type": "ListItem",
            position: 2,
            name: categoryInfo.label,
            item: `${SITE_URL}/category/${categoryInfo.key}`,
          }
        : null,
      {
        "@type": "ListItem",
        position: categoryInfo ? 3 : 2,
        name: item.title,
        item: articleUrl,
      },
    ].filter(Boolean),
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs
        items={[
          { label: "الرئيسية", href: "/" },
          ...(categoryInfo
            ? [{ label: categoryInfo.label, href: `/category/${categoryInfo.key}` }]
            : []),
          { label: item.title },
        ]}
      />

      <header className="flex flex-col gap-4 mt-4 mb-6">
        <CategoryTag category={item.category} />
        <h1 className="font-display text-3xl sm:text-4xl leading-tight text-ink">
          {item.title}
        </h1>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <time
            dateTime={item.created_at}
            className="font-utility text-sm text-ink/50"
          >
            {formatArabicDate(item.created_at)}
          </time>
          <ShareButton url={articleUrl} title={item.title} />
        </div>
      </header>

      {item.image_url ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8 bg-ink/5">
          <SafeImage
            src={item.image_url}
            alt={item.title}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      ) : null}

      <div className="font-body text-lg leading-loose text-ink/90 whitespace-pre-line max-w-[70ch]">
        {item.content}
      </div>

      <ArticleGallery images={images} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </article>
  );
}
