import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import { CategoryPieChart } from "@/components/dashboard/category-pie-chart";
import { getTransactions, summarizeTransactions } from "@/lib/data/transactions";
import { formatCurrency, formatDate, formatMonthYear } from "@/lib/format";
import { ArrowRight } from "lucide-react";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string; ano?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const month = Number(params.mes) || now.getMonth() + 1;
  const year = Number(params.ano) || now.getFullYear();

  const transactions = await getTransactions({ month, year });
  const summary = summarizeTransactions(transactions);
  const recent = transactions.slice(0, 5);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Visão geral</h1>
          <p className="text-sm text-muted-foreground">
            {formatMonthYear(month, year)}
          </p>
        </div>
        <PeriodSelector month={month} year={year} />
      </div>

      <SummaryCards
        totalReceitas={summary.totalReceitas}
        totalDespesas={summary.totalDespesas}
        saldo={summary.saldo}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Despesas por categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryPieChart data={summary.porCategoria} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Últimas transações</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              render={<Link href="/dashboard/transacoes" />}
            >
              Ver todas <ArrowRight className="size-3.5" />
            </Button>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nenhuma transação neste período.
              </p>
            ) : (
              <ul className="divide-y">
                {recent.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between gap-2 py-3 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{t.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.category} · {formatDate(t.transaction_date)}
                      </p>
                    </div>
                    <span
                      className={
                        t.type === "receita"
                          ? "shrink-0 font-medium text-emerald-600 dark:text-emerald-400"
                          : "shrink-0 font-medium text-rose-600 dark:text-rose-400"
                      }
                    >
                      {t.type === "receita" ? "+" : "-"}
                      {formatCurrency(Number(t.amount))}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
