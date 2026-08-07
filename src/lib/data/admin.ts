import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { UserAccessOverviewRow } from "@/lib/supabase/types";

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();
}

export async function getAllUserAccess(): Promise<UserAccessOverviewRow[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("user_access_overview")
    .select("*")
    .order("expires_at", { ascending: true, nullsFirst: false });

  if (error) {
    throw new Error(`Erro ao buscar usuários: ${error.message}`);
  }

  return data ?? [];
}
