import { CATEGORIES } from "@/lib/supabase/types";
import { getBudgetProgress } from "@/lib/data/budgets";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import { BudgetRow } from "@/components/budgets/budget-row";
import { formatMonthYear } from "@/lib/format";

export default async function OrcamentosPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string; ano?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const month = Number(params.mes) || now.getMonth() + 1;
  const year = Number(params.ano) || now.getFullYear();

  const progress = await getBudgetProgress(month, year);
  const progressByCategory = new Map(progress.map((p) => [p.category, p]));

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Orçamentos</h1>
          <p className="text-sm text-muted-foreground">
            {formatMonthYear(month, year)}
          </p>
        </div>
        <PeriodSelector month={month} year={year} />
      </div>

      <div className="rounded-xl border bg-card px-4">
        {CATEGORIES.map((category) => {
          const item = progressByCategory.get(category);
          return (
            <BudgetRow
              key={`${category}-${item?.limit ?? "none"}`}
              category={category}
              limit={item?.limit ?? null}
              spent={item?.spent ?? 0}
              percentage={item?.percentage ?? 0}
            />
          );
        })}
      </div>
    </div>
  );
}
