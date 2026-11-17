"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface CartContextValue {
  /** Quantidade por variantId. */
  quantities: Record<string, number>;
  /** Total de itens no carrinho. */
  count: number;
  /** Aumenta a cada adição: o Header usa para fazer o ícone do carrinho pular. */
  bumpKey: number;
  setQuantity: (variantId: string, quantity: number) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/**
 * Carrinho em memória, só para o protótipo.
 * Na integração, trocar por Cart da Storefront API (cartCreate / cartLinesUpdate).
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ quantities: Record<string, number>; bumpKey: number }>({
    quantities: {},
    bumpKey: 0,
  });

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    setState((current) => {
      const previous = current.quantities[variantId] ?? 0;
      const quantities = { ...current.quantities };
      if (quantity <= 0) delete quantities[variantId];
      else quantities[variantId] = quantity;
      return { quantities, bumpKey: quantity > previous ? current.bumpKey + 1 : current.bumpKey };
    });
  }, []);

  const value = useMemo(() => {
    const count = Object.values(state.quantities).reduce((sum, quantity) => sum + quantity, 0);
    return { ...state, count, setQuantity };
  }, [state, setQuantity]);

  return (
    <CartContext.Provider value={value}>
      {children}
      {/* Anuncia mudanças do carrinho para leitores de tela */}
      <p aria-live="polite" className="sr-only">
        {value.count === 0 ? "" : `${value.count} ${value.count === 1 ? "item" : "itens"} no carrinho`}
      </p>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return context;
}
