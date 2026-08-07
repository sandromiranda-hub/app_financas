"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/data/admin";

export type GrantKind = "trial" | "paid" | "free";

const GRANTS: Record<GrantKind, { days: number | null; note: string }> = {
  trial: { days: 14, note: "Teste manual (+14 dias)" },
  paid: { days: 365, note: "Pago (+365 dias)" },
  free: { days: null, note: "Acesso gratuito permanente" },
};

export async function grantAccess(userId: string, kind: GrantKind) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdmin(user?.email)) {
    throw new Error("Sem permissão.");
  }

  const grant = GRANTS[kind];
  const expiresAt =
    grant.days === null
      ? null
      : new Date(Date.now() + grant.days * 24 * 60 * 60 * 1000).toISOString();

  const admin = createAdminClient();
  const { error } = await admin
    .from("user_access")
    .update({ expires_at: expiresAt, note: grant.note })
    .eq("user_id", userId);

  if (error) throw new Error(`Não foi possível atualizar: ${error.message}`);

  revalidatePath("/dashboard/admin");
}
