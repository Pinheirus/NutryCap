// Dados do painel Dia/Noite da seção "Sua rotina de pele".
//
// Os itens reaproveitam os produtos reais de data/products.ts (mesmo preço,
// avaliação, foto e variantId) e só acrescentam o passo da rotina — assim o
// preço e a foto nunca ficam dessincronizados do resto do site.
import { getProduct } from "./products";
import type { Money, Product } from "./types";

export type RoutinePeriodId = "day" | "night";

export interface SkinRoutineItem {
  step: number;
  stepLabel: string;
  product: Product;
}

export interface SkinRoutinePeriod {
  id: RoutinePeriodId;
  label: string;
  subtitle: string;
  items: SkinRoutineItem[];
  /** Preço da rotina completa (pacote). Sempre menor que a soma dos avulsos. */
  routinePrice: Money;
}

const brl = (amount: string): Money => ({ amount, currencyCode: "BRL" });

function step(stepNumber: number, stepLabel: string, handle: string): SkinRoutineItem {
  return { step: stepNumber, stepLabel, product: getProduct(handle) };
}

export const skinRoutine: Record<RoutinePeriodId, SkinRoutinePeriod> = {
  day: {
    id: "day",
    label: "Manhã",
    subtitle: "Quatro passos para começar o dia com a pele limpa, hidratada e protegida.",
    routinePrice: brl("239.90"),
    items: [
      step(1, "Limpar", "gel-de-limpeza-facial"),
      step(2, "Tratar", "serum-vitamina-c"),
      step(3, "Hidratar", "hidratante-acido-hialuronico"),
      step(4, "Proteger", "protetor-solar-fps-50"),
    ],
  },
  night: {
    id: "night",
    label: "Noite",
    subtitle: "Quatro passos para a pele se recuperar enquanto você descansa.",
    routinePrice: brl("229.90"),
    items: [
      step(1, "Remover", "demaquilante-bifasico"),
      step(2, "Limpar", "gel-de-limpeza-facial"),
      step(3, "Tratar", "serum-noturno-retinol"),
      step(4, "Reparar", "creme-noturno-reparador"),
    ],
  },
};

/** Soma dos preços avulsos dos itens da rotina — calculada, nunca digitada. */
export function separatePrice(period: SkinRoutinePeriod): number {
  return period.items.reduce((sum, { product }) => sum + Number(product.price.amount), 0);
}

/**
 * Adiciona a rotina completa (os 4 produtos do período) ao carrinho.
 *
 * TODO(shopify): hoje é só um stub. Quando a rotina completa existir como um
 * produto/bundle de verdade na Shopify, trocar por uma chamada real —
 * provavelmente `cartLinesAdd` da Storefront API com o variantId do bundle,
 * ou `cartLinesAdd` em lote com o variantId de cada item, se preferirmos
 * vender os quatro produtos separados mas com desconto de combo.
 */
export function addRoutineToCart(period: SkinRoutinePeriod): void {
  console.log(
    `[stub] Adicionar ao carrinho: rotina de pele — ${period.label}`,
    period.items.map(({ product }) => ({ variantId: product.variantId, title: product.title })),
  );
}
