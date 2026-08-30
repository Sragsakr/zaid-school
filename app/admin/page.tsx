import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import NewsTable from "@/components/admin/NewsTable";
import { getAllNewsForAdmin } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminNewsListPage() {
  const news = await getAllNewsForAdmin();

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl text-ink">إدارة الأخبار</h1>
          <Link
            href="/admin/news/new"
            className="rounded-md bg-ink text-paper font-utility text-sm px-4 py-2 hover:bg-ink/90 transition-colors"
          >
            + إضافة خبر
          </Link>
        </div>

        <NewsTable news={news} />
      </div>
    </>
  );
}
