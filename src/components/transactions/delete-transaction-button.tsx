"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteTransaction } from "@/lib/actions/transactions";

export function DeleteTransactionButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm("Excluir esta transação? Essa ação não pode ser desfeita.")) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteTransaction(id);
        toast.success("Transação excluída.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro ao excluir.");
      }
    });
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8 text-destructive hover:text-destructive"
      onClick={handleDelete}
      disabled={pending}
    >
      <Trash2 className="size-4" />
      <span className="sr-only">Excluir</span>
    </Button>
  );
}
