import { solarIcons, type IconName } from "./solar-icons";

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

/** Ícone Solar (estilo Linear). Decorativo: o texto acessível fica no elemento pai. */
export function Icon({ name, size = 24, className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={className}
      dangerouslySetInnerHTML={{ __html: solarIcons[name] }}
    />
  );
}

export type { IconName };
