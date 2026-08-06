"use client";

import { useActionState, useTransition, type FormEvent } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { upsertBudget, deleteBudget } from "@/lib/actions/budgets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BudgetProgressBar } from "@/components/dashboard/budget-progress-bar";
import { formatCurrency } from "@/lib/format";
import type { TransactionCategory } from "@/lib/supabase/types";

export function BudgetRow({
  category,
  limit,
  spent,
  percentage,
}: {
  category: TransactionCategory;
  limit: number | null;
  spent: number;
  percentage: number;
}) {
  const [state, formAction, pending] = useActionState(upsertBudget, undefined);
  const [deleting, startDeleteTransition] = useTransition();

  function handleDelete() {
    startDeleteTransition(async () => {
      try {
        await deleteBudget(category);
        toast.success("Orçamento removido.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro ao remover.");
      }
    });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const value = String(formData.get("limit_amount") ?? "").trim();
    if (!value) {
      e.preventDefault();
      handleDelete();
    }
  }

  const limitInputId = `limit-${category}`;

  return (
    <div className="grid gap-2 border-b py-4 last:border-0 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-4">
      <div>
        <p className="font-medium">{category}</p>
        {limit !== null && (
          <>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatCurrency(spent)} de {formatCurrency(limit)}
            </p>
            <div className="mt-2 max-w-xs">
              <BudgetProgressBar percentage={percentage} />
            </div>
          </>
        )}
        {state?.error && (
          <p className="mt-1 text-sm text-destructive">{state.error}</p>
        )}
      </div>

      <form action={formAction} onSubmit={handleSubmit} className="flex items-center gap-2">
        <input type="hidden" name="category" value={category} />
        <Label htmlFor={limitInputId} className="sr-only">
          Limite de {category}
        </Label>
        <Input
          id={limitInputId}
          name="limit_amount"
          type="text"
          inputMode="decimal"
          placeholder="0,00"
          defaultValue={limit !== null ? limit.toFixed(2).replace(".", ",") : ""}
          className="w-28"
        />
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Salvando..." : "Salvar"}
        </Button>
        {limit !== null && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={handleDelete}
            disabled={deleting}
          >
            <X className="size-4" />
            <span className="sr-only">Remover orçamento</span>
          </Button>
        )}
      </form>
    </div>
  );
}
