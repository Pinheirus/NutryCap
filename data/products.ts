// Dados de exemplo (fictícios) para o protótipo. Sem back-end.
import { productImageSizes } from "./product-image-sizes";
import type { Kit, Money, Product, ProductLine, RoutineBundle } from "./types";

const brl = (amount: string): Money => ({ amount, currencyCode: "BRL" });

interface ProductInput {
  handle: string;
  title: string;
  lineHandle: string;
  productType: Product["productType"];
  price: string;
  compareAtPrice?: string;
  volume?: string;
  rating?: [value: number, count: number];
  activeIngredient?: string;
  tags?: string[];
  availableForSale?: boolean;
}

function product(input: ProductInput): Product {
  return {
    id: `gid://shopify/Product/${input.handle}`,
    handle: input.handle,
    title: input.title,
    volume: input.volume ?? null,
    lineHandle: input.lineHandle,
    productType: input.productType,
    tags: input.tags ?? [],
    availableForSale: input.availableForSale ?? true,
    featuredImage: {
      url: `/products/${input.handle}.svg`,
      altText: `Embalagem do produto ${[input.title, input.volume].filter(Boolean).join(" ")}`,
      ...productImageSizes[input.handle],
    },
    variantId: `gid://shopify/ProductVariant/${input.handle}`,
    price: brl(input.price),
    compareAtPrice: input.compareAtPrice ? brl(input.compareAtPrice) : null,
    rating: input.rating ? { value: input.rating[0], count: input.rating[1] } : null,
    activeIngredient: input.activeIngredient ?? null,
  };
}

export const lines: ProductLine[] = [
  { id: "gid://shopify/Collection/cresce-mais", handle: "cresce-mais", title: "Cresce+", description: "Crescimento e força desde a raiz." },
  { id: "gid://shopify/Collection/nutricao", handle: "nutricao", title: "Nutrição", description: "Reparação e brilho para fios ressecados." },
  { id: "gid://shopify/Collection/cachos", handle: "cachos", title: "Cachos", description: "Definição e hidratação para todas as curvaturas." },
  { id: "gid://shopify/Collection/pele", handle: "pele", title: "Pele", description: "Cuidado diário, da limpeza à proteção." },
];

export const products: Product[] = [
  // Cresce+
  product({ handle: "shampoo-cresce-mais", title: "Shampoo Cresce+", volume: "300 ml", lineHandle: "cresce-mais", productType: "cabelo", price: "49.90", compareAtPrice: "62.90", rating: [4.8, 312], tags: ["mais-vendido"] }),
  product({ handle: "condicionador-cresce-mais", title: "Condicionador Cresce+", volume: "300 ml", lineHandle: "cresce-mais", productType: "cabelo", price: "54.90", rating: [4.7, 198], tags: ["mais-vendido"] }),
  product({ handle: "tonico-capilar-cresce-mais", title: "Tônico Capilar Cresce+", volume: "120 ml", lineHandle: "cresce-mais", productType: "cabelo", price: "69.90", compareAtPrice: "89.90", rating: [4.9, 421], tags: ["mais-vendido"] }),
  // Esgotado: está marcado como mais vendido, mas não deve aparecer na home.
  product({ handle: "leave-in-cresce-mais", title: "Leave-in Cresce+", volume: "200 ml", lineHandle: "cresce-mais", productType: "cabelo", price: "44.90", rating: [4.8, 264], tags: ["mais-vendido"], availableForSale: false }),

  // Nutrição
  product({ handle: "serum-antiqueda", title: "Sérum Antiqueda Fortalecedor", volume: "60 ml", lineHandle: "nutricao", productType: "cabelo", price: "79.90", compareAtPrice: "99.90", rating: [4.6, 87], tags: ["mais-vendido"] }),
  product({ handle: "mascara-nutricao-profunda", title: "Máscara Nutrição Profunda", volume: "500 g", lineHandle: "nutricao", productType: "cabelo", price: "59.90", rating: [4.7, 128], tags: ["mais-vendido"] }),
  product({ handle: "oleo-reparador-de-pontas", title: "Óleo Reparador de Pontas", volume: "60 ml", lineHandle: "nutricao", productType: "cabelo", price: "34.90", tags: ["lancamento"] }),

  // Cachos
  product({ handle: "creme-de-pentear-cachos", title: "Creme de Pentear Cachos", volume: "300 ml", lineHandle: "cachos", productType: "cabelo", price: "39.90", rating: [4.8, 156], tags: ["mais-vendido"] }),
  product({ handle: "gelatina-ativadora-de-cachos", title: "Gelatina Ativadora de Cachos", volume: "300 g", lineHandle: "cachos", productType: "cabelo", price: "44.90", tags: ["lancamento"] }),

  // Pele
  product({ handle: "gel-de-limpeza-facial", title: "Gel de Limpeza", volume: "150 ml", activeIngredient: "Ácido salicílico 2%", lineHandle: "pele", productType: "pele", price: "44.90", rating: [4.7, 143] }),
  product({ handle: "serum-vitamina-c", title: "Sérum Vitamina C", volume: "30 ml", activeIngredient: "Vitamina C pura 10%", lineHandle: "pele", productType: "pele", price: "89.90", compareAtPrice: "109.90", rating: [4.8, 176], tags: ["mais-vendido"] }),
  product({ handle: "hidratante-acido-hialuronico", title: "Hidratante Facial", volume: "50 g", activeIngredient: "Ácido hialurônico 5%", lineHandle: "pele", productType: "pele", price: "69.90", rating: [4.6, 92] }),
  product({ handle: "protetor-solar-fps-50", title: "Protetor Solar FPS 50", volume: "50 g", activeIngredient: "Com vitamina E", lineHandle: "pele", productType: "pele", price: "64.90", tags: ["lancamento"] }),
  product({ handle: "demaquilante-bifasico", title: "Demaquilante Bifásico", volume: "120 ml", activeIngredient: "Água micelar", lineHandle: "pele", productType: "pele", price: "39.90", rating: [4.5, 61] }),
  product({ handle: "serum-noturno-retinol", title: "Sérum Noturno", volume: "30 ml", activeIngredient: "Retinol 0,3%", lineHandle: "pele", productType: "pele", price: "94.90", compareAtPrice: "114.90", tags: ["lancamento"] }),
  product({ handle: "creme-noturno-reparador", title: "Creme Noturno", volume: "50 g", activeIngredient: "Ceramidas e niacinamida", lineHandle: "pele", productType: "pele", price: "74.90", tags: ["lancamento"] }),
];

/* ------------------------------------------------------------------ */
/* Seletores                                                            */
/* ------------------------------------------------------------------ */

export function getProduct(handle: string): Product {
  const found = products.find((item) => item.handle === handle);
  if (!found) throw new Error(`Produto não encontrado: ${handle}`);
  return found;
}

/** Produto esgotado não aparece na home. */
const inStock = (item: Product) => item.availableForSale;

export const bestSellers = products.filter((item) => inStock(item) && item.tags.includes("mais-vendido"));
export const newArrivals = products.filter((item) => inStock(item) && item.tags.includes("lancamento"));

/* ------------------------------------------------------------------ */
/* Rotinas                                                              */
/* ------------------------------------------------------------------ */

/**
 * Rotinas de pele. Cada uma é vendida também como pacote ("rotina completa"),
 * com preço próprio — menor que a soma dos produtos avulsos.
 */
export const skinRoutine: Record<"manha" | "noite", RoutineBundle> = {
  manha: {
    id: "gid://shopify/Product/rotina-de-pele-manha",
    title: "Rotina de pele da manhã",
    variantId: "gid://shopify/ProductVariant/rotina-de-pele-manha",
    price: brl("239.90"),
    steps: [
      { step: 1, productHandle: "gel-de-limpeza-facial", benefit: "Limpar" },
      { step: 2, productHandle: "serum-vitamina-c", benefit: "Tratar" },
      { step: 3, productHandle: "hidratante-acido-hialuronico", benefit: "Hidratar" },
      { step: 4, productHandle: "protetor-solar-fps-50", benefit: "Proteger" },
    ],
  },
  noite: {
    id: "gid://shopify/Product/rotina-de-pele-noite",
    title: "Rotina de pele da noite",
    variantId: "gid://shopify/ProductVariant/rotina-de-pele-noite",
    price: brl("229.90"),
    steps: [
      { step: 1, productHandle: "demaquilante-bifasico", benefit: "Remover" },
      { step: 2, productHandle: "gel-de-limpeza-facial", benefit: "Limpar" },
      { step: 3, productHandle: "serum-noturno-retinol", benefit: "Tratar" },
      { step: 4, productHandle: "creme-noturno-reparador", benefit: "Reparar" },
    ],
  },
};

export const cresceKit: Kit = {
  id: "gid://shopify/Product/kit-cresce-mais",
  handle: "kit-cresce-mais",
  title: "Kit Cresce+ completo",
  description: "As três etapas da rotina, juntas.",
  featuredImage: {
    url: "/products/kit-cresce-mais.svg",
    altText: "Kit Cresce+ com shampoo, condicionador e tônico capilar",
    width: 800,
    height: 480,
  },
  variantId: "gid://shopify/ProductVariant/kit-cresce-mais",
  price: brl("139.90"),
  steps: [
    { step: 1, productHandle: "shampoo-cresce-mais", benefit: "Limpa e prepara o couro cabeludo." },
    { step: 2, productHandle: "condicionador-cresce-mais", benefit: "Fortalece o fio, da raiz às pontas." },
    { step: 3, productHandle: "tonico-capilar-cresce-mais", benefit: "Estimula o crescimento, direto na raiz." },
  ],
};
