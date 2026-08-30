import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import AdminRoleSelect from "@/components/admin/AdminRoleSelect";
import { createClient } from "@/lib/supabase/server";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const [{ data: userData }, { data: role }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.rpc("current_admin_role"),
  ]);
  if (role !== "super_admin") redirect("/admin");
  const { data: profiles } = await supabase.from("admin_profiles").select("*").order("created_at");

  return (
    <>
      <AdminNav />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <p className="font-utility text-sm font-semibold text-maroon">الأمان والصلاحيات</p>
        <h1 className="mt-1 font-display text-3xl text-ink">فريق إدارة الموقع</h1>
        <p className="mt-2 max-w-2xl font-body leading-7 text-ink/65">المحرر يكتب ويعدّل، والناشر يدير الإعدادات ويحذف الأخبار، والمشرف الأعلى يدير صلاحيات الفريق.</p>
        <div className="mt-8 overflow-hidden rounded-xl border border-ink/10 bg-white">
          <table className="w-full text-sm"><thead className="bg-ink/[0.04] font-utility text-ink/65"><tr><th className="px-4 py-3 text-right">البريد الإلكتروني</th><th className="px-4 py-3 text-right">الدور</th></tr></thead><tbody>{(profiles ?? []).map((profile) => <tr key={profile.id} className="border-t border-ink/10"><td className="px-4 py-4 font-utility">{profile.email ?? profile.id}</td><td className="px-4 py-4"><AdminRoleSelect profileId={profile.id} role={profile.role} isCurrentUser={profile.id === userData.user?.id} /></td></tr>)}</tbody></table>
        </div>
      </main>
    </>
  );
}
