import Link from "next/link";
import { notFound } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import ArticleGallery from "@/components/ArticleGallery";
import CategoryTag from "@/components/CategoryTag";
import SafeImage from "@/components/SafeImage";
import { formatArabicDate, formatArabicDateTime } from "@/lib/format-date";
import { safeHttpUrl } from "@/lib/safe-url";
import { createClient } from "@/lib/supabase/server";

export default async function PreviewNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: item }, { data: gallery }] = await Promise.all([
    supabase.from("news").select("*").eq("id", id).single(),
    supabase.from("news_images").select("*").eq("news_id", id).order("sort_order"),
  ]);
  if (!item) notFound();
  const ctaUrl = safeHttpUrl(item.cta_url);

  return (
    <>
      <AdminNav />
      <div className="border-b border-gold/30 bg-gold/10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 font-utility text-sm">
          <strong>وضع المعاينة — هذه الصفحة غير ظاهرة للعامة</strong>
          <div className="flex gap-3"><Link href={`/admin/news/${item.id}/edit`} className="text-maroon hover:underline">تعديل الخبر</Link><Link href="/admin" className="hover:underline">العودة للإدارة</Link></div>
        </div>
      </div>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <article>
          <header className="flex flex-col gap-4">
            <CategoryTag category={item.category} />
            <h1 className="font-display text-3xl leading-tight text-ink sm:text-5xl">{item.title}</h1>
            <p className="font-body text-lg leading-8 text-ink/70 sm:text-xl">{item.excerpt}</p>
            <time dateTime={item.created_at} className="border-y border-ink/10 py-3 font-utility text-sm text-ink/55">أُنشئ في {formatArabicDate(item.created_at)}</time>
          </header>
          {item.event_at || item.location || item.audience ? <dl className="mt-6 grid gap-3 rounded-xl border border-gold/30 bg-gold/10 p-5 font-utility text-sm sm:grid-cols-3">{item.event_at ? <div><dt className="text-ink/55">الموعد</dt><dd className="mt-1 font-semibold">{formatArabicDateTime(item.event_at)}</dd></div> : null}{item.location ? <div><dt className="text-ink/55">المكان</dt><dd className="mt-1 font-semibold">{item.location}</dd></div> : null}{item.audience ? <div><dt className="text-ink/55">موجّه إلى</dt><dd className="mt-1 font-semibold">{item.audience}</dd></div> : null}</dl> : null}
          {item.image_url ? <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-2xl bg-ink/5"><SafeImage src={item.image_url} alt={item.image_alt || item.title} fill sizes="768px" className="object-cover" priority /></div> : null}
          <div className="prose-school mt-8 whitespace-pre-line font-body text-lg leading-loose text-ink/90">{item.content}</div>
          {item.cta_label && ctaUrl ? <a href={ctaUrl} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-11 items-center rounded-lg bg-maroon px-6 font-utility text-sm font-semibold text-paper">{item.cta_label} ↗</a> : null}
          <ArticleGallery images={gallery ?? []} />
        </article>
      </main>
    </>
  );
}
