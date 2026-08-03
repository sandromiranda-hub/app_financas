import Link from "next/link";
import { redirect } from "next/navigation";
import { Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { UserMenu } from "@/components/dashboard/user-menu";

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
    <div className="flex min-h-svh flex-col bg-muted/20">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Wallet className="size-5 text-primary" />
            Finanças
          </Link>
          <DashboardNav className="order-3 w-full justify-center sm:order-none sm:w-auto sm:justify-start" />
          <UserMenu email={user.email ?? ""} />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
