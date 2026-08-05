import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Transaction, TransactionCategory, TransactionType } from "@/lib/supabase/types";

export type TransactionFilters = {
  month: number;
  year: number;
  category?: TransactionCategory | "todas";
  search?: string;
};

function monthRange(month: number, year: number) {
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

export async function getTransactions(
  filters: TransactionFilters
): Promise<Transaction[]> {
  const supabase = await createClient();
  const { start, end } = monthRange(filters.month, filters.year);

  let query = supabase
    .from("transactions")
    .select("*")
    .gte("transaction_date", start)
    .lt("transaction_date", end)
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters.category && filters.category !== "todas") {
    query = query.eq("category", filters.category);
  }

  if (filters.search) {
    query = query.ilike("description", `%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Erro ao buscar transações: ${error.message}`);
  }

  return data ?? [];
}

export type MonthlySummary = {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  despesasPorCategoria: { category: TransactionCategory; total: number }[];
  receitasPorCategoria: { category: TransactionCategory; total: number }[];
};

function groupByCategory(
  transactions: Transaction[]
): { category: TransactionCategory; total: number }[] {
  const map = new Map<TransactionCategory, number>();

  for (const t of transactions) {
    map.set(t.category, (map.get(t.category) ?? 0) + Number(t.amount));
  }

  return Array.from(map.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

export function summarizeTransactions(
  transactions: Transaction[]
): MonthlySummary {
  let totalReceitas = 0;
  let totalDespesas = 0;
  const receitas: Transaction[] = [];
  const despesas: Transaction[] = [];

  for (const t of transactions) {
    if (t.type === "receita") {
      totalReceitas += Number(t.amount);
      receitas.push(t);
    } else {
      totalDespesas += Number(t.amount);
      despesas.push(t);
    }
  }

  return {
    totalReceitas,
    totalDespesas,
    saldo: totalReceitas - totalDespesas,
    despesasPorCategoria: groupByCategory(despesas),
    receitasPorCategoria: groupByCategory(receitas),
  };
}

export async function getTransactionById(
  id: string
): Promise<Transaction | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Erro ao buscar transação: ${error.message}`);
  }

  return data;
}

export type { Transaction, TransactionType, TransactionCategory };
