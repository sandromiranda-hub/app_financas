import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthShell } from "@/components/auth/auth-shell";
import { MailCheck } from "lucide-react";

export default async function ConfirmeEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <AuthShell>
      <Card className="rounded-2xl border-none shadow-[0_20px_50px_-20px_rgba(15,28,62,0.25)]">
        <CardHeader className="items-center text-center">
          <div
            className="mb-2 flex size-12 items-center justify-center rounded-full"
            style={{ background: "rgba(54,123,236,.1)" }}
          >
            <MailCheck className="size-6 text-primary" />
          </div>
          <CardTitle className="text-xl font-semibold" style={{ color: "#0F1C3E" }}>
            Confirme seu e-mail
          </CardTitle>
          <CardDescription>
            {email ? (
              <>
                Enviamos um link de confirmação para{" "}
                <span className="font-medium text-foreground">{email}</span>.
              </>
            ) : (
              "Enviamos um link de confirmação para o e-mail informado no cadastro."
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            Abra sua caixa de entrada e clique no link para ativar sua conta.
            Não esqueça de checar a pasta de spam ou lixo eletrônico caso não
            encontre o e-mail.
          </p>
          <Link
            href="/login"
            className="w-full rounded-full bg-[#FFB715] px-4 py-2 text-center text-sm font-semibold text-[#0F1C3E] hover:bg-[#ffc340]"
          >
            Ir para o login
          </Link>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
