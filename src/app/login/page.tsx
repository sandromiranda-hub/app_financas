import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthShell>
      <Card className="rounded-2xl border-none shadow-[0_20px_50px_-20px_rgba(15,28,62,0.25)]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold" style={{ color: "#0F1C3E" }}>
            Entrar na sua conta
          </CardTitle>
          <CardDescription>Acesse seu painel financeiro.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm redirectTo={params.redirectTo ?? "/dashboard"} />
        </CardContent>
      </Card>
    </AuthShell>
  );
}
