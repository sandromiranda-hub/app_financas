-- Controle de acesso por usuário: cada usuário tem uma liberação com
-- validade opcional (null = nunca expira — usado pra acesso gratuito
-- permanente, ex: família). Todo novo cadastro recebe automaticamente um
-- teste de 14 dias via trigger; extensões, conversão pra pago ou acesso
-- vitalício são feitas manualmente no Table Editor do Supabase (só o
-- role postgres tem permissão de escrita nesta tabela).

create table if not exists public.user_access (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  expires_at timestamptz,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_access_expires_at_idx on public.user_access (expires_at);

drop trigger if exists user_access_set_updated_at on public.user_access;
create trigger user_access_set_updated_at
  before update on public.user_access
  for each row
  execute function public.set_updated_at();

alter table public.user_access enable row level security;

drop policy if exists "Usuários podem ver sua própria liberação de acesso" on public.user_access;
create policy "Usuários podem ver sua própria liberação de acesso"
  on public.user_access for select
  using (auth.uid() = user_id);

grant usage on schema public to authenticated;
grant select on public.user_access to authenticated;
-- Sem insert/update/delete para "authenticated": só o trigger abaixo (que
-- roda como definer, ignorando RLS) e o Table Editor (role postgres)
-- podem escrever nesta tabela.

-- O painel de admin usa a service_role key (ignora RLS, mas ainda precisa
-- da permissão básica de acesso ao objeto — sem isso dá "permission denied"
-- mesmo com a chave certa).
grant select, update on public.user_access to service_role;

-- Concede 14 dias de teste automaticamente a cada novo usuário criado em
-- auth.users — inclusive os criados manualmente por você no painel.
create or replace function public.grant_trial_access()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_access (user_id, expires_at, note)
  values (new.id, now() + interval '14 days', 'Teste automático (14 dias)');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_grant_trial on auth.users;
create trigger on_auth_user_created_grant_trial
  after insert on auth.users
  for each row
  execute function public.grant_trial_access();

-- Retroativo: o gatilho acima só vale pra cadastros novos. Sem isso, quem
-- já tem conta (inclusive você) ficaria bloqueado ao rodar esta migration.
-- Libera todo mundo que já existe sem validade (ajuste depois, pessoa por
-- pessoa, no Table Editor).
insert into public.user_access (user_id, expires_at, note)
select id, null, 'Acesso migrado automaticamente (ajuste conforme necessário)'
from auth.users
on conflict (user_id) do nothing;

-- View de conferência: abra no Table Editor (aparece junto das tabelas)
-- pra ver rapidamente quem está vencendo, ordenado do mais próximo pro
-- mais distante (acessos sem validade ficam por último).
create or replace view public.user_access_overview as
select
  ua.user_id,
  au.email,
  ua.expires_at,
  ua.note,
  case
    when ua.expires_at is null then null
    else extract(day from ua.expires_at - now())::int
  end as dias_restantes
from public.user_access ua
join auth.users au on au.id = ua.user_id
order by ua.expires_at asc nulls last;

grant select on public.user_access_overview to service_role;
