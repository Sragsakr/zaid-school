import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import AdminRoleSelect from "@/components/admin/AdminRoleSelect";
import AddAdminUserForm from "@/components/admin/AddAdminUserForm";
import RemoveAdminUserButton from "@/components/admin/RemoveAdminUserButton";
import { createClient } from "@/lib/supabase/server";
import { currentAdminRole } from "@/lib/admin-access";
import { isServiceRoleConfigured } from "@/lib/admin-users";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const [{ data: userData }, role] = await Promise.all([supabase.auth.getUser(), currentAdminRole()]);
  if (role !== "super_admin") redirect("/admin");
  const { data: profiles } = await supabase.from("admin_profiles").select("*").order("created_at");

  return (
    <>
      <AdminNav />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <p className="font-utility text-sm font-semibold text-maroon">الأمان والصلاحيات</p>
        <h1 className="mt-1 font-display text-3xl text-ink">فريق إدارة الموقع</h1>
        <p className="mt-2 max-w-2xl font-body leading-7 text-ink/65">المحرر يكتب ويعدّل، والناشر يدير الإعدادات ويحذف الأخبار، والمشرف الأعلى يدير صلاحيات الفريق ويضيف/يزيل أعضاء.</p>

        <section aria-label="إضافة مستخدم جديد" className="mt-8 rounded-xl border border-ink/10 bg-white p-5">
          <h2 className="font-display text-xl text-ink">إضافة مستخدم جديد</h2>
          <div className="mt-4"><AddAdminUserForm serviceRolePresent={isServiceRoleConfigured} /></div>
        </section>

        <section aria-label="أعضاء الفريق الحاليون" className="mt-8 overflow-hidden rounded-xl border border-ink/10 bg-white">
          <table className="w-full text-sm"><thead className="bg-ink/[0.04] font-utility text-ink/65"><tr><th className="px-4 py-3 text-right">البريد الإلكتروني</th><th className="px-4 py-3 text-right">الدور</th><th className="px-4 py-3 text-right">إجراءات</th></tr></thead><tbody>{(profiles ?? []).map((profile) => <tr key={profile.id} className="border-t border-ink/10"><td className="px-4 py-4 font-utility">{profile.email ?? profile.id}</td><td className="px-4 py-4"><AdminRoleSelect profileId={profile.id} role={profile.role} isCurrentUser={profile.id === userData.user?.id} /></td><td className="px-4 py-4">{(profile.id !== userData.user?.id) ? <RemoveAdminUserButton userId={profile.id} /> : <span className="font-utility text-xs text-ink/50">أنت</span>}</td></tr>)}</tbody></table>
        </section>
      </main>
    </>
  );
}
