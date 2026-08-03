"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
  redirectTo,
  justRegistered,
}: {
  redirectTo: string;
  justRegistered: boolean;
}) {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />

      {justRegistered && !state?.error && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          Conta criada com sucesso. Faça login para continuar.
        </p>
      )}

      <div className="grid gap-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="voce@email.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Entrando..." : "Entrar"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Não tem uma conta?{" "}
        <Link href="/cadastro" className="font-medium text-primary hover:underline">
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}
