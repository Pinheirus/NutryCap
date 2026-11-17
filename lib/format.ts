import type { Money, Product, ProductRating } from "@/data/types";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const decimal = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export const toNumber = (money: Money) => Number(money.amount);

/** "R$ 49,90" */
export function formatMoney(money: Money | number) {
  return currency.format(typeof money === "number" ? money : toNumber(money));
}

/** "4,7 (128)" */
export function formatRating(rating: ProductRating) {
  return `${decimal.format(rating.value)} (${rating.count})`;
}

/** Percentual de desconto arredondado, ex.: 21 */
export function discountPercent(price: Money, compareAtPrice: Money) {
  return Math.round((1 - toNumber(price) / toNumber(compareAtPrice)) * 100);
}

/** Nome com volume, ex.: "Shampoo Cresce+ 300 ml" */
export function fullTitle(product: Pick<Product, "title" | "volume">) {
  return [product.title, product.volume].filter(Boolean).join(" ");
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
