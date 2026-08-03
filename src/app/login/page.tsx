import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import { Wallet } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; cadastrado?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-6 flex items-center justify-center gap-2 text-lg font-semibold"
        >
          <Wallet className="size-5 text-primary" />
          Finanças
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Entrar na sua conta</CardTitle>
            <CardDescription>
              Acesse seu painel financeiro pessoal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm
              redirectTo={params.redirectTo ?? "/dashboard"}
              justRegistered={params.cadastrado === "1"}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
