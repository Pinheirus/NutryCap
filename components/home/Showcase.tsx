"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { CarouselArrows, useCarousel, useDragScroll } from "@/components/ui/Carousel";
import { Icon } from "@/components/ui/Icon";
import { Tabs } from "@/components/ui/Tabs";
import { bestSellers, newArrivals } from "@/data/products";

const tabs = [
  { value: "mais-vendidos", label: "Mais vendidos" },
  { value: "lancamentos", label: "Lançamentos" },
] as const;

type TabValue = (typeof tabs)[number]["value"];

const productsByTab = { "mais-vendidos": bestSellers, lancamentos: newArrivals };

function SeeAllLink() {
  return (
    <a
      href="#"
      className="inline-flex min-h-11 items-center gap-1 text-[15px] font-medium text-warm-900 underline-offset-4 hover:underline"
    >
      Ver todos
      <Icon name="arrowRight" size={16} />
    </a>
  );
}

/**
 * Vitrine com abas: troca os produtos sem recarregar.
 * Não usa o Container: tem a mesma margem do banner (--gutter) e a faixa de
 * cards sangra até a borda direita da tela.
 */
export function Showcase() {
  const [tab, setTab] = useState<TabValue>("mais-vendidos");
  // as setas rolam um card por clique
  const { trackRef, canPrev, canNext, prev, next, update } = useCarousel<HTMLDivElement>({ step: "item" });
  // no desktop, dá para arrastar a faixa com o mouse
  useDragScroll(trackRef);

  // Ao trocar de aba, o carrossel volta para o início.
  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 });
    update();
  }, [tab, trackRef, update]);

  return (
    <section id="vitrine" aria-label="Vitrine" className="mt-16 scroll-mt-24 md:mt-28">
      {/* Cabeçalho: alinhado com a borda esquerda do banner */}
      <div className="mb-6 flex items-end justify-between gap-4 px-(--gutter) md:mb-8">
        <Tabs id="vitrine" label="Vitrine de produtos" tabs={tabs} value={tab} onChange={setTab} />
        <div className="hidden items-center gap-6 md:flex">
          <SeeAllLink />
          <CarouselArrows canPrev={canPrev} canNext={canNext} onPrev={prev} onNext={next} />
        </div>
      </div>

      <div id="vitrine-panel" role="tabpanel" aria-labelledby={`vitrine-tab-${tab}`}>
        {/*
          Wrapper dos cards: ocupa a tela toda, rola na horizontal (sem barra) e é
          o "container" da unidade cqw usada na largura do card no celular.
          Card com largura fixa: celular 72% do wrapper · tablet (≥640px) 260px ·
          desktop (≥1024px) 304px. Em telas largas aparecem mais cards, do mesmo tamanho.
        */}
        <div
          ref={trackRef}
          tabIndex={0}
          role="group"
          aria-label={tabs.find((item) => item.value === tab)!.label}
          className="no-scrollbar @container w-full cursor-grab snap-x snap-proximity scroll-pl-(--gutter) overflow-x-auto overscroll-x-contain select-none data-[dragging=true]:cursor-grabbing [--gap:12px] sm:[--gap:24px]"
        >
          <ul className="flex w-max gap-(--gap) px-(--gutter)">
            {productsByTab[tab].map((product, index) => (
              // a key inclui a aba: os cards entram de novo, com transição suave
              <li key={`${tab}-${product.id}`} className="w-[72cqw] shrink-0 snap-start sm:w-[260px] lg:w-[304px]">
                <div className="h-full animate-fade-up" style={{ animationDelay: `${Math.min(index, 5) * 40}ms` }}>
                  {/* ranking 01/02/03 só nos três primeiros da aba Mais vendidos */}
                  <ProductCard product={product} rank={tab === "mais-vendidos" && index < 3 ? index + 1 : undefined} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* No celular não há setas nem espaço ao lado das abas: o link vai abaixo do carrossel */}
      <div className="mt-4 flex justify-end px-(--gutter) md:hidden">
        <SeeAllLink />
      </div>
    </section>
  );
}
