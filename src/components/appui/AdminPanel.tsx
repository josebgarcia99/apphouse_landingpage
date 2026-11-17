"use client";

import { BarChart3, ClipboardList, KeyRound, MapPin, Utensils } from "lucide-react";
import { useState } from "react";
import { ApphouseLogo } from "@/components/ui/ApphouseLogo";
import { STATUS_FLOW, STATUS_META, historyOrders, type Order } from "@/data/orders";
import { cn, formatMXN } from "@/lib/utils";
import { StatusPill } from "./shared";

type AdminPanelProps = {
  /** Pedido activo de la simulación (puede no existir todavía). */
  order: Order | null;
  onAdvance: () => void;
  onReject: () => void;
  className?: string;
};

const NAV = [
  { label: "Pedidos", icon: ClipboardList, active: true },
  { label: "Catálogo", icon: Utensils, active: false },
  { label: "Reportes", icon: BarChart3, active: false },
  { label: "Accesos", icon: KeyRound, active: false },
];

/**
 * Panel administrativo web (demostración). Se adapta al ancho de su contenedor:
 * en espacios estrechos oculta la barra lateral y apila lista y detalle.
 */
export function AdminPanel({ order, onAdvance, onReject, className }: AdminPanelProps) {
  const orders = order ? [order, ...historyOrders] : historyOrders;
  const activeId = order?.id;

  // La selección manual solo vale para el pedido activo con el que se hizo.
  const [pick, setPick] = useState<{ forOrder: string | undefined; id: string } | null>(null);
  const selectedId = pick && pick.forOrder === activeId ? pick.id : (activeId ?? orders[0].id);
  const selected = orders.find((item) => item.id === selectedId) ?? orders[0];
  const isActive = selected.id === activeId;
  const meta = STATUS_META[selected.status];
  const position = STATUS_FLOW.indexOf(selected.status);

  return (
    <div className={cn("@container flex min-h-full bg-paper text-ink-900", className)}>
      <aside aria-hidden className="hidden w-[150px] shrink-0 flex-col bg-ink-900 p-3 text-paper @[560px]:flex">
        <div className="flex items-center gap-2 px-1.5 py-1">
          <ApphouseLogo markOnly className="h-5" title="" />
          <span className="font-display text-[13px] font-semibold">Panel</span>
        </div>
        <ul className="mt-4 space-y-0.5 text-[11.5px] font-medium">
          {NAV.map(({ label, icon: Icon, active }) => (
            <li
              key={label}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2.5 py-2",
                active ? "bg-white/10 text-paper" : "text-stone",
              )}
            >
              <Icon size={13} />
              {label}
            </li>
          ))}
        </ul>
        <div className="mt-auto rounded-xl bg-white/5 p-2.5 text-[10px] leading-snug text-stone">
          <p className="font-semibold text-paper">Brasa Norte</p>
          <p>Marca ficticia</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-11 shrink-0 items-center justify-between gap-2 border-b border-ink-900/8 px-4">
          <p className="text-[13px] font-semibold">
            Pedidos <span className="font-normal text-ink-400">· Hoy</span>
          </p>
          <span className="rounded-full bg-ink-900/6 px-2.5 py-1 text-[10px] font-semibold text-ink-500">
            Sucursal Centro
          </span>
        </div>

        {/* En contenedores estrechos el detalle (con sus acciones) va primero. */}
        <div className="no-scrollbar grid min-h-0 flex-1 content-start overflow-y-auto @[600px]:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] @[600px]:content-stretch">
          <ul
            className="order-2 divide-y divide-ink-900/8 border-t border-ink-900/8 @[600px]:order-1 @[600px]:border-r @[600px]:border-t-0"
            aria-label="Pedidos de hoy"
          >
            {orders.map((item) => {
              const current = item.id === selected.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-current={current ? "true" : undefined}
                    onClick={() => setPick({ forOrder: activeId, id: item.id })}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors duration-200",
                      current ? "bg-white" : "hover:bg-white/60",
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="tabular flex items-center gap-1.5 text-[12px] font-semibold">
                        #{item.id}
                        {item.id === activeId && item.status === "nuevo" ? (
                          <span className="relative flex size-2">
                            <span className="motion-ambient absolute inset-0 animate-pulse-ring rounded-full bg-terra" />
                            <span className="relative size-2 rounded-full bg-terra" />
                          </span>
                        ) : null}
                      </span>
                      <span className="block truncate text-[10.5px] text-ink-400">
                        {item.placedAt} · {item.customer.name}
                      </span>
                    </span>
                    <span className="tabular text-[11.5px] font-semibold">{formatMXN(item.total)}</span>
                    <StatusPill status={item.status} />
                  </button>
                </li>
              );
            })}
          </ul>

          <div
            role="group"
            aria-label={`Detalle del pedido ${selected.id}`}
            className="order-1 flex flex-col gap-3 bg-white p-4 @[600px]:order-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="tabular font-display text-[19px] font-semibold leading-none">#{selected.id}</p>
                <p className="mt-1 text-[10.5px] text-ink-400">Recibido: {selected.placedAt}</p>
              </div>
              <StatusPill status={selected.status} />
            </div>

            <div aria-hidden className="flex gap-1">
              {STATUS_FLOW.map((status, index) => (
                <span
                  key={status}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors duration-500",
                    selected.status === "rechazado"
                      ? "bg-[#c2413a]/25"
                      : index <= position
                        ? "bg-teal"
                        : "bg-ink-900/10",
                  )}
                />
              ))}
            </div>

            <p className="flex items-start gap-1.5 text-[11px] leading-snug text-ink-500">
              <MapPin size={12} className="mt-0.5 shrink-0" />
              <span>
                <span className="font-semibold text-ink-900">{selected.customer.name}</span> ·{" "}
                {selected.customer.address}
              </span>
            </p>

            <ul className="space-y-1 border-y border-ink-900/8 py-2.5 text-[11.5px]">
              {selected.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-2">
                  <span className="min-w-0 truncate">
                    <span className="tabular font-bold">{item.qty}×</span> {item.name}
                  </span>
                  <span className="tabular text-ink-400">{formatMXN(item.price * item.qty)}</span>
                </li>
              ))}
              <li className="flex justify-between pt-1.5 text-[12.5px] font-bold">
                <span>Total</span>
                <span className="tabular">{formatMXN(selected.total)}</span>
              </li>
            </ul>

            <div className="mt-auto" aria-live="polite">
              {isActive && meta.action ? (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={onAdvance}
                    className="h-10 flex-1 whitespace-nowrap rounded-full bg-ink-900 px-4 text-[12px] font-semibold text-paper transition-[background-color,transform] duration-200 hover:bg-ink-600 active:scale-[0.98]"
                  >
                    {meta.action}
                  </button>
                  {selected.status === "nuevo" ? (
                    <button
                      type="button"
                      onClick={onReject}
                      className="h-10 rounded-full px-4 text-[12px] font-semibold text-[#9b2c25] ring-1 ring-inset ring-[#c2413a]/30 transition-colors duration-200 hover:bg-[#c2413a]/8"
                    >
                      Rechazar
                    </button>
                  ) : null}
                </div>
              ) : (
                <p className="rounded-xl bg-ink-900/5 px-3 py-2.5 text-[11px] leading-snug text-ink-500">
                  {isActive
                    ? selected.status === "entregado"
                      ? "Pedido completado. Puedes reiniciar la simulación para repetir el recorrido."
                      : "Pedido rechazado. Puedes reiniciar la simulación para repetir el recorrido."
                    : "Pedido anterior de ejemplo, sin acciones pendientes."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
