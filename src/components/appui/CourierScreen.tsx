"use client";

import { Check, MapPin, MessageCircle, Package, Store } from "lucide-react";
import { STATUS_FLOW, type Order } from "@/data/orders";
import { MiniMap } from "./MiniMap";
import { StatusBar, apphouseTheme, themeVars } from "./shared";
import { mapProgress } from "./TrackingScreen";

type CourierScreenProps = {
  order: Order | null;
  onAdvance: () => void;
};

/**
 * Aplicación para repartidores (demostración): seguimiento de entregas y
 * comunicación con el cliente. Los repartidores pertenecen al establecimiento.
 */
export function CourierScreen({ order, onAdvance }: CourierScreenProps) {
  const position = order ? STATUS_FLOW.indexOf(order.status) : -1;
  const waiting = !order || position < 3;
  const ready = order?.status === "listo";
  const onTheWay = order?.status === "en_camino";
  const delivered = order?.status === "entregado";

  return (
    <div className="flex h-full flex-col bg-[var(--app-bg)] text-[var(--app-text)]" style={themeVars(apphouseTheme)}>
      <div className="shrink-0">
        <StatusBar />
        <div className="flex items-center gap-2.5 px-4 pb-3 pt-2">
          <span className="grid size-9 place-items-center rounded-full bg-[var(--app-surface)] text-[11px] font-bold ring-1 ring-inset ring-[var(--app-line)]">
            {(order?.courier ?? "L").slice(0, 1)}
          </span>
          <div className="min-w-0">
            <p className="font-display text-[15px] font-semibold leading-tight">Entregas</p>
            <p className="truncate text-[10px] text-[var(--app-muted)]">Repartidor de Brasa Norte</p>
          </div>
          <span className="ml-auto flex items-center gap-1.5 rounded-full bg-[var(--app-surface)] px-2.5 py-1 text-[9.5px] font-semibold ring-1 ring-inset ring-[var(--app-line)]">
            <span aria-hidden className="size-1.5 rounded-full bg-[var(--app-primary)]" />
            Disponible
          </span>
        </div>
      </div>

      <div className="mx-3 shrink-0 overflow-hidden rounded-2xl ring-1 ring-inset ring-[var(--app-line)]">
        <MiniMap progress={order ? mapProgress(order.status) : 0} moving={Boolean(onTheWay)} className="h-[150px]" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3 pb-7 pt-3" aria-live="polite">
        {waiting || order?.status === "rechazado" ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2.5 rounded-2xl bg-[var(--app-surface)] px-5 text-center ring-1 ring-inset ring-[var(--app-line)]">
            <span className="grid size-11 place-items-center rounded-full bg-[var(--app-line)] text-[var(--app-muted)]">
              <Package size={18} />
            </span>
            <p className="text-[12.5px] font-semibold">Sin entregas por ahora</p>
            <p className="text-[10.5px] leading-relaxed text-[var(--app-muted)]">
              {order && order.status !== "rechazado"
                ? `El pedido #${order.id} aparecerá aquí cuando el establecimiento lo marque como listo.`
                : "Las entregas asignadas por el establecimiento aparecerán aquí."}
            </p>
          </div>
        ) : order ? (
          <article className="flex flex-1 flex-col rounded-2xl bg-[var(--app-surface)] p-3 ring-1 ring-inset ring-[var(--app-line)]">
            <div className="flex items-center justify-between">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-[var(--app-primary)]">
                {ready ? "Nueva entrega" : onTheWay ? "En ruta" : "Completada"}
              </p>
              <p className="tabular text-[11px] font-semibold text-[var(--app-muted)]">#{order.id}</p>
            </div>
            <ul className="mt-2.5 space-y-2.5 text-[11.5px]">
              <li className="flex gap-2.5">
                <Store size={14} className="mt-0.5 shrink-0 text-[var(--app-muted)]" />
                <span>
                  <span className="block font-semibold leading-snug">Recoger en Brasa Norte</span>
                  <span className="block text-[10px] text-[var(--app-muted)]">Sucursal Centro</span>
                </span>
              </li>
              <li className="flex gap-2.5">
                <MapPin size={14} className="mt-0.5 shrink-0 text-[var(--app-primary)]" />
                <span>
                  <span className="block font-semibold leading-snug">Entregar a {order.customer.name}</span>
                  <span className="block text-[10px] text-[var(--app-muted)]">{order.customer.address}</span>
                </span>
              </li>
            </ul>

            <div className="mt-auto flex gap-2 pt-3">
              {delivered ? (
                <p className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-[var(--app-line)] text-[11.5px] font-semibold">
                  <Check size={14} /> Entrega completada
                </p>
              ) : (
                <>
                  <span
                    aria-hidden
                    className="grid size-10 shrink-0 place-items-center rounded-full ring-1 ring-inset ring-[var(--app-line)]"
                    title="Comunicación con el cliente (ilustrativa)"
                  >
                    <MessageCircle size={15} />
                  </span>
                  <button
                    type="button"
                    onClick={onAdvance}
                    className="h-10 flex-1 rounded-full bg-[var(--app-primary)] text-[11.5px] font-bold text-[var(--app-on-primary)] transition-transform active:scale-[0.98]"
                  >
                    {ready ? "Recoger pedido" : "Confirmar entrega"}
                  </button>
                </>
              )}
            </div>
          </article>
        ) : null}
      </div>
    </div>
  );
}
