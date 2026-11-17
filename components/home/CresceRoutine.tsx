import { AddToCart } from "@/components/cart/AddToCart";
import { ProductImage, TINTED_SURFACE } from "@/components/product/ProductImage";
import { Icon } from "@/components/ui/Icon";
import { Media } from "@/components/ui/Media";
import { cresceKit, getProduct } from "@/data/products";
import { cn, formatMoney, fullTitle, toNumber } from "@/lib/format";

/**
 * Rotina Cresce+: painel de largura total, gêmeo do banner.
 * Não usa o Container: tem a mesma margem lateral do banner (--gutter), raio e
 * fundo #EFE9EB. O conteúdo fica num wrapper interno de até 1440px.
 */
export function CresceRoutine() {
  const steps = cresceKit.steps.map((step) => ({ ...step, product: getProduct(step.productHandle) }));
  const separatePrice = steps.reduce((sum, step) => sum + toNumber(step.product.price), 0);
  const savings = separatePrice - toNumber(cresceKit.price);

  return (
    <section
      id="rotina-cresce"
      aria-labelledby="cresce-title"
      // padding-inline: 16px no celular · 24px no tablet · 80px no desktop (os mesmos valores do Container)
      className="mx-(--gutter) mt-16 scroll-mt-24 rounded-2xl bg-warm-100 px-(--container-pad) py-10 md:mt-28 md:rounded-block md:py-16"
    >
      <div className="mx-auto max-w-[1440px]">
        <h2 id="cresce-title" className="font-display text-4xl leading-[1.05] font-medium tracking-tight md:text-5xl">
          Rotina Cresce+
        </h2>
        <p className="mt-3 max-w-md text-base text-warm-700">Três etapas, nessa ordem, para o fio crescer forte.</p>

        {/*
          Desktop: 3 passos (colunas iguais) + kit com 420px fixos à direita, 48px entre os grupos.
          Tablet: passos em 3 colunas e o kit abaixo, na largura toda.
          Celular: passos em lista (miniatura à esquerda) e o kit abaixo.
        */}
        <div className="mt-8 grid items-stretch gap-8 md:mt-10 md:gap-12 xl:grid-cols-[minmax(0,1fr)_420px]">
          <ol className="grid gap-6 sm:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.step} className="flex items-center gap-5 sm:flex-col sm:items-stretch sm:gap-0">
                <ProductImage
                  image={step.product.featuredImage}
                  alt=""
                  surface="tinted"
                  sizes="(min-width: 640px) 320px, 112px"
                  className="w-28 shrink-0 sm:w-full sm:max-w-[320px]"
                />
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-center gap-4 sm:mt-5">
                    <span aria-hidden="true" className="font-display text-5xl leading-none font-medium md:text-6xl">
                      {step.step}
                    </span>
                    {/* linha fina que liga esta etapa à próxima */}
                    {index < steps.length - 1 && (
                      <span aria-hidden="true" className="-mr-6 hidden h-px flex-1 bg-warm-300 sm:block" />
                    )}
                  </div>
                  <h3 className="mt-3 text-base font-bold">
                    <span className="sr-only">Etapa {step.step}: </span>
                    {fullTitle(step.product)}
                  </h3>
                  <p className="mt-1 text-[15px] text-warm-700">{step.benefit}</p>
                  {/* logo abaixo da descrição */}
                  <a
                    href="#"
                    aria-label={`Ver produto: ${fullTitle(step.product)}`}
                    className="mt-3 inline-flex items-center gap-1 self-start py-1 text-sm font-medium text-warm-700 underline-offset-4 hover:text-warm-900 hover:underline"
                  >
                    Ver produto
                    <Icon name="arrowRight" size={16} />
                  </a>
                </div>
              </li>
            ))}
          </ol>

          {/* Kit completo. No tablet ocupa a largura toda: imagem à esquerda, informações à direita. */}
          <article
            className={cn(
              "flex flex-col rounded-block p-6 md:p-8 md:max-xl:grid md:max-xl:grid-cols-2 md:max-xl:items-center md:max-xl:gap-8",
              TINTED_SURFACE,
            )}
          >
            <Media
              image={cresceKit.featuredImage}
              sizes="(min-width: 1280px) 356px, (min-width: 768px) 45vw, 90vw"
              className="aspect-[5/3] w-full object-contain"
            />
            <div className="flex flex-1 flex-col">
              <h3 className="mt-4 font-display text-2xl font-medium md:max-xl:mt-0">{cresceKit.title}</h3>
              <p className="mt-1 text-[15px] text-warm-700">{cresceKit.description}</p>

              <div className="mt-5 mb-6">
                <p className="text-sm text-muted">
                  Comprando avulso: <s>{formatMoney(separatePrice)}</s>
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="sr-only">Preço do kit: </span>
                  <span className="font-display text-4xl font-medium">{formatMoney(cresceKit.price)}</span>
                  <span className="inline-flex h-7 items-center rounded-full bg-brand px-3 text-[13px] font-bold text-warm-900">
                    Economize {formatMoney(savings)}
                  </span>
                </p>
              </div>

              <div className="mt-auto">
                <AddToCart variantId={cresceKit.variantId} title={cresceKit.title} label="Adicionar o kit" variant="accent" size="lg" />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
