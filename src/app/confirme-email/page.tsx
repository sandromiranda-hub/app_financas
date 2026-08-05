import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MailCheck, Wallet } from "lucide-react";

export default async function ConfirmeEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-6 flex items-center justify-center gap-2 text-lg font-semibold"
        >
          <Wallet className="size-5 text-primary" />
          Controle Financeiro
        </Link>
        <Card>
          <CardHeader className="items-center text-center">
            <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <MailCheck className="size-6 text-primary" />
            </div>
            <CardTitle>Confirme seu e-mail</CardTitle>
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
            <Link href="/login" className={cn(buttonVariants(), "w-full")}>
              Ir para o login
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
