"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/lib/supabase/types";
import { formatDate } from "@/lib/format";

function escapeCsvField(value: string): string {
  if (/[",\n;]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function buildCsv(transactions: Transaction[]): string {
  const header = ["Data", "Descrição", "Categoria", "Tipo", "Valor"];
  const rows = transactions.map((t) => [
    formatDate(t.transaction_date),
    t.description,
    t.category,
    t.type === "receita" ? "Receita" : "Despesa",
    Number(t.amount).toFixed(2).replace(".", ","),
  ]);

  return [header, ...rows]
    .map((row) => row.map(escapeCsvField).join(";"))
    .join("\n");
}

export function ExportCsvButton({
  transactions,
  filename,
}: {
  transactions: Transaction[];
  filename: string;
}) {
  function handleExport() {
    const csv = "﻿" + buildCsv(transactions);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <Button
      variant="outline"
      className="gap-2"
      onClick={handleExport}
      disabled={transactions.length === 0}
    >
      <Download className="size-4" />
      Exportar CSV
    </Button>
  );
}
