import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignupForm } from "@/components/auth/signup-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function CadastroPage() {
  return (
    <AuthShell>
      <Card className="rounded-2xl border-none shadow-[0_20px_50px_-20px_rgba(15,28,62,0.25)]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold" style={{ color: "#0F1C3E" }}>
            Criar sua conta
          </CardTitle>
          <CardDescription>Comece a organizar suas finanças em minutos.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
      </Card>
    </AuthShell>
  );
}
