"use client";

import { Check, RotateCcw, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AdminPanel } from "@/components/appui/AdminPanel";
import { CartScreen } from "@/components/appui/CartScreen";
import { CatalogScreen } from "@/components/appui/CatalogScreen";
import { CourierScreen } from "@/components/appui/CourierScreen";
import { TrackingScreen } from "@/components/appui/TrackingScreen";
import { BrowserFrame } from "@/components/devices/BrowserFrame";
import { PhoneFrame } from "@/components/devices/PhoneFrame";
import { ApphouseLogo } from "@/components/ui/ApphouseLogo";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { restaurant } from "@/data/sectors";
import { OrderSimProvider, useOrderSim } from "@/lib/order-sim";
import { cn } from "@/lib/utils";

type DemoExperienceProps = { open: boolean; onClose: () => void };

/**
 * DEMOSTRACIÓN LOCAL
 * Experiencia navegable a pantalla completa: catálogo → carrito → pedido →
 * panel de gestión → cambios de estado → seguimiento. Todo ocurre en el estado
 * local del navegador; no se piden datos ni se envía nada a ningún servidor.
 */
export default function DemoExperience({ open, onClose }: DemoExperienceProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Evita que la página de fondo se desplace mientras la demo está abierta.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog ref={dialogRef} aria-labelledby="demo-titulo" className="dialog-full" onClose={onClose}>
      <OrderSimProvider>
        <DemoInner onClose={() => dialogRef.current?.close()} />
      </OrderSimProvider>
    </dialog>
  );
}

type CustomerView = "catalog" | "cart" | "tracking";
type DeviceTab = "cliente" | "panel" | "repartidor";

const GUIDE_STEPS = ["Catálogo", "Carrito", "Pedido", "Gestión", "Seguimiento"];

function DemoInner({ onClose }: { onClose: () => void }) {
  const sim = useOrderSim();
  const [view, setView] = useState<CustomerView>("catalog");
  const [tab, setTab] = useState<DeviceTab>("cliente");
  const order = sim.order;
  const theme = restaurant.theme;

  // Paso de la guía e instrucción según el estado de la simulación.
  let step = 0;
  let instruction = "Explora el catálogo de Brasa Norte y agrega productos con el botón «+».";
  if (!order && sim.cartCount > 0) {
    step = 1;
    instruction = "Abre el carrito, ajusta las cantidades y confirma tu pedido ficticio.";
  }
  if (order) {
    if (order.status === "nuevo") {
      step = 2;
      instruction = "El pedido llegó al panel de gestión. Acéptalo (o recházalo) desde el panel.";
    } else if (order.status === "aceptado" || order.status === "preparando") {
      step = 3;
      instruction = "Avanza el pedido desde el panel: inicia la preparación y márcalo como listo.";
    } else if (order.status === "listo") {
      step = 3;
      instruction = "El pedido está listo. Envíalo desde el panel o recógelo en la app de repartidores.";
    } else if (order.status === "en_camino") {
      step = 4;
      instruction = "El pedido va en camino. Observa el seguimiento en la app del cliente y confirma la entrega.";
    } else if (order.status === "entregado") {
      step = 5;
      instruction = "Pedido entregado. Puedes hacer otro pedido o reiniciar la demostración.";
    } else {
      step = 2;
      instruction = "El establecimiento rechazó el pedido. Haz otro pedido o reinicia la demostración.";
    }
  }

  const restart = () => {
    sim.reset();
    setView("catalog");
    setTab("cliente");
  };

  const confirmOrder = () => {
    sim.placeOrder();
    setView("tracking");
  };

  const customerScreen: ReactNode =
    view === "tracking" && order ? (
      <TrackingScreen theme={theme} order={order} onNewOrder={() => setView("catalog")} />
    ) : view === "cart" ? (
      <CartScreen
        theme={theme}
        products={restaurant.products}
        items={sim.cartItems}
        total={sim.cartTotal}
        onAdd={sim.add}
        onRemove={sim.remove}
        onConfirm={confirmOrder}
        onBack={() => setView("catalog")}
        onSeed={sim.seedCart}
      />
    ) : (
      <CatalogScreen
        sector={restaurant}
        cart={sim.cart}
        onAdd={sim.add}
        onRemove={sim.remove}
        onOpenCart={() => setView("cart")}
      />
    );

  const zoom = "var(--phone-zoom, 1)";
  const devices: Record<DeviceTab, { label: string; hint: string; node: ReactNode; alert: boolean }> = {
    cliente: {
      label: "App del cliente",
      hint: "Catálogo, carrito y seguimiento",
      alert: false,
      node: (
        <div className="flex flex-col items-center gap-3">
          <PhoneFrame label="App del cliente (demostración)" zoom={zoom}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={view}
                className="h-full"
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.25 }}
              >
                {customerScreen}
              </motion.div>
            </AnimatePresence>
          </PhoneFrame>
          {order && view !== "tracking" ? (
            <button
              type="button"
              onClick={() => setView("tracking")}
              className="min-h-11 rounded-full border border-white/15 px-4 text-sm font-semibold transition-colors hover:bg-white/8"
            >
              Ver seguimiento del pedido #{order.id}
            </button>
          ) : null}
        </div>
      ),
    },
    panel: {
      label: "Panel de gestión",
      hint: "Recibe el pedido y cambia su estado",
      alert: order?.status === "nuevo",
      node: (
        <BrowserFrame
          label="Panel administrativo (demostración)"
          className="h-[min(560px,calc(590px*var(--phone-zoom,1)))] w-full max-w-[720px] max-xl:h-[540px]"
        >
          <AdminPanel order={order} onAdvance={sim.advance} onReject={sim.reject} className="h-full" />
        </BrowserFrame>
      ),
    },
    repartidor: {
      label: "App de repartidores",
      hint: "Recoge y entrega el pedido",
      alert: order?.status === "listo",
      node: (
        <PhoneFrame label="App de repartidores (demostración)" zoom={zoom}>
          <CourierScreen order={order} onAdvance={sim.advance} />
        </PhoneFrame>
      ),
    },
  };
  const order3: DeviceTab[] = ["cliente", "panel", "repartidor"];

  return (
    <div className="flex h-full flex-col bg-ink-950 text-paper [--phone-zoom:1] xl:[@media(max-height:900px)]:[--phone-zoom:0.86] xl:[@media(max-height:790px)]:[--phone-zoom:0.74]">
      {/* ---------- Barra superior ---------- */}
      <div className="shrink-0 border-b border-white/10">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <ApphouseLogo className="h-7 shrink-0" markOnly title="" />
            <h2 id="demo-titulo" className="h-card truncate text-lg sm:text-xl">
              Demostración local
            </h2>
            <span className="hidden md:block">
              <DemoBadge>Datos ficticios · sin datos personales</DemoBadge>
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={restart}
              className="flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold transition-colors hover:bg-white/8"
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Reiniciar demostración</span>
              <span className="sm:hidden">Reiniciar</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar la demostración"
              className="grid size-11 place-items-center rounded-full bg-paper text-ink-950 transition-colors hover:bg-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="container-x py-5 lg:py-7">
          {/* ---------- Guía ---------- */}
          <div className="rounded-3xl border border-white/10 bg-white/4 p-4 sm:p-5">
            <ol className="flex gap-1.5 sm:gap-3" aria-label="Progreso de la demostración">
              {GUIDE_STEPS.map((label, index) => {
                const done = index < step;
                const current = index === step;
                return (
                  <li key={label} className="min-w-0 flex-1" aria-current={current ? "step" : undefined}>
                    <span
                      aria-hidden
                      className={cn(
                        "block h-1 rounded-full transition-colors duration-500",
                        done || current ? "bg-aqua" : "bg-white/12",
                      )}
                    />
                    <span
                      className={cn(
                        "mt-2 flex items-center gap-1 truncate text-[0.72rem] font-semibold sm:text-[0.8rem]",
                        current ? "text-paper" : done ? "text-stone" : "text-stone/80",
                      )}
                    >
                      {done ? <Check size={12} className="shrink-0 text-aqua" /> : null}
                      <span className="truncate">{label}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
            <p role="status" className="mt-3.5 text-[0.95rem] leading-snug text-paper/90 sm:text-base">
              <span className="font-semibold text-aqua">Siguiente paso: </span>
              {instruction}
            </p>
          </div>

          {/* ---------- Escritorio amplio: tres herramientas a la vez ---------- */}
          <div className="mt-7 hidden grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-8 xl:grid">
            {order3.map((id) => (
              <div key={id} role="group" aria-label={devices[id].label} className={id === "panel" ? "min-w-0" : undefined}>
                <DeviceCaption label={devices[id].label} hint={devices[id].hint} alert={devices[id].alert} />
                <div className="flex justify-center">{devices[id].node}</div>
              </div>
            ))}
          </div>

          {/* ---------- Móvil, tablet y laptop: una herramienta a la vez ---------- */}
          <div className="mt-5 xl:hidden">
            <div role="tablist" aria-label="Herramientas de la demostración" className="grid grid-cols-3 gap-1 rounded-full bg-white/6 p-1">
              {order3.map((id) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  id={`demo-tab-${id}`}
                  aria-selected={tab === id}
                  aria-controls="demo-panel"
                  onClick={() => setTab(id)}
                  className={cn(
                    "relative flex min-h-11 items-center justify-center gap-1.5 rounded-full px-2 text-[0.8rem] font-semibold transition-colors duration-200 sm:text-sm",
                    tab === id ? "bg-paper text-ink-950" : "text-stone hover:text-paper",
                  )}
                >
                  <span className="truncate">
                    {id === "cliente" ? "Cliente" : id === "panel" ? "Panel" : "Repartidor"}
                  </span>
                  {devices[id].alert && tab !== id ? (
                    <span className="relative flex size-2 shrink-0">
                      <span className="motion-ambient absolute inset-0 animate-pulse-ring rounded-full bg-terra" />
                      <span className="relative size-2 rounded-full bg-terra" />
                      <span className="sr-only">Acción pendiente</span>
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
            <div
              role="tabpanel"
              id="demo-panel"
              aria-labelledby={`demo-tab-${tab}`}
              className="mt-6 flex justify-center pb-6"
            >
              {devices[tab].node}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeviceCaption({ label, hint, alert }: { label: string; hint: string; alert: boolean }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div>
        <p className="h-card text-[1.05rem]">{label}</p>
        <p className="text-sm text-stone">{hint}</p>
      </div>
      {alert ? (
        <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-terra px-3 py-1 text-[0.7rem] font-bold text-ink-950">
          <span aria-hidden className="size-1.5 rounded-full bg-ink-950" />
          Acción aquí
        </span>
      ) : null}
    </div>
  );
}
