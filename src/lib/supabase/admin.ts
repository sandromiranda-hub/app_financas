import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Cliente com a service role key: ignora RLS por completo. Só pode ser
// usado em código server-only, depois de confirmar que quem chamou é o
// administrador (ver src/lib/data/admin.ts). Nunca importar em um
// componente client nem expor o valor da chave ao navegador.
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
