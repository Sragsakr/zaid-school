import { createClient } from "@/lib/supabase/server";
import type { AdminRole } from "@/lib/types";

// Returns the current signed-in user's admin role, or null.
export async function currentAdminRole(): Promise<AdminRole | null> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("current_admin_role");
  return (data as AdminRole | null) ?? null;
}