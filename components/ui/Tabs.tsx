"use client";

import { useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/format";

interface TabsProps<T extends string> {
  /** Prefixo dos ids: a aba vira `${id}-tab-x` e o painel deve usar `${id}-panel`. */
  id: string;
  label: string;
  tabs: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/** Abas em Chillax: ativa em cinza escuro com traço rosa; inativa em cinza médio. */
export function Tabs<T extends string>({ id, label, tabs, value, onChange, className }: TabsProps<T>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(event: KeyboardEvent, index: number) {
    const move = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!move) return;
    event.preventDefault();
    const next = (index + move + tabs.length) % tabs.length;
    onChange(tabs[next].value);
    refs.current[next]?.focus();
  }

  return (
    <div role="tablist" aria-label={label} className={cn("flex gap-6 md:gap-8", className)}>
      {tabs.map((tab, index) => {
        const selected = tab.value === value;
        return (
          <button
            key={tab.value}
            ref={(element) => {
              refs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${tab.value}`}
            aria-selected={selected}
            aria-controls={`${id}-panel`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              "relative pb-2 font-display text-2xl font-medium transition-colors duration-200 ease-soft md:text-[2rem]",
              selected ? "text-warm-900" : "text-warm-600 hover:text-warm-700",
            )}
          >
            {tab.label}
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-x-0 bottom-0 h-0.5 origin-left rounded-full bg-brand transition-transform duration-300 ease-soft",
                selected ? "scale-x-100" : "scale-x-0",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
