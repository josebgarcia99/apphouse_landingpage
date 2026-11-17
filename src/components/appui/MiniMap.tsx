"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";
import { useMotionPref } from "@/components/providers/MotionProvider";
import { cn } from "@/lib/utils";

/** Ruta ilustrativa: del establecimiento (abajo a la izquierda) al cliente (arriba a la derecha). */
const ROUTE: Array<[number, number]> = [
  [36, 124],
  [36, 82],
  [120, 82],
  [120, 40],
  [208, 40],
];

const SEGMENTS = ROUTE.slice(1).map(([x, y], index) => {
  const [px, py] = ROUTE[index];
  return Math.hypot(x - px, y - py);
});
const TOTAL = SEGMENTS.reduce((sum, length) => sum + length, 0);

function pointAt(t: number): { x: number; y: number } {
  let remaining = Math.min(1, Math.max(0, t)) * TOTAL;
  for (let index = 0; index < SEGMENTS.length; index += 1) {
    const length = SEGMENTS[index];
    if (remaining <= length) {
      const [ax, ay] = ROUTE[index];
      const [bx, by] = ROUTE[index + 1];
      const ratio = length === 0 ? 0 : remaining / length;
      return { x: ax + (bx - ax) * ratio, y: ay + (by - ay) * ratio };
    }
    remaining -= length;
  }
  const [x, y] = ROUTE[ROUTE.length - 1];
  return { x, y };
}

const BLOCKS: Array<[number, number, number, number]> = [
  [6, 6, 24, 28],
  [42, 6, 72, 28],
  [126, 6, 76, 28],
  [214, 6, 30, 28],
  [6, 46, 24, 30],
  [42, 46, 72, 30],
  [126, 46, 76, 30],
  [214, 46, 30, 30],
  [6, 88, 24, 30],
  [42, 88, 72, 30],
  [126, 88, 76, 30],
  [214, 88, 30, 30],
  [6, 130, 24, 16],
  [42, 130, 72, 16],
  [126, 130, 76, 16],
  [214, 130, 30, 16],
];

type MiniMapProps = {
  /** Posición del repartidor sobre la ruta, de 0 (establecimiento) a 1 (cliente). */
  progress: number;
  /** Muestra al repartidor en movimiento. */
  moving?: boolean;
  className?: string;
};

/**
 * Mapa esquemático de seguimiento. No usa cartografía ni ubicaciones reales:
 * es una ilustración que toma sus colores de las variables --app-*.
 */
export function MiniMap({ progress, moving = false, className }: MiniMapProps) {
  const { reduced } = useMotionPref();
  const t = useMotionValue(progress);
  const cx = useTransform(t, (value) => pointAt(value).x);
  const cy = useTransform(t, (value) => pointAt(value).y);

  useEffect(() => {
    const controls = animate(t, progress, {
      duration: reduced ? 0 : 2.6,
      ease: [0.45, 0, 0.2, 1],
    });
    return () => controls.stop();
  }, [progress, reduced, t]);

  const path = ROUTE.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x} ${y}`).join(" ");
  const [startX, startY] = ROUTE[0];
  const [endX, endY] = ROUTE[ROUTE.length - 1];

  return (
    <svg
      viewBox="0 0 250 152"
      role="img"
      aria-label="Mapa ilustrativo de la ruta de entrega"
      className={cn("block h-auto w-full", className)}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="250" height="152" fill="var(--app-surface)" />
      {BLOCKS.map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="4" fill="var(--app-line)" />
      ))}
      <path d={path} fill="none" stroke="var(--app-muted)" strokeOpacity="0.35" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d={path}
        fill="none"
        stroke="var(--app-primary)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="5 6"
        className={moving ? "motion-ambient animate-route" : undefined}
      />

      {/* Establecimiento */}
      <g transform={`translate(${startX} ${startY})`}>
        <circle r="9" fill="var(--app-bg)" stroke="var(--app-primary)" strokeWidth="2" />
        <rect x="-3.5" y="-3.5" width="7" height="7" rx="1.5" fill="var(--app-primary)" />
      </g>
      {/* Cliente */}
      <g transform={`translate(${endX} ${endY})`}>
        <circle r="9" fill="var(--app-primary)" />
        <circle r="3.2" fill="var(--app-on-primary)" />
      </g>

      {/* Repartidor */}
      {moving ? (
        <motion.circle cx={cx} cy={cy} r="11" fill="var(--app-primary)" fillOpacity="0.25" />
      ) : null}
      <motion.circle cx={cx} cy={cy} r="5.5" fill="var(--app-text)" stroke="var(--app-bg)" strokeWidth="2" />
    </svg>
  );
}
