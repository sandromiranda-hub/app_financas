"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, type TransactionCategory } from "@/lib/supabase/types";

export type TransactionFormState = { error?: string; success?: boolean } | undefined;

function parseTransactionForm(formData: FormData) {
  const description = String(formData.get("description") ?? "").trim();
  const amountRaw = String(formData.get("amount") ?? "").replace(",", ".");
  const amount = Number.parseFloat(amountRaw);
  const type = String(formData.get("type") ?? "");
  const category = String(formData.get("category") ?? "") as TransactionCategory;
  const transaction_date = String(formData.get("transaction_date") ?? "");

  if (!description) return { error: "Informe uma descrição." } as const;
  if (!Number.isFinite(amount) || amount <= 0)
    return { error: "Informe um valor válido, maior que zero." } as const;
  if (type !== "receita" && type !== "despesa")
    return { error: "Selecione o tipo: receita ou despesa." } as const;
  if (!CATEGORIES.includes(category))
    return { error: "Selecione uma categoria válida." } as const;
  if (!transaction_date) return { error: "Selecione uma data." } as const;

  return {
    data: { description, amount, type, category, transaction_date },
  } as const;
}

export async function createTransaction(
  _prevState: TransactionFormState,
  formData: FormData
): Promise<TransactionFormState> {
  const parsed = parseTransactionForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Sessão expirada. Faça login novamente." };

  const { error } = await supabase.from("transactions").insert({
    ...parsed.data,
    user_id: user.id,
  });

  if (error) return { error: `Não foi possível salvar: ${error.message}` };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transacoes");
  return { success: true };
}

export async function updateTransaction(
  id: string,
  _prevState: TransactionFormState,
  formData: FormData
): Promise<TransactionFormState> {
  const parsed = parseTransactionForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("transactions")
    .update(parsed.data)
    .eq("id", id);

  if (error) return { error: `Não foi possível atualizar: ${error.message}` };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transacoes");
  return { success: true };
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) throw new Error(`Não foi possível excluir: ${error.message}`);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transacoes");
}
