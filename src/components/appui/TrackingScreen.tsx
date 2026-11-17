"use client";

import { Check, MessageCircle, Phone, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { STATUS_FLOW, STATUS_META, type Order } from "@/data/orders";
import type { AppTheme } from "@/data/sectors";
import { cn, formatMXN } from "@/lib/utils";
import { MiniMap } from "./MiniMap";
import { StatusBar, themeVars } from "./shared";

/** Hitos que ve el cliente. `current` y `done` son posiciones dentro de STATUS_FLOW. */
const MILESTONES = [
  { label: "Recibido por el establecimiento", current: 0, done: 1 },
  { label: "En preparación", current: 1, done: 3 },
  { label: "En camino", current: 3, done: 5 },
  { label: "Entregado", current: 5, done: 5 },
];

export function mapProgress(status: Order["status"]): number {
  if (status === "entregado") return 1;
  if (status === "en_camino") return 0.68;
  return 0;
}

type TrackingScreenProps = {
  theme: AppTheme;
  order: Order;
  /** Permite iniciar otro pedido cuando este terminó. */
  onNewOrder?: () => void;
};

/** App del cliente: seguimiento del pedido y comunicación con el repartidor. */
export function TrackingScreen({ theme, order, onNewOrder }: TrackingScreenProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const rejected = order.status === "rechazado";
  const position = STATUS_FLOW.indexOf(order.status);
  const delivered = order.status === "entregado";
  const courierVisible = position >= 3;

  return (
    <div className="flex h-full flex-col bg-[var(--app-bg)] text-[var(--app-text)]" style={themeVars(theme)}>
      <div className="shrink-0 px-4">
        <StatusBar className="-mx-4" />
        <p className="tabular pt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--app-muted)]">
          Pedido #{order.id}
        </p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={order.status}
            aria-live="polite"
            className="font-display text-[19px] font-semibold leading-tight"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {STATUS_META[order.status].customer}
          </motion.p>
        </AnimatePresence>
        <p className="mt-0.5 text-[10.5px] text-[var(--app-muted)]">
          {rejected
            ? "El establecimiento no pudo tomar este pedido."
            : delivered
              ? "Gracias por pedir directamente con nosotros."
              : "Tiempo estimado ilustrativo: 25 a 35 min"}
        </p>
      </div>

      <div className="mx-3 mt-3 shrink-0 overflow-hidden rounded-2xl ring-1 ring-inset ring-[var(--app-line)]">
        <MiniMap progress={mapProgress(order.status)} moving={order.status === "en_camino"} className="h-[132px]" />
      </div>

      {rejected ? (
        <div className="mx-3 mt-3 flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl bg-[var(--app-surface)] px-5 text-center ring-1 ring-inset ring-[var(--app-line)]">
          <span className="grid size-10 place-items-center rounded-full bg-[var(--app-line)]">
            <X size={18} />
          </span>
          <p className="text-[11.5px] leading-relaxed text-[var(--app-muted)]">
            En la simulación, el establecimiento rechazó el pedido desde su panel.
          </p>
        </div>
      ) : (
        <ol className="mx-3 mt-3 shrink-0 rounded-2xl bg-[var(--app-surface)] px-3.5 py-3 ring-1 ring-inset ring-[var(--app-line)]">
          {MILESTONES.map((milestone, index) => {
            const done = position >= milestone.done;
            const current = !done && position >= milestone.current;
            return (
              <li key={milestone.label} className="relative flex gap-3 pb-3.5 last:pb-0">
                {index < MILESTONES.length - 1 ? (
                  <span
                    aria-hidden
                    className={cn(
                      "absolute left-[8.5px] top-5 h-[calc(100%-18px)] w-px",
                      done ? "bg-[var(--app-primary)]" : "bg-[var(--app-line)]",
                    )}
                  />
                ) : null}
                <span
                  aria-hidden
                  className={cn(
                    "relative mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full transition-colors duration-300",
                    done
                      ? "bg-[var(--app-primary)] text-[var(--app-on-primary)]"
                      : current
                        ? "ring-2 ring-inset ring-[var(--app-primary)]"
                        : "ring-1 ring-inset ring-[var(--app-line)]",
                  )}
                >
                  {done ? <Check size={11} strokeWidth={3.4} /> : null}
                  {current ? <span className="size-1.5 rounded-full bg-[var(--app-primary)]" /> : null}
                </span>
                <span
                  className={cn(
                    "text-[11.5px] leading-snug",
                    done || current ? "font-semibold" : "text-[var(--app-muted)]",
                  )}
                >
                  {milestone.label}
                  {current ? <span className="sr-only"> (estado actual)</span> : null}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      {/* Resumen del pedido */}
      {rejected ? null : (
        <div className="mx-3 mt-2 min-h-0 flex-1 overflow-hidden px-1 pt-1 text-[10.5px] text-[var(--app-muted)]">
          <p className="truncate">
            {order.items.map((item) => `${item.qty}× ${item.name}`).join(" · ")}
          </p>
          <p className="tabular mt-0.5 font-semibold text-[var(--app-text)]">Total {formatMXN(order.total)}</p>
        </div>
      )}

      <div className="shrink-0 px-3 pb-7 pt-2.5">
        {(delivered || rejected) && onNewOrder ? (
          <button
            type="button"
            onClick={onNewOrder}
            className="flex h-11 w-full items-center justify-center rounded-full bg-[var(--app-primary)] text-[12.5px] font-bold text-[var(--app-on-primary)] transition-transform active:scale-[0.98]"
          >
            Hacer otro pedido
          </button>
        ) : (
          <div className="relative">
            <AnimatePresence>
              {chatOpen && courierVisible ? (
                <motion.p
                  role="status"
                  className="absolute bottom-full right-0 mb-2 max-w-[86%] rounded-2xl rounded-br-md bg-[var(--app-primary)] px-3 py-2 text-[10.5px] font-medium leading-snug text-[var(--app-on-primary)]"
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                >
                  «Voy en camino con tu pedido». Mensaje de ejemplo.
                </motion.p>
              ) : null}
            </AnimatePresence>
            <div
              className={cn(
                "flex items-center gap-2.5 rounded-2xl p-2.5 ring-1 ring-inset ring-[var(--app-line)] transition-colors duration-300",
                courierVisible ? "bg-[var(--app-surface)]" : "bg-transparent",
              )}
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--app-line)] text-[10px] font-bold">
                {courierVisible ? order.courier.slice(0, 1) : "·"}
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn("truncate text-[11.5px] font-semibold leading-tight", !courierVisible && "text-[var(--app-muted)]")}>
                  {courierVisible ? order.courier : "Repartidor por asignar"}
                </p>
                <p className="truncate text-[9.5px] text-[var(--app-muted)]">Repartidor del establecimiento</p>
              </div>
              <button
                type="button"
                disabled={!courierVisible}
                onClick={() => setChatOpen((value) => !value)}
                aria-pressed={chatOpen}
                aria-label="Ver mensaje de ejemplo del repartidor"
                className="grid size-8 place-items-center rounded-full bg-[var(--app-primary)] text-[var(--app-on-primary)] disabled:opacity-50"
              >
                <MessageCircle size={14} />
              </button>
              <span
                aria-hidden
                className="grid size-8 place-items-center rounded-full ring-1 ring-inset ring-[var(--app-line)]"
              >
                <Phone size={13} />
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
