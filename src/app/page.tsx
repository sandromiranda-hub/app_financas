import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Wallet,
  PieChart,
  SlidersHorizontal,
  Download,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

const FEATURES = [
  {
    icon: PieChart,
    title: "Dashboard visual",
    description:
      "Veja receitas, despesas e saldo do mês em cards claros, com gráfico de pizza por categoria.",
  },
  {
    icon: SlidersHorizontal,
    title: "Filtros poderosos",
    description:
      "Filtre por mês, ano e categoria, ou busque uma transação específica pela descrição.",
  },
  {
    icon: Download,
    title: "Exportação em CSV",
    description:
      "Exporte suas transações filtradas com um clique para usar em planilhas ou relatórios.",
  },
  {
    icon: ShieldCheck,
    title: "Seus dados, só seus",
    description:
      "Autenticação segura e Row Level Security garantem que só você acesse suas transações.",
  },
  {
    icon: Smartphone,
    title: "Responsivo",
    description:
      "Interface adaptada para celular, tablet e desktop, sempre que você precisar consultar.",
  },
  {
    icon: Wallet,
    title: "Categorias prontas",
    description:
      "Alimentação, transporte, moradia, lazer e mais — categorize sem esforço.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2 font-semibold">
            <Wallet className="size-5 text-primary" />
            Controle Financeiro
          </div>
          <nav className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }))}>
              Entrar
            </Link>
            <Link href="/cadastro" className={cn(buttonVariants())}>
              Criar conta grátis
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="mx-auto max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Controle suas finanças pessoais de forma simples e visual
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-balance text-lg text-muted-foreground">
            Registre receitas e despesas, acompanhe seu saldo mensal e entenda
            para onde vai seu dinheiro — tudo em um só lugar.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/cadastro" className={cn(buttonVariants({ size: "lg" }))}>
              Começar agora
            </Link>
            <Link
              href="/login"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
            >
              Já tenho conta
            </Link>
          </div>
        </section>

        <section className="border-t bg-muted/30 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Tudo que você precisa para organizar seu dinheiro
              </h2>
              <p className="mt-3 text-muted-foreground">
                Sem planilhas complicadas, sem anotações espalhadas.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <Card key={title}>
                  <CardHeader>
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <CardTitle className="mt-2">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                  <CardContent />
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Pronto para organizar sua vida financeira?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Crie sua conta gratuitamente e comece agora mesmo.
          </p>
          <div className="mt-6">
            <Link href="/cadastro" className={cn(buttonVariants({ size: "lg" }))}>
              Criar conta grátis
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
          © 2026 Controle Financeiro. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
