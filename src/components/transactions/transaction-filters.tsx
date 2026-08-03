"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import { CATEGORIES } from "@/lib/supabase/types";

export function TransactionFilters({
  month,
  year,
  category,
  search,
}: {
  month: number;
  year: number;
  category: string;
  search: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(search);

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "todas") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <PeriodSelector month={month} year={year} />

      <Select
        value={category || "todas"}
        onValueChange={(v) => updateParam("categoria", v)}
      >
        <SelectTrigger className="w-[170px]">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas categorias</SelectItem>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateParam("busca", searchValue);
        }}
        className="relative flex-1 sm:max-w-xs"
      >
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onBlur={() => updateParam("busca", searchValue)}
          placeholder="Buscar por descrição..."
          className="pl-8"
        />
      </form>
    </div>
  );
}
