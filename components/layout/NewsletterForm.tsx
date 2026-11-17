"use client";

import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

/** Newsletter do rodapé. No protótipo, só confirma o envio na tela. */
export function NewsletterForm() {
  const id = useId();
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <p role="status" className="flex h-12 animate-fade-in items-center text-base font-medium text-white">
        Pronto! Você recebe nosso próximo recado.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
      <label htmlFor={id} className="sr-only">
        Seu e-mail
      </label>
      <input
        id={id}
        type="email"
        required
        autoComplete="email"
        placeholder="Seu e-mail"
        className="h-12 min-w-0 shrink-0 rounded-full sm:flex-1 border border-warm-700 bg-warm-900 px-5 text-base text-white placeholder:text-warm-400 focus-visible:outline-offset-0"
      />
      <Button type="submit" variant="accent" size="lg">
        Quero receber
      </Button>
    </form>
  );
}
