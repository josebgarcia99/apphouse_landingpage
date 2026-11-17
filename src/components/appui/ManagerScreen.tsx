"use client";

import { Check, MapPin, X } from "lucide-react";
import { useState } from "react";
import { ApphouseLogo } from "@/components/ui/ApphouseLogo";
import { STATUS_META, historyOrders, type Order } from "@/data/orders";
import { restaurant } from "@/data/sectors";
import { cn, formatMXN } from "@/lib/utils";
import { ProductThumb, StatusBar, StatusPill, apphouseTheme, themeVars } from "./shared";

type ManagerScreenProps = {
  order: Order | null;
  onAdvance: () => void;
  onReject: () => void;
};

/**
 * Aplicación de gestión del establecimiento (demostración):
 * atención de pedidos y actualización de información operativa.
 */
export function ManagerScreen({ order, onAdvance, onReject }: ManagerScreenProps) {
  const [tab, setTab] = useState<"pedidos" | "catalogo">("pedidos");
  const [unavailable, setUnavailable] = useState<Record<string, boolean>>({ "r-corte": true });

  const meta = order ? STATUS_META[order.status] : null;
  const isOpen = order ? order.status !== "entregado" && order.status !== "rechazado" : false;

  return (
    <div className="flex h-full flex-col bg-[var(--app-bg)] text-[var(--app-text)]" style={themeVars(apphouseTheme)}>
      <div className="shrink-0">
        <StatusBar />
        <div className="flex items-center gap-2.5 px-4 pb-2.5 pt-2">
          <span className="grid size-9 place-items-center rounded-[11px] bg-[var(--app-surface)] ring-1 ring-inset ring-[var(--app-line)]">
            <ApphouseLogo markOnly className="h-5" title="" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-[15px] font-semibold leading-tight">Gestión</p>
            <p className="truncate text-[10px] text-[var(--app-muted)]">Brasa Norte · Sucursal Centro</p>
          </div>
        </div>
        <div role="tablist" aria-label="Secciones de la app de gestión" className="mx-3 grid grid-cols-2 rounded-full bg-[var(--app-surface)] p-0.5 text-[11px] font-semibold">
          {(["pedidos", "catalogo"] as const).map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={tab === item}
              onClick={() => setTab(item)}
              className={cn(
                "flex h-7 items-center justify-center gap-1.5 rounded-full transition-colors duration-200",
                tab === item ? "bg-[var(--app-text)] text-[var(--app-bg)]" : "text-[var(--app-muted)]",
              )}
            >
              {item === "pedidos" ? "Pedidos" : "Catálogo"}
              {item === "pedidos" && isOpen ? (
                <span className="tabular grid size-4 place-items-center rounded-full bg-[var(--app-primary)] text-[9px] font-bold text-[var(--app-on-primary)]">
                  1
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {tab === "pedidos" ? (
        <div className="no-scrollbar min-h-0 flex-1 space-y-2.5 overflow-y-auto px-3 pb-6 pt-3">
          {order && meta ? (
            <article className="rounded-2xl bg-[var(--app-surface)] p-3 ring-1 ring-inset ring-[var(--app-line)]">
              <div className="flex items-center justify-between gap-2">
                <p className="tabular font-display text-[15px] font-semibold">#{order.id}</p>
                <StatusPill status={order.status} surface="dark" />
              </div>
              <p className="mt-1.5 flex items-start gap-1.5 text-[10.5px] leading-snug text-[var(--app-muted)]">
                <MapPin size={11} className="mt-0.5 shrink-0" />
                <span>
                  {order.customer.name} · {order.customer.address}
                </span>
              </p>
              <ul className="mt-2.5 space-y-1 border-y border-[var(--app-line)] py-2.5 text-[11.5px]">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between gap-2">
                    <span className="min-w-0 truncate">
                      <span className="tabular font-bold text-[var(--app-primary)]">{item.qty}×</span> {item.name}
                    </span>
                    <span className="tabular text-[var(--app-muted)]">{formatMXN(item.price * item.qty)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 flex justify-between text-[12.5px] font-bold">
                <span>Total</span>
                <span className="tabular">{formatMXN(order.total)}</span>
              </p>

              <div className="mt-3" aria-live="polite">
                {meta.action ? (
                  <div className="flex gap-2">
                    {order.status === "nuevo" ? (
                      <button
                        type="button"
                        onClick={onReject}
                        className="h-10 rounded-full px-3.5 text-[11.5px] font-semibold text-[var(--app-muted)] ring-1 ring-inset ring-[var(--app-line)] transition-colors hover:text-[var(--app-text)]"
                      >
                        Rechazar
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={onAdvance}
                      className="h-10 flex-1 rounded-full bg-[var(--app-primary)] px-3 text-[11.5px] font-bold text-[var(--app-on-primary)] transition-transform active:scale-[0.98]"
                    >
                      {meta.action}
                    </button>
                  </div>
                ) : (
                  <p className="flex items-center justify-center gap-1.5 rounded-full bg-[var(--app-line)] py-2.5 text-[11px] font-semibold text-[var(--app-muted)]">
                    {order.status === "entregado" ? <Check size={13} /> : <X size={13} />}
                    {order.status === "entregado" ? "Pedido completado" : "Pedido rechazado"}
                  </p>
                )}
              </div>
            </article>
          ) : (
            <p className="rounded-2xl bg-[var(--app-surface)] px-4 py-6 text-center text-[11.5px] leading-relaxed text-[var(--app-muted)] ring-1 ring-inset ring-[var(--app-line)]">
              Sin pedidos nuevos. Cuando un cliente confirme su pedido aparecerá aquí.
            </p>
          )}

          <p className="px-1 pt-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[var(--app-muted)]">
            Anteriores
          </p>
          <ul className="space-y-1.5">
            {historyOrders.slice(0, 2).map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-2 rounded-xl bg-[var(--app-surface)] px-3 py-2 text-[11px] ring-1 ring-inset ring-[var(--app-line)]"
              >
                <span className="tabular font-semibold">#{item.id}</span>
                <span className="tabular text-[var(--app-muted)]">{formatMXN(item.total)}</span>
                <StatusPill status={item.status} surface="dark" />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <ul className="no-scrollbar min-h-0 flex-1 space-y-1.5 overflow-y-auto px-3 pb-6 pt-3" aria-label="Disponibilidad de productos">
          {restaurant.products.slice(0, 6).map((product) => {
            const available = !unavailable[product.id];
            return (
              <li
                key={product.id}
                className="flex items-center gap-2.5 rounded-2xl bg-[var(--app-surface)] p-2 ring-1 ring-inset ring-[var(--app-line)]"
              >
                <ProductThumb src={product.image} className={cn("size-10 rounded-[10px]", !available && "opacity-40 grayscale")} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11.5px] font-semibold leading-snug">{product.name}</p>
                  <p className="text-[10px] text-[var(--app-muted)]">{available ? "Disponible" : "Agotado"}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={available}
                  aria-label={`Disponibilidad de ${product.name}`}
                  onClick={() => setUnavailable((state) => ({ ...state, [product.id]: available }))}
                  className={cn(
                    "relative h-6 w-10 shrink-0 rounded-full transition-colors duration-200",
                    available ? "bg-[var(--app-primary)]" : "bg-[var(--app-line)]",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 size-5 rounded-full bg-white transition-transform duration-200",
                      available ? "translate-x-[18px]" : "translate-x-0.5",
                    )}
                    style={{ left: 0 }}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
