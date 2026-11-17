import Image from "next/image";
import type { ShopImage } from "@/data/types";
import { cn } from "@/lib/format";

interface ProductStageProps {
  image: ShopImage;
  sizes: string;
  alt?: string;
  className?: string;
}

/**
 * Bloco da imagem na vitrine: quadrado, raio de 16px, degradê linear e sombra de chão.
 * O produto cabe sempre inteiro numa caixa de até 70% × 78% do bloco (frascos
 * largos, como a Máscara, não são cortados).
 * No hover do card (classe `group` no pai), o produto sobe 4px e a sombra encolhe.
 */
export function ProductStage({ image, sizes, alt, className }: ProductStageProps) {
  return (
    <div
      className={cn(
        "relative aspect-square overflow-hidden rounded-card bg-[linear-gradient(180deg,#EFE9EB_0%,#E6DEE0_100%)]",
        // sombra de chão: pseudo-elemento
        "after:absolute after:bottom-[8%] after:left-1/2 after:h-[14px] after:w-[55%] after:-translate-x-1/2 after:rounded-[50%] after:bg-[rgba(33,28,29,0.16)] after:blur-[8px] after:content-['']",
        "after:transition-transform after:duration-200 after:ease-soft group-hover:after:scale-x-90 group-hover:after:scale-y-75",
        className,
      )}
    >
      <div className="absolute inset-0 z-10 grid place-items-center transition-transform duration-200 ease-soft group-hover:-translate-y-1">
        {/* caixa centralizada: no máximo 70% da largura e 78% da altura do bloco */}
        <div className="relative h-[78%] w-[70%]">
          <Image
            src={image.url}
            alt={alt ?? image.altText}
            fill
            sizes={sizes}
            unoptimized={image.url.endsWith(".svg")}
            draggable={false}
            className="object-contain object-bottom [-webkit-user-drag:none]"
          />
        </div>
      </div>
    </div>
  );
}

/** Padding da imagem dentro da área, em % do lado do quadrado. */
const PADDING = 12;
const BOX = 100 - PADDING * 2;

interface ProductImageProps {
  /** Imagem do produto recortada, com fundo transparente. */
  image: ShopImage;
  sizes: string;
  /** Use "" quando o nome do produto já estiver ao lado. */
  alt?: string;
  /**
   * Onde a área está apoiada:
   * "light" (padrão) → sobre fundo claro: degradê de branco para #EFE9EB;
   * "tinted" → sobre painel #EFE9EB: degradê de branco para #FAF8F9, para o tile se destacar.
   */
  surface?: "light" | "tinted";
  /** Sombra de chão sob o produto. Default true. */
  shadow?: boolean;
  className?: string;
}

/** Degradê radial suave, branco no centro, que termina em #FAF8F9 — para áreas sobre painéis tingidos. */
export const TINTED_SURFACE = "bg-[radial-gradient(ellipse_at_50%_60%,#FFFFFF_0%,#FAF8F9_100%)]";

/**
 * Área da imagem do produto: quadrada, raio de 16px, fundo em degradê radial
 * e uma sombra suave sob o frasco.
 */
export function ProductImage({ image, sizes, alt, surface = "light", shadow = true, className }: ProductImageProps) {
  // Com object-fit: contain, calculamos onde o produto fica para posicionar a sombra.
  const ratio = image.width / image.height;
  const width = ratio >= 1 ? BOX : BOX * ratio; // largura do frasco, em % da área
  const height = ratio >= 1 ? BOX / ratio : BOX;
  const base = PADDING + (BOX - height) / 2; // distância da base do frasco até a base da área

  return (
    <div
      className={cn(
        "relative aspect-square overflow-hidden rounded-card",
        surface === "tinted" ? TINTED_SURFACE : "bg-[radial-gradient(ellipse_at_50%_60%,#FFFFFF_0%,#EFE9EB_100%)]",
        className,
      )}
    >
      {/* Sombra sob o produto: elipse com 60% da largura do frasco */}
      {shadow && (
        <span
          aria-hidden="true"
          className="absolute h-[5%] rounded-[50%] bg-[rgba(33,28,29,0.12)] blur-[8px]"
          style={{ left: `${50 - width * 0.3}%`, width: `${width * 0.6}%`, bottom: `${base - 2.5}%` }}
        />
      )}
      <Image
        src={image.url}
        alt={alt ?? image.altText}
        fill
        sizes={sizes}
        unoptimized={image.url.endsWith(".svg")}
        className="object-contain p-[12%]"
      />
    </div>
  );
}
