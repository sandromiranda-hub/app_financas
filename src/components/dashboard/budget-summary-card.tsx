import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BudgetProgressBar } from "@/components/dashboard/budget-progress-bar";
import { formatCurrency } from "@/lib/format";
import type { BudgetProgress } from "@/lib/data/budgets";

export function BudgetSummaryCard({ budgets }: { budgets: BudgetProgress[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Orçamentos</CardTitle>
        <Link
          href="/dashboard/orcamentos"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1")}
        >
          Ver todos <ArrowRight className="size-3.5" />
        </Link>
      </CardHeader>
      <CardContent>
        {budgets.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhum orçamento definido ainda.{" "}
            <Link
              href="/dashboard/orcamentos"
              className="font-medium text-primary hover:underline"
            >
              Definir agora
            </Link>
            .
          </p>
        ) : (
          <ul className="grid gap-4">
            {budgets.map((b) => (
              <li key={b.category}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{b.category}</span>
                  <span className="text-muted-foreground">
                    {formatCurrency(b.spent)} / {formatCurrency(b.limit)}
                  </span>
                </div>
                <BudgetProgressBar percentage={b.percentage} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
