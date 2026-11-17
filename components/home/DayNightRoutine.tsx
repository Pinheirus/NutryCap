"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { addRoutineToCart, separatePrice, skinRoutine, type RoutinePeriodId } from "@/data/skin-routine";
import { cn, formatMoney } from "@/lib/format";
import { RoutineCard } from "./RoutineCard";
import { SkyScene } from "./SkyScene";
import { ThemeToggle } from "./ThemeToggle";

const EASE = "cubic-bezier(0.4,0,0.2,1)";
const DAY_GRADIENT = "linear-gradient(160deg, #FFF4EA 0%, #FCE3D2 55%, #F9CDBB 100%)";
const NIGHT_GRADIENT = "linear-gradient(160deg, #1A1C33 0%, #2B2E5A 100%)";
const PERIODS: RoutinePeriodId[] = ["day", "night"];

/**
 * Painel Dia/Noite da seção "Sua rotina de pele". Única seção da home que sai
 * da paleta neutra — o resto da página não muda.
 *
 * Não usa o Container: tem a margem lateral do banner (--gutter), igual à
 * Rotina Cresce+. O conteúdo interno fica num wrapper de até 1440px.
 */
export function DayNightRoutine() {
  const [period, setPeriod] = useState<RoutinePeriodId>("day");
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);

  // Estado inicial por horário local: só depois de montar, para não gerar
  // mismatch de hidratação (servidor e primeiro render no cliente usam "day").
  // A leitura do relógio do navegador é externa ao React e só acontece uma
  // vez (deps vazias) — exceção deliberada à regra, não um efeito encadeado.
  useEffect(() => {
    const hour = new Date().getHours();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (hour < 6 || hour >= 18) setPeriod("night");
  }, []);

  // Pausa a deriva das nuvens e o brilho das estrelas quando a seção sai da tela.
  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const night = period === "night";
  const data = skinRoutine[period];
  const total = separatePrice(data);
  const routinePrice = Number(data.routinePrice.amount);
  const savings = total - routinePrice;
  const hasDiscount = savings > 0;

  const textColor = night ? "#F6F3F7" : "#211C1D";
  const mutedColor = night ? "#C9C6DA" : "#514A4C";
  const colorTransition: CSSProperties = { transitionProperty: "color", transitionDuration: "400ms", transitionTimingFunction: EASE };

  return (
    <section
      ref={sectionRef}
      id="skin-routine"
      aria-labelledby="skin-routine-title"
      className={cn("relative mx-(--gutter) mt-16 overflow-hidden rounded-2xl md:mt-28 md:rounded-block", night && "on-dark")}
    >
      {/* Fundo: dois layers que fazem o crossfade (a classe trata o reduced-motion) */}
      <div
        aria-hidden="true"
        className="day-night-crossfade absolute inset-0 transition-opacity duration-700"
        style={{ background: DAY_GRADIENT, opacity: night ? 0 : 1, transitionTimingFunction: EASE }}
      />
      <div
        aria-hidden="true"
        className="day-night-crossfade absolute inset-0 transition-opacity duration-700"
        style={{ background: NIGHT_GRADIENT, opacity: night ? 1 : 0, transitionTimingFunction: EASE }}
      />

      <SkyScene period={period} paused={!inView} />

      <div className="relative z-10 px-(--container-pad) py-10 md:py-16">
        <div className="mx-auto max-w-[1440px]">
          {/* Cabeçalho em duas colunas */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-[420px]">
              <h2
                id="skin-routine-title"
                className="font-display text-[2.5rem] leading-[1.05] font-medium"
                style={{ color: textColor, ...colorTransition }}
              >
                Sua rotina de pele
              </h2>
              <p className="mt-4 text-lg text-balance" style={{ color: mutedColor, ...colorTransition }}>
                {data.subtitle}
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 lg:items-end">
              <ThemeToggle period={period} onChange={setPeriod} idPrefix="skin-routine" />

              <div className="w-full max-w-[340px]">
                <button
                  type="button"
                  onClick={() => addRoutineToCart(data)}
                  aria-label={`Adicionar rotina completa: ${formatMoney(data.routinePrice)}`}
                  className="h-[52px] w-full rounded-full px-6 text-[15px] font-medium transition-colors duration-400"
                  style={{
                    backgroundColor: night ? "#FFFFFF" : "#211C1D",
                    color: night ? "#1A1C33" : "#FFFFFF",
                    transitionTimingFunction: EASE,
                  }}
                >
                  Adicionar rotina completa · {formatMoney(data.routinePrice)}
                </button>
                {hasDiscount && (
                  <p className="mt-2 text-sm lg:text-right" style={{ color: mutedColor, ...colorTransition }}>
                    Comprando avulso: <s>{formatMoney(total)}</s>
                    {" · "}
                    <span className="font-medium">Economize {formatMoney(savings)}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/*
            Grid de cards: os dois períodos ficam empilhados na mesma célula
            (col-start-1 row-start-1), então a altura do bloco é sempre a do
            mais alto dos dois — a troca de tema nunca pula o layout.
          */}
          <div className="relative mt-12 grid">
            {PERIODS.map((periodId) => {
              const periodData = skinRoutine[periodId];
              const active = periodId === period;
              return (
                <div
                  key={periodId}
                  role="tabpanel"
                  id={`skin-routine-panel-${periodId}`}
                  aria-labelledby={`skin-routine-tab-${periodId}`}
                  aria-label={`Rotina de pele: ${periodId === "day" ? "manhã" : "noite"}`}
                  aria-hidden={!active}
                  inert={!active}
                  className={cn(
                    "no-scrollbar col-start-1 row-start-1 flex snap-x snap-proximity gap-4 overflow-x-auto scroll-pl-(--gutter) [--step-reach:24px]",
                    "sm:grid sm:grid-cols-2 sm:snap-none sm:gap-6 sm:overflow-visible sm:[--step-reach:32px]",
                    "lg:grid-cols-4 lg:[--step-reach:40px]",
                    "transition-opacity",
                    active ? "visible opacity-100 duration-200" : "invisible opacity-0 duration-150",
                  )}
                  style={{ transitionTimingFunction: EASE }}
                >
                  {periodData.items.map((item, index) => (
                    <div key={item.step} className="w-[72%] shrink-0 snap-start sm:w-auto sm:shrink sm:snap-align-none">
                      <RoutineCard
                        item={item}
                        theme={periodId}
                        showConnector={index < periodData.items.length - 1}
                        connectorClassName={index % 2 === 1 ? "hidden lg:block" : undefined}
                        sizes="(min-width: 1024px) 18vw, 44vw"
                      />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
