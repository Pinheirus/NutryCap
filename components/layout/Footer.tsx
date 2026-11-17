import { Icon } from "@/components/ui/Icon";
import { footer, store } from "@/data/home";
import { FooterWordmark } from "./FooterWordmark";
import { NewsletterForm } from "./NewsletterForm";
import { Container } from "@/components/ui/Container";

/** Ano atual, calculado no servidor e guardado em cache. */
async function CopyrightYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}

const columnTitle = "text-[13px] font-bold tracking-wider text-warm-400 uppercase";
const footerLink =
  "inline-flex min-h-9 items-center text-[15px] text-white/90 underline-offset-4 transition-colors duration-200 hover:text-white hover:underline";

/** Mesma forma do banner: bloco grande com margem e cantos arredondados. */
export function Footer() {
  return (
    <Container as="footer" className="mt-16 pb-4 md:mt-28 md:pb-6">
      <div className="on-dark @container relative overflow-hidden rounded-block bg-linear-to-br from-warm-900 to-warm-800 text-white">
        {/* Toque de rosa num canto, quase imperceptível */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-48 -right-48 size-[640px] rounded-full bg-[radial-gradient(closest-side,rgb(255_81_130/0.13),transparent)]"
        />

        <div className="relative p-6 pt-10 md:p-12 lg:p-16">
          {/* Topo: newsletter */}
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-16">
            <div>
              <h2 className="font-display text-3xl leading-tight font-medium text-balance md:text-4xl">
                {footer.newsletter.title}
              </h2>
              <p className="mt-3 max-w-md text-base text-warm-300">{footer.newsletter.description}</p>
            </div>
            <NewsletterForm />
          </div>

          {/* Meio: colunas */}
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-white/10 pt-12 md:mt-16 md:grid-cols-4 md:pt-16">
            {footer.columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h3 className={columnTitle}>{column.title}</h3>
                <ul className="mt-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className={footerLink}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div>
              <h3 className={columnTitle}>Atendimento</h3>
              <a href={store.whatsapp.href} className={`${footerLink} mt-3 gap-2 font-medium`}>
                <Icon name="chat" size={18} />
                <span>
                  <span className="sr-only">WhatsApp </span>
                  {store.whatsapp.label}
                </span>
              </a>
              <p className="text-[15px] text-warm-300">WhatsApp · {store.hours}</p>
            </div>
          </div>

          {/* Redes sociais, pagamento e dados legais */}
          <div className="mt-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <ul aria-label="Redes sociais" className="flex flex-wrap gap-x-6">
              {footer.social.map((network) => (
                <li key={network.label}>
                  <a href={network.href} className={footerLink}>
                    {network.label}
                  </a>
                </li>
              ))}
            </ul>
            <ul aria-label="Formas de pagamento" className="flex flex-wrap gap-2">
              {footer.payments.map((payment) => (
                <li
                  key={payment}
                  className="inline-flex h-8 items-center rounded-lg border border-white/15 px-3 text-[13px] font-medium text-warm-300"
                >
                  {payment}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-8 text-[13px] text-warm-400">
            © <CopyrightYear /> {store.name} · CNPJ {store.cnpj}
          </p>
        </div>

        <FooterWordmark />
      </div>
    </Container>
  );
}
