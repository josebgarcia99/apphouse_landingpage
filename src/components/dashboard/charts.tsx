"use client";

import { animate } from "motion/react";
import { CircleCheck, CircleX, Ban, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMotionPref } from "@/components/providers/MotionProvider";
import { cn, formatInt } from "@/lib/utils";

/**
 * Componentes de gráficas del dashboard (sin librerías externas).
 * Criterios: una serie = un color validado contra el fondo, marcas delgadas con
 * extremo redondeado, retícula sólida y discreta, etiquetas directas selectivas,
 * detalle al pasar el cursor o enfocar, y una vista de tabla equivalente.
 * Los colores salen de las variables --viz-* definidas en la sección.
 */

/* ------------------------------ Utilidades ------------------------------ */

/** Redondea el máximo del eje a un número limpio (1, 2, 2.5, 5 × 10ⁿ). */
export function niceMax(value: number): number {
  if (value <= 0) return 1;
  const exponent = Math.floor(Math.log10(value));
  const base = 10 ** exponent;
  const candidate = [1, 2, 2.5, 5, 10].find((step) => step * base >= value) ?? 10;
  return candidate * base;
}

type AnimatedNumberProps = { value: number; format: (value: number) => string };

/** Número que transita suavemente al cambiar los filtros. */
export function AnimatedNumber({ value, format }: AnimatedNumberProps) {
  const { reduced } = useMotionPref();
  const ref = useRef<HTMLSpanElement>(null);
  const previous = useRef(value);
  // El texto inicial no cambia para React: las actualizaciones se escriben en el nodo.
  const [initial] = useState(() => format(value));

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const from = previous.current;
    previous.current = value;
    if (reduced || from === value) {
      node.textContent = format(value);
      return;
    }
    const controls = animate(from, value, {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = format(latest);
      },
    });
    return () => controls.stop();
  }, [value, format, reduced]);

  return <span ref={ref}>{initial}</span>;
}

function Tooltip({ value, label, align }: { value: string; label: string; align: "left" | "center" | "right" }) {
  return (
    <span
      role="tooltip"
      className={cn(
        "pointer-events-none absolute bottom-full z-20 mb-2 whitespace-nowrap rounded-lg border border-white/10 bg-[#0b100f] px-2.5 py-1.5 text-left opacity-0 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] transition-opacity duration-150 group-hover:opacity-100 group-focus:opacity-100",
        align === "left" && "left-0",
        align === "center" && "left-1/2 -translate-x-1/2",
        align === "right" && "right-0",
      )}
    >
      <strong className="block text-[13px] font-semibold leading-tight text-[var(--viz-ink)]">{value}</strong>
      <span className="text-[11px] text-[var(--viz-muted)]">{label}</span>
    </span>
  );
}

/* ------------------------------ Tarjeta ------------------------------ */

type ChartCardProps = {
  title: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
  /** Vista de tabla equivalente a la gráfica. */
  table?: { columns: [string, string]; rows: Array<[string, string]> };
  showTable?: boolean;
};

export function ChartCard({ title, subtitle, className, children, table, showTable = false }: ChartCardProps) {
  return (
    <section
      aria-label={title}
      className={cn("flex flex-col rounded-2xl bg-[var(--viz-surface)] p-5 ring-1 ring-inset ring-white/6 sm:p-6", className)}
    >
      <header className="mb-5">
        <h3 className="text-[0.95rem] font-semibold text-[var(--viz-ink)]">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-[0.8rem] text-[var(--viz-muted)]">{subtitle}</p> : null}
      </header>
      {showTable && table ? (
        <table className="w-full text-left text-[0.85rem]">
          <caption className="sr-only">{title}</caption>
          <thead>
            <tr className="text-[var(--viz-muted)]">
              <th scope="col" className="pb-2 font-medium">
                {table.columns[0]}
              </th>
              <th scope="col" className="pb-2 text-right font-medium">
                {table.columns[1]}
              </th>
            </tr>
          </thead>
          <tbody className="tabular text-[var(--viz-ink-2)]">
            {table.rows.map(([name, value]) => (
              <tr key={name} className="border-t border-[var(--viz-grid)]">
                <th scope="row" className="py-1.5 font-normal">
                  {name}
                </th>
                <td className="py-1.5 text-right font-medium text-[var(--viz-ink)]">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        children
      )}
    </section>
  );
}

/* ------------------------------ Columnas ------------------------------ */

type Datum = { label: string; value: number };

type ColumnChartProps = {
  data: Datum[];
  unit: string;
  /** Muestra una de cada n etiquetas del eje X en pantallas pequeñas. */
  sparseLabels?: boolean;
  ariaLabel: string;
};

/** Columnas de una sola serie. Solo el valor máximo lleva etiqueta directa. */
export function ColumnChart({ data, unit, sparseLabels = false, ariaLabel }: ColumnChartProps) {
  const max = Math.max(...data.map((item) => item.value), 1);
  const top = niceMax(max);
  const peak = data.findIndex((item) => item.value === max);
  const ticks = [top, top / 2, 0];

  return (
    <div role="group" aria-label={ariaLabel} className="flex min-h-0 flex-1 gap-3">
      {/* Eje Y */}
      <div aria-hidden className="tabular flex h-44 flex-col justify-between text-right text-[10.5px] leading-none text-[var(--viz-muted)]">
        {ticks.map((tick) => (
          <span key={tick}>{formatInt(tick)}</span>
        ))}
      </div>

      <div className="min-w-0 flex-1">
        <div className="relative h-44">
          {/* Retícula: líneas sólidas y discretas */}
          <div aria-hidden className="absolute inset-0 flex flex-col justify-between">
            <span className="h-px bg-[var(--viz-grid)]" />
            <span className="h-px bg-[var(--viz-grid)]" />
            <span className="h-px bg-[var(--viz-axis)]" />
          </div>
          <ul className="absolute inset-0 flex items-end gap-[3px] sm:gap-1.5">
            {data.map((item, index) => {
              const align = index < 2 ? "left" : index > data.length - 3 ? "right" : "center";
              return (
                <li
                  key={item.label}
                  tabIndex={0}
                  aria-label={`${item.label}: ${formatInt(item.value)} ${unit}`}
                  className="group relative flex h-full min-w-0 flex-1 cursor-default items-end justify-center rounded-sm outline-offset-2"
                >
                  <span
                    className="relative block w-full max-w-6 rounded-t-[4px] bg-[var(--viz-series)] transition-[height,filter] duration-700 ease-expo group-hover:brightness-125 group-focus:brightness-125"
                    style={{ height: `${Math.max((item.value / top) * 100, 1)}%` }}
                  >
                    {index === peak ? (
                      <span className="tabular absolute bottom-full left-1/2 mb-1 -translate-x-1/2 text-[10.5px] font-semibold text-[var(--viz-ink)] group-hover:opacity-0 group-focus:opacity-0">
                        {formatInt(item.value)}
                      </span>
                    ) : null}
                    <Tooltip value={`${formatInt(item.value)} ${unit}`} label={item.label} align={align} />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        {/* Eje X */}
        <ul aria-hidden className="mt-2 flex gap-[3px] text-center text-[10.5px] text-[var(--viz-muted)] sm:gap-1.5">
          {data.map((item, index) => (
            <li
              key={item.label}
              className={cn("min-w-0 flex-1 whitespace-nowrap", sparseLabels && index % 2 === 1 && "invisible sm:visible")}
            >
              {item.label.replace(" h", "")}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------ Barras ordenadas ------------------------------ */

type RankedBarsProps = { data: Datum[]; unit: string; ariaLabel: string };

/** Barras horizontales ordenadas, un solo color, valor en la punta. */
export function RankedBars({ data, unit, ariaLabel }: RankedBarsProps) {
  const max = Math.max(...data.map((item) => item.value), 1);
  return (
    <ol aria-label={ariaLabel} className="flex flex-1 flex-col justify-between gap-3.5">
      {data.map((item, index) => (
        <li
          key={item.label}
          tabIndex={0}
          aria-label={`${index + 1}. ${item.label}: ${formatInt(item.value)} ${unit}`}
          className="group cursor-default rounded-sm outline-offset-4"
        >
          <p className="flex items-baseline justify-between gap-3 text-[0.82rem]">
            <span className="min-w-0 truncate text-[var(--viz-ink-2)]">
              <span className="tabular mr-2 text-[var(--viz-muted)]">{index + 1}</span>
              {item.label}
            </span>
            <span className="tabular font-semibold text-[var(--viz-ink)]">{formatInt(item.value)}</span>
          </p>
          <span aria-hidden className="mt-1.5 block h-2.5 border-l border-[var(--viz-axis)]">
            <span
              className="block h-full rounded-r-[4px] bg-[var(--viz-series)] transition-[width,filter] duration-700 ease-expo group-hover:brightness-125 group-focus:brightness-125"
              style={{ width: `${Math.max((item.value / max) * 100, 1)}%` }}
            />
          </span>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------ Barra segmentada ------------------------------ */

const STATUS_PARTS: Array<{ key: "completed" | "cancelled" | "rejected"; label: string; color: string; ink: string; icon: LucideIcon }> = [
  { key: "completed", label: "Completados", color: "var(--viz-good)", ink: "#0b0b0b", icon: CircleCheck },
  { key: "cancelled", label: "Cancelados", color: "var(--viz-warning)", ink: "#0b0b0b", icon: Ban },
  { key: "rejected", label: "Rechazados", color: "var(--viz-critical)", ink: "#ffffff", icon: CircleX },
];

type StatusBarProps = { completed: number; cancelled: number; rejected: number };

/** Un todo dividido en estados: bloques con separación, leyenda con icono y cifra. */
export function StatusBar({ completed, cancelled, rejected }: StatusBarProps) {
  const values = { completed, cancelled, rejected };
  const total = Math.max(completed + cancelled + rejected, 1);
  const percent = (value: number) => `${((value / total) * 100).toFixed(1).replace(".0", "")}%`;

  return (
    <div>
      <div className="flex h-7 gap-0.5" role="group" aria-label="Pedidos por estado">
        {STATUS_PARTS.map((part, index) => {
          const value = values[part.key];
          const share = value / total;
          if (value === 0) return null;
          return (
            <span
              key={part.key}
              tabIndex={0}
              aria-label={`${part.label}: ${formatInt(value)} pedidos, ${percent(value)}`}
              className="group relative flex min-w-1.5 cursor-default items-center rounded-[4px] px-2 transition-[flex-grow,filter] duration-700 ease-expo hover:brightness-110 focus:brightness-110"
              style={{ flexGrow: value, flexBasis: 0, backgroundColor: part.color, color: part.ink }}
            >
              {/* La cifra solo se imprime dentro del bloque cuando cabe. */}
              {share > 0.2 ? <span className="text-[11px] font-bold">{percent(value)}</span> : null}
              <Tooltip
                value={`${formatInt(value)} pedidos`}
                label={`${part.label} · ${percent(value)}`}
                align={index === 0 ? "left" : "right"}
              />
            </span>
          );
        })}
      </div>
      <ul className="mt-4 flex flex-col gap-x-7 gap-y-2 text-[0.82rem] sm:flex-row sm:flex-wrap">
        {STATUS_PARTS.map((part) => {
          const Icon = part.icon;
          const value = values[part.key];
          return (
            <li key={part.key} className="flex items-center gap-2 whitespace-nowrap">
              <Icon size={15} style={{ color: part.color }} className="shrink-0" aria-hidden />
              <span className="text-[var(--viz-ink-2)]">{part.label}</span>
              <span className="tabular ml-auto font-semibold text-[var(--viz-ink)] sm:ml-0">
                <AnimatedNumber value={value} format={formatInt} />
              </span>
              <span className="tabular text-[var(--viz-muted)]">{percent(value)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ------------------------------ Mapa de calor ------------------------------ */

/** Rampa secuencial de un solo tono, validada contra el fondo (de menor a mayor). */
export const HEAT_RAMP = ["#226158", "#27796d", "#2a9485", "#36b8a3", "#5fe0c9"];
const COLS = 16;
const ROWS = 9;

type Zone = { id: string; name: string; x: number; y: number; orders: number; share: number };

type HeatMapProps = { zones: Zone[] };

/**
 * Mapa de calor ilustrativo sobre un plano esquemático.
 * No usa cartografía ni ubicaciones reales.
 */
export function HeatMap({ zones }: HeatMapProps) {
  const cells: number[] = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const cx = ((col + 0.5) / COLS) * 100;
      const cy = ((row + 0.5) / ROWS) * 100;
      let intensity = 0;
      zones.forEach((zone) => {
        const dx = (cx - zone.x) / 1.6; // el plano es más ancho que alto
        const dy = cy - zone.y;
        intensity += zone.share * Math.exp(-(dx * dx + dy * dy) / (2 * 9.5 * 9.5));
      });
      cells.push(intensity);
    }
  }
  const max = Math.max(...cells, 0.0001);
  const ranked = [...zones].sort((a, b) => b.orders - a.orders);
  const labeled = new Set(ranked.slice(0, 3).map((zone) => zone.id));

  return (
    <div className="flex flex-1 flex-col">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-[#0f1514] ring-1 ring-inset ring-white/6">
        {/* Calles esquemáticas */}
        <svg aria-hidden viewBox="0 0 160 90" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <g stroke="var(--viz-grid)" strokeWidth="0.6" fill="none">
            <path d="M0 22 H160 M0 47 H160 M0 70 H160 M28 0 V90 M62 0 V90 M98 0 V90 M132 0 V90" />
            <path d="M0 84 L58 30 L160 8" strokeWidth="1" />
          </g>
        </svg>

        <div
          aria-hidden
          className="absolute inset-0 grid gap-0.5 p-0.5"
          style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
        >
          {cells.map((intensity, index) => {
            const ratio = intensity / max;
            const step = ratio < 0.2 ? -1 : Math.min(HEAT_RAMP.length - 1, Math.floor(ratio * HEAT_RAMP.length));
            return (
              <span
                key={index}
                className="rounded-[3px] transition-[background-color,opacity] duration-700"
                style={{
                  backgroundColor: step === -1 ? "transparent" : HEAT_RAMP[step],
                  opacity: step === -1 ? 0 : 0.92,
                }}
              />
            );
          })}
        </div>

        {/* Zonas: detalle al pasar el cursor o enfocar */}
        <ul aria-label="Zonas de demanda">
          {zones.map((zone) => (
            <li
              key={zone.id}
              tabIndex={0}
              aria-label={`Zona ${zone.name}: ${formatInt(zone.orders)} pedidos, ${(zone.share * 100).toFixed(0)}%`}
              className="group absolute z-10 flex size-7 -translate-x-1/2 -translate-y-1/2 cursor-default items-center justify-center rounded-full"
              style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
            >
              <span className="size-2.5 rounded-full bg-[var(--viz-ink)] ring-2 ring-[#0f1514]" />
              {labeled.has(zone.id) ? (
                <span className="pointer-events-none absolute left-full ml-0.5 whitespace-nowrap rounded bg-[#0f1514]/85 px-1.5 py-0.5 text-[10.5px] font-semibold text-[var(--viz-ink)]">
                  {zone.name}
                </span>
              ) : null}
              <Tooltip
                value={`${formatInt(zone.orders)} pedidos`}
                label={`Zona ${zone.name} · ${(zone.share * 100).toFixed(0)}%`}
                align={zone.x > 66 ? "right" : zone.x < 33 ? "left" : "center"}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[11px] text-[var(--viz-muted)]">
        <span className="flex items-center gap-2">
          Menor
          <span aria-hidden className="flex gap-0.5">
            {HEAT_RAMP.map((color) => (
              <span key={color} className="h-2.5 w-5 rounded-[2px]" style={{ backgroundColor: color }} />
            ))}
          </span>
          Mayor demanda
        </span>
        <span>Plano esquemático: no representa ubicaciones reales.</span>
      </div>
    </div>
  );
}
