// Ilustração do céu do painel Dia/Noite: sol, lua, nuvens e estrelas, tudo em
// SVG/CSS inline (sem imagens raster, sem bibliotecas de animação).
import type { CSSProperties } from "react";

const EASE = "cubic-bezier(0.4,0,0.2,1)";

interface SkySceneProps {
  period: "day" | "night";
  /** true quando a seção está fora da tela: pausa a deriva das nuvens e o brilho das estrelas. */
  paused: boolean;
}

/*
 * Geometria do arco sol/lua: o sol fica perto do topo do bloco da ilustração;
 * a lua começa bem abaixo do bloco (fora da vista), na posição exatamente
 * oposta ao sol em relação ao pivô — assim os dois trocam de lugar com uma
 * única rotação de 180° do grupo, sem precisar calcular raio/ângulo.
 * (pivô = ponto abaixo do painel; reflexo de um ponto P por um pivô O é 2O − P.)
 */
const PIVOT = { x: 52, y: 150 };
const SUN_POS = { x: 70, y: 20 };
const MOON_POS = { x: 2 * PIVOT.x - SUN_POS.x, y: 2 * PIVOT.y - SUN_POS.y };

// Nuvens (só de dia): cada uma é um grupo de círculos achatados, posições fixas.
const CLOUDS: ReadonlyArray<{ x: number; y: number; scale: number; delay: string }> = [
  { x: 18, y: 34, scale: 1, delay: "0s" },
  { x: 40, y: 14, scale: 0.72, delay: "-18s" },
];

// Estrelas (só de noite): posições e atrasos fixos — nunca Math.random no render.
// Concentradas na metade superior/direita do painel.
const STARS: ReadonlyArray<{ x: number; y: number; r: number; delay: string }> = [
  { x: 58, y: 6, r: 1.6, delay: "0s" },
  { x: 71, y: 4, r: 2.2, delay: "0.4s" },
  { x: 84, y: 9, r: 1.6, delay: "0.8s" },
  { x: 93, y: 5, r: 1.8, delay: "1.2s" },
  { x: 64, y: 13, r: 2.4, delay: "1.6s" },
  { x: 49, y: 10, r: 1.6, delay: "2s" },
  { x: 97, y: 15, r: 1.8, delay: "2.4s" },
  { x: 78, y: 17, r: 1.6, delay: "2.8s" },
  { x: 88, y: 21, r: 2.2, delay: "0.2s" },
  { x: 60, y: 23, r: 1.6, delay: "0.6s" },
  { x: 43, y: 17, r: 1.8, delay: "1s" },
  { x: 95, y: 27, r: 1.6, delay: "1.4s" },
  { x: 69, y: 29, r: 2.4, delay: "1.8s" },
  { x: 54, y: 31, r: 1.6, delay: "2.2s" },
  { x: 81, y: 33, r: 1.8, delay: "2.6s" },
  { x: 37, y: 25, r: 1.6, delay: "3s" },
  { x: 90, y: 37, r: 1.8, delay: "3.4s" },
  { x: 63, y: 39, r: 2.2, delay: "0.3s" },
  { x: 47, y: 35, r: 1.6, delay: "0.7s" },
  { x: 75, y: 43, r: 1.8, delay: "1.1s" },
  { x: 31, y: 31, r: 1.6, delay: "1.5s" },
  { x: 86, y: 45, r: 1.6, delay: "1.9s" },
  { x: 41, y: 43, r: 1.8, delay: "2.3s" },
  { x: 57, y: 47, r: 1.6, delay: "2.7s" },
];

function SunGraphic() {
  return (
    <svg viewBox="0 0 340 340" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="sun-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD9A0" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFD9A0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="170" cy="170" r="170" fill="url(#sun-halo)" />
      <circle cx="170" cy="170" r="120" fill="none" stroke="#FFD9A0" strokeWidth="1" opacity="0.08" />
      <circle cx="170" cy="170" r="136" fill="none" stroke="#FFD9A0" strokeWidth="1" opacity="0.07" />
      <circle cx="170" cy="170" r="152" fill="none" stroke="#FFD9A0" strokeWidth="1" opacity="0.06" />
      <circle cx="170" cy="170" r="100" fill="#FFD9A0" />
    </svg>
  );
}

function MoonGraphic() {
  return (
    <svg viewBox="0 0 260 260" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="moon-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(243,237,226,0.25)" />
          <stop offset="100%" stopColor="rgba(243,237,226,0)" />
        </radialGradient>
        <mask id="moon-crescent">
          <rect width="260" height="260" fill="#FFFFFF" />
          <circle cx="162" cy="104" r="76" fill="#000000" />
        </mask>
      </defs>
      <circle cx="130" cy="130" r="130" fill="url(#moon-halo)" />
      <circle cx="130" cy="130" r="90" fill="#F3EDE2" mask="url(#moon-crescent)" />
    </svg>
  );
}

function Cloud({ x, y, scale, delay, paused }: { x: number; y: number; scale: number; delay: string; paused: boolean }) {
  return (
    <div
      className="animate-cloud-drift absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${28 * scale}%`,
        aspectRatio: "2.4 / 1",
        animationDelay: delay,
        animationPlayState: paused ? "paused" : "running",
      }}
    >
      <div className="relative h-full w-full">
        <span className="absolute inset-x-0 bottom-0 h-[70%] rounded-full bg-white/45" />
        <span className="absolute top-0 left-[8%] h-[85%] w-[46%] rounded-full bg-white/45" />
        <span className="absolute top-[6%] right-[12%] h-[70%] w-[38%] rounded-full bg-white/45" />
      </div>
    </div>
  );
}

/**
 * Ilustração decorativa (aria-hidden) no canto superior direito do painel.
 * Fica atrás do cabeçalho (renderizada antes dele no DOM) e um pouco apagada
 * perto do texto, via mask-image, para não atrapalhar a leitura.
 */
export function SkyScene({ period, paused }: SkySceneProps) {
  const night = period === "night";
  const fade: CSSProperties = {
    WebkitMaskImage: "linear-gradient(225deg, black 32%, transparent 78%)",
    maskImage: "linear-gradient(225deg, black 32%, transparent 78%)",
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-0 right-0 z-0"
      style={{ width: "clamp(280px, 48vw, 520px)", aspectRatio: "1 / 1", opacity: 0.95, ...fade }}
    >
      {/* grupo que gira 180° em torno de um pivô abaixo do painel */}
      <div
        className="absolute inset-0 transition-transform duration-[900ms]"
        style={{ transformOrigin: `${PIVOT.x}% ${PIVOT.y}%`, transform: night ? "rotate(180deg)" : "rotate(0deg)", transitionTimingFunction: EASE }}
      >
        {/* sol — contra-rotacionado para não girar junto com o grupo */}
        <div
          className="absolute transition-transform duration-[900ms]"
          style={{
            left: `${SUN_POS.x}%`,
            top: `${SUN_POS.y}%`,
            width: "46%",
            aspectRatio: "1 / 1",
            transform: `translate(-50%, -50%) rotate(${night ? -180 : 0}deg)`,
            transitionTimingFunction: EASE,
          }}
        >
          <SunGraphic />
        </div>

        {/* lua — mesma lógica, começa fora da vista (abaixo do painel) */}
        <div
          className="absolute transition-transform duration-[900ms]"
          style={{
            left: `${MOON_POS.x}%`,
            top: `${MOON_POS.y}%`,
            width: "30%",
            aspectRatio: "1 / 1",
            transform: `translate(-50%, -50%) rotate(${night ? -180 : 0}deg)`,
            transitionTimingFunction: EASE,
          }}
        >
          <MoonGraphic />
        </div>
      </div>

      {/* nuvens: só de dia */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: night ? 0 : 1, transitionTimingFunction: EASE }}
      >
        {CLOUDS.map((cloud, index) => (
          <Cloud key={index} {...cloud} paused={paused} />
        ))}
      </div>

      {/* estrelas: só de noite */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: night ? 1 : 0, transitionTimingFunction: EASE }}
      >
        {STARS.map((star, index) => (
          <span
            key={index}
            className="animate-twinkle absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.r * 2}px`,
              height: `${star.r * 2}px`,
              animationDelay: star.delay,
              animationPlayState: paused ? "paused" : "running",
            }}
          />
        ))}
      </div>
    </div>
  );
}
