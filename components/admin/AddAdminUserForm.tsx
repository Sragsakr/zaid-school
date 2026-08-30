"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addAdminUserAction } from "@/app/admin/users/actions";
import type { AdminRole } from "@/lib/types";

const ROLE_LABEL: Record<AdminRole, string> = {
  editor: "محرر",
  publisher: "ناشر",
  super_admin: "مشرف أعلى",
};

export default function AddAdminUserForm({ serviceRolePresent }: { serviceRolePresent: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("editor");
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setFeedback(null);
    const result = await addAdminUserAction({ email, password, role });
    setBusy(false);
    if (result.ok) {
      setFeedback({ kind: "success", text: "تم إنشاء الحساب ومنحه الدور بنجاح." });
      setEmail("");
      setPassword("");
      router.refresh();
    } else {
      setFeedback({ kind: "error", text: result.error ?? "حدث خطأ." });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="new-email" className="font-utility text-sm text-ink/70">البريد الإلكتروني</label>
          <input id="new-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teacher@school.edu" dir="ltr" className="min-h-11 rounded-lg border border-ink/15 bg-white px-3 font-body text-left focus-visible:ring-2 focus-visible:ring-gold" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="new-password" className="font-utility text-sm text-ink/70">كلمة المرور المؤقتة</label>
          <input id="new-password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8 أحرف على الأقل" dir="ltr" className="min-h-11 rounded-lg border border-ink/15 bg-white px-3 font-body text-left focus-visible:ring-2 focus-visible:ring-gold" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="new-role" className="font-utility text-sm text-ink/70">الدور</label>
        <select id="new-role" value={role} onChange={(e) => setRole(e.target.value as AdminRole)} className="min-h-11 rounded-lg border border-ink/15 bg-white px-3 font-utility text-sm focus-visible:ring-2 focus-visible:ring-gold">
          {(Object.keys(ROLE_LABEL) as AdminRole[]).map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
        </select>
      </div>
      {feedback ? <p role={feedback.kind === "error" ? "alert" : "status"} className={`rounded-lg px-3 py-2 font-utility text-sm ${feedback.kind === "success" ? "bg-teal/10 text-teal" : "bg-maroon/10 text-maroon"}`}>{feedback.text}</p> : null}
      {!serviceRolePresent ? <p role="status" className="rounded-lg bg-gold/10 px-3 py-2 font-utility text-sm text-ink/70">أضف SUPABASE_SERVICE_ROLE_KEY في إعدادات Vercel لتفعيل إضافة مستخدمين من هنا.</p> : null}
      <button type="submit" disabled={busy} className="self-start rounded-lg bg-ink px-4 py-2 font-utility text-sm text-paper transition-colors hover:bg-maroon disabled:opacity-60">
        {busy ? "جارٍ الإنشاء..." : "+ إضافة مستخدم"}
      </button>
    </form>
  );
}