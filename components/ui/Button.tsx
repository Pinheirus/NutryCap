import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/format";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,border-color,color,transform] duration-200 ease-soft active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants = {
  /** Preenchido escuro: ações principais (banner, rotina completa, página de produto). */
  primary: "bg-warm-900 text-white hover:bg-warm-800",
  /** Secundário: contorno de 1px; no hover, preenche. É o "Adicionar" dos cards. */
  secondary: "border border-warm-900 bg-transparent text-warm-900 hover:bg-warm-900 hover:text-white",
  /** Preenchido claro, para fundos escuros. */
  inverse: "bg-white text-warm-900 hover:bg-warm-100",
  /** Rosa da marca: usar com moderação, só em ações de destaque. */
  accent: "bg-brand text-warm-900 hover:bg-[#ff6a94]",
  /** Sobre foto: quase preto com borda fina branca. */
  onImage: "border border-white bg-warm-900 text-white hover:bg-warm-800",
} as const;

const sizes = {
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
} as const;

interface StyleProps {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export function buttonClasses({ variant = "primary", size = "md" }: StyleProps = {}, className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = StyleProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size }, className)} {...props} />;
}

type ButtonLinkProps = StyleProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <a className={buttonClasses({ variant, size }, className)} {...props} />;
}
