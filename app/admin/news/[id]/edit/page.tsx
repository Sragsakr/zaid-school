import { notFound } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import NewsForm from "@/components/admin/NewsForm";
import { createClient } from "@/lib/supabase/server";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: item } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single();

  if (!item) {
    notFound();
  }

  const { data: gallery } = await supabase
    .from("news_images")
    .select("*")
    .eq("news_id", id)
    .order("sort_order", { ascending: true });

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="font-display text-3xl text-ink mb-6">تعديل الخبر</h1>
        <NewsForm initial={item} initialGallery={gallery ?? []} />
      </div>
    </>
  );
}
