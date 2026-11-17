"use client";

import { Bike, Check, Monitor, RotateCcw, Smartphone, Store, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { AdminPanel } from "@/components/appui/AdminPanel";
import { CourierScreen } from "@/components/appui/CourierScreen";
import { ManagerScreen } from "@/components/appui/ManagerScreen";
import { TrackingScreen } from "@/components/appui/TrackingScreen";
import { BrowserFrame } from "@/components/devices/BrowserFrame";
import { PhoneFrame } from "@/components/devices/PhoneFrame";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { STATUS_FLOW, STATUS_META } from "@/data/orders";
import { restaurant } from "@/data/sectors";
import { OrderSimProvider, useOrderSim } from "@/lib/order-sim";
import { cn } from "@/lib/utils";

type ToolId = "cliente" | "panel" | "gestion" | "repartidor";

const TOOLS: Array<{ id: ToolId; name: string; short: string; text: string; icon: LucideIcon }> = [
  {
    id: "cliente",
    name: "Aplicación para clientes",
    short: "Clientes",
    text: "Catálogo, pedidos, seguimiento y comunicación relacionados con la entrega.",
    icon: Smartphone,
  },
  {
    id: "panel",
    name: "Panel administrativo",
    short: "Panel",
    text: "Gestión de pedidos, productos, información y accesos.",
    icon: Monitor,
  },
  {
    id: "gestion",
    name: "Aplicación de gestión del establecimiento",
    short: "Gestión",
    text: "Atención de pedidos y actualización de información operativa.",
    icon: Store,
  },
  {
    id: "repartidor",
    name: "Aplicación para repartidores",
    short: "Repartidores",
    text: "Seguimiento de entregas y comunicación con el cliente.",
    icon: Bike,
  },
];

/** Las cuatro herramientas muestran el mismo pedido y reaccionan a sus cambios de estado. */
export function Tools() {
  return (
    <OrderSimProvider withSeedOrder>
      <ToolsInner />
    </OrderSimProvider>
  );
}

function ToolsInner() {
  const sim = useOrderSim();
  const [selected, setSelected] = useState<ToolId>("cliente");
  const order = sim.order;
  const status = order?.status ?? "nuevo";
  const meta = STATUS_META[status];
  const position = STATUS_FLOW.indexOf(status);

  // Herramientas desde las que se ejecuta la siguiente acción.
  const turn: ToolId[] =
    meta.actor === "establecimiento" ? ["panel", "gestion"] : meta.actor === "repartidor" ? ["repartidor"] : [];

  const device = (id: ToolId, zoom?: number): ReactNode => {
    if (id === "panel") {
      return (
        <BrowserFrame label="Panel administrativo de demostración" className="h-[472px] w-full">
          <AdminPanel order={order} onAdvance={sim.advance} onReject={sim.reject} className="h-full" />
        </BrowserFrame>
      );
    }
    return (
      <PhoneFrame label={`${TOOLS.find((tool) => tool.id === id)?.name} de demostración`} zoom={zoom}>
        {id === "cliente" && order ? <TrackingScreen theme={restaurant.theme} order={order} /> : null}
        {id === "gestion" ? <ManagerScreen order={order} onAdvance={sim.advance} onReject={sim.reject} /> : null}
        {id === "repartidor" ? <CourierScreen order={order} onAdvance={sim.advance} /> : null}
      </PhoneFrame>
    );
  };

  const selectedTool = TOOLS.find((tool) => tool.id === selected) ?? TOOLS[0];

  return (
    <section
      id="herramientas"
      aria-labelledby="herramientas-titulo"
      className="relative -mt-8 rounded-t-[2rem] bg-ink-800 text-paper lg:rounded-t-[3rem]"
    >
      <div className="container-x pb-28 pt-20 sm:pt-28 lg:pb-40 lg:pt-36">
        <SectionHeading
          id="herramientas-titulo"
          eyebrow="Las herramientas"
          title="Cuatro herramientas. Una operación conectada."
          subtitle="Un mismo pedido, visto desde cada herramienta. Cambia su estado desde cualquiera de ellas y observa cómo responden las demás."
        />

        {/* ---------- Estado compartido del pedido ---------- */}
        <Reveal delay={0.1}>
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/4 p-5 sm:p-6 lg:mt-16">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <p className="tabular h-card text-xl">Pedido #{order?.id}</p>
                <DemoBadge>Pedido ficticio</DemoBadge>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {meta.action ? (
                  <button
                    type="button"
                    onClick={sim.advance}
                    className="min-h-11 rounded-full bg-aqua px-5 text-sm font-semibold text-ink-950 transition-[background-color,transform] duration-200 hover:bg-aqua-300 active:scale-[0.98]"
                  >
                    {meta.action}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={sim.reset}
                  className="flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold transition-colors duration-200 hover:bg-white/8"
                >
                  <RotateCcw size={14} />
                  Reiniciar
                </button>
              </div>
            </div>

            <ol className="mt-6 grid grid-cols-3 gap-x-2 gap-y-4 sm:grid-cols-6" aria-label="Estado del pedido">
              {STATUS_FLOW.map((item, index) => {
                const done = status !== "rechazado" && index < position;
                const current = status !== "rechazado" && index === position;
                return (
                  <li key={item} aria-current={current ? "step" : undefined}>
                    <span
                      aria-hidden
                      className={cn(
                        "block h-1 rounded-full transition-colors duration-500",
                        done || current ? "bg-aqua" : "bg-white/12",
                      )}
                    />
                    <span
                      className={cn(
                        "mt-2.5 flex items-center gap-1.5 text-[0.78rem] font-medium leading-tight transition-colors duration-300",
                        current ? "text-paper" : done ? "text-stone" : "text-stone/80",
                      )}
                    >
                      {done ? <Check size={12} className="shrink-0 text-aqua" /> : null}
                      {STATUS_META[item].label}
                    </span>
                  </li>
                );
              })}
            </ol>
            {status === "rechazado" ? (
              <p className="mt-4 text-sm text-stone" role="status">
                El establecimiento rechazó el pedido. Reinicia para repetir el recorrido.
              </p>
            ) : null}
          </div>
        </Reveal>

        {/* ---------- Escritorio amplio: las cuatro herramientas a la vez ---------- */}
        <div className="mt-14 hidden grid-cols-[auto_minmax(0,1fr)_auto_auto] items-start gap-x-7 xl:grid">
          {TOOLS.map((tool, index) => (
            <Reveal key={tool.id} delay={index * 0.08}>
              <ToolColumn tool={tool} active={turn.includes(tool.id)}>
                {device(tool.id, 0.8)}
              </ToolColumn>
            </Reveal>
          ))}
        </div>

        {/* ---------- Móvil, tablet y laptop: una herramienta a la vez ---------- */}
        <div className="mt-10 xl:hidden">
          <div className="md:grid md:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] md:gap-10">
            <div
              role="tablist"
              aria-label="Herramientas de Apphouse"
              aria-orientation="horizontal"
              className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0 md:flex-col md:overflow-visible"
            >
              {TOOLS.map((tool) => {
                const isSelected = tool.id === selected;
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    role="tab"
                    id={`herramienta-tab-${tool.id}`}
                    aria-selected={isSelected}
                    aria-controls="herramienta-panel"
                    onClick={() => setSelected(tool.id)}
                    className={cn(
                      "relative flex shrink-0 items-center gap-2.5 rounded-full border px-4 py-2.5 text-left text-sm font-semibold transition-colors duration-300 md:items-start md:rounded-2xl md:p-4",
                      isSelected
                        ? "border-paper bg-paper text-ink-950"
                        : "border-white/12 text-paper hover:border-white/35",
                    )}
                  >
                    <Icon size={17} className="shrink-0 md:mt-0.5" />
                    <span>
                      <span className="md:hidden">{tool.short}</span>
                      <span className="hidden md:block">{tool.name}</span>
                      <span
                        className={cn(
                          "mt-1 hidden text-[0.82rem] font-normal leading-snug md:block",
                          isSelected ? "text-ink-500" : "text-stone",
                        )}
                      >
                        {tool.text}
                      </span>
                    </span>
                    {turn.includes(tool.id) ? (
                      <span className="relative flex size-2 shrink-0 md:absolute md:right-4 md:top-4">
                        <span className="motion-ambient absolute inset-0 animate-pulse-ring rounded-full bg-terra" />
                        <span className="relative size-2 rounded-full bg-terra" />
                        <span className="sr-only">Acción pendiente en esta herramienta</span>
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div
              role="tabpanel"
              id="herramienta-panel"
              aria-labelledby={`herramienta-tab-${selected}`}
              className="mt-8 md:mt-0"
            >
              <p className="mb-6 text-sm leading-relaxed text-stone md:hidden">
                <span className="font-semibold text-paper">{selectedTool.name}.</span> {selectedTool.text}
              </p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={selected}
                  className="flex justify-center"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {device(selected)}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type ToolColumnProps = {
  tool: (typeof TOOLS)[number];
  active: boolean;
  children: ReactNode;
};

function ToolColumn({ tool, active, children }: ToolColumnProps) {
  const Icon = tool.icon;
  return (
    <div className={cn(tool.id === "panel" ? "min-w-0" : "w-[224px]")}>
      <div className="relative">
        {children}
        <AnimatePresence>
          {active ? (
            <motion.span
              key="turn"
              className="absolute -top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-terra px-3 py-1 text-[0.7rem] font-bold text-ink-950"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
            >
              <span aria-hidden className="size-1.5 rounded-full bg-ink-950" />
              Siguiente acción aquí
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="mt-7 border-t border-white/12 pt-5">
        <p className="flex items-start gap-2.5">
          <Icon size={18} className="mt-0.5 shrink-0 text-aqua" />
          <span className="h-card text-[1.15rem]">{tool.name}</span>
        </p>
        <p className="mt-2 text-sm leading-relaxed text-stone">{tool.text}</p>
      </div>
    </div>
  );
}
