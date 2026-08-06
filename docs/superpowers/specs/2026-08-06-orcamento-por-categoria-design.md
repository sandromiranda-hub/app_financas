# Orçamento por categoria — design

Data: 2026-08-06
Status: aprovado, aguardando plano de implementação

## Contexto

O Controle Financeiro (Next.js + Supabase) está em produção com autenticação, CRUD de
transações, categorias fixas, filtros, exportação CSV e um dashboard com gráficos de
receitas/despesas por categoria. Esta é a primeira de três frentes identificadas para a v2
(orçamento por categoria, categorias personalizadas, visão de tendência ao longo do tempo) —
as outras duas ficam para specs futuros, decompostas deliberadamente para não crescer o
escopo de uma vez.

## Objetivo

Permitir que o usuário defina um limite de gasto mensal por categoria e acompanhe visualmente
o quanto já gastou contra esse limite, no mês selecionado.

## Decisões de escopo (confirmadas com o usuário)

- "Meta personalizada" e "orçamento por categoria" são o mesmo conceito — não existe um
  conceito separado de "meta de economia" nesta v2.
- O limite é **recorrente**: definido uma vez por categoria, vale todo mês até ser alterado.
  Não há limites diferentes por mês/ano.
- Orçamento se aplica apenas a categorias de despesa (o cálculo de "gasto" soma só
  transações do tipo `despesa`).
- Fica visível em dois lugares: uma tela dedicada para gerenciar os limites, e um resumo no
  dashboard existente.
- Sem alertas ativos (toast/notificação) nesta versão — só indicação visual (cor/barra de
  progresso).
- Sem histórico de mudanças de limite.

## Modelo de dados

Nova tabela `public.budgets`, seguindo o mesmo padrão de `public.transactions` (schema em
`supabase/schema.sql`) — RLS por `user_id` e os `GRANT`s incluídos desde a criação, para não
repetir o bug de "permission denied" corrigido em `supabase/migrations/20260806120000_grant_transactions_permissions.sql`.

```sql
create table public.budgets (
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

`unique (user_id, category)` reflete a recorrência automática: no máximo um limite ativo por
categoria por usuário. Reaproveita a função `set_updated_at()` já existente.

Este SQL deve ser adicionado tanto a `supabase/schema.sql` (documentação do schema completo)
quanto a uma nova migration em `supabase/migrations/`, e rodado manualmente no SQL Editor do
Supabase (mesmo fluxo já usado para a correção de permissões).

## Camada de dados — `src/lib/data/budgets.ts`

Segue o mesmo padrão de `src/lib/data/transactions.ts` (server-only, usa
`createClient()` de `@/lib/supabase/server`):

- `getBudgets(): Promise<Budget[]>` — todos os limites do usuário autenticado.
- `getBudgetProgress(month, year): Promise<BudgetProgress[]>` — combina `getBudgets()` com o
  agrupamento de despesas por categoria já calculado por `summarizeTransactions` (não precisa
  de query SQL de agregação nova). Cada item: `{ category, limit, spent, percentage }`.

Server actions em `src/lib/actions/budgets.ts` (mesmo padrão de
`src/lib/actions/transactions.ts`):

- `upsertBudget(category, limitAmount)` — insere ou atualiza (on conflict `user_id, category`
  do update) o limite de uma categoria.
- `deleteBudget(category)` — remove o limite de uma categoria (equivalente a limpar o campo
  na UI).

### Tratamento de erros

- `limit_amount` deve ser um número positivo — validado no cliente (input `type="number"
  min="0.01"`) e reforçado pelo `check (limit_amount > 0)` no banco.
- Erros do Supabase (rede, RLS, permissão) retornam `{ error: string }` da server action,
  exibido no formulário — mesmo padrão usado em `login`/`createTransaction`.
- Limpar o campo e salvar chama `deleteBudget` em vez de `upsertBudget` com valor zero.

## UI — tela dedicada `/dashboard/orcamentos`

Nova página seguindo o padrão de `src/app/dashboard/transacoes/page.tsx`:

- Usa `PeriodSelector` (mês/ano) já existente, para ver o progresso de meses passados —
  o limite é o mesmo todo mês, mas o "gasto" muda conforme o mês selecionado.
- Lista as 9 categorias fixas (`CATEGORIES` de `@/lib/supabase/types`). Cada linha:
  nome da categoria, campo de valor (editável inline, com botão salvar), barra de progresso e
  texto "R$ gasto / R$ limite" para categorias com limite definido; categorias sem limite
  mostram só o campo vazio para definir um.
- Novo item de navegação em `DashboardNav` ("Orçamentos", ícone `Target` do lucide-react).

## UI — resumo no dashboard (`/dashboard`)

Novo card na Visão geral, abaixo dos gráficos de categoria existentes
(`Despesas por categoria` / `Receitas por categoria`), mostrando as categorias que têm
limite definido com sua barra de progresso, e link "Ver todos" para `/dashboard/orcamentos`
— mesmo padrão visual do card "Últimas transações" já existente. Se nenhum orçamento estiver
definido, mostra uma chamada para configurar (mesmo padrão de estado vazio já usado no
`CategoryPieChart`).

## Tratamento visual

Reaproveita a paleta da identidade Ikigai já aplicada no app:

- `< 80%` do limite: azul `#367BEC` (dentro do esperado)
- `80–100%`: amarelo `#FFB715` (atenção)
- `> 100%`: laranja `#FF7217` (estourado)

## Fora de escopo

- Notificações/alertas ativos (toast, e-mail, push)
- Limite variável mês a mês — é recorrente por design
- Orçamento para categorias de receita
- Histórico de mudanças de limite
- Categorias personalizadas (spec futuro, separado)
- Visão de tendência ao longo do tempo (spec futuro, separado)

## Testes

O projeto não tem framework de testes automatizados configurado (`package.json` só define
`dev`/`build`/`start`/`lint`). Validação será manual: `npm run build` + `npm run lint` antes
de qualquer deploy (mesmo processo já usado nas mudanças anteriores), e teste manual do fluxo
de definir/editar/remover limite e verificar o cálculo de progresso em pelo menos dois meses
diferentes (um com transações, um vazio).
