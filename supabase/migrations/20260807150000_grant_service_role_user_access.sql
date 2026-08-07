-- Corrige "permission denied for view user_access_overview" no painel de
-- admin. A migration anterior (20260807140000) concedeu select em
-- user_access só para "authenticated" — esqueceu do "service_role", que é
-- quem o painel de admin usa (ignora RLS, mas ainda precisa da permissão
-- básica de acesso ao objeto).

grant select on public.user_access_overview to service_role;
grant select, update on public.user_access to service_role;
