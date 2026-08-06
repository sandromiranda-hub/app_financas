"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "Início" },
  { id: "recursos", label: "Recursos" },
  { id: "painel", label: "Painel" },
  { id: "comecar", label: "Começar" },
];

export function BrandRail() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const targets = SECTIONS.map(({ id }) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = targets.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { threshold: 0.5 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Navegação lateral"
      className="fixed inset-y-0 left-0 z-50 hidden w-16 flex-col items-center justify-between bg-[#0F1C3E] py-6 md:flex"
    >
      <div className="flex rotate-180 items-center gap-2 text-xs font-medium tracking-wide [writing-mode:vertical-rl]">
        <span className="text-white">{SECTIONS[active].label}</span>
        <span className="text-white/30">|</span>
        <span className="text-[#FFB715]">Controle Financeiro</span>
      </div>

      <div className="flex flex-col items-center gap-4">
        {SECTIONS.map(({ id, label }, i) => (
          <a
            key={id}
            href={`#${id}`}
            aria-label={label}
            className={`flex size-7 items-center justify-center rounded-full border text-[0.62rem] font-semibold transition-colors ${
              i === active
                ? "border-[#FFB715] bg-[#FFB715]/15 text-[#FFB715]"
                : "border-white/25 text-white/55 hover:border-white hover:text-white"
            }`}
          >
            {String(i + 1).padStart(2, "0")}
          </a>
        ))}
      </div>

      <a
        href="#top"
        aria-label="Voltar ao início"
        className="rotate-180 rounded-md bg-[#FFB715] px-1.5 py-2.5 text-xs font-semibold text-[#0F1C3E] [writing-mode:vertical-rl]"
      >
        Início
      </a>
    </nav>
  );
}
