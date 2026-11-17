// Conteúdo de exemplo da home (textos, navegação, depoimentos).
import type { Benefit, NeedCard, Testimonial } from "./types";

export const store = {
  name: "Nutry Cap",
  announcement: { before: "Frete grátis acima de ", highlight: "R$ 199", after: "" },
  whatsapp: { label: "(61) 3627-1908", href: "https://wa.me/556136271908" },
  hours: "Seg a sáb, 8h às 18h",

  // ↓ Valores usados nos textos da faixa de benefícios. Editar aqui.
  /** Prazo máximo de entrega, em dias úteis. VALOR PROVISÓRIO: confirmar com a operação. */
  deliveryBusinessDays: 7,
  /** Horário do atendimento pelo WhatsApp (segunda a sábado). */
  supportOpens: "8h",
  supportCloses: "18h",
  cnpj: "05.889.982/0001-38",
  /** Logo oficial (330×96, fundo transparente). */
  logo: { url: "/images/nutrycap-industria-logo.avif", altText: "Nutry Cap", width: 330, height: 96 },
};

export const navigation = {
  categories: [
    { label: "Cabelo", href: "#" },
    { label: "Cachos", href: "#" },
    { label: "Pele", href: "#" },
    { label: "Kits", href: "#" },
  ],
  links: [
    { label: "Para empresas", href: "#" },
    { label: "Sobre nós", href: "#" },
    { label: "Entre em contato", href: "#" },
  ],
};

export const hero = {
  title: "Cabelo forte começa na raiz.",
  description: "Cuidado feito na nossa fábrica, pensado para o seu dia a dia.",
  cta: { label: "Conhecer a rotina Cresce+", href: "#rotina-cresce" },
  /** Foto do banner (2054×765). O arquivo tem extensão .png, mas o conteúdo é WebP — o navegador lê normalmente. */
  image: {
    url: "/images/banner_nutrycap.png",
    altText: "Linha Cresce+ da Nutry Cap: shampoo, condicionador e máscara capilar",
    width: 2054,
    height: 765,
  },
};

const needImage = (name: string, altText: string) => ({
  url: `/images/${name}.svg`,
  altText,
  width: 1200,
  height: 1600,
});

export const needs: NeedCard[] = [
  { id: "queda", question: "Percebendo a queda de cabelo?", href: "#", image: needImage("necessidade-queda", "Imagem ilustrativa de fios lisos") },
  { id: "crescimento", question: "Quer fios mais longos?", href: "#", image: needImage("necessidade-crescimento", "Imagem ilustrativa de fios longos e ondulados") },
  { id: "cachos", question: "Cachos sem definição?", href: "#", image: needImage("necessidade-cachos", "Imagem ilustrativa de cachos") },
  { id: "pele", question: "Pele pedindo cuidado?", href: "#", image: needImage("necessidade-pele", "Imagem ilustrativa de gotas de hidratante") },
];

// "Cruelty\u2011free" usa hífen não separável (U+2011), para o título nunca quebrar no hífen.
export const benefits: Benefit[] = [
  {
    id: "fabrica",
    icon: "factory",
    title: "Direto da fábrica",
    description: "Sem intermediários: do nosso laboratório até você.",
  },
  {
    id: "entrega",
    icon: "delivery",
    title: "Envio para todo o Brasil",
    description: `Entrega em até ${store.deliveryBusinessDays} dias úteis, com rastreio.`,
  },
  {
    id: "cruelty-free",
    icon: "heart",
    title: "Cruelty\u2011free",
    description: "Nenhum produto é testado em animais.",
  },
  {
    id: "atendimento",
    icon: "chat",
    title: "Atendimento humano",
    description: `Pelo WhatsApp, de segunda a sábado, das ${store.supportOpens} às ${store.supportCloses}.`,
  },
];

// Seção Depoimentos — por enquanto um espaço reservado: editar título e cards aqui.
export const testimonials = {
  title: "Quem usa, conta",
  total: "+2.000 avaliações",
  average: "4,8 de 5",
  items: [
    { id: "1", quote: "Em dois meses já dava pra ver os fios novos nascendo na frente.", author: "Mariana S.", productHandle: "tonico-capilar-cresce-mais" },
    { id: "2", quote: "Meus cachos nunca ficaram tão definidos, e sem pesar.", author: "Juliana R.", productHandle: "creme-de-pentear-cachos" },
    { id: "3", quote: "Textura leve, some na pele. Virou o primeiro passo da minha manhã.", author: "Camila T.", productHandle: "serum-vitamina-c" },
  ] satisfies Testimonial[],
};

export const footer = {
  newsletter: {
    title: "Um recado nosso, de vez em quando.",
    description: "Lançamentos, dicas de cuidado e cupons. Sem lotar sua caixa de entrada.",
  },
  columns: [
    {
      title: "Loja",
      links: [
        { label: "Cabelo", href: "#" },
        { label: "Cachos", href: "#" },
        { label: "Pele", href: "#" },
        { label: "Kits", href: "#" },
      ],
    },
    {
      title: "Para empresas",
      links: [
        { label: "Marca própria", href: "#" },
        { label: "Revenda", href: "#" },
        { label: "Fale com vendas", href: "#" },
      ],
    },
    {
      title: "Ajuda",
      links: [
        { label: "Perguntas frequentes", href: "#" },
        { label: "Trocas e devoluções", href: "#" },
        { label: "Frete e entrega", href: "#" },
        { label: "Políticas", href: "#" },
      ],
    },
  ],
  social: [
    { label: "Instagram", href: "#" },
    { label: "TikTok", href: "#" },
    { label: "YouTube", href: "#" },
  ],
  payments: ["Pix", "Visa", "Mastercard", "Elo", "Boleto"],
};
