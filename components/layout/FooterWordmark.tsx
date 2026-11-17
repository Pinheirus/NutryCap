"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/format";

const letters = "NUTRY CAP".split("");

/** "NUTRY CAP" gigante, quase escondido no fundo. As letras sobem ao chegar no rodapé. */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="-mb-[2.2cqw] flex justify-center overflow-hidden font-display text-[length:17cqw] leading-[0.82] font-medium whitespace-nowrap text-[#3a3134] select-none"
    >
      {letters.map((letter, index) => (
        <span
          key={index}
          style={{ transitionDelay: `${index * 35}ms` }}
          className={cn(
            "inline-block transition-transform duration-400 ease-soft",
            letter === " " && "w-[0.28em]",
            visible ? "translate-y-0" : "translate-y-full",
          )}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}
