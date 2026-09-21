import { createAdminClient } from "@/lib/supabase/admin";

// Chamada 1x por dia pelo Vercel Cron (vercel.json) só para gerar atividade
// real de API no Supabase — o plano Free pausa projetos após ~7 dias sem
// requisições, e isso evita depender de uso manual do app para manter o
// banco ativo.
//
// Diferente de um health check público, aqui a query precisa do client
// admin: nenhuma tabela deste projeto tem GRANT para o role "anon" (ver
// supabase/migrations), então uma query anônima falharia com "permission
// denied" e o cron marcaria erro todo dia. Por isso a rota exige o
// CRON_SECRET — sem ele, seria um endpoint público rodando com
// service_role.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ status: "unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("user_access")
    .select("user_id", { count: "exact", head: true });

  if (error) {
    return Response.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }

  return Response.json({ status: "ok", timestamp: new Date().toISOString() });
}
