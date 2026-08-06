-- Finanças Pessoais App — schema do banco de dados
-- Execute este script no SQL Editor do seu projeto Supabase (https://app.supabase.com)

-- 1. Tipos enumerados -------------------------------------------------------

create type transaction_type as enum ('receita', 'despesa');

create type transaction_category as enum (
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Saúde',
  'Educação',
  'Salário',
  'Freelance',
  'Outros'
);

-- 2. Tabela de transações ----------------------------------------------------

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  description text not null,
  amount numeric(12, 2) not null check (amount > 0),
  type transaction_type not null,
  category transaction_category not null default 'Outros',
  transaction_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists transactions_user_id_idx on public.transactions (user_id);
create index if not exists transactions_date_idx on public.transactions (transaction_date);
create index if not exists transactions_user_date_idx on public.transactions (user_id, transaction_date desc);

-- Mantém updated_at sincronizado a cada alteração
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists transactions_set_updated_at on public.transactions;
create trigger transactions_set_updated_at
  before update on public.transactions
  for each row
  execute function public.set_updated_at();

-- 3. Row Level Security -------------------------------------------------------
-- Cada usuário só pode ver e gerenciar suas próprias transações.

alter table public.transactions enable row level security;

create policy "Usuários podem ver suas próprias transações"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Usuários podem inserir suas próprias transações"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Usuários podem atualizar suas próprias transações"
  on public.transactions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Usuários podem excluir suas próprias transações"
  on public.transactions for delete
  using (auth.uid() = user_id);

-- 4. Privilégios de tabela ----------------------------------------------------
-- O RLS acima só é avaliado depois que a role passa pela checagem de GRANT.
-- Sem isso, qualquer acesso à tabela falha com "permission denied".

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.transactions to authenticated;

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

drop policy if exists "Usuários podem ver seus próprios orçamentos" on public.budgets;
create policy "Usuários podem ver seus próprios orçamentos"
  on public.budgets for select
  using (auth.uid() = user_id);

drop policy if exists "Usuários podem inserir seus próprios orçamentos" on public.budgets;
create policy "Usuários podem inserir seus próprios orçamentos"
  on public.budgets for insert
  with check (auth.uid() = user_id);

drop policy if exists "Usuários podem atualizar seus próprios orçamentos" on public.budgets;
create policy "Usuários podem atualizar seus próprios orçamentos"
  on public.budgets for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Usuários podem excluir seus próprios orçamentos" on public.budgets;
create policy "Usuários podem excluir seus próprios orçamentos"
  on public.budgets for delete
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.budgets to authenticated;
