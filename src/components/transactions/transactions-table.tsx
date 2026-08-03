import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TransactionDialog } from "@/components/transactions/transaction-dialog";
import { DeleteTransactionButton } from "@/components/transactions/delete-transaction-button";
import type { Transaction } from "@/lib/supabase/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

function AmountText({ transaction }: { transaction: Transaction }) {
  return (
    <span
      className={cn(
        "font-medium tabular-nums",
        transaction.type === "receita"
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-rose-600 dark:text-rose-400"
      )}
    >
      {transaction.type === "receita" ? "+" : "-"}
      {formatCurrency(Number(transaction.amount))}
    </span>
  );
}

export function TransactionsTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-16 text-center text-sm text-muted-foreground">
        Nenhuma transação encontrada para os filtros selecionados.
      </div>
    );
  }

  return (
    <>
      {/* Mobile: lista de cards */}
      <ul className="grid gap-3 sm:hidden">
        {transactions.map((t) => (
          <li key={t.id} className="rounded-lg border p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium">{t.description}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(t.transaction_date)}
                </p>
              </div>
              <AmountText transaction={t} />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <Badge variant="secondary">{t.category}</Badge>
              <div className="flex items-center">
                <TransactionDialog transaction={t} />
                <DeleteTransactionButton id={t.id} />
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop: tabela */}
      <div className="hidden overflow-x-auto rounded-lg border sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-20 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatDate(t.transaction_date)}
                </TableCell>
                <TableCell className="font-medium">{t.description}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{t.category}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <AmountText transaction={t} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end">
                    <TransactionDialog transaction={t} />
                    <DeleteTransactionButton id={t.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
