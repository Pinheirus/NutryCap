import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { hero } from "@/data/home";
import type { ShopImage } from "@/data/types";
import { cn } from "@/lib/format";

/** Imagem de produto recortada (PNG com fundo transparente), à direita do banner. */
const PRODUCT_IMAGE = "/hero/kit-cresce.png";

interface HeroProps {
  /**
   * Foto de fundo do banner (opcional). Com foto, entram o overlay escuro na base
   * e à esquerda, o texto branco e a borda branca do botão. Sem foto, o banner
   * fica com fundo liso #EFE9EB e texto escuro.
   */
  withImage?: ShopImage;
}

/**
 * Banner. Não usa o Container do site: o bloco vai quase de ponta a ponta,
 * com a margem lateral global --gutter (12px no celular, 24px a partir do tablet),
 * a mesma da vitrine.
 * Só o conteúdo interno volta para o Container, para alinhar com o logo e as seções.
 */
export function Hero({ withImage }: HeroProps) {
  const hasImage = Boolean(withImage);
  // Enquanto o PNG não estiver em /public, o espaço da imagem fica vazio.
  const hasProductImage = existsSync(join(process.cwd(), "public", PRODUCT_IMAGE));

  return (
    <section
      aria-labelledby="hero-title"
      className={cn(
        "relative mx-(--gutter) mt-(--gutter) overflow-hidden rounded-2xl md:rounded-block",
        // Altura: a tela menos topbar, header e 136px (margem do topo, espaço até a
        // próxima seção e o começo dos cards, que continuam visíveis sem rolar)
        "h-[calc(100svh-var(--topbar-h)-var(--header-h)-136px)] min-h-[520px]",
        hasImage ? "on-dark bg-warm-800" : "bg-warm-100",
      )}
    >
      {withImage && (
        <>
          {/*
            A foto é cortada para preencher o bloco (object-cover), então precisa da
            resolução cheia: `original` serve o arquivo como está (ele já é leve, ~80 KB).
            Enquadramento: no celular, o frasco de shampoo; a partir do tablet, o lado
            direito da foto (condicionador e máscara ficam livres, ao lado do texto).
          */}
          <Media image={withImage} sizes="100vw" fill priority original className="object-cover object-[30%_center] md:object-[90%_center]" />
          {/* Overlay escuro suave na base e à esquerda, para o texto branco ficar legível */}
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-warm-900/80 via-warm-900/30 to-transparent" />
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-r from-warm-900/75 via-warm-900/35 via-45% to-transparent to-70%" />
        </>
      )}

      {/*
        Esta camada tem a largura da tela (desfaz a margem do banner), então o
        Container aqui dentro cai exatamente na mesma coluna do resto do site.
        Abaixo do desktop a margem do site é menor que a do banner, por isso o
        conteúdo ganha um recuo mínimo de 24px a partir da borda do bloco.
      */}
      <div className="absolute inset-y-0 -inset-x-(--gutter) flex items-end">
        <Container className="pb-6 max-xl:px-[calc(var(--gutter)+24px)] md:pb-12 xl:pb-16">
          {/*
            Imagem do produto.
            Celular: em cima do texto, com 260px de altura.
            Tablet e desktop: metade direita do banner, alinhada à base, até 90% da altura.
            (As contas com --gutter compensam a camada mais larga que o banner.)
          */}
          <div className="relative mb-3 h-[260px] md:absolute md:right-(--gutter) md:bottom-0 md:mb-0 md:h-[90%] md:w-[calc(50%-var(--gutter))]">
            {/* Sem o arquivo, o espaço fica reservado e vazio (sem bordas nem guias). */}
            {hasProductImage && (
              <Image
                src={PRODUCT_IMAGE}
                alt="Kit Cresce+: shampoo, condicionador e tônico capilar"
                fill
                // No Next.js 16, `preload` substitui a antiga prop `priority`.
                preload
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-contain object-bottom"
              />
            )}
          </div>

          {/* Texto: na metade esquerda quando a imagem está ao lado */}
          <div className="relative md:w-1/2 md:pr-6">
            <h1
              id="hero-title"
              className={cn(
                "font-display text-[2.5rem] leading-[1.05] font-medium tracking-tight text-balance lg:text-5xl xl:text-7xl",
                hasImage ? "text-white" : "text-warm-900",
              )}
            >
              {hero.title}
            </h1>
            <p className={cn("mt-4 max-w-[520px] text-base text-balance md:text-lg", hasImage ? "text-white" : "text-warm-700")}>
              {hero.description}
            </p>
            <ButtonLink href={hero.cta.href} variant={hasImage ? "onImage" : "primary"} size="lg" className="mt-7">
              {hero.cta.label}
            </ButtonLink>
          </div>
        </Container>
      </div>
    </section>
  );
}
