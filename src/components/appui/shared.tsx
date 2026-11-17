"use client";

import { BatteryFull, Minus, Plus, Signal, Wifi } from "lucide-react";
import type { CSSProperties } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import { STATUS_META, type OrderStatus } from "@/data/orders";
import type { AppTheme } from "@/data/sectors";
import { cn } from "@/lib/utils";

/** Convierte la identidad de una app de ejemplo en variables CSS. */
export function themeVars(theme: AppTheme): CSSProperties {
  return {
    "--app-bg": theme.bg,
    "--app-surface": theme.surface,
    "--app-text": theme.text,
    "--app-muted": theme.muted,
    "--app-line": theme.line,
    "--app-primary": theme.primary,
    "--app-on-primary": theme.onPrimary,
    "--app-header": theme.header,
    "--app-on-header": theme.onHeader,
  } as CSSProperties;
}

/** Identidad de las herramientas propias de Apphouse (gestión y repartidores). */
export const apphouseTheme: AppTheme = {
  brand: "Apphouse",
  tagline: "Gestión",
  monogram: "A",
  bg: "#0d1211",
  surface: "#171e1d",
  text: "#f7f5f0",
  muted: "#9aa39e",
  line: "rgba(247,245,240,0.09)",
  primary: "#43d7bd",
  onPrimary: "#08100f",
  header: "#0d1211",
  onHeader: "#f7f5f0",
};

export function StatusBar({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("flex h-[40px] items-end justify-between px-6 pb-1.5 text-[11px] font-semibold", className)}
    >
      <span className="tabular">9:41</span>
      <span className="flex items-center gap-1">
        <Signal size={11} strokeWidth={2.6} />
        <Wifi size={11} strokeWidth={2.6} />
        <BatteryFull size={15} strokeWidth={2} />
      </span>
    </div>
  );
}

type ProductThumbProps = { src: string; alt?: string; className?: string; sizes?: string };

/** Fotografía de producto con respaldo si el archivo no existe. */
export function ProductThumb({ src, alt = "", className, sizes = "96px" }: ProductThumbProps) {
  return (
    <span className={cn("relative block shrink-0 overflow-hidden bg-[var(--app-line)]", className)}>
      <SmartImage
        src={src}
        alt={alt}
        sizes={sizes}
        quality={60}
        fallbackClassName="bg-[linear-gradient(135deg,var(--app-line),transparent)]"
      />
    </span>
  );
}

type QtyControlProps = {
  qty: number;
  name: string;
  onAdd: () => void;
  onRemove: () => void;
  size?: "sm" | "md";
};

/** Botón «+» que se convierte en selector de cantidad al agregar el producto. */
export function QtyControl({ qty, name, onAdd, onRemove, size = "md" }: QtyControlProps) {
  const dimension = size === "sm" ? "size-6" : "size-7";
  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={onAdd}
        aria-label={`Agregar ${name}`}
        className={cn(
          dimension,
          "grid shrink-0 place-items-center rounded-full bg-[var(--app-primary)] text-[var(--app-on-primary)] transition-transform duration-200 hover:scale-110 active:scale-95",
        )}
      >
        <Plus size={14} strokeWidth={2.8} />
      </button>
    );
  }
  return (
    <span className="flex shrink-0 items-center gap-1 rounded-full bg-[var(--app-line)] p-0.5">
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Quitar una unidad de ${name}`}
        className={cn(dimension, "grid place-items-center rounded-full text-[var(--app-text)] transition-colors hover:bg-[var(--app-line)]")}
      >
        <Minus size={12} strokeWidth={2.8} />
      </button>
      <span aria-live="polite" className="tabular min-w-3.5 text-center text-[11px] font-bold">
        {qty}
      </span>
      <button
        type="button"
        onClick={onAdd}
        aria-label={`Agregar otra unidad de ${name}`}
        className={cn(dimension, "grid place-items-center rounded-full bg-[var(--app-primary)] text-[var(--app-on-primary)]")}
      >
        <Plus size={12} strokeWidth={2.8} />
      </button>
    </span>
  );
}

const pillTones = {
  light: {
    new: "bg-terra/18 text-terra-700",
    active: "bg-teal/15 text-teal-700",
    done: "bg-sage/20 text-sage-700",
    bad: "bg-[#c2413a]/12 text-[#9b2c25]",
  },
  dark: {
    new: "bg-terra/20 text-terra",
    active: "bg-aqua/15 text-aqua",
    done: "bg-white/10 text-stone",
    bad: "bg-[#e5675f]/15 text-[#f29b94]",
  },
} as const;

type StatusPillProps = { status: OrderStatus; surface?: "light" | "dark"; className?: string };

export function StatusPill({ status, surface = "light", className }: StatusPillProps) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold",
        pillTones[surface][meta.tone],
        className,
      )}
    >
      {meta.tone === "new" ? <span aria-hidden className="size-1.5 rounded-full bg-current" /> : null}
      {meta.label}
    </span>
  );
}
