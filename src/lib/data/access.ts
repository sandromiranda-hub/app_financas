import "server-only";
import { createClient } from "@/lib/supabase/server";

export async function hasActiveAccess(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_access")
    .select("expires_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return false;
  if (data.expires_at === null) return true;

  return new Date(data.expires_at).getTime() > Date.now();
}
