import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getTransactions } from "@/lib/data/transactions";
import type { Budget, TransactionCategory } from "@/lib/supabase/types";

export type BudgetProgress = {
  category: TransactionCategory;
  limit: number;
  spent: number;
  percentage: number;
};

export async function getBudgets(): Promise<Budget[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .order("category");

  if (error) {
    throw new Error(`Erro ao buscar orçamentos: ${error.message}`);
  }

  return data ?? [];
}

export async function getBudgetProgress(
  month: number,
  year: number
): Promise<BudgetProgress[]> {
  const [budgets, transactions] = await Promise.all([
    getBudgets(),
    getTransactions({ month, year }),
  ]);

  const spentByCategory = new Map<TransactionCategory, number>();
  for (const t of transactions) {
    if (t.type !== "despesa") continue;
    spentByCategory.set(
      t.category,
      (spentByCategory.get(t.category) ?? 0) + Number(t.amount)
    );
  }

  return budgets.map((b) => {
    const limit = Number(b.limit_amount);
    const spent = spentByCategory.get(b.category) ?? 0;
    return {
      category: b.category,
      limit,
      spent,
      percentage: limit > 0 ? Math.round((spent / limit) * 100) : 0,
    };
  });
}
