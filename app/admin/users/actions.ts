"use server";

import type { AdminRole } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { currentAdminRole } from "@/lib/admin-access";
import { createAdminUser, isServiceRoleConfigured } from "@/lib/admin-users";

export async function addAdminUserAction(input: { email: string; password: string; role: AdminRole }) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { ok: false, error: "غير مصرح." };

  const role = await currentAdminRole();
  if (role !== "super_admin") return { ok: false, error: "تتطلب صلاحية المشرف الأعلى." };

  if (!isServiceRoleConfigured) {
    return { ok: false, error: "المفتاح المتقدم SUPABASE_SERVICE_ROLE_KEY غير مضبوط. أضفه في إعدادات Vercel ثم أعد المحاولة." };
  }

  try {
    await createAdminUser({ email: input.email.trim(), password: input.password, role: input.role });
    return { ok: true, error: null };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "تعذر إنشاء المستخدم." };
  }
}

export async function removeAdminUserAction(userId: string) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { ok: false, error: "غير مصرح." };
  if (authData.user.id === userId) return { ok: false, error: "لا يمكن إزالة حسابك الحالي." };

  const role = await currentAdminRole();
  if (role !== "super_admin") return { ok: false, error: "تتطلب صلاحية المشرف الأعلى." };

  const { error } = await supabase.from("admin_profiles").delete().eq("id", userId);
  if (error) return { ok: false, error: error.message };
  return { ok: true, error: null };
}