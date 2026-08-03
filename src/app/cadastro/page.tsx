import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignupForm } from "@/components/auth/signup-form";
import { Wallet } from "lucide-react";

export default function CadastroPage() {
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
            <CardTitle>Criar sua conta</CardTitle>
            <CardDescription>
              Comece a organizar suas finanças em minutos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
