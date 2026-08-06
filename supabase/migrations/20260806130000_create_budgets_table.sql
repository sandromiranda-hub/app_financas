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
