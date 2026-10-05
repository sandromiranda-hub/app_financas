import { createAdminClient } from "@/lib/supabase/admin";

// Chamada periodicamente pelo Vercel Cron (vercel.json) só para gerar
// atividade real de API no Supabase — o plano Free pausa projetos após
// ~7 dias sem requisições, e isso evita depender de uso manual do app
// para manter o banco ativo.
//
// Diferente de um health check público, aqui a query precisa do client
// admin: nenhuma tabela deste projeto tem GRANT para o role "anon" (ver
// supabase/migrations), então uma query anônima falharia com "permission
// denied" e o cron marcaria erro todo dia. Por isso a rota exige o
// CRON_SECRET — sem ele, seria um endpoint público rodando com
// service_role.
//
// Um banco já pausado não responde à primeira tentativa (timeout/fetch
// failed) — por isso o retry com espera: a primeira chamada "acorda" o
// projeto, e a tentativa seguinte, já com o banco de pé, confirma o
// health check com sucesso em vez de reportar falha. Confirmado em
// produção no PipeFlow CRM (mesmo padrão de keep-alive) que uma única
// tentativa sem retry deixava o projeto pausar mesmo com o cron ativo.
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ status: "unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const attempts = 3;
  let lastError: string | null = null;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    const { error } = await supabase
      .from("user_access")
      .select("user_id", { count: "exact", head: true });

    if (!error) {
      return Response.json({ status: "ok", attempt, timestamp: new Date().toISOString() });
    }

    lastError = error.message;
    if (attempt < attempts) {
      await sleep(attempt * 3000);
    }
  }

  return Response.json({ status: "error", message: lastError, attempts }, { status: 500 });
}
