"use client";

import { CarouselItem, CarouselTrack, useCarousel } from "@/components/ui/Carousel";
import { Icon } from "@/components/ui/Icon";
import { Media } from "@/components/ui/Media";
import { needs } from "@/data/home";
import { Container } from "@/components/ui/Container";

/** 4 cards de necessidade. Celular: carrossel com 1 card e parte do próximo. */
export function NeedCards() {
  const { trackRef } = useCarousel();

  return (
    <Container as="section" aria-labelledby="needs-title" className="mt-10 md:mt-14">
      <h2 id="needs-title" className="sr-only">
        Do que você precisa hoje?
      </h2>

      <CarouselTrack
        trackRef={trackRef}
        label="Necessidades"
        className="[--gap:24px] [--gaps:1] [--per:1.2] sm:[--gaps:2] sm:[--per:2.3] lg:[--gaps:3] lg:[--per:4]"
      >
        {needs.map((need) => (
          <CarouselItem key={need.id}>
            <a
              href={need.href}
              className="on-dark group relative block aspect-3/4 overflow-hidden rounded-card bg-warm-800 focus-visible:outline-offset-[-6px]"
            >
              {/* Desfoque suave só no desktop com mouse; no toque a foto fica nítida */}
              <Media
                image={need.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 24vw, (min-width: 640px) 42vw, 80vw"
                className="object-cover transition-[filter,transform] duration-400 ease-soft lg:group-hover:scale-105 lg:group-hover:blur-[6px] lg:group-focus-visible:scale-105 lg:group-focus-visible:blur-[6px]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-warm-900/85 via-warm-900/15 to-transparent transition-opacity duration-400 ease-soft lg:opacity-90 lg:group-hover:opacity-100"
              />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 transition-transform duration-400 ease-soft lg:group-hover:-translate-y-1.5">
                <h3 className="font-display text-2xl leading-tight font-medium text-balance text-white">{need.question}</h3>
                <Icon
                  name="arrowRight"
                  size={22}
                  className="mb-1 shrink-0 text-white/80 transition-[transform,color] duration-400 ease-soft lg:group-hover:translate-x-1 lg:group-hover:text-white"
                />
              </div>
            </a>
          </CarouselItem>
        ))}
      </CarouselTrack>
    </Container>
  );
}
