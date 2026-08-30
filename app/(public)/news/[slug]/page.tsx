import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getNewsBySlug, getNewsImages } from "@/lib/data";
import { createStaticClient } from "@/lib/supabase/static";
import CategoryTag from "@/components/CategoryTag";
import ArticleGallery from "@/components/ArticleGallery";
import ShareButton from "@/components/ShareButton";
import { formatArabicDate } from "@/lib/format-date";

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
    return { title: "الخبر غير موجود" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const url = `${siteUrl}/news/${item.slug}`;

  return {
    title: item.title,
    description: item.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: item.title,
      description: item.excerpt,
      url,
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const articleUrl = `${siteUrl}/news/${item.slug}`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <header className="flex flex-col gap-4 mb-6">
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
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      ) : null}

      <div className="font-body text-lg leading-loose text-ink/90 whitespace-pre-line">
        {item.content}
      </div>

      <ArticleGallery images={images} />
    </article>
  );
}
