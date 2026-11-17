import Image from "next/image";
import type { ShopImage } from "@/data/types";

interface MediaProps {
  image: ShopImage;
  /** Tamanhos responsivos, como no atributo sizes de <img>. */
  sizes: string;
  /** Preenche o elemento pai (que precisa ser position: relative). */
  fill?: boolean;
  priority?: boolean;
  /** Serve o arquivo original, sem redimensionar (para fotos já leves que são cortadas com object-cover). */
  original?: boolean;
  /** Use "" quando a imagem for decorativa e o texto já estiver ao lado. */
  alt?: string;
  className?: string;
}

/** Imagem no formato da Storefront API. SVGs de exemplo passam direto, sem otimização. */
export function Media({ image, sizes, fill, priority, original, alt, className }: MediaProps) {
  return (
    <Image
      src={image.url}
      alt={alt ?? image.altText}
      sizes={sizes}
      // No Next.js 16, `preload` substitui a antiga prop `priority`.
      preload={priority}
      unoptimized={original || image.url.endsWith(".svg")}
      className={className}
      {...(fill ? { fill: true } : { width: image.width, height: image.height })}
    />
  );
}
