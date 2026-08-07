import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAllUserAccess, isAdmin } from "@/lib/data/admin";
import { AdminUserRow } from "@/components/admin/admin-user-row";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdmin(user?.email)) {
    redirect("/dashboard");
  }

  const rows = await getAllUserAccess();

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Usuários</h1>
        <p className="text-sm text-muted-foreground">
          {rows.length} usuário{rows.length === 1 ? "" : "s"} — ordenado por vencimento mais próximo.
        </p>
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead>Conceder acesso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <AdminUserRow key={row.user_id} row={row} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
