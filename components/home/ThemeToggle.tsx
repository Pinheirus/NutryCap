"use client";

import { useRef, type KeyboardEvent } from "react";
import { Icon } from "@/components/ui/Icon";

export type RoutinePeriodId = "day" | "night";

interface ThemeToggleProps {
  period: RoutinePeriodId;
  onChange: (period: RoutinePeriodId) => void;
  idPrefix: string;
}

const options = [
  { value: "day" as const, label: "Manhã", icon: "sun" as const },
  { value: "night" as const, label: "Noite", icon: "moon" as const },
];

/**
 * Seletor Manhã/Noite. role="tablist" com dois role="tab" — o conteúdo
 * controlado é o painel de cards (role="tabpanel"), renderizado por quem usa
 * este componente. Setas esquerda/direita alternam a seleção.
 * O foco visível herda a cor do tema do painel ancestral (classe `.on-dark`
 * à noite, já existente no site).
 */
export function ThemeToggle({ period, onChange, idPrefix }: ThemeToggleProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const night = period === "night";

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const move = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!move) return;
    event.preventDefault();
    const next = (index + move + options.length) % options.length;
    onChange(options[next].value);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label="Período da rotina"
      className="relative grid grid-cols-2 rounded-full p-1 transition-colors duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
      style={{ backgroundColor: night ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.6)" }}
    >
      {/* pílula ativa: desliza entre as duas opções em 300ms */}
      <span
        aria-hidden="true"
        className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ transform: night ? "translateX(100%)" : "translateX(0)", backgroundColor: night ? "#FFFFFF" : "#211C1D" }}
      />

      {options.map((option, index) => {
        const selected = option.value === period;
        return (
          <button
            key={option.value}
            ref={(element) => {
              refs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${option.value}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel-${option.value}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className="relative inline-flex h-11 min-h-11 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-medium transition-colors duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{
              color: selected ? (night ? "#1A1C33" : "#FFFFFF") : night ? "#C9C6DA" : "#514A4C",
            }}
          >
            <Icon name={option.icon} size={18} />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
