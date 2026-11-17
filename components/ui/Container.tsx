import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/format";

type ContainerProps<T extends ElementType> = {
  /** Elemento HTML a renderizar (section, div, footer…). */
  as?: T;
} & ComponentPropsWithoutRef<T>;

/**
 * Container da página: largura máxima de 1440px, centralizado.
 * Padding lateral (variável --container-pad, em globals.css):
 * 16px no celular · 24px no tablet · 80px no desktop.
 */
export function Container<T extends ElementType = "div">({ as, className, ...props }: ContainerProps<T>) {
  const Component: ElementType = as ?? "div";
  return <Component className={cn("mx-auto w-full max-w-[1440px] px-(--container-pad)", className)} {...props} />;
}
