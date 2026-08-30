import AdminNav from "@/components/admin/AdminNav";
import SettingsForm from "@/components/admin/SettingsForm";
import { getSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="font-display text-3xl text-ink mb-6">إعدادات الموقع</h1>
        <SettingsForm initial={settings} />
      </div>
    </>
  );
}
