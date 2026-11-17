import { AddToCart } from "@/components/cart/AddToCart";
import { Icon } from "@/components/ui/Icon";
import type { Product } from "@/data/types";
import { cn, discountPercent, formatMoney, formatRating, fullTitle } from "@/lib/format";
import { ProductImage, ProductStage } from "./ProductImage";

interface ProductCardProps {
  product: Product;
  /**
   * Quando o card faz parte de uma rotina: número grande, rótulo da etapa e a
   * linha fina que liga ao próximo passo. O card também mostra o ativo do produto.
   */
  step?: {
    number: number;
    label: string;
    /** Classes de visibilidade da linha (ex.: "hidden lg:block"); omita na última etapa. */
    connector?: string;
  };
  /** Posição no ranking (1, 2, 3…): mostra "01", "02", "03" no canto da imagem. */
  rank?: number;
  /** Tamanhos responsivos da foto. */
  sizes?: string;
}

function DiscountBadge({ product, className }: { product: Product; className?: string }) {
  if (!product.compareAtPrice) return null;
  return (
    <span className={cn("absolute z-20 inline-flex h-7 items-center rounded-full bg-brand px-2.5 text-xs font-bold text-warm-900", className)}>
      <span className="sr-only">Desconto de </span>-{discountPercent(product.price, product.compareAtPrice)}%
    </span>
  );
}

function Rating({ product, className }: { product: Product; className?: string }) {
  return (
    <p className={cn("flex h-5 items-center gap-1 text-sm text-warm-700", className)}>
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
  );
}

function Price({ product, className }: { product: Product; className?: string }) {
  const { price, compareAtPrice } = product;
  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2", className)}>
      {compareAtPrice ? (
        <>
          <span className="sr-only">Por </span>
          <span className="text-xl font-semibold">{formatMoney(price)}</span>
          <span className="sr-only">, de </span>
          <s className="text-sm text-muted">{formatMoney(compareAtPrice)}</s>
        </>
      ) : (
        <span className="text-xl font-semibold">{formatMoney(price)}</span>
      )}
    </p>
  );
}

/**
 * Card de produto — componente único do site, com duas apresentações:
 * - vitrine (padrão): sem fundo; só o bloco da imagem tem cor;
 * - etapa de rotina (prop `step`): card com fundo, número da etapa e ativo.
 */
export function ProductCard({ product, step, rank, sizes = "(min-width: 1024px) 22vw, (min-width: 768px) 38vw, 62vw" }: ProductCardProps) {
  const { title, volume, featuredImage, variantId, activeIngredient } = product;
  const name = fullTitle(product);

  /* ---------- Etapa de rotina ---------- */
  if (step) {
    return (
      <article className="flex h-full flex-col rounded-card bg-warm-50 p-3 text-warm-900 sm:p-4">
        <div className="relative">
          <ProductImage image={featuredImage} sizes={sizes} />
          <DiscountBadge product={product} className="top-2 right-2" />
        </div>

        {/* número grande + linha até o próximo passo + rótulo */}
        <div className="mt-4">
          <div className="flex items-center gap-3">
            <span className="font-display text-[2rem] leading-none font-medium">
              <span className="sr-only">Etapa </span>
              {step.number}
            </span>
            {step.connector && (
              <span
                aria-hidden="true"
                className={cn("relative z-10 -mr-(--step-reach) h-px flex-1 bg-warm-300", step.connector)}
              />
            )}
          </div>
          <p className="mt-1 text-sm text-warm-700">{step.label}</p>
        </div>

        {/* nome sem a unidade; o volume e o ativo vão na linha de apoio */}
        <h3 className="mt-3 text-base leading-[1.375rem] font-medium text-pretty">
          <a href="#" className="rounded-sm hover:underline hover:underline-offset-4">
            {title}
          </a>
        </h3>
        {/* reserva 2 linhas: em cards estreitos "volume · ativo" quebra */}
        <p className="mt-1 min-h-10 text-sm leading-5 text-pretty text-muted">
          {[volume, activeIngredient].filter(Boolean).join(" · ")}
        </p>

        {/* avaliação, preço e botão ficam presos na base: alinham mesmo quando um nome quebra em 2 linhas */}
        <Rating product={product} className="mt-auto pt-2" />

        {/* a linha do preço riscado fica sempre reservada, para os preços alinharem entre os cards */}
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

        <AddToCart variantId={variantId} title={name} variant="secondary" />
      </article>
    );
  }

  /* ---------- Vitrine ---------- */
  return (
    <article className="group flex h-full flex-col text-warm-900">
      <div className="relative">
        <ProductStage image={featuredImage} sizes={sizes} />
        {rank !== undefined && (
          // mesma altura do selo de desconto (28px), para os dois ficarem na mesma linha
          <span className="absolute top-3 left-3 z-20 inline-flex h-7 items-center font-display text-sm leading-none font-medium text-warm-900">
            <span className="sr-only">Posição </span>
            {String(rank).padStart(2, "0")}
          </span>
        )}
        <DiscountBadge product={product} className="top-3 right-3" />
      </div>

      {/* nome em 1 linha (com reticências se passar) e, abaixo, o volume */}
      <h3 className="mt-3.5 truncate text-base leading-[1.375rem] font-medium">
        <a href="#" title={title} draggable={false} className="hover:underline hover:underline-offset-4">
          {title}
        </a>
      </h3>
      <p className="min-h-5 text-sm leading-5 text-muted">{volume ?? activeIngredient}</p>

      <Rating product={product} className="mt-2" />
      <Price product={product} className="mt-2.5 mb-4" />

      <div className="mt-auto">
        <AddToCart variantId={variantId} title={name} variant="secondary" icon="cartPlus" />
      </div>
    </article>
  );
}
