import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import NewsTable from "@/components/admin/NewsTable";
import { getAllNewsForAdmin } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminNewsListPage() {
  const news = await getAllNewsForAdmin();
  const publishedCount = news.filter((item) => item.published).length;
  const draftCount = news.length - publishedCount;

  return (
    <>
      <AdminNav />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-utility text-sm font-semibold text-maroon">مساحة العمل</p><h1 className="mt-1 font-display text-3xl text-ink">إدارة الأخبار</h1></div><Link href="/admin/news/new" className="flex min-h-11 items-center rounded-lg bg-ink px-5 font-utility text-sm text-paper transition-colors hover:bg-maroon">+ إضافة خبر</Link></div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-ink/10 bg-white p-4"><span className="font-utility text-sm text-ink/60">إجمالي الأخبار</span><strong className="mt-2 block font-display text-3xl">{news.length}</strong></div><div className="rounded-xl border border-teal/20 bg-teal/5 p-4"><span className="font-utility text-sm text-ink/60">منشور</span><strong className="mt-2 block font-display text-3xl text-teal">{publishedCount}</strong></div><div className="rounded-xl border border-gold/30 bg-gold/10 p-4"><span className="font-utility text-sm text-ink/60">مسودات</span><strong className="mt-2 block font-display text-3xl text-ink">{draftCount}</strong></div></div>
        <div className="mt-8"><NewsTable news={news} /></div>
      </main>
    </>
  );
}
