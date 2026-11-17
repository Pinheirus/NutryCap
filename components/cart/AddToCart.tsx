"use client";

import { useEffect, useRef } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/format";
import { useCart } from "./CartProvider";

interface AddToCartProps {
  variantId: string;
  /** Nome do item, usado nos rótulos acessíveis. */
  title: string;
  label?: string;
  variant?: "primary" | "secondary" | "accent" | "inverse";
  size?: "md" | "lg";
  /** Ícone (18px) à esquerda do texto. */
  icon?: IconName;
  className?: string;
}

/** Botão de adicionar que vira contador (– 1 +) depois do primeiro clique. */
export function AddToCart({ variantId, title, label = "Adicionar", variant = "primary", size = "md", icon, className }: AddToCartProps) {
  const { quantities, setQuantity } = useCart();
  const quantity = quantities[variantId] ?? 0;

  // Ao trocar botão ↔ contador, o foco do teclado acompanha a troca.
  const addRef = useRef<HTMLButtonElement>(null);
  const plusRef = useRef<HTMLButtonElement>(null);
  const moveFocus = useRef(false);
  const inCart = quantity > 0;

  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    (inCart ? plusRef : addRef).current?.focus();
  }, [inCart]);

  const height = size === "lg" ? "h-12" : "h-11";

  if (!inCart) {
    return (
      <button
        ref={addRef}
        type="button"
        aria-label={`${label}: ${title}`}
        onClick={() => {
          moveFocus.current = true;
          setQuantity(variantId, 1);
        }}
        className={buttonClasses({ variant, size }, cn("w-full animate-fade-in", className))}
      >
        {icon && <Icon name={icon} size={18} />}
        {label}
      </button>
    );
  }

  const stepButton =
    "grid aspect-square h-full place-items-center rounded-full text-warm-900 transition-colors duration-200 hover:bg-warm-100";

  return (
    <div
      role="group"
      aria-label={`Quantidade de ${title}`}
      className={cn(
        "flex w-full animate-fade-in items-center justify-between rounded-full border border-warm-900 bg-white p-1",
        height,
        className,
      )}
    >
      <button
        type="button"
        aria-label="Diminuir quantidade"
        onClick={() => {
          if (quantity === 1) moveFocus.current = true;
          setQuantity(variantId, quantity - 1);
        }}
        className={stepButton}
      >
        <Icon name="minus" size={18} />
      </button>
      <span className="min-w-6 text-center text-sm font-bold tabular-nums text-warm-900">{quantity}</span>
      <button
        ref={plusRef}
        type="button"
        aria-label="Aumentar quantidade"
        onClick={() => setQuantity(variantId, quantity + 1)}
        className={stepButton}
      >
        <Icon name="plus" size={18} />
      </button>
    </div>
  );
}
