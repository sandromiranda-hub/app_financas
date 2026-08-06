-- Corrige "permission denied for table transactions" em produção.
--
-- O RLS (supabase/schema.sql) já estava correto, mas o GRANT que precisa
-- rodar antes das políticas de RLS serem avaliadas nunca tinha sido
-- aplicado no banco em produção — só existia no schema.sql local.
-- GRANT é idempotente: seguro rodar de novo mesmo se já aplicado.

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.transactions to authenticated;
