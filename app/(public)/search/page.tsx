import type { Metadata } from "next";
import NewsCard from "@/components/NewsCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { searchPublishedNews } from "@/lib/data";

export const metadata: Metadata = {
  title: "البحث في الأخبار",
  description: "ابحث في أخبار وإعلانات وفعاليات المدرسة.",
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim().slice(0, 100);
  const results = await searchPublishedNews(query);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "البحث" }]} />
      <header className="rounded-2xl bg-ink px-6 py-8 text-paper sm:px-10">
        <p className="font-utility text-sm font-semibold text-gold">أرشيف المدرسة</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">البحث في الأخبار</h1>
        <form action="/search" method="get" role="search" className="mt-6 flex max-w-2xl flex-col gap-3 sm:flex-row">
          <label htmlFor="public-search" className="sr-only">كلمة البحث</label>
          <input id="public-search" name="q" type="search" maxLength={100} defaultValue={query} placeholder="اكتب عنوان الخبر أو كلمة منه..." className="min-h-12 flex-1 rounded-lg border border-paper/20 bg-paper px-4 font-body text-ink" />
          <button type="submit" className="min-h-12 rounded-lg bg-gold px-6 font-utility text-sm font-semibold text-ink transition-colors hover:bg-paper">بحث</button>
        </form>
      </header>
      {query ? (
        <section className="flex flex-col gap-5">
          <h2 className="sr-only">نتائج البحث</h2>
          <p className="font-utility text-sm text-ink/60">{results.length} نتيجة للبحث عن <strong className="text-ink">«{query}»</strong></p>
          {results.length > 0 ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{results.map((item) => <NewsCard key={item.id} item={item} />)}</div> : <div className="rounded-xl border border-ink/10 bg-white p-8 text-center"><h2 className="font-display text-2xl text-ink">لا توجد نتائج مطابقة</h2><p className="mt-2 font-body text-ink/60">جرّب كلمة أقصر أو اسم تصنيف مثل نتائج أو فعاليات.</p></div>}
        </section>
      ) : <p className="font-body text-ink/60">اكتب كلمة في مربع البحث للوصول إلى الخبر المطلوب.</p>}
    </div>
  );
}
