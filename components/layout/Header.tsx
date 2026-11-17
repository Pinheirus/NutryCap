"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { navigation, store } from "@/data/home";
import { cn } from "@/lib/format";

const TOPBAR_HEIGHT = 36;

/** Link do menu com traço rosa: aparece no hover/foco e fica fixo no item ativo. */
const navItem =
  "group/nav relative inline-flex h-full items-center gap-1 text-[15px] font-medium text-warm-800 transition-colors duration-200 ease-soft hover:text-warm-900 aria-[current=page]:text-warm-900 aria-expanded:text-warm-900";
const navUnderline =
  "absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 rounded-full bg-brand transition-transform duration-300 ease-soft group-hover/nav:scale-x-100 group-focus-visible/nav:scale-x-100 group-aria-[current=page]/nav:scale-x-100 group-aria-expanded/nav:scale-x-100";

function SearchField({ className }: { className?: string }) {
  const id = useId();
  return (
    <form role="search" action="#" onSubmit={(event) => event.preventDefault()} className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">
        Buscar produtos
      </label>
      <Icon name="search" size={24} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-warm-900" />
      <input
        id={id}
        type="search"
        placeholder="Buscar produtos"
        className="h-11 w-full rounded-full bg-warm-100 pr-4 pl-12 text-[15px] text-warm-900 placeholder:text-placeholder focus-visible:outline-offset-0"
      />
    </form>
  );
}

function CategoriesMenu() {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        wrapper.current?.querySelector("button")?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div
      ref={wrapper}
      className="relative h-full"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={navItem}
      >
        Categorias
        <Icon
          name="chevronDown"
          size={16}
          className={cn("transition-transform duration-200 ease-soft", open && "rotate-180")}
        />
        <span aria-hidden="true" className={navUnderline} />
      </button>

      <div
        id={panelId}
        className={cn(
          "absolute top-full -left-4 w-56 pt-2 transition-[opacity,transform,visibility] duration-200 ease-soft",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
        )}
      >
        <ul className="rounded-card border border-warm-100 bg-white p-2 shadow-header">
          {navigation.categories.map((category) => (
            <li key={category.label}>
              <a
                href={category.href}
                className="flex h-11 items-center justify-between rounded-lg px-3 text-[15px] font-medium text-warm-900 transition-colors duration-200 hover:bg-warm-50"
              >
                {category.label}
                <Icon name="arrowRight" size={16} className="text-warm-600" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CartLink() {
  const { count, bumpKey } = useCart();
  return (
    <a
      href="#"
      aria-label={count === 0 ? "Carrinho vazio" : `Carrinho, ${count} ${count === 1 ? "item" : "itens"}`}
      className="relative grid size-11 place-items-center rounded-full text-warm-900 transition-colors duration-200 hover:bg-warm-50"
    >
      {/* a key reinicia a animação a cada item adicionado */}
      <span key={bumpKey} className={cn("grid place-items-center", bumpKey > 0 && "animate-cart-bump")}>
        <Icon name="cart" size={24} />
      </span>
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute top-1 right-0.5 grid h-[18px] min-w-[18px] animate-fade-in place-items-center rounded-full bg-brand px-1 text-[11px] leading-none font-bold text-warm-900"
        >
          {count}
        </span>
      )}
    </a>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const { announcement } = store;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > TOPBAR_HEIGHT);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Topbar: rola junto com a página e some */}
      <p className="flex h-(--topbar-h) items-center justify-center bg-warm-100 px-4 text-center text-[13px] font-medium text-warm-700">
        <span>
          {announcement.before}
          <strong className="font-bold text-warm-900">{announcement.highlight}</strong>
          {announcement.after}
        </span>
      </p>

      {/* Linha principal: fixa ao rolar, um pouco mais baixa e com sombra suave */}
      <header
        className={cn(
          "sticky top-0 z-40 border-b border-warm-100 bg-white transition-shadow duration-300 ease-soft",
          scrolled && "shadow-header",
        )}
      >
        <Container
          className={cn(
            "flex items-center gap-3 transition-[height] duration-300 ease-soft lg:gap-8 xl:gap-10",
            scrolled ? "h-[60px]" : "h-(--header-h)",
          )}
        >
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuOpen((value) => !value)}
            className="-ml-2.5 grid size-11 place-items-center rounded-full text-warm-900 lg:hidden"
          >
            <Icon name={menuOpen ? "close" : "menu"} size={24} />
          </button>

          <a href="#" aria-label="Nutry Cap, página inicial" className="shrink-0">
            {/* logo oficial, com 28px de altura */}
            <Image
              src={store.logo.url}
              alt=""
              width={store.logo.width}
              height={store.logo.height}
              preload
              className="h-7 w-auto"
            />
          </a>

          <nav aria-label="Principal" className="hidden h-full items-center gap-6 lg:flex xl:gap-8">
            <CategoriesMenu />
            {navigation.links.map((link) => (
              <a key={link.label} href={link.href} className={navItem}>
                {link.label}
                <span aria-hidden="true" className={navUnderline} />
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <SearchField className="mr-2 hidden w-52 lg:block xl:w-72" />
            <a
              href="#"
              aria-label="Minha conta"
              className="grid size-11 place-items-center rounded-full text-warm-900 transition-colors duration-200 hover:bg-warm-50"
            >
              <Icon name="user" size={24} />
            </a>
            <CartLink />
          </div>
        </Container>

        {/* Menu do celular e tablet */}
        <div
          id={menuId}
          className={cn(
            "grid transition-[grid-template-rows,visibility] duration-300 ease-soft lg:hidden",
            menuOpen ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden">
            <Container as="nav" aria-label="Menu" className="border-t border-warm-100 pt-4 pb-6">
              <SearchField />
              <p className="mt-5 text-xs font-bold tracking-wider text-warm-700 uppercase">Categorias</p>
              <ul className="mt-1">
                {navigation.categories.map((category) => (
                  <li key={category.label}>
                    <a href={category.href} className="flex h-11 items-center font-display text-xl font-medium text-warm-900">
                      {category.label}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="mt-3 border-t border-warm-100 pt-3">
                {navigation.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="flex h-11 items-center text-[15px] font-medium text-warm-900">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Container>
          </div>
        </div>
      </header>
    </>
  );
}
