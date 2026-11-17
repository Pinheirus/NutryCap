import type { IconName } from "@/components/ui/solar-icons";

// Tipos dos dados de exemplo.
// Os nomes e formatos seguem a Shopify Storefront API para facilitar a
// integração futura: basta trocar os arquivos em data/ por consultas GraphQL.

/** Storefront API: MoneyV2 (amount vem como string decimal). */
export interface Money {
  amount: string;
  currencyCode: "BRL";
}

/** Storefront API: Image. */
export interface ShopImage {
  url: string;
  altText: string;
  width: number;
  height: number;
}

/** Avaliações — na Shopify, virão de metafields (ex.: reviews.rating). */
export interface ProductRating {
  value: number;
  count: number;
}

/** Storefront API: Product (achatado para a primeira variante). */
export interface Product {
  id: string;
  handle: string;
  /** Só o nome, sem o volume. Ex.: "Shampoo Cresce+". */
  title: string;
  /** Volume ou peso, ex.: "300 ml" — na Shopify, o título da variante. */
  volume: string | null;
  /** Linha do produto — Storefront API: Collection.handle. */
  lineHandle: string;
  productType: "cabelo" | "pele";
  tags: string[];
  availableForSale: boolean;
  featuredImage: ShopImage;
  /** Storefront API: ProductVariant.id — é o que vai para o carrinho. */
  variantId: string;
  price: Money;
  /** Preço antigo ("de"), quando houver promoção. */
  compareAtPrice: Money | null;
  rating: ProductRating | null;
  /** Ativo principal, ex.: "Ácido hialurônico 5%" — na Shopify, um metafield. */
  activeIngredient: string | null;
}

/** Linha de produtos — Storefront API: Collection. */
export interface ProductLine {
  id: string;
  handle: string;
  title: string;
  description: string;
}

/** Etapa de uma rotina (pele ou Cresce+). */
export interface RoutineStep {
  step: number;
  productHandle: string;
  /** Frase curta do que a etapa faz. */
  benefit: string;
}

/** Rotina vendida como pacote — na Shopify, um Product do tipo bundle. */
export interface RoutineBundle {
  id: string;
  title: string;
  variantId: string;
  /** Preço da rotina completa. Se for menor que a soma dos avulsos, há desconto. */
  price: Money;
  steps: RoutineStep[];
}

/** Kit — na Shopify, um Product do tipo bundle. */
export interface Kit {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage: ShopImage;
  variantId: string;
  price: Money;
  steps: RoutineStep[];
}

export interface Testimonial {
  id: string;
  quote: string;
  /** Nome abreviado, ex.: "Mariana S." */
  author: string;
  productHandle: string;
}

export interface NeedCard {
  id: string;
  question: string;
  href: string;
  image: ShopImage;
}

export interface Benefit {
  id: string;
  /** Ícone Solar (Linear) — nome definido em components/ui/solar-icons.ts. */
  icon: IconName;
  title: string;
  description: string;
}
