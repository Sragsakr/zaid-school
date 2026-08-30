"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AdminRole } from "@/lib/types";

const ROLE_LABEL: Record<AdminRole, string> = {
  editor: "محرر",
  publisher: "ناشر",
  super_admin: "مشرف أعلى",
};

export default function AdminRoleSelect({ profileId, role, isCurrentUser }: { profileId: string; role: AdminRole; isCurrentUser: boolean }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateRole(nextRole: AdminRole) {
    setSaving(true);
    setError(null);
    const { error: updateError } = await createClient().from("admin_profiles").update({ role: nextRole }).eq("id", profileId);
    setSaving(false);
    if (updateError) { setError("تعذر تحديث الدور."); return; }
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-1">
      <select aria-label="دور المستخدم" value={role} disabled={saving || isCurrentUser} onChange={(event) => updateRole(event.target.value as AdminRole)} className="min-h-10 rounded-md border border-ink/15 bg-white px-3 font-utility text-sm disabled:opacity-60">
        {(Object.keys(ROLE_LABEL) as AdminRole[]).map((roleKey) => <option key={roleKey} value={roleKey}>{ROLE_LABEL[roleKey]}</option>)}
      </select>
      {isCurrentUser ? <span className="font-utility text-xs text-ink/50">حسابك الحالي</span> : null}
      {error ? <span role="alert" className="font-utility text-xs text-maroon">{error}</span> : null}
    </div>
  );
}
