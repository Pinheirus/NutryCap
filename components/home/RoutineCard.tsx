import { AddToCart } from "@/components/cart/AddToCart";
import { ProductImage } from "@/components/product/ProductImage";
import { Icon } from "@/components/ui/Icon";
import type { SkinRoutineItem } from "@/data/skin-routine";
import { cn, discountPercent, formatMoney, formatRating, fullTitle } from "@/lib/format";

interface RoutineCardProps {
  item: SkinRoutineItem;
  /** Tema do painel: define a sombra do card (dia: suave · noite: profunda). */
  theme: "day" | "night";
  /** Mostra a linha fina até o número do próximo card. Omita no último card. */
  showConnector?: boolean;
  /** Classes de visibilidade da linha (ex.: esconder entre fileiras no grid 2 colunas). */
  connectorClassName?: string;
  sizes: string;
}

const CARD_SHADOW: Record<RoutineCardProps["theme"], string> = {
  day: "0 1px 2px rgba(33,28,29,0.06)",
  night: "0 12px 32px rgba(8,9,24,0.35)",
};

/**
 * Card de produto do painel Dia/Noite. O card e o tile da imagem ficam sempre
 * em #FAF8F9 (não tingem com o tema) — a foto real precisa de um fundo neutro
 * para a cor do produto ficar fiel. Só a sombra do card muda com o tema.
 *
 * Todos os blocos (número + rótulo, nome, apoio, avaliação, preço) reservam
 * altura fixa, para os 4 cards alinharem nos dois períodos.
 */
export function RoutineCard({ item, theme, showConnector, connectorClassName, sizes }: RoutineCardProps) {
  const { product } = item;
  const support = [product.volume, product.activeIngredient].filter(Boolean).join(" · ");

  return (
    <article
      className="flex h-full flex-col rounded-card bg-warm-50 p-3 text-warm-900 transition-shadow duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] sm:p-4"
      style={{ boxShadow: CARD_SHADOW[theme] }}
    >
      <div className="relative">
        <ProductImage image={product.featuredImage} sizes={sizes} />
        {product.compareAtPrice && (
          <span className="absolute top-2 right-2 inline-flex h-7 items-center rounded-full bg-brand px-2.5 text-xs font-bold text-warm-900">
            <span className="sr-only">Desconto de </span>-{discountPercent(product.price, product.compareAtPrice)}%
          </span>
        )}
      </div>

      {/* número grande + linha até o próximo passo + rótulo */}
      <div className="mt-4">
        <div className="flex items-center gap-3">
          <span className="font-display text-[2rem] leading-none font-medium">
            <span className="sr-only">Etapa </span>
            {item.step}
          </span>
          {showConnector && (
            <span aria-hidden="true" className={cn("relative z-10 -mr-(--step-reach) h-px flex-1 bg-warm-300", connectorClassName)} />
          )}
        </div>
        <p className="mt-1 text-sm text-muted">{item.stepLabel}</p>
      </div>

      {/* nome sem a unidade, até 2 linhas reservadas */}
      <h3 className="mt-3 min-h-[2.75rem] text-base leading-[1.375rem] font-medium text-pretty">
        <a href="#" className="rounded-sm hover:underline hover:underline-offset-4">
          {product.title}
        </a>
      </h3>
      {/* "volume · ativo", até 2 linhas reservadas */}
      <p className="mt-1 min-h-10 text-sm leading-5 text-pretty text-muted">{support}</p>

      {/* avaliação: slot de 1 linha, "Novo" quando não há nota */}
      <p className="mt-2 flex h-5 items-center gap-1 text-sm text-warm-700">
        {product.rating ? (
          <>
            <Icon name="starFilled" size={15} className="text-warm-900" />
            <span className="sr-only">Nota </span>
            {formatRating(product.rating)}
          </>
        ) : (
          "Novo"
        )}
      </p>

      {/* preço; a linha do riscado fica sempre reservada, vazia quando não há desconto */}
      <p className="mt-2 mb-4 flex flex-col">
        {product.compareAtPrice && <span className="sr-only">Por </span>}
        <span className="text-xl font-semibold">{formatMoney(product.price)}</span>
        <span className="min-h-5 text-sm leading-5 text-muted">
          {product.compareAtPrice && (
            <>
              <span className="sr-only">, de </span>
              <s>{formatMoney(product.compareAtPrice)}</s>
            </>
          )}
        </span>
      </p>

      <AddToCart variantId={product.variantId} title={fullTitle(product)} variant="secondary" icon="cartPlus" />
    </article>
  );
}
