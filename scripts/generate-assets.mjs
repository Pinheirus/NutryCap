// Gera os assets de exemplo do protótipo:
//   1. components/ui/solar-icons.ts  → subconjunto dos ícones Solar (estilo Linear)
//   2. public/products/*.svg         → "fotos" de produto ilustrativas
//   3. public/images/*.svg           → imagens de ambiente ilustrativas (banner e cards)
//
// Rodar com: npm run assets
// Quando as fotos reais chegarem, basta trocar os arquivos/URLs em data/.

import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function write(relativePath, content) {
  const target = join(root, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content, "utf8");
}

/* ------------------------------------------------------------------ */
/* 1. Ícones Solar (Linear)                                            */
/* ------------------------------------------------------------------ */

const solar = require("@iconify-json/solar/icons.json");

// nome usado no código → candidatos no set Solar (o primeiro que existir)
const iconMap = {
  search: ["magnifer-linear", "magnifier-linear", "rounded-magnifer-linear"],
  user: ["user-circle-linear", "user-linear"],
  cart: ["cart-large-2-linear", "cart-large-linear"],
  // o Solar não tem "bag-plus": este é o equivalente no estilo Linear
  cartPlus: ["cart-plus-linear"],
  chevronDown: ["alt-arrow-down-linear"],
  chevronLeft: ["alt-arrow-left-linear"],
  chevronRight: ["alt-arrow-right-linear"],
  arrowRight: ["arrow-right-linear"],
  menu: ["hamburger-menu-linear"],
  close: ["close-linear", "close-circle-linear"],
  plus: ["add-linear"],
  minus: ["minus-linear"],
  star: ["star-linear"],
  // única exceção ao estilo Linear: a estrela de avaliação é preenchida
  starFilled: ["star-bold"],
  sun: ["sun-2-linear", "sun-linear"],
  moon: ["moon-linear"],
  check: ["check-circle-linear"],
  chat: ["chat-round-dots-linear", "chat-round-linear"],
  // faixa de benefícios
  factory: ["factory-linear", "buildings-2-linear"],
  delivery: ["delivery-linear", "truck-linear"],
  heart: ["heart-linear"],
};

const iconEntries = Object.entries(iconMap).map(([name, candidates]) => {
  const found = candidates.find((candidate) => solar.icons[candidate]);
  if (!found) throw new Error(`Ícone Solar não encontrado: ${candidates.join(", ")}`);
  return `  ${name}: ${JSON.stringify(solar.icons[found].body)},`;
});

write(
  "components/ui/solar-icons.ts",
  `// Arquivo gerado por scripts/generate-assets.mjs — não editar à mão.
// Ícones Solar, estilo Linear (https://www.figma.com/community/file/1166831539721848736).

export const solarIcons = {
${iconEntries.join("\n")}
} as const;

export type IconName = keyof typeof solarIcons;
`,
);

/* ------------------------------------------------------------------ */
/* 2. Produtos                                                          */
/* ------------------------------------------------------------------ */

const palettes = {
  cresce: { body: "#FFD9E3", shade: "#F7BFCE", cap: "#211C1D", label: "#FFFFFF", ink: "#211C1D", accent: "#FF5182" },
  cachos: { body: "#EBDCCB", shade: "#DCC8B2", cap: "#514A4C", label: "#FAF8F9", ink: "#31292B", accent: "#8A7B80" },
  nutri: { body: "#E6DEE0", shade: "#DACED1", cap: "#31292B", label: "#FFFFFF", ink: "#31292B", accent: "#8A7B80" },
  pele: { body: "#F3E3DA", shade: "#E7D0C4", cap: "#B99E92", label: "#FFFFFF", ink: "#31292B", accent: "#FF5182" },
  noite: { body: "#3B3235", shade: "#31292B", cap: "#211C1D", label: "#514A4C", ink: "#FAF8F9", accent: "#FF5182" },
};

function label(p, x, y, w, h, line) {
  const cx = x + w / 2;
  return `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${p.label}"/>
  <text x="${cx}" y="${y + h * 0.36}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="${Math.round(w * 0.105)}" font-weight="700" letter-spacing="2" fill="${p.ink}">NUTRY CAP</text>
  <rect x="${cx - 14}" y="${y + h * 0.5}" width="28" height="3" rx="1.5" fill="${p.accent}"/>
  <text x="${cx}" y="${y + h * 0.78}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="${Math.round(w * 0.085)}" fill="${p.ink}" opacity="0.75">${line}</text>`;
}

const shadow = (cx, rx) => `<ellipse cx="${cx}" cy="706" rx="${rx}" ry="16" fill="#211C1D" opacity="0.08"/>`;
const stroke = (p) => (p.body === "#FFFFFF" ? ` stroke="#E6DEE0" stroke-width="3"` : "");

const shapes = {
  bottle: (p, line, cx = 400, s = 1) => `
  <rect x="${cx - 50 * s}" y="${700 - 520 * s}" width="${100 * s}" height="${70 * s}" rx="${10 * s}" fill="${p.cap}"/>
  <path d="M${cx - 110 * s} ${700 - 380 * s} q0 -${70 * s} ${60 * s} -${70 * s} h${100 * s} q${60 * s} 0 ${60 * s} ${70 * s} v${350 * s} q0 ${30 * s} -${30 * s} ${30 * s} h-${160 * s} q-${30 * s} 0 -${30 * s} -${30 * s} z" fill="${p.body}"${stroke(p)}/>
  <rect x="${cx + 70 * s}" y="${700 - 380 * s}" width="${40 * s}" height="${350 * s}" fill="${p.shade}" opacity="0.6"/>
  ${label(p, cx - 80 * s, 700 - 300 * s, 160 * s, 200 * s, line)}`,

  pump: (p, line, cx = 400, s = 1) => `
  <rect x="${cx - 12 * s}" y="${700 - 540 * s}" width="${24 * s}" height="${90 * s}" fill="${p.cap}"/>
  <path d="M${cx - 80 * s} ${700 - 560 * s} h${110 * s} q${14 * s} 0 ${14 * s} ${14 * s} v${16 * s} h-${124 * s} z" fill="${p.cap}"/>
  <rect x="${cx - 46 * s}" y="${700 - 470 * s}" width="${92 * s}" height="${50 * s}" rx="${8 * s}" fill="${p.cap}"/>
  <rect x="${cx - 105 * s}" y="${700 - 420 * s}" width="${210 * s}" height="${420 * s}" rx="${34 * s}" fill="${p.body}"${stroke(p)}/>
  <rect x="${cx + 65 * s}" y="${700 - 400 * s}" width="${40 * s}" height="${380 * s}" rx="${20 * s}" fill="${p.shade}" opacity="0.6"/>
  ${label(p, cx - 78 * s, 700 - 320 * s, 156 * s, 200 * s, line)}`,

  dropper: (p, line, cx = 400, s = 1) => `
  <rect x="${cx - 26 * s}" y="${700 - 470 * s}" width="${52 * s}" height="${90 * s}" rx="${26 * s}" fill="${p.cap}"/>
  <rect x="${cx - 44 * s}" y="${700 - 390 * s}" width="${88 * s}" height="${60 * s}" rx="${8 * s}" fill="${p.cap}"/>
  <path d="M${cx - 80 * s} ${700 - 270 * s} q0 -${60 * s} ${50 * s} -${60 * s} h${60 * s} q${50 * s} 0 ${50 * s} ${60 * s} v${240 * s} q0 ${30 * s} -${30 * s} ${30 * s} h-${100 * s} q-${30 * s} 0 -${30 * s} -${30 * s} z" fill="${p.body}"${stroke(p)}/>
  <rect x="${cx + 48 * s}" y="${700 - 270 * s}" width="${32 * s}" height="${240 * s}" fill="${p.shade}" opacity="0.6"/>
  ${label(p, cx - 58 * s, 700 - 230 * s, 116 * s, 160 * s, line)}`,

  jar: (p, line, cx = 400, s = 1) => `
  <rect x="${cx - 170 * s}" y="${700 - 330 * s}" width="${340 * s}" height="${80 * s}" rx="${16 * s}" fill="${p.cap}"/>
  <rect x="${cx - 160 * s}" y="${700 - 256 * s}" width="${320 * s}" height="${256 * s}" rx="${34 * s}" fill="${p.body}"${stroke(p)}/>
  <rect x="${cx + 110 * s}" y="${700 - 240 * s}" width="${50 * s}" height="${220 * s}" rx="${24 * s}" fill="${p.shade}" opacity="0.6"/>
  ${label(p, cx - 95 * s, 700 - 215 * s, 190 * s, 170 * s, line)}`,

  tube: (p, line, cx = 400, s = 1) => `
  <path d="M${cx - 110 * s} ${700 - 500 * s} h${220 * s} l-${25 * s} ${410 * s} h-${170 * s} z" fill="${p.body}"${stroke(p)}/>
  <rect x="${cx - 112 * s}" y="${700 - 516 * s}" width="${224 * s}" height="${26 * s}" rx="${6 * s}" fill="${p.shade}"/>
  <rect x="${cx - 80 * s}" y="${700 - 96 * s}" width="${160 * s}" height="${96 * s}" rx="${14 * s}" fill="${p.cap}"/>
  ${label(p, cx - 70 * s, 700 - 420 * s, 140 * s, 190 * s, line)}`,
};

const svg = (w, h, inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${inner}\n</svg>\n`;

// handle → [forma, paleta, texto do rótulo]
const products = {
  "shampoo-cresce-mais": ["bottle", "cresce", "Cresce+"],
  "condicionador-cresce-mais": ["bottle", "cresce", "Cresce+"],
  "tonico-capilar-cresce-mais": ["dropper", "cresce", "Cresce+"],
  "leave-in-cresce-mais": ["pump", "cresce", "Cresce+"],
  "serum-antiqueda": ["dropper", "nutri", "Antiqueda"],
  "mascara-nutricao-profunda": ["jar", "nutri", "Nutrição"],
  "oleo-reparador-de-pontas": ["dropper", "nutri", "Reparador"],
  "creme-de-pentear-cachos": ["pump", "cachos", "Cachos"],
  "gelatina-ativadora-de-cachos": ["jar", "cachos", "Cachos"],
  "gel-de-limpeza-facial": ["pump", "pele", "Limpeza"],
  "serum-vitamina-c": ["dropper", "pele", "Vitamina C"],
  "hidratante-acido-hialuronico": ["jar", "pele", "Hidratante"],
  "protetor-solar-fps-50": ["tube", "pele", "FPS 50"],
  "demaquilante-bifasico": ["bottle", "noite", "Demaquilante"],
  "serum-noturno-retinol": ["dropper", "noite", "Retinol"],
  "creme-noturno-reparador": ["jar", "noite", "Noturno"],
};

// Caixa de cada forma (x, y, largura, altura): o SVG sai recortado rente ao produto,
// como um PNG de produto com fundo transparente.
const bounds = {
  bottle: [288, 178, 224, 524],
  pump: [293, 138, 214, 564],
  dropper: [318, 228, 164, 474],
  // o pote fica numa tela mais alta que ele: assim aparece mais largo que alto,
  // mas na mesma escala dos frascos (e não ampliado até encher o bloco)
  jar: [228, 102, 344, 600],
  tube: [286, 182, 228, 520],
};

const sizes = {};
for (const [handle, [shape, palette, line]] of Object.entries(products)) {
  const [x, y, w, h] = bounds[shape];
  sizes[handle] = { width: w, height: h };
  write(
    `public/products/${handle}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${w}" height="${h}">${shapes[shape](palettes[palette], line)}\n</svg>\n`,
  );
}

write(
  "data/product-image-sizes.ts",
  `// Arquivo gerado por scripts/generate-assets.mjs — não editar à mão.
// Dimensões das imagens de exemplo. Na Shopify, width/height vêm da própria API.

export const productImageSizes: Record<string, { width: number; height: number }> = ${JSON.stringify(sizes, null, 2)};
`,
);

// Kit: os três produtos da rotina lado a lado
write(
  "public/products/kit-cresce-mais.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 260 800 480" width="800" height="480">${[
    shadow(210, 94),
    shadow(420, 94),
    shadow(610, 76),
    shapes.bottle(palettes.cresce, "Cresce+", 210, 0.72),
    shapes.bottle(palettes.cresce, "Cresce+", 420, 0.72),
    shapes.dropper(palettes.cresce, "Cresce+", 610, 0.8),
  ].join("")}\n</svg>\n`,
);

/* ------------------------------------------------------------------ */
/* 3. Imagens de ambiente                                               */
/* ------------------------------------------------------------------ */

// Gerador pseudoaleatório determinístico: o mesmo seed gera sempre a mesma imagem.
function rng(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function scene({ w, h, seed, from, to, glow, strands, motif }) {
  const rand = rng(seed);
  let marks = "";

  if (motif === "waves" || motif === "straight") {
    // fios: curvas longas, lisas ou onduladas
    for (let i = 0; i < 46; i++) {
      const x = w * (0.1 + rand() * 0.9);
      const sway = motif === "straight" ? w * 0.05 : w * 0.16;
      const c1 = x + (rand() - 0.5) * sway * 2;
      const c2 = x + (rand() - 0.5) * sway * 2;
      const end = x + (rand() - 0.5) * sway;
      marks += `<path d="M${x.toFixed(0)} ${-20} C${c1.toFixed(0)} ${(h * 0.35).toFixed(0)} ${c2.toFixed(0)} ${(h * 0.7).toFixed(0)} ${end.toFixed(0)} ${h + 20}" stroke="${strands}" stroke-width="${(2 + rand() * 9).toFixed(1)}" opacity="${(0.12 + rand() * 0.4).toFixed(2)}" fill="none" stroke-linecap="round"/>`;
    }
  } else if (motif === "curls") {
    // cachos: espirais descendo
    for (let i = 0; i < 16; i++) {
      const x = w * (0.08 + rand() * 0.84);
      const amp = w * (0.03 + rand() * 0.035);
      const step = h * (0.045 + rand() * 0.03);
      let d = `M${x.toFixed(0)} -20`;
      for (let y = -20, k = 0; y < h + step; y += step, k++) {
        const dir = k % 2 === 0 ? 1 : -1;
        d += ` q${(dir * amp * 2).toFixed(0)} ${(step / 2).toFixed(0)} 0 ${step.toFixed(0)}`;
      }
      marks += `<path d="${d}" stroke="${strands}" stroke-width="${(8 + rand() * 12).toFixed(1)}" opacity="${(0.18 + rand() * 0.4).toFixed(2)}" fill="none" stroke-linecap="round"/>`;
    }
  } else if (motif === "drops") {
    // pele: gotas e brilhos suaves
    for (let i = 0; i < 22; i++) {
      const r = w * (0.02 + rand() * 0.09);
      const cx = w * rand();
      const cy = h * rand();
      marks += `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${r.toFixed(0)}" fill="${strands}" opacity="${(0.1 + rand() * 0.3).toFixed(2)}"/>`;
      marks += `<circle cx="${(cx - r * 0.3).toFixed(0)}" cy="${(cy - r * 0.3).toFixed(0)}" r="${(r * 0.25).toFixed(0)}" fill="#FFFFFF" opacity="0.35"/>`;
    }
  }

  return svg(
    w,
    h,
    `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.72" cy="0.28" r="0.6">
      <stop offset="0" stop-color="${glow}" stop-opacity="0.9"/>
      <stop offset="1" stop-color="${glow}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  ${marks}`,
  );
}

const scenes = {
  "necessidade-queda": { w: 1200, h: 1600, seed: 11, from: "#DCCFC6", to: "#9C8478", glow: "#F4ECE6", strands: "#4A3A34", motif: "straight" },
  "necessidade-crescimento": { w: 1200, h: 1600, seed: 23, from: "#E7C7B4", to: "#93614F", glow: "#FBE9DD", strands: "#3B2520", motif: "waves" },
  "necessidade-cachos": { w: 1200, h: 1600, seed: 37, from: "#CDB7A6", to: "#5E463D", glow: "#EAD9CB", strands: "#2B1D19", motif: "curls" },
  "necessidade-pele": { w: 1200, h: 1600, seed: 41, from: "#F1D9D0", to: "#C99A8C", glow: "#FFF3EE", strands: "#FFFFFF", motif: "drops" },
};

for (const [name, config] of Object.entries(scenes)) {
  write(`public/images/${name}.svg`, scene(config));
}

console.log(
  `Gerados: ${iconEntries.length} ícones, ${Object.keys(products).length + 1} produtos, ${Object.keys(scenes).length} imagens.`,
);
