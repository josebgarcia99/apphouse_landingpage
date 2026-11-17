import { useId } from "react";
import { cn } from "@/lib/utils";

type ApphouseLogoProps = {
  /** "light": palabra en blanco cálido para fondos oscuros. "color": degradado oficial. */
  tone?: "light" | "color";
  /** Solo el isotipo, sin la palabra. */
  markOnly?: boolean;
  className?: string;
  title?: string;
};

/**
 * Logotipo de Apphouse redibujado como componente a partir del SVG publicado
 * en la página oficial (isotipo facetado + palabra). Sustituir por el archivo
 * maestro de marca antes de publicar. Con `title=""` se trata como decorativo.
 */
export function ApphouseLogo({
  tone = "light",
  markOnly = false,
  className,
  title = "Apphouse",
}: ApphouseLogoProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const g = (name: string) => `${uid}-${name}`;
  const fill = (name: string) => `url(#${g(name)})`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={markOnly ? "0 0 47.27 53.55" : "0 0 212.22 53.55"}
      role={title ? "img" : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      className={cn("h-8 w-auto", className)}
    >
      <defs>
        <linearGradient id={g("word")} x1="64.29" y1="27.02" x2="212.22" y2="27.02" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2d5ea3" />
          <stop offset="1" stopColor="#36a0ad" />
        </linearGradient>
        <linearGradient id={g("a")} x1="42.63" y1="26.79" x2="31.61" y2="11.61" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4d6aeb" />
          <stop offset="1" stopColor="#153c7a" />
        </linearGradient>
        <linearGradient id={g("b")} x1="27.76" y1="40.41" x2="35.84" y2="52.52" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#153c7a" />
          <stop offset="1" stopColor="#4d6aeb" />
        </linearGradient>
        <linearGradient id={g("c")} x1="23.64" y1="42.89" x2="23.64" y2="19.21" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2d5ea3" />
          <stop offset="1" stopColor="#36a0ad" />
        </linearGradient>
        <linearGradient id={g("d")} x1="31.14" y1="37.88" x2="31.14" y2="3.35" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#43d7bd" />
          <stop offset=".17" stopColor="#42ddbb" />
          <stop offset="1" stopColor="#4d6aeb" />
        </linearGradient>
        <linearGradient id={g("e")} x1="36.61" y1="55.41" x2="36.61" y2="27.48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#36a0ad" />
          <stop offset="1" stopColor="#153c7a" />
        </linearGradient>
        <linearGradient id={g("f")} x1="4.64" y1="26.79" x2="15.66" y2="11.61" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4d6aeb" />
          <stop offset="1" stopColor="#153c7a" />
        </linearGradient>
        <linearGradient id={g("g")} x1="19.51" y1="40.41" x2="11.43" y2="52.52" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#153c7a" />
          <stop offset="1" stopColor="#4d6aeb" />
        </linearGradient>
        <linearGradient id={g("h")} x1="23.64" y1="-1.08" x2="23.64" y2="14.37" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4d6aeb" />
          <stop offset="1" stopColor="#153c7a" />
        </linearGradient>
        <linearGradient id={g("i")} x1="16.13" y1="37.88" x2="16.13" y2="3.35" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#43d7bd" />
          <stop offset=".17" stopColor="#42ddbb" />
          <stop offset="1" stopColor="#4d6aeb" />
        </linearGradient>
        <linearGradient id={g("j")} x1="10.66" y1="55.41" x2="10.66" y2="27.48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#36a0ad" />
          <stop offset="1" stopColor="#153c7a" />
        </linearGradient>
      </defs>

      {markOnly ? null : (
        <g fill={tone === "light" ? "currentColor" : fill("word")} className={tone === "light" ? "text-paper" : undefined}>
          <path d="M72.17,14.09h5.57l7.91,20.99h-5.17l-1.28-3.68h-8.55l-1.31,3.68h-5.05l7.88-20.99ZM77.65,27.05l-2.74-7.76-2.74,7.76h5.48Z" />
          <path d="M87.35,19.56h4.44v1.55c1.19-1.22,2.8-1.92,4.69-1.92,4.29,0,7.48,3.5,7.48,8.12s-3.19,8.12-7.48,8.12c-1.89,0-3.5-.7-4.69-1.92v7.33h-4.44v-21.3ZM99.4,27.32c0-2.19-1.61-3.83-3.8-3.83s-3.8,1.64-3.8,3.83,1.61,3.83,3.8,3.83,3.8-1.64,3.8-3.83Z" />
          <path d="M106.64,19.56h4.44v1.55c1.19-1.22,2.8-1.92,4.69-1.92,4.29,0,7.48,3.5,7.48,8.12s-3.19,8.12-7.48,8.12c-1.89,0-3.5-.7-4.69-1.92v7.33h-4.44v-21.3ZM118.69,27.32c0-2.19-1.61-3.83-3.8-3.83s-3.8,1.64-3.8,3.83,1.61,3.83,3.8,3.83,3.8-1.64,3.8-3.83Z" />
          <path d="M126.45,13.17h2.62v8.82c1.22-1.8,3.16-2.8,5.6-2.8,3.77,0,6.3,2.49,6.3,6.3v9.58h-2.62v-8.76c0-2.77-1.76-4.59-4.53-4.59s-4.75,1.86-4.75,4.66v8.7h-2.62V13.17Z" />
          <path d="M144.31,27.32c0-4.62,3.56-8.12,8.28-8.12s8.25,3.5,8.25,8.12-3.56,8.12-8.25,8.12-8.28-3.5-8.28-8.12ZM158.12,27.32c0-3.19-2.37-5.6-5.54-5.6s-5.57,2.4-5.57,5.6,2.37,5.6,5.57,5.6,5.54-2.4,5.54-5.6Z" />
          <path d="M164.05,29.33v-9.77h2.62v9.01c0,2.62,1.67,4.35,4.26,4.35s4.53-1.76,4.53-4.41v-8.94h2.62v15.52h-2.62v-2.25c-1.19,1.67-3.01,2.62-5.35,2.62-3.62,0-6.05-2.43-6.05-6.12Z" />
          <path d="M181.49,30.67h2.68c0,1.46,1.34,2.4,3.35,2.4,1.89,0,3.13-.88,3.13-2.13,0-3.35-8.91-1.58-8.91-7.06,0-2.83,2.25-4.69,5.63-4.69s5.72,1.83,5.72,4.59h-2.68c0-1.34-1.22-2.22-3.07-2.22s-2.92.82-2.92,2.01c0,3.26,8.92,1.52,8.92,7.09,0,2.86-2.31,4.78-5.84,4.78s-5.99-1.92-5.99-4.78Z" />
          <path d="M195.73,27.32c0-4.62,3.56-8.12,8.25-8.12s8.25,3.5,8.25,8.12c0,.37-.03.76-.06,1.1h-13.63c.46,2.74,2.65,4.62,5.57,4.62,2.16,0,4.05-1.03,4.93-2.59h2.92c-1.22,2.98-4.23,4.99-7.88,4.99-4.78,0-8.34-3.5-8.34-8.12ZM198.55,26.07h10.89c-.46-2.59-2.65-4.47-5.48-4.47s-4.9,1.83-5.42,4.47Z" />
        </g>
      )}

      <g>
        <polygon fill={fill("a")} points="47.27 23.79 38.64 30.68 31.25 10.99 47.27 23.79" />
        <polygon fill={fill("b")} points="37.27 53.55 23.64 42.66 30.98 36.8 37.27 53.55" />
        <polygon fill={fill("c")} points="30.98 36.8 23.64 42.66 16.29 36.8 23.64 17.23 30.98 36.8" />
        <polygon fill={fill("d")} points="38.64 30.68 30.98 36.8 23.64 17.23 28.61 3.98 31.24 10.99 31.25 10.99 38.64 30.68" />
        <polygon fill={fill("e")} points="42.24 40.29 37.27 53.55 30.98 36.8 38.64 30.68 42.24 40.29" />
        <polygon fill={fill("f")} points="0 23.79 8.63 30.68 16.02 10.99 0 23.79" />
        <polygon fill={fill("g")} points="10.01 53.55 23.64 42.66 16.29 36.8 10.01 53.55" />
        <polygon fill={fill("h")} points="28.61 3.98 23.64 17.23 18.66 3.98 23.64 0 28.61 3.98" />
        <polygon fill={fill("i")} points="23.64 17.23 16.29 36.8 8.63 30.68 16.02 10.99 16.03 10.99 18.66 3.98 23.64 17.23" />
        <polygon fill={fill("j")} points="5.03 40.29 10.01 53.55 16.29 36.8 8.63 30.68 5.03 40.29" />
      </g>
    </svg>
  );
}
