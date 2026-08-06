import Link from "next/link";
import { Poppins } from "next/font/google";
import { BrandMark } from "@/components/brand-mark";

// Identidade visual da Ikigai Booking (guia de marca), aplicada às telas
// de autenticação (login, cadastro, confirmação de e-mail). Tokens
// sobrescritos só dentro deste wrapper.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${poppins.variable} relative flex min-h-svh items-center justify-center overflow-hidden p-4`}
      style={{
        background: "#FAFAFA",
        color: "#0F1C3E",
        fontFamily: "var(--font-poppins)",
        ["--primary" as string]: "#367BEC",
        ["--primary-foreground" as string]: "#FFFFFF",
        ["--ring" as string]: "#367BEC",
        ["--foreground" as string]: "#0F1C3E",
        ["--font-heading" as string]: "var(--font-poppins)",
      }}
    >
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        fill="none"
        className="pointer-events-none absolute -left-10 top-10 w-40 opacity-70 sm:w-52"
      >
        <path d="M12,75 A50,50 0 0,1 75,12" stroke="#0F1C3E" strokeWidth="8" strokeLinecap="round" />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        fill="none"
        className="pointer-events-none absolute -right-8 bottom-16 w-32 opacity-80 sm:w-44"
      >
        <path d="M10,55 A45,45 0 0,1 55,10" stroke="#FFB715" strokeWidth="8" strokeLinecap="round" />
      </svg>

      <div className="relative z-10 w-full max-w-sm">
        <Link href="/" className="mb-7 flex items-center justify-center gap-2.5">
          <BrandMark size={32} />
          <span className="leading-tight">
            <span className="block text-sm" style={{ color: "#0F1C3E" }}>Controle</span>
            <span className="block text-base font-bold" style={{ color: "#367BEC" }}>Financeiro</span>
          </span>
        </Link>
        {children}
      </div>
    </div>
  );
}
