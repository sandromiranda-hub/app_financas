"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { grantAccess, type GrantKind } from "@/lib/actions/admin";
import type { UserAccessOverviewRow } from "@/lib/supabase/types";

function getStatus(row: UserAccessOverviewRow) {
  if (row.expires_at === null) {
    return { label: "Sem validade", color: "#367BEC" };
  }
  const dias = row.dias_restantes ?? 0;
  if (dias < 0) {
    return { label: `Vencido há ${Math.abs(dias)} dia(s)`, color: "#FF7217" };
  }
  if (dias <= 7) {
    return { label: `Vence em ${dias} dia(s)`, color: "#FFB715" };
  }
  return { label: `Vence em ${dias} dia(s)`, color: "#367BEC" };
}

export function AdminUserRow({ row }: { row: UserAccessOverviewRow }) {
  const [pending, startTransition] = useTransition();

  function handleGrant(kind: GrantKind) {
    startTransition(async () => {
      try {
        await grantAccess(row.user_id, kind);
        toast.success("Acesso atualizado.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro ao atualizar.");
      }
    });
  }

  const status = getStatus(row);

  return (
    <TableRow>
      <TableCell className="whitespace-normal">
        <p className="font-medium">{row.email}</p>
        {row.note && <p className="text-xs text-muted-foreground">{row.note}</p>}
      </TableCell>
      <TableCell>
        <span
          className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium text-white"
          style={{ background: status.color }}
        >
          {status.label}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => handleGrant("trial")}
          >
            +14 dias
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => handleGrant("paid")}
          >
            +365 dias
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => handleGrant("free")}
          >
            Grátis (sem validade)
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
