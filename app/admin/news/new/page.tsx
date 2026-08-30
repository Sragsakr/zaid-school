import AdminNav from "@/components/admin/AdminNav";
import NewsForm from "@/components/admin/NewsForm";

export default function NewNewsPage() {
  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="font-display text-3xl text-ink mb-6">إضافة خبر</h1>
        <NewsForm />
      </div>
    </>
  );
}
