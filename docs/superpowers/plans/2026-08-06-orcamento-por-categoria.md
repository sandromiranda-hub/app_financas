# Orçamento por categoria — Plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir que o usuário defina um limite de gasto mensal recorrente por categoria e acompanhe visualmente o progresso contra esse limite, no dashboard e numa tela dedicada.

**Architecture:** Segue exatamente o padrão já estabelecido em `src/lib/data/transactions.ts` / `src/lib/actions/transactions.ts`: uma tabela Supabase com RLS, uma camada de dados server-only, server actions com `useActionState`, e componentes React que consomem essa camada. Nenhuma dependência nova.

**Tech Stack:** Next.js (App Router, server components/actions), Supabase (Postgres + RLS), Tailwind, lucide-react. Sem framework de testes automatizados.

## Global Constraints

- Spec de referência: `docs/superpowers/specs/2026-08-06-orcamento-por-categoria-design.md`.
- O limite é **recorrente**: uma linha por `(user_id, category)`, sem dimensão de mês/ano na tabela.
- Orçamento cobre só categorias de despesa — o cálculo de "gasto" soma apenas transações `type = 'despesa'`.
- Sem alertas ativos (toast/notificação) — só indicação visual (cor da barra de progresso).
- Sem histórico de mudanças de limite.
- Cores de progresso (hex exatos, já usados no resto do app): `< 80%` → `#367BEC`; `80–100%` → `#FFB715`; `> 100%` → `#FF7217`.
- Sem framework de testes automatizado no projeto. "Testar" = `npx tsc --noEmit`, `npm run lint`, `npm run build`, e verificação manual no navegador (`npm run dev`).
- A migration SQL precisa ser rodada manualmente pelo usuário no SQL Editor do Supabase antes de qualquer teste manual que dependa do banco (Task 6 em diante) — mesmo fluxo já usado para a correção de `GRANT` em `supabase/migrations/20260806120000_grant_transactions_permissions.sql`.

---

### Task 1: Migration SQL, schema.sql e tipos

**Files:**
- Create: `supabase/migrations/20260806130000_create_budgets_table.sql`
- Modify: `supabase/schema.sql` (append ao final do arquivo)
- Modify: `src/lib/supabase/types.ts:30-60`

**Interfaces:**
- Produces: tipo `Budget` (`id`, `user_id`, `category: TransactionCategory`, `limit_amount: number`, `created_at`, `updated_at`), exportado de `@/lib/supabase/types`. Usado por todas as tasks seguintes.

- [ ] **Step 1: Criar a migration**

Conteúdo de `supabase/migrations/20260806130000_create_budgets_table.sql`:

```sql
-- Orçamento por categoria: limite de gasto recorrente por categoria
-- (mesmo valor todo mês, até o usuário mudar). Segue o mesmo padrão de
-- RLS + GRANT de transactions (ver migration 20260806120000).

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category transaction_category not null,
  limit_amount numeric(12, 2) not null check (limit_amount > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, category)
);

create index if not exists budgets_user_id_idx on public.budgets (user_id);

drop trigger if exists budgets_set_updated_at on public.budgets;
create trigger budgets_set_updated_at
  before update on public.budgets
  for each row
  execute function public.set_updated_at();

alter table public.budgets enable row level security;

create policy "Usuários podem ver seus próprios orçamentos"
  on public.budgets for select
  using (auth.uid() = user_id);

create policy "Usuários podem inserir seus próprios orçamentos"
  on public.budgets for insert
  with check (auth.uid() = user_id);

create policy "Usuários podem atualizar seus próprios orçamentos"
  on public.budgets for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Usuários podem excluir seus próprios orçamentos"
  on public.budgets for delete
  using (auth.uid() = user_id);

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.budgets to authenticated;
```

- [ ] **Step 2: Adicionar a mesma seção ao final de `supabase/schema.sql`**

Acrescentar ao final do arquivo (depois da linha 82, `grant select, insert, update, delete on public.transactions to authenticated;`):

```sql

-- 5. Tabela de orçamentos ----------------------------------------------------
-- Limite de gasto recorrente por categoria (mesmo valor todo mês, até o usuário mudar).

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category transaction_category not null,
  limit_amount numeric(12, 2) not null check (limit_amount > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, category)
);

create index if not exists budgets_user_id_idx on public.budgets (user_id);

drop trigger if exists budgets_set_updated_at on public.budgets;
create trigger budgets_set_updated_at
  before update on public.budgets
  for each row
  execute function public.set_updated_at();

alter table public.budgets enable row level security;

create policy "Usuários podem ver seus próprios orçamentos"
  on public.budgets for select
  using (auth.uid() = user_id);

create policy "Usuários podem inserir seus próprios orçamentos"
  on public.budgets for insert
  with check (auth.uid() = user_id);

create policy "Usuários podem atualizar seus próprios orçamentos"
  on public.budgets for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Usuários podem excluir seus próprios orçamentos"
  on public.budgets for delete
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.budgets to authenticated;
```

- [ ] **Step 3: Adicionar o tipo `Budget` em `src/lib/supabase/types.ts`**

Inserir logo depois do fechamento do tipo `Transaction` (depois da linha 40, `};`, antes de `export type Database = {`):

```ts
export type Budget = {
  id: string;
  user_id: string;
  category: TransactionCategory;
  limit_amount: number;
  created_at: string;
  updated_at: string;
};
```

- [ ] **Step 4: Adicionar `budgets` em `Database.public.Tables`**

Dentro do bloco `Tables`, logo depois do fechamento da entrada `transactions` (depois de `Relationships: [];\n      };`, antes do `};` que fecha `Tables`):

```ts
      budgets: {
        Row: Budget;
        Insert: Omit<Budget, "id" | "user_id" | "created_at" | "updated_at"> & {
          id?: string;
          user_id?: string;
        };
        Update: Partial<
          Omit<Budget, "id" | "user_id" | "created_at" | "updated_at">
        >;
        Relationships: [];
      };
```

- [ ] **Step 5: Verificar que o projeto ainda compila**

Run: `npx tsc --noEmit`
Expected: sem erros (o tipo `Budget` ainda não é usado em lugar nenhum, mas precisa compilar).

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations/20260806130000_create_budgets_table.sql supabase/schema.sql src/lib/supabase/types.ts
git commit -m "feat: adiciona tabela budgets (schema, migration e tipos)"
```

---

### Task 2: Camada de dados — `src/lib/data/budgets.ts`

**Files:**
- Create: `src/lib/data/budgets.ts`

**Interfaces:**
- Consumes: `createClient()` de `@/lib/supabase/server` (retorna `Promise<SupabaseClient>`); `getTransactions({ month, year })` de `@/lib/data/transactions` (retorna `Promise<Transaction[]>`); tipo `Budget` de `@/lib/supabase/types`.
- Produces: `getBudgets(): Promise<Budget[]>`; tipo `BudgetProgress = { category: TransactionCategory; limit: number; spent: number; percentage: number }`; `getBudgetProgress(month: number, year: number): Promise<BudgetProgress[]>`. Usados pelas Tasks 6 e 8.

- [ ] **Step 1: Criar o arquivo**

```ts
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getTransactions } from "@/lib/data/transactions";
import type { Budget, TransactionCategory } from "@/lib/supabase/types";

export type BudgetProgress = {
  category: TransactionCategory;
  limit: number;
  spent: number;
  percentage: number;
};

export async function getBudgets(): Promise<Budget[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .order("category");

  if (error) {
    throw new Error(`Erro ao buscar orçamentos: ${error.message}`);
  }

  return data ?? [];
}

export async function getBudgetProgress(
  month: number,
  year: number
): Promise<BudgetProgress[]> {
  const [budgets, transactions] = await Promise.all([
    getBudgets(),
    getTransactions({ month, year }),
  ]);

  const spentByCategory = new Map<TransactionCategory, number>();
  for (const t of transactions) {
    if (t.type !== "despesa") continue;
    spentByCategory.set(
      t.category,
      (spentByCategory.get(t.category) ?? 0) + Number(t.amount)
    );
  }

  return budgets.map((b) => {
    const limit = Number(b.limit_amount);
    const spent = spentByCategory.get(b.category) ?? 0;
    return {
      category: b.category,
      limit,
      spent,
      percentage: limit > 0 ? Math.round((spent / limit) * 100) : 0,
    };
  });
}
```

- [ ] **Step 2: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/lib/data/budgets.ts
git commit -m "feat: adiciona camada de dados de orçamentos (getBudgets, getBudgetProgress)"
```

---

### Task 3: Server actions — `src/lib/actions/budgets.ts`

**Files:**
- Create: `src/lib/actions/budgets.ts`

**Interfaces:**
- Consumes: `createClient()` de `@/lib/supabase/server`; `CATEGORIES`, `TransactionCategory` de `@/lib/supabase/types`.
- Produces: `type BudgetFormState = { error?: string; success?: boolean } | undefined`; `upsertBudget(prevState: BudgetFormState, formData: FormData): Promise<BudgetFormState>` (compatível com `useActionState`); `deleteBudget(category: TransactionCategory): Promise<void>`. Usados pela Task 5.

- [ ] **Step 1: Criar o arquivo**

```ts
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, type TransactionCategory } from "@/lib/supabase/types";

export type BudgetFormState = { error?: string; success?: boolean } | undefined;

export async function upsertBudget(
  _prevState: BudgetFormState,
  formData: FormData
): Promise<BudgetFormState> {
  const category = String(formData.get("category") ?? "") as TransactionCategory;
  const limitRaw = String(formData.get("limit_amount") ?? "").replace(",", ".");
  const limitAmount = Number.parseFloat(limitRaw);

  if (!CATEGORIES.includes(category)) return { error: "Categoria inválida." };
  if (!Number.isFinite(limitAmount) || limitAmount <= 0)
    return { error: "Informe um valor válido, maior que zero." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Sessão expirada. Faça login novamente." };

  const { error } = await supabase
    .from("budgets")
    .upsert(
      { user_id: user.id, category, limit_amount: limitAmount },
      { onConflict: "user_id,category" }
    );

  if (error) return { error: `Não foi possível salvar: ${error.message}` };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/orcamentos");
  return { success: true };
}

export async function deleteBudget(category: TransactionCategory) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("budgets")
    .delete()
    .eq("category", category);

  if (error) throw new Error(`Não foi possível remover: ${error.message}`);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/orcamentos");
}
```

- [ ] **Step 2: Verificar tipos e lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/lib/actions/budgets.ts
git commit -m "feat: adiciona server actions de orçamento (upsertBudget, deleteBudget)"
```

---

### Task 4: Componente `BudgetProgressBar`

**Files:**
- Create: `src/components/dashboard/budget-progress-bar.tsx`

**Interfaces:**
- Produces: `BudgetProgressBar({ percentage: number })` — componente client-safe (sem `"use client"`, não usa hooks, pode ser renderizado em server ou client component). Usado pelas Tasks 5 e 8.

- [ ] **Step 1: Criar o componente**

```tsx
export function BudgetProgressBar({ percentage }: { percentage: number }) {
  const clamped = Math.min(Math.max(percentage, 0), 100);
  const color =
    percentage > 100 ? "#FF7217" : percentage >= 80 ? "#FFB715" : "#367BEC";

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(percentage)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-2 w-full overflow-hidden rounded-full bg-muted"
    >
      <div
        className="h-full rounded-full transition-[width]"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Verificar tipos e lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/budget-progress-bar.tsx
git commit -m "feat: adiciona componente BudgetProgressBar"
```

---

### Task 5: Componente `BudgetRow`

**Files:**
- Create: `src/components/budgets/budget-row.tsx`

**Interfaces:**
- Consumes: `upsertBudget`, `deleteBudget` de `@/lib/actions/budgets` (Task 3); `BudgetProgressBar` de `@/components/dashboard/budget-progress-bar` (Task 4); `Button`, `Input` de `@/components/ui/*` (já existentes); `formatCurrency` de `@/lib/format` (já existente).
- Produces: `BudgetRow({ category: TransactionCategory; limit: number | null; spent: number; percentage: number })` — client component, uma linha completa de categoria (nome, progresso, formulário de limite). Usado pela Task 6.

- [ ] **Step 1: Criar o componente**

```tsx
"use client";

import { useActionState, useTransition } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { upsertBudget, deleteBudget } from "@/lib/actions/budgets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

      <form action={formAction} className="flex items-center gap-2">
        <input type="hidden" name="category" value={category} />
        <Input
          name="limit_amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0,00"
          defaultValue={limit ?? ""}
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
```

- [ ] **Step 2: Verificar tipos e lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/components/budgets/budget-row.tsx
git commit -m "feat: adiciona componente BudgetRow"
```

---

### Task 6: Tela `/dashboard/orcamentos`

**Files:**
- Create: `src/app/dashboard/orcamentos/page.tsx`

**Interfaces:**
- Consumes: `CATEGORIES` de `@/lib/supabase/types`; `getBudgetProgress` de `@/lib/data/budgets` (Task 2); `PeriodSelector` de `@/components/dashboard/period-selector` (já existente, props `{ month: number; year: number }`); `BudgetRow` de `@/components/budgets/budget-row` (Task 5); `formatMonthYear` de `@/lib/format` (já existente).

- [ ] **Step 1: Criar a página**

```tsx
import { CATEGORIES } from "@/lib/supabase/types";
import { getBudgetProgress } from "@/lib/data/budgets";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import { BudgetRow } from "@/components/budgets/budget-row";
import { formatMonthYear } from "@/lib/format";

export default async function OrcamentosPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string; ano?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const month = Number(params.mes) || now.getMonth() + 1;
  const year = Number(params.ano) || now.getFullYear();

  const progress = await getBudgetProgress(month, year);
  const progressByCategory = new Map(progress.map((p) => [p.category, p]));

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Orçamentos</h1>
          <p className="text-sm text-muted-foreground">
            {formatMonthYear(month, year)}
          </p>
        </div>
        <PeriodSelector month={month} year={year} />
      </div>

      <div className="rounded-xl border bg-card px-4">
        {CATEGORIES.map((category) => {
          const item = progressByCategory.get(category);
          return (
            <BudgetRow
              key={category}
              category={category}
              limit={item?.limit ?? null}
              spent={item?.spent ?? 0}
              percentage={item?.percentage ?? 0}
            />
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Rodar a migration no Supabase**

Antes de testar esta task, é preciso que a tabela `budgets` exista no banco em produção. Rode o conteúdo de `supabase/migrations/20260806130000_create_budgets_table.sql` no SQL Editor do Supabase (mesmo fluxo já usado para a migration de `GRANT` anterior).

- [ ] **Step 3: Verificar build**

Run: `npm run build`
Expected: build passa sem erros, rota `/dashboard/orcamentos` listada no output.

- [ ] **Step 4: Teste manual — definir e editar limite**

Run: `npm run dev`, abrir `http://localhost:3000/dashboard/orcamentos` logado.
Expected:
- As 9 categorias aparecem listadas, todas sem limite definido.
- Definir um limite numa categoria (ex: `500` em Alimentação) e clicar Salvar: o valor persiste após recarregar a página, e a barra de progresso aparece.
- Editar esse valor para outro número e salvar: atualiza.
- Clicar no X para remover: o limite some, categoria volta ao estado sem orçamento.

- [ ] **Step 5: Teste manual — cálculo de progresso em dois meses**

Expected:
- Num mês com despesas lançadas na categoria com limite, o valor "gasto" bate com a soma real das transações daquele mês/categoria, e a cor da barra corresponde ao percentual (azul `< 80%`, amarelo `80–100%`, laranja `> 100%`).
- Num mês sem nenhuma transação (usar o seletor de mês/ano para ir a um mês vazio), a categoria com limite mostra "R$ 0,00 de R$ X,00" sem erro na página.

- [ ] **Step 6: Commit**

```bash
git add src/app/dashboard/orcamentos/page.tsx
git commit -m "feat: adiciona tela /dashboard/orcamentos"
```

---

### Task 7: Link de navegação

**Files:**
- Modify: `src/components/dashboard/dashboard-nav.tsx:6-11`

**Interfaces:**
- Nenhuma nova — só adiciona uma entrada à lista `LINKS` já existente.

- [ ] **Step 1: Adicionar o ícone e a entrada de navegação**

Substituir:

```tsx
import { LayoutDashboard, ArrowLeftRight } from "lucide-react";

const LINKS = [
  { href: "/dashboard", label: "Visão geral", icon: LayoutDashboard },
  { href: "/dashboard/transacoes", label: "Transações", icon: ArrowLeftRight },
];
```

por:

```tsx
import { LayoutDashboard, ArrowLeftRight, Target } from "lucide-react";

const LINKS = [
  { href: "/dashboard", label: "Visão geral", icon: LayoutDashboard },
  { href: "/dashboard/transacoes", label: "Transações", icon: ArrowLeftRight },
  { href: "/dashboard/orcamentos", label: "Orçamentos", icon: Target },
];
```

- [ ] **Step 2: Teste manual**

Run: `npm run dev`, abrir `http://localhost:3000/dashboard`.
Expected: item "Orçamentos" aparece na navegação do cabeçalho, com ícone de alvo; clicar leva para `/dashboard/orcamentos` e fica destacado como ativo.

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/dashboard-nav.tsx
git commit -m "feat: adiciona Orçamentos à navegação do dashboard"
```

---

### Task 8: Card resumo no dashboard

**Files:**
- Create: `src/components/dashboard/budget-summary-card.tsx`
- Modify: `src/app/dashboard/page.tsx:1-10` (imports), `:22-24` (dados), `:68-70` (render)

**Interfaces:**
- Consumes: `BudgetProgress` de `@/lib/data/budgets` (Task 2); `BudgetProgressBar` de `@/components/dashboard/budget-progress-bar` (Task 4); `Card`/`CardContent`/`CardHeader`/`CardTitle` de `@/components/ui/card` (já existentes); `buttonVariants` de `@/components/ui/button` (já existente); `formatCurrency` de `@/lib/format` (já existente).
- Produces: `BudgetSummaryCard({ budgets: BudgetProgress[] })`.

- [ ] **Step 1: Criar o card**

```tsx
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
```

- [ ] **Step 2: Buscar os dados em `src/app/dashboard/page.tsx`**

Adicionar aos imports (perto de `import { getTransactions, summarizeTransactions } from "@/lib/data/transactions";`):

```tsx
import { getBudgetProgress } from "@/lib/data/budgets";
import { BudgetSummaryCard } from "@/components/dashboard/budget-summary-card";
```

Substituir:

```tsx
  const transactions = await getTransactions({ month, year });
  const summary = summarizeTransactions(transactions);
  const recent = transactions.slice(0, 5);
```

por:

```tsx
  const transactions = await getTransactions({ month, year });
  const summary = summarizeTransactions(transactions);
  const recent = transactions.slice(0, 5);
  const budgetProgress = await getBudgetProgress(month, year);
```

- [ ] **Step 3: Renderizar o card**

Substituir:

```tsx
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Últimas transações</CardTitle>
```

por:

```tsx
      </div>

      <BudgetSummaryCard budgets={budgetProgress} />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Últimas transações</CardTitle>
```

- [ ] **Step 4: Verificar build**

Run: `npm run build`
Expected: build passa sem erros.

- [ ] **Step 5: Teste manual**

Run: `npm run dev`, abrir `http://localhost:3000/dashboard`.
Expected: card "Orçamentos" aparece entre os gráficos de categoria e "Últimas transações", mostrando as categorias com limite definido e link "Ver todos" funcionando. Se nenhum orçamento estiver definido, mostra a chamada "Definir agora".

- [ ] **Step 6: Commit**

```bash
git add src/components/dashboard/budget-summary-card.tsx src/app/dashboard/page.tsx
git commit -m "feat: adiciona card de resumo de orçamentos no dashboard"
```

---

### Task 9: Validação final

**Files:** nenhum novo — só validação de todo o trabalho das Tasks 1–8.

- [ ] **Step 1: Build completo**

Run: `npm run build`
Expected: sem erros, todas as rotas listadas (incluindo `/dashboard/orcamentos`).

- [ ] **Step 2: Lint completo**

Run: `npm run lint`
Expected: sem erros/avisos.

- [ ] **Step 3: Repetir o teste manual de dois meses (Task 6, Step 5) de ponta a ponta**

Expected: fluxo completo — definir limite em `/dashboard/orcamentos`, ver refletido no card do dashboard, conferir cálculo em mês com transações e em mês vazio — funciona sem erros no console do navegador nem no terminal do `next dev`.

- [ ] **Step 4: Avisar o usuário para revisar antes do push**

Este plano não inclui `git push` — assim como nas mudanças anteriores, o push para produção só acontece depois que o usuário revisar e aprovar explicitamente.
