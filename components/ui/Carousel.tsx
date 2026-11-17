"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { cn } from "@/lib/format";
import { Icon } from "./Icon";

/**
 * Carrossel por rolagem nativa (scroll-snap): funciona com toque, trackpad e teclado.
 *
 * Quem usa define três variáveis CSS no trilho (via className):
 *   --gap  → espaço entre os cards
 *   --per  → cards visíveis, com fração (ex.: 4.4 = quatro e parte do quinto)
 *   --gaps → espaços inteiros visíveis (parte inteira de --per)
 * Ex.: "[--gap:24px] [--per:1.5] [--gaps:1] md:[--per:2.5] md:[--gaps:2] lg:[--per:4.4] lg:[--gaps:4]"
 */
interface CarouselOptions {
  /**
   * Quanto as setas rolam por clique:
   * "page" → quase uma tela de cards · "item" → um card (largura do card + gap).
   */
  step?: "page" | "item";
}

export function useCarousel<T extends HTMLElement = HTMLUListElement>({ step = "page" }: CarouselOptions = {}) {
  /** Elemento que rola (o próprio trilho ou um wrapper em volta dele). */
  const trackRef = useRef<T>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    update();
    track.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [update]);

  const scroll = useCallback((direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    let distance = track.clientWidth * 0.8;
    if (step === "item") {
      const item = track.querySelector("li");
      const gap = item?.parentElement ? parseFloat(getComputedStyle(item.parentElement).columnGap) || 0 : 0;
      if (item) distance = item.getBoundingClientRect().width + gap;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: direction * distance, behavior: reduced ? "auto" : "smooth" });
  }, [step]);

  return { trackRef, canPrev, canNext, update, prev: () => scroll(-1), next: () => scroll(1) };
}

/** A partir de quantos pixels de movimento o gesto deixa de ser clique e vira arrasto. */
const DRAG_THRESHOLD = 5;

/**
 * Arrastar com o mouse para rolar (desktop). Toque e caneta continuam com a
 * rolagem nativa; trackpad, shift+roda e teclado também não são afetados.
 *
 * - Só reage a event.pointerType === "mouse" (botão principal).
 * - Passou de 5px, é arrasto: o clique seguinte é bloqueado, para não abrir o
 *   produto nem acionar "Adicionar" sem querer. Abaixo disso, é clique normal.
 * - Durante o arrasto o scroll-snap fica desligado; ao soltar, o carrossel
 *   assenta no card mais próximo e o snap volta.
 *
 * O elemento ganha data-dragging="true" enquanto arrasta (para o cursor grabbing).
 */
export function useDragScroll<T extends HTMLElement>(ref: RefObject<T | null>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let pointerId: number | null = null;
    let startX = 0;
    let startScroll = 0;
    let dragging = false;
    let blockClick = false;
    let restoreTimer: number | undefined;

    const restoreSnap = () => {
      window.clearTimeout(restoreTimer);
      element.removeEventListener("scrollend", restoreSnap);
      element.style.scrollSnapType = "";
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startScroll = element.scrollLeft;
      dragging = false;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      const distance = event.clientX - startX;

      if (!dragging) {
        if (Math.abs(distance) <= DRAG_THRESHOLD) return;
        dragging = true;
        restoreSnap();
        element.style.scrollSnapType = "none";
        element.dataset.dragging = "true";
        // A captura só começa aqui: capturar já no pointerdown desviaria os cliques normais.
        element.setPointerCapture(event.pointerId);
      }

      element.scrollLeft = startScroll - distance;
    };

    const onPointerEnd = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      pointerId = null;
      if (!dragging) return;

      dragging = false;
      delete element.dataset.dragging;
      if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);

      // O clique que o navegador dispara logo depois de soltar não deve valer.
      blockClick = true;
      window.setTimeout(() => (blockClick = false), 0);

      // Assenta no card mais próximo e só então religa o snap.
      const items = [...element.querySelectorAll<HTMLElement>("li")];
      const padding = parseFloat(getComputedStyle(element).scrollPaddingLeft) || 0;
      const max = element.scrollWidth - element.clientWidth;
      const base = element.getBoundingClientRect().left - element.scrollLeft;
      const stops = items.map((item) => Math.min(max, Math.max(0, item.getBoundingClientRect().left - base - padding)));
      const nearest = stops.reduce((best, stop) => (Math.abs(stop - element.scrollLeft) < Math.abs(best - element.scrollLeft) ? stop : best), element.scrollLeft);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      element.addEventListener("scrollend", restoreSnap, { once: true });
      restoreTimer = window.setTimeout(restoreSnap, 600);
      element.scrollTo({ left: nearest, behavior: reduced ? "auto" : "smooth" });
    };

    const onClickCapture = (event: MouseEvent) => {
      if (!blockClick) return;
      blockClick = false;
      event.preventDefault();
      event.stopPropagation();
    };

    // Evita o "arrastar a foto/link" nativo do navegador.
    const onDragStart = (event: DragEvent) => event.preventDefault();

    element.addEventListener("pointerdown", onPointerDown);
    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerup", onPointerEnd);
    element.addEventListener("pointercancel", onPointerEnd);
    element.addEventListener("click", onClickCapture, true);
    element.addEventListener("dragstart", onDragStart);
    return () => {
      restoreSnap();
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", onPointerEnd);
      element.removeEventListener("pointercancel", onPointerEnd);
      element.removeEventListener("click", onClickCapture, true);
      element.removeEventListener("dragstart", onDragStart);
    };
  }, [ref]);
}

interface CarouselTrackProps {
  trackRef: RefObject<HTMLUListElement | null>;
  label: string;
  children: ReactNode;
  className?: string;
}

/** Trilho do carrossel. No celular, sangra até a borda da tela. */
export function CarouselTrack({ trackRef, label, children, className }: CarouselTrackProps) {
  return (
    <ul
      ref={trackRef}
      aria-label={label}
      tabIndex={0}
      className={cn(
        "no-scrollbar flex snap-x snap-mandatory gap-(--gap) overflow-x-auto overscroll-x-contain",
        "-mx-(--container-pad) scroll-px-(--container-pad) px-(--container-pad) md:mx-0 md:scroll-px-0 md:px-0",
        className,
      )}
    >
      {children}
    </ul>
  );
}

export function CarouselItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <li className={cn("w-[calc((100%-var(--gap)*var(--gaps))/var(--per))] shrink-0 snap-start", className)}>
      {children}
    </li>
  );
}

interface CarouselArrowsProps {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

/** Setas em círculos com borda fina. */
export function CarouselArrows({ canPrev, canNext, onPrev, onNext, className }: CarouselArrowsProps) {
  const arrow =
    "grid size-11 place-items-center rounded-full border border-warm-300 text-warm-900 transition-[border-color,opacity] duration-200 ease-soft hover:border-warm-900 disabled:opacity-40 disabled:hover:border-warm-300";

  return (
    <div className={cn("flex gap-2", className)}>
      <button type="button" aria-label="Anteriores" disabled={!canPrev} onClick={onPrev} className={arrow}>
        <Icon name="chevronLeft" size={20} />
      </button>
      <button type="button" aria-label="Próximos" disabled={!canNext} onClick={onNext} className={arrow}>
        <Icon name="chevronRight" size={20} />
      </button>
    </div>
  );
}
