import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";

export function SummaryCards({
  totalReceitas,
  totalDespesas,
  saldo,
}: {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Receitas
          </CardTitle>
          <ArrowUpCircle className="size-4 text-primary" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold text-primary">
            {formatCurrency(totalReceitas)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Despesas
          </CardTitle>
          <ArrowDownCircle className="size-4 text-[#FF7217]" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold text-[#FF7217]">
            {formatCurrency(totalDespesas)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Saldo
          </CardTitle>
          <Wallet className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p
            className={cn(
              "text-2xl font-semibold",
              saldo >= 0 ? "text-foreground" : "text-[#FF7217]"
            )}
          >
            {formatCurrency(saldo)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
