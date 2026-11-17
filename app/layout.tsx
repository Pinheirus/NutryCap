import type { Metadata } from "next";
import { CartProvider } from "@/components/cart/CartProvider";
import { Footer } from "@/components/layout/Footer";
import localFont from "next/font/local";
import { Header } from "@/components/layout/Header";
import "./globals.css";

// Chillax: títulos e chamadas (peso 500; 600 só no logo provisório)
const chillax = localFont({
  src: [
    { path: "./fonts/Chillax-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Chillax-Semibold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-chillax",
  display: "swap",
});

// Satoshi: corpo e interface
const satoshi = localFont({
  src: [
    { path: "./fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Satoshi-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nutry Cap — Cuidado para cabelo e pele, direto da fábrica",
  description: "Protótipo da nova home da Nutry Cap.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${chillax.variable} ${satoshi.variable} antialiased`}>
      <body className="flex min-h-svh flex-col">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-warm-900 focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-white"
        >
          Pular para o conteúdo
        </a>
        <CartProvider>
          <Header />
          <main id="conteudo" className="flex-1">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
