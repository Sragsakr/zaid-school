import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { AdminRole, Database } from "@/lib/types";

export const isServiceRoleConfigured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function createAdminUser({ email, password, role }: { email: string; password: string; role: AdminRole }) {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) throw new Error("المفتاح المتقدم غير مضبوط.");
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error("رابط المشروع غير مضبوط.");

  const cookieStore = await cookies();
  const serviceClient = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  // Create the auth account (service role bypasses RLS).
  const { data, error } = await serviceClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role },
  });
  if (error) throw new Error(error.message);

  // Link the profile with the desired role.
  const profileInsert = await serviceClient.from("admin_profiles").insert({ id: data.user.id, email, role });
  if (profileInsert.error) throw new Error(profileInsert.error.message);

  return data.user;
}