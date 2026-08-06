import Link from "next/link";
import { Poppins } from "next/font/google";
import {
  PieChart,
  SlidersHorizontal,
  Download,
  ShieldCheck,
  Smartphone,
  Tag,
  ArrowUp,
  ArrowDown,
  Wallet,
} from "lucide-react";
import { BrandRail } from "@/components/landing/brand-rail";

// Identidade visual da Ikigai Booking (guia de marca), aprovada para landing,
// login e área logada. Tokens sobrescritos só nesta página.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const FEATURES = [
  {
    icon: PieChart,
    title: "Veja o mês inteiro num olhar",
    description:
      "Receitas, despesas e saldo em cards claros, com o gráfico por categoria sempre à mão.",
  },
  {
    icon: SlidersHorizontal,
    title: "Filtre até achar o que procura",
    description: "Por mês, por ano, por categoria ou pelo nome da transação.",
  },
  {
    icon: Download,
    title: "Leve seus dados pra onde quiser",
    description: "Exporte em CSV com um clique e abra na sua planilha de sempre.",
  },
  {
    icon: ShieldCheck,
    title: "Só você vê o que é seu",
    description:
      "Login seguro e permissões por linha garantem que ninguém mais acesse suas transações.",
  },
  {
    icon: Smartphone,
    title: "Do bolso à mesa de trabalho",
    description: "A mesma clareza no celular, no tablet e no computador.",
  },
  {
    icon: Tag,
    title: "Categorias já prontas",
    description:
      "Alimentação, transporte, moradia, lazer e mais — comece a categorizar no primeiro lançamento.",
  },
];

const CHAPTER_INDEX = [
  { idx: "2.1", label: "Painel visual" },
  { idx: "2.2", label: "Filtros poderosos" },
  { idx: "2.3", label: "Exportação CSV" },
  { idx: "2.4", label: "Segurança" },
  { idx: "2.5", label: "Responsivo" },
  { idx: "2.6", label: "Categorias prontas" },
];

const DESPESAS_LEGEND = [
  { color: "#FF7217", label: "Moradia", value: "47%" },
  { color: "#FFA265", label: "Alimentação", value: "25%" },
  { color: "#74C210", label: "Transporte", value: "15%" },
  { color: "#72A7FF", label: "Outros", value: "13%" },
];

const RECEITAS_LEGEND = [
  { color: "#367BEC", label: "Salário", value: "80%" },
  { color: "#72A7FF", label: "Freelance", value: "20%" },
];

function BrandMark({ size = 34 }: { size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, background: "#367BEC" }}
    >
      <svg
        width={size * 0.47}
        height={size * 0.47}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M5 17V13M12 17V9M19 17V6" />
      </svg>
    </span>
  );
}

function YellowButton({
  href,
  children,
  large = false,
}: {
  href: string;
  children: React.ReactNode;
  large?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 rounded-full bg-[#FFB715] font-semibold text-[#0F1C3E] transition-transform hover:-translate-y-0.5 hover:bg-[#ffc340] ${
        large ? "px-7 py-3.5 text-base" : "px-5 py-2.5 text-sm"
      }`}
    >
      {children}
    </Link>
  );
}

export default function LandingPage() {
  return (
    <div
      id="top"
      className={`${poppins.variable} md:pl-16`}
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      <BrandRail />

      <header className="border-b border-[#EEF0F5]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-5">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandMark />
            <span className="leading-tight">
              <span className="block text-sm text-[#0F1C3E]">Controle</span>
              <span className="block text-base font-bold text-[#367BEC]">Financeiro</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-semibold text-[#0F1C3E] hover:bg-[#F1F3F8]"
            >
              Entrar
            </Link>
            <YellowButton href="/cadastro">Criar conta grátis</YellowButton>
          </nav>
        </div>
      </header>

      <main>
        <section id="hero" className="relative overflow-hidden bg-[#367BEC] py-16 text-white sm:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] text-white/60">
                CONTROLE FINANCEIRO · 2026
              </span>
              <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.15] sm:text-5xl">
                Você sabe pra onde vai o seu dinheiro{" "}
                <span className="inline-block rounded-lg bg-[#FFB715] px-2 py-0.5 text-[#0F1C3E]">
                  este mês?
                </span>
              </h1>
              <p className="mt-4 max-w-md text-balance text-white/85">
                Registre receitas e despesas, acompanhe seu saldo e entenda seus gastos por
                categoria — tudo em um painel simples e rápido.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <YellowButton href="/cadastro" large>
                  Criar conta grátis ›
                </YellowButton>
                <Link
                  href="/login"
                  className="inline-flex items-center rounded-full border border-white/50 px-7 py-3.5 text-base font-semibold text-white hover:bg-white/10"
                >
                  Já tenho conta
                </Link>
              </div>
            </div>

            <div className="relative mx-auto aspect-square w-full max-w-[380px]" aria-hidden>
              <svg viewBox="0 0 100 100" fill="none" className="absolute -left-8 -top-6 w-28">
                <path d="M12,75 A50,50 0 0,1 75,12" stroke="#0F1C3E" strokeWidth="9" strokeLinecap="round" />
              </svg>
              <svg viewBox="0 0 100 100" fill="none" className="absolute -bottom-4 left-4 w-24">
                <path d="M10,55 A45,45 0 0,1 55,10" stroke="#FFB715" strokeWidth="9" strokeLinecap="round" />
              </svg>
              <svg viewBox="0 0 100 100" fill="none" className="absolute -right-10 top-4 w-32">
                <path
                  d="M15,85 A60,60 0 0,0 85,15"
                  stroke="rgba(255,255,255,.65)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-[9%] flex items-center justify-center rounded-full bg-white shadow-[0_30px_70px_-25px_rgba(6,14,36,0.55)]">
                <div
                  className="relative aspect-square w-[62%] rounded-full"
                  style={{
                    background:
                      "conic-gradient(#367BEC 0% 62%, #FF7217 62% 85%, #FFB715 85% 100%)",
                  }}
                >
                  <div className="absolute inset-[20%] flex flex-col items-center justify-center rounded-full bg-white text-center">
                    <b className="text-[1.05rem] text-[#0F1C3E]">R$ 2.020</b>
                    <span className="text-[0.66rem] uppercase tracking-wide text-[#5B647A]">
                      Saldo
                    </span>
                  </div>
                </div>
                <span className="absolute -top-[6%] right-[2%] flex size-8 items-center justify-center rounded-full bg-[#74C210] text-white shadow-[0_8px_16px_-8px_rgba(0,0,0,0.35)]">
                  <ArrowUp className="size-3.5" strokeWidth={2.75} />
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#0F1C3E] py-14 text-white">
          <div className="mx-auto max-w-6xl px-8">
            <span className="flex size-11 items-center justify-center rounded-full border border-[#FFB715] text-[#FFB715]">
              02
            </span>
            <h2 className="mt-5 text-3xl font-semibold sm:text-4xl">Recursos</h2>
            <p className="mt-2 max-w-md text-white/75">
              Tudo o que você precisa pra organizar seu dinheiro, sem planilha complicada.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-9 gap-y-2">
              {CHAPTER_INDEX.map(({ idx, label }) => (
                <span key={idx} className="text-sm text-white/85">
                  <span className="mr-1.5 font-semibold text-[#FFB715]">{idx}</span>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="recursos" className="bg-[#FAFAFA] py-16">
          <div className="mx-auto max-w-6xl px-8">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, description }, i) => (
                <article
                  key={title}
                  className="rounded-2xl bg-white p-6 shadow-[0_14px_30px_-24px_rgba(15,28,62,0.35)]"
                >
                  <div
                    className="mb-4 flex size-11 items-center justify-center rounded-xl"
                    style={
                      i === 1 || i === 4
                        ? { background: "rgba(255,183,21,.16)", color: "#B87E00" }
                        : { background: "rgba(54,123,236,.1)", color: "#367BEC" }
                    }
                  >
                    <Icon className="size-5" strokeWidth={1.8} />
                  </div>
                  <h3 className="text-base font-semibold text-[#0F1C3E]">{title}</h3>
                  <p className="mt-1.5 text-sm text-[#5B647A]">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#367BEC] py-14 text-white">
          <div className="mx-auto max-w-6xl px-8">
            <span className="flex size-11 items-center justify-center rounded-full border border-white text-white">
              03
            </span>
            <h2 className="mt-5 text-3xl font-semibold sm:text-4xl">Painel</h2>
            <p className="mt-2 max-w-md text-white/80">
              Um retrato do seu mês, em segundos — igual ao que você vê dentro do app.
            </p>
          </div>
        </section>

        <section id="painel" className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-8">
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="overflow-hidden rounded-2xl shadow-[0_14px_30px_-22px_rgba(15,28,62,0.3)]">
                <div className="flex h-20 items-start justify-end bg-[#367BEC] p-3">
                  <ArrowUp className="size-4 text-white" strokeWidth={2.5} />
                </div>
                <div className="p-4">
                  <div className="text-sm text-[#5B647A]">Receitas</div>
                  <div className="text-xl font-semibold text-[#0F1C3E]">R$ 5.200,00</div>
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl shadow-[0_14px_30px_-22px_rgba(15,28,62,0.3)]">
                <div className="flex h-20 items-start justify-end bg-[#FF7217] p-3">
                  <ArrowDown className="size-4 text-white" strokeWidth={2.5} />
                </div>
                <div className="p-4">
                  <div className="text-sm text-[#5B647A]">Despesas</div>
                  <div className="text-xl font-semibold text-[#0F1C3E]">R$ 3.180,00</div>
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl shadow-[0_14px_30px_-22px_rgba(15,28,62,0.3)]">
                <div className="flex h-20 items-start justify-end bg-[#FFB715] p-3">
                  <Wallet className="size-4 text-[#0F1C3E]" strokeWidth={2.2} />
                </div>
                <div className="p-4">
                  <div className="text-sm text-[#5B647A]">Saldo</div>
                  <div className="text-xl font-semibold text-[#0F1C3E]">R$ 2.020,00</div>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div className="flex items-center gap-5">
                <div
                  className="relative size-21 shrink-0 rounded-full"
                  style={{
                    background:
                      "conic-gradient(#FF7217 0% 47%, #FFA265 47% 72%, #74C210 72% 87%, #72A7FF 87% 100%)",
                  }}
                >
                  <div className="absolute inset-4 rounded-full bg-white" />
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-[#5B647A]">
                    Despesas por categoria
                  </h4>
                  <ul className="space-y-1 text-sm text-[#5B647A]">
                    {DESPESAS_LEGEND.map(({ color, label, value }) => (
                      <li key={label} className="flex items-center gap-2">
                        <span
                          className="size-2 shrink-0 rounded-full"
                          style={{ background: color }}
                        />
                        {label} · {value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div
                  className="relative size-21 shrink-0 rounded-full"
                  style={{
                    background: "conic-gradient(#367BEC 0% 80%, #72A7FF 80% 100%)",
                  }}
                >
                  <div className="absolute inset-4 rounded-full bg-white" />
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-[#5B647A]">
                    Receitas por categoria
                  </h4>
                  <ul className="space-y-1 text-sm text-[#5B647A]">
                    {RECEITAS_LEGEND.map(({ color, label, value }) => (
                      <li key={label} className="flex items-center gap-2">
                        <span
                          className="size-2 shrink-0 rounded-full"
                          style={{ background: color }}
                        />
                        {label} · {value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="comecar" className="bg-[#0F1C3E] py-20 text-center text-white">
          <div className="mx-auto max-w-6xl px-8">
            <h2 className="mx-auto max-w-md text-balance text-3xl font-semibold sm:text-4xl">
              Pronto pra organizar suas finanças{" "}
              <span className="inline-block rounded-lg bg-[#FFB715] px-2 py-0.5 text-[#0F1C3E]">
                este mês?
              </span>
            </h2>
            <p className="mt-3 text-white/75">Grátis para criar sua conta. Leva menos de um minuto.</p>
            <div className="mt-7 flex justify-center">
              <YellowButton href="/cadastro" large>
                Criar conta grátis ›
              </YellowButton>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#EEF0F5] bg-[#FAFAFA] py-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-8">
          <Link href="/" className="flex items-center gap-2">
            <BrandMark size={26} />
            <span className="text-sm font-bold text-[#367BEC]">Controle Financeiro</span>
          </Link>
          <p className="text-sm text-[#5B647A]">© 2026 Controle Financeiro. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
