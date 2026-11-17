import { Container } from "@/components/ui/Container";
import { testimonials } from "@/data/home";
import { getProduct } from "@/data/products";
import { fullTitle } from "@/lib/format";

/**
 * Depoimentos — por enquanto um espaço reservado na ordem da home:
 * título e 3 cards de exemplo, editáveis em data/home.ts (`testimonials`).
 */
export function Testimonials() {
  return (
    <Container as="section" aria-labelledby="testimonials-title" className="mt-16 md:mt-28">
      <h2 id="testimonials-title" className="font-display text-4xl leading-[1.05] font-medium tracking-tight md:text-5xl">
        {testimonials.title}
      </h2>
      <p className="mt-3 text-base text-warm-700">
        {testimonials.total} · nota média de {testimonials.average}
      </p>

      <ul className="mt-8 grid gap-3 md:mt-10 md:grid-cols-3 md:gap-5">
        {testimonials.items.map((item) => (
          <li key={item.id}>
            <figure className="flex h-full flex-col justify-between gap-6 rounded-card bg-warm-50 p-6">
              <blockquote className="text-lg leading-snug font-medium text-warm-900">“{item.quote}”</blockquote>
              <figcaption className="text-sm text-warm-700">
                <span className="font-bold text-warm-900">{item.author}</span>
                <span className="mt-0.5 block">Usou {fullTitle(getProduct(item.productHandle))}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Container>
  );
}
