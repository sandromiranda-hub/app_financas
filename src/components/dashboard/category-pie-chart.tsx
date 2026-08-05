"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CATEGORY_COLORS, type TransactionCategory } from "@/lib/supabase/types";
import { formatCurrency } from "@/lib/format";

type Slice = { category: TransactionCategory; total: number };

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: Slice }[];
}) {
  if (!active || !payload?.length) return null;
  const { category, total } = payload[0].payload;

  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-semibold text-popover-foreground">
        {formatCurrency(total)}
      </p>
      <p className="text-muted-foreground">{category}</p>
    </div>
  );
}

export function CategoryPieChart({
  data,
  emptyMessage = "Nenhuma transação registrada neste período.",
}: {
  data: Slice[];
  emptyMessage?: string;
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.total, 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:items-center">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={2}
              stroke="var(--card)"
              strokeWidth={2}
            >
              {data.map((slice) => (
                <Cell
                  key={slice.category}
                  fill={CATEGORY_COLORS[slice.category]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="grid gap-2 text-sm">
        {data.map((slice) => (
          <li key={slice.category} className="flex items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: CATEGORY_COLORS[slice.category] }}
              aria-hidden
            />
            <span className="flex-1 truncate text-foreground">
              {slice.category}
            </span>
            <span className="text-muted-foreground">
              {((slice.total / total) * 100).toFixed(0)}%
            </span>
            <span className="w-24 text-right font-medium tabular-nums text-foreground">
              {formatCurrency(slice.total)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
