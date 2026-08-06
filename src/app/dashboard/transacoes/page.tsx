import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionDialog } from "@/components/transactions/transaction-dialog";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { ExportCsvButton } from "@/components/transactions/export-csv-button";
import { getTransactions } from "@/lib/data/transactions";
import { CATEGORIES, type TransactionCategory } from "@/lib/supabase/types";
import { formatMonthYear } from "@/lib/format";
import { parsePeriod } from "@/lib/period";

export default async function TransacoesPage({
  searchParams,
}: {
  searchParams: Promise<{
    mes?: string;
    ano?: string;
    categoria?: string;
    busca?: string;
  }>;
}) {
  const params = await searchParams;
  const { month, year } = parsePeriod(params.mes, params.ano);
  const category = CATEGORIES.includes(params.categoria as TransactionCategory)
    ? (params.categoria as TransactionCategory)
    : undefined;
  const search = params.busca ?? "";

  const transactions = await getTransactions({
    month,
    year,
    category,
    search,
  });

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Transações</h1>
          <p className="text-sm text-muted-foreground">
            {transactions.length} transaç{transactions.length === 1 ? "ão" : "ões"} em{" "}
            {formatMonthYear(month, year)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportCsvButton
            transactions={transactions}
            filename={`transacoes-${year}-${String(month).padStart(2, "0")}.csv`}
          />
          <TransactionDialog />
        </div>
      </div>

      <TransactionFilters
        month={month}
        year={year}
        category={category ?? ""}
        search={search}
      />

      <TransactionsTable transactions={transactions} />
    </div>
  );
}
