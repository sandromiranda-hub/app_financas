import Link from "next/link";
import { redirect } from "next/navigation";
import { Poppins } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { UserMenu } from "@/components/dashboard/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandMark } from "@/components/brand-mark";

// Identidade visual da Ikigai Booking (guia de marca), aplicada só dentro do app logado.
// Sobrescreve apenas os tokens de marca (primária, foco, gráficos) — não mexe em
// --background/--card/--foreground, que continuam adaptando ao tema claro/escuro.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div
      className={`${poppins.variable} flex min-h-svh flex-col bg-muted/20`}
      style={{
        fontFamily: "var(--font-poppins)",
        ["--primary" as string]: "#367BEC",
        ["--primary-foreground" as string]: "#FFFFFF",
        ["--ring" as string]: "#367BEC",
        ["--font-heading" as string]: "var(--font-poppins)",
        ["--chart-1" as string]: "#367BEC",
        ["--chart-2" as string]: "#FF7217",
        ["--chart-3" as string]: "#74C210",
        ["--chart-4" as string]: "#FFB715",
        ["--chart-5" as string]: "#72A7FF",
        ["--chart-6" as string]: "#FFA265",
        ["--chart-7" as string]: "#AFE070",
        ["--chart-8" as string]: "#0F1C3E",
      }}
    >
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <BrandMark size={28} />
            <span className="leading-tight">
              <span className="block text-xs text-foreground">Controle</span>
              <span className="block text-sm font-bold text-primary">Financeiro</span>
            </span>
          </Link>
          <DashboardNav className="order-3 w-full justify-center sm:order-none sm:w-auto sm:justify-start" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserMenu email={user.email ?? ""} />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
