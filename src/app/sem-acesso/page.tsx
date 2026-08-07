import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthShell } from "@/components/auth/auth-shell";
import { logout } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { ShieldOff } from "lucide-react";

export default function SemAcessoPage() {
  return (
    <AuthShell>
      <Card className="rounded-2xl border-none shadow-[0_20px_50px_-20px_rgba(15,28,62,0.25)]">
        <CardHeader className="items-center text-center">
          <div
            className="mb-2 flex size-12 items-center justify-center rounded-full"
            style={{ background: "rgba(139,58,58,.1)" }}
          >
            <ShieldOff className="size-6" style={{ color: "#8B3A3A" }} />
          </div>
          <CardTitle className="text-xl font-semibold" style={{ color: "#0F1C3E" }}>
            Seu acesso não está ativo
          </CardTitle>
          <CardDescription>
            Seu período de teste terminou ou seu acesso ainda não foi liberado.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            Fale com quem te convidou para liberar ou renovar o seu acesso.
          </p>
          <form action={logout}>
            <Button type="submit" variant="outline" className="w-full">
              Sair
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
