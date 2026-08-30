"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { removeAdminUserAction } from "@/app/admin/users/actions";

export default function RemoveAdminUserButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleRemove() {
    if (!confirm("هل تريد إزالة هذا المستخدم من الفريق؟ لن يُحذف حسابه، لكن سيفقد صلاحية الإدارة.")) return;
    setBusy(true);
    setErr(null);
    const result = await removeAdminUserAction(userId);
    setBusy(false);
    if (result.ok) router.refresh();
    else setErr(result.error ?? "تعذر إزالة المستخدم.");
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button type="button" onClick={handleRemove} disabled={busy} className="font-utility text-sm text-maroon hover:underline disabled:opacity-60">
        {busy ? "جارٍ..." : "إزالة"}
      </button>
      {err ? <span role="alert" className="font-utility text-xs text-maroon">{err}</span> : null}
    </div>
  );
}