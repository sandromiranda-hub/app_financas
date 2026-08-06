"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, type TransactionCategory } from "@/lib/supabase/types";
import { parseDecimalInput } from "@/lib/format";

export type BudgetFormState = { error?: string; success?: boolean } | undefined;

export async function upsertBudget(
  _prevState: BudgetFormState,
  formData: FormData
): Promise<BudgetFormState> {
  const category = String(formData.get("category") ?? "") as TransactionCategory;
  const limitAmount = parseDecimalInput(String(formData.get("limit_amount") ?? ""));

  if (!CATEGORIES.includes(category)) return { error: "Categoria inválida." };
  if (!Number.isFinite(limitAmount) || limitAmount <= 0)
    return { error: "Informe um valor válido, maior que zero." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Sessão expirada. Faça login novamente." };

  const { error } = await supabase
    .from("budgets")
    .upsert(
      { user_id: user.id, category, limit_amount: limitAmount },
      { onConflict: "user_id,category" }
    );

  if (error) return { error: `Não foi possível salvar: ${error.message}` };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/orcamentos");
  return { success: true };
}

export async function deleteBudget(category: TransactionCategory) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Sessão expirada. Faça login novamente.");

  const { error } = await supabase
    .from("budgets")
    .delete()
    .eq("category", category)
    .eq("user_id", user.id);

  if (error) throw new Error(`Não foi possível remover: ${error.message}`);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/orcamentos");
}
