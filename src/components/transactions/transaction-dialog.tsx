"use client";

import { useState, useTransition } from "react";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, type Transaction } from "@/lib/supabase/types";
import { createTransaction, updateTransaction } from "@/lib/actions/transactions";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function TransactionDialog({
  transaction,
}: {
  transaction?: Transaction;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const isEdit = Boolean(transaction);

  const action = isEdit
    ? updateTransaction.bind(null, transaction!.id)
    : createTransaction;

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await action(undefined, formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setError(undefined);
      toast.success(isEdit ? "Transação atualizada." : "Transação criada.");
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isEdit ? (
        <DialogTrigger
          render={<Button variant="ghost" size="icon" className="size-8" />}
        >
          <Pencil className="size-4" />
          <span className="sr-only">Editar</span>
        </DialogTrigger>
      ) : (
        <DialogTrigger render={<Button className="gap-2" />}>
          <Plus className="size-4" />
          Nova transação
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <form action={handleSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Editar transação" : "Nova transação"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados da {isEdit ? "transação" : "nova transação"}.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              name="description"
              placeholder="Ex: Supermercado"
              defaultValue={transaction?.description}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0,00"
                defaultValue={transaction?.amount}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="transaction_date">Data</Label>
              <Input
                id="transaction_date"
                name="transaction_date"
                type="date"
                defaultValue={transaction?.transaction_date ?? todayISO()}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo</Label>
              <Select name="type" defaultValue={transaction?.type ?? "despesa"} required>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                name="category"
                defaultValue={transaction?.category ?? "Outros"}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
