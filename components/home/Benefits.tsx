import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { benefits } from "@/data/home";
import { cn } from "@/lib/format";

/**
 * Faixa de benefícios: leve, sem fundo, só com linhas finas (#E6DEE0).
 * - Desktop (≥1400px): 4 colunas iguais, linha vertical entre elas. (Abaixo disso o
 *   título mais longo não cabe em 1 linha numa coluna, então vale o 2×2.)
 * - Tablet (≥640px): 2×2, linha horizontal entre as fileiras e vertical entre as colunas.
 * - Celular: lista, ícone à esquerda, linha horizontal entre os itens.
 */
export function Benefits() {
  return (
    <Container as="section" aria-labelledby="benefits-title" className="mt-16 md:mt-28">
      <h2 id="benefits-title" className="sr-only">
        Por que comprar com a Nutry Cap
      </h2>

      {/* linha no topo e embaixo da faixa */}
      <ul className="grid border-y border-warm-200 sm:grid-cols-2 min-[87.5rem]:grid-cols-4 min-[87.5rem]:py-10">
        {benefits.map((benefit, index) => (
          <li
            key={benefit.id}
            className={cn(
              "flex items-start gap-4 border-warm-200 py-6 sm:block sm:px-8 sm:py-8 min-[87.5rem]:py-0",
              // linha horizontal: celular, entre todos os itens; tablet, só entre as fileiras
              index > 0 && "border-t min-[87.5rem]:border-t-0",
              index === 1 && "sm:border-t-0",
              // linha vertical: entre colunas, nunca nas bordas
              index % 2 === 1 && "sm:border-l",
              index === 2 && "min-[87.5rem]:border-l",
            )}
          >
            <Icon name={benefit.icon} size={28} className="shrink-0 text-warm-900" />
            <div className="min-w-0 sm:mt-4">
              <h3 className="font-display text-xl leading-7 font-medium text-warm-900 min-[87.5rem]:whitespace-nowrap">{benefit.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-5 text-warm-700">{benefit.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
}
