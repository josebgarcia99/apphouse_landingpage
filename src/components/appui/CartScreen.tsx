"use client";

import { Check, ChevronLeft, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import type { OrderItem } from "@/data/orders";
import type { AppTheme, Product } from "@/data/sectors";
import { formatMXN } from "@/lib/utils";
import { ProductThumb, QtyControl, StatusBar, themeVars } from "./shared";

type CartScreenProps = {
  theme: AppTheme;
  products: Product[];
  items: OrderItem[];
  total: number;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onConfirm: () => void;
  onBack?: () => void;
  /** Rellena el carrito con una selección de ejemplo cuando está vacío. */
  onSeed?: () => void;
};

/** App del cliente: carrito y confirmación de un pedido ficticio. */
export function CartScreen({
  theme,
  products,
  items,
  total,
  onAdd,
  onRemove,
  onConfirm,
  onBack,
  onSeed,
}: CartScreenProps) {
  const units = items.reduce((sum, item) => sum + item.qty, 0);
  const imageOf = (id: string) => products.find((product) => product.id === id)?.image ?? "";

  return (
    <div className="flex h-full flex-col bg-[var(--app-bg)] text-[var(--app-text)]" style={themeVars(theme)}>
      <div className="shrink-0">
        <StatusBar />
        <div className="flex items-center gap-2 px-3 pb-3 pt-2">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="Volver al catálogo"
              className="grid size-8 place-items-center rounded-full bg-[var(--app-surface)] ring-1 ring-inset ring-[var(--app-line)]"
            >
              <ChevronLeft size={16} />
            </button>
          ) : null}
          <div className={onBack ? "" : "px-1"}>
            <p className="font-display text-[16px] font-semibold leading-tight">Tu pedido</p>
            <p className="text-[10px] text-[var(--app-muted)]">{theme.brand}</p>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 pb-10 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-[var(--app-surface)] text-[var(--app-muted)] ring-1 ring-inset ring-[var(--app-line)]">
            <ShoppingBag size={22} />
          </span>
          <p className="text-[13px] font-semibold">Tu carrito está vacío</p>
          <p className="text-[11px] leading-relaxed text-[var(--app-muted)]">
            Agrega productos desde el catálogo para armar un pedido de ejemplo.
          </p>
          {onSeed ? (
            <button
              type="button"
              onClick={onSeed}
              className="mt-1 rounded-full bg-[var(--app-primary)] px-4 py-2.5 text-[11.5px] font-bold text-[var(--app-on-primary)] transition-transform active:scale-[0.97]"
            >
              Usar una selección de ejemplo
            </button>
          ) : null}
        </div>
      ) : (
        <>
          <ul className="no-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto px-3" aria-label="Productos del pedido">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-2.5 rounded-2xl bg-[var(--app-surface)] p-2 ring-1 ring-inset ring-[var(--app-line)]"
              >
                <ProductThumb src={imageOf(item.id)} className="size-11 rounded-[10px]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold leading-snug">{item.name}</p>
                  <p className="tabular text-[11px] text-[var(--app-muted)]">
                    {formatMXN(item.price * item.qty)}
                  </p>
                </div>
                <QtyControl
                  size="sm"
                  qty={item.qty}
                  name={item.name}
                  onAdd={() => onAdd(item.id)}
                  onRemove={() => onRemove(item.id)}
                />
              </li>
            ))}
          </ul>

          <div className="shrink-0 space-y-2.5 border-t border-[var(--app-line)] px-4 pb-7 pt-3">
            <dl className="space-y-1 text-[11.5px]">
              <div className="flex justify-between text-[var(--app-muted)]">
                <dt>Productos</dt>
                <dd className="tabular">{units}</dd>
              </div>
              <div className="flex justify-between text-[14px] font-bold">
                <dt>Total</dt>
                <dd className="tabular">{formatMXN(total)}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={onConfirm}
              className="flex h-11 w-full items-center justify-center rounded-full bg-[var(--app-primary)] text-[12.5px] font-bold text-[var(--app-on-primary)] transition-transform active:scale-[0.98]"
            >
              Confirmar pedido
            </button>
            <p className="text-center text-[9.5px] leading-snug text-[var(--app-muted)]">
              Pedido ficticio: no se realiza ningún cobro.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

type ConfirmedScreenProps = {
  theme: AppTheme;
  orderId: string;
  total: number;
  onTrack?: () => void;
  trackLabel?: string;
};

/** App del cliente: confirmación tras enviar el pedido. */
export function ConfirmedScreen({ theme, orderId, total, onTrack, trackLabel = "Ver seguimiento" }: ConfirmedScreenProps) {
  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-4 bg-[var(--app-bg)] px-7 text-center text-[var(--app-text)]"
      style={themeVars(theme)}
    >
      <motion.span
        className="grid size-16 place-items-center rounded-full bg-[var(--app-primary)] text-[var(--app-on-primary)]"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      >
        <Check size={30} strokeWidth={3} />
      </motion.span>
      <div>
        <p className="font-display text-[20px] font-semibold leading-tight">Pedido enviado</p>
        <p className="tabular mt-1 text-[12px] text-[var(--app-muted)]">
          #{orderId} · {formatMXN(total)}
        </p>
      </div>
      <p className="text-[11.5px] leading-relaxed text-[var(--app-muted)]">
        {theme.brand} ya lo recibió en sus herramientas de gestión.
      </p>
      {onTrack ? (
        <button
          type="button"
          onClick={onTrack}
          className="mt-1 rounded-full bg-[var(--app-surface)] px-5 py-2.5 text-[12px] font-bold ring-1 ring-inset ring-[var(--app-line)] transition-transform active:scale-[0.97]"
        >
          {trackLabel}
        </button>
      ) : null}
    </div>
  );
}
