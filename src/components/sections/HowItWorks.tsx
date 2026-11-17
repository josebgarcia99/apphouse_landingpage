"use client";

import { Info, MousePointerClick, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AdminPanel } from "@/components/appui/AdminPanel";
import { CartScreen, ConfirmedScreen } from "@/components/appui/CartScreen";
import { CatalogScreen } from "@/components/appui/CatalogScreen";
import { TrackingScreen } from "@/components/appui/TrackingScreen";
import { BrowserFrame } from "@/components/devices/BrowserFrame";
import { PhoneFrame } from "@/components/devices/PhoneFrame";
import { useMotionPref } from "@/components/providers/MotionProvider";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { STATUS_META } from "@/data/orders";
import { restaurant } from "@/data/sectors";
import { OrderSimProvider, useOrderSim } from "@/lib/order-sim";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    short: "Catálogo",
    title: "Tus clientes exploran tu catálogo",
    text: "Presenta tus productos en una aplicación que lleva el nombre y la identidad de tu negocio.",
    hint: "Filtra por categoría y toca «+» para agregar productos.",
  },
  {
    short: "Pedido",
    title: "Realizan su pedido",
    text: "Tus clientes eligen lo que necesitan y realizan su pedido desde la aplicación de tu establecimiento.",
    hint: "Ajusta las cantidades y confirma el pedido ficticio.",
  },
  {
    short: "Gestión",
    title: "Tu establecimiento administra la solicitud",
    text: "Recibe, organiza y da seguimiento a los pedidos desde tus herramientas de gestión.",
    hint: "Usa los botones del panel para cambiar el estado del pedido.",
  },
  {
    short: "Seguimiento",
    title: "El cliente sigue su entrega",
    text: "El cliente puede seguir el proceso desde su app, mientras tu establecimiento organiza sus entregas.",
    hint: "Simula el avance y observa cómo cambia la app del cliente.",
  },
] as const;

const DELIVERY_NOTE =
  "Apphouse proporciona la tecnología de seguimiento y gestión, pero no suministra repartidores ni realiza las entregas físicamente.";

/** Recorrido interactivo de un pedido: catálogo → pedido → gestión → seguimiento. */
export function HowItWorks() {
  return (
    <OrderSimProvider withSeedOrder>
      <HowItWorksInner />
    </OrderSimProvider>
  );
}

function HowItWorksInner() {
  const { reduced } = useMotionPref();
  const [active, setActive] = useState(0);
  const stepRefs = useRef<Array<HTMLLIElement | null>>([]);

  // El paso activo es el que cruza el centro de la pantalla.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step));
        });
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    stepRefs.current.forEach((element) => element && observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const goTo = (index: number) => {
    const element = stepRefs.current[index];
    if (!element) return;
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    element.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: desktop ? "center" : "start" });
  };

  return (
    <section
      id="como-funciona"
      aria-labelledby="como-funciona-titulo"
      className="relative -mt-8 rounded-t-[2rem] bg-ink-900 text-paper lg:rounded-t-[3rem]"
    >
      <div className="container-x pb-24 pt-20 sm:pt-28 lg:pb-32 lg:pt-36">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="como-funciona-titulo"
            eyebrow="Cómo funciona · El recorrido de un pedido"
            title="Del catálogo a la puerta de tus clientes. Todo conectado."
            subtitle="Apphouse conecta la aplicación de tus clientes con las herramientas que utiliza tu establecimiento para administrar pedidos."
          />
          <DemoBadge className="shrink-0 self-start lg:self-end">Simulación interactiva</DemoBadge>
        </div>

        <div className="mt-14 lg:mt-10 lg:grid lg:grid-cols-12 lg:gap-12">
          {/* ---------- Pasos ---------- */}
          <ol className="lg:col-span-5">
            {STEPS.map((step, index) => {
              const isActive = index === active;
              return (
                <li
                  key={step.title}
                  ref={(element) => {
                    stepRefs.current[index] = element;
                  }}
                  data-step={index}
                  className="scroll-mt-24 border-t border-white/10 py-12 first:border-t-0 first:pt-0 lg:flex lg:min-h-[82vh] lg:flex-col lg:justify-center lg:border-t-0 lg:py-0"
                >
                  <div
                    className={cn(
                      "transition-opacity duration-500",
                      isActive ? "opacity-100" : "lg:opacity-70",
                    )}
                  >
                    <p className="eyebrow tabular flex items-center gap-3 text-aqua">
                      Paso 0{index + 1}
                      <span aria-hidden className="h-px w-10 bg-aqua/50" />
                    </p>
                    <h3 className="h-card mt-4 text-[clamp(1.75rem,3.2vw,2.75rem)]">{step.title}</h3>
                    <p className="lede mt-4 max-w-md text-stone">{step.text}</p>
                    <p className="mt-6 flex items-start gap-2.5 text-sm text-paper/75">
                      <MousePointerClick size={16} className="mt-0.5 shrink-0 text-aqua" />
                      {step.hint}
                    </p>
                    {index === 3 ? (
                      <p className="mt-5 flex max-w-md items-start gap-2.5 rounded-2xl border border-white/10 bg-white/4 p-4 text-sm leading-relaxed text-stone">
                        <Info size={16} className="mt-0.5 shrink-0 text-terra" />
                        {DELIVERY_NOTE}
                      </p>
                    ) : null}
                  </div>

                  {/* En móvil y tablet cada paso muestra su propia interfaz. */}
                  <div className="mt-10 flex justify-center lg:hidden">
                    <Stage step={index} onGo={goTo} />
                  </div>
                </li>
              );
            })}
          </ol>

          {/* ---------- Escenario fijo (escritorio) ---------- */}
          <div className="hidden lg:col-span-7 lg:block">
            <div className="sticky top-[4.5rem] flex h-[calc(100svh-4.5rem)] flex-col items-center justify-center gap-5 py-5 [--phone-zoom:1] [@media(max-height:820px)]:[--phone-zoom:0.86] [@media(max-height:720px)]:[--phone-zoom:0.74]">
              <div
                role="group"
                aria-label="Ir a un paso del recorrido"
                className="flex shrink-0 gap-1 rounded-full border border-white/10 bg-white/4 p-1"
              >
                {STEPS.map((step, index) => (
                  <button
                    key={step.short}
                    type="button"
                    aria-current={index === active ? "step" : undefined}
                    onClick={() => goTo(index)}
                    className={cn(
                      "tabular flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.8rem] font-semibold transition-colors duration-300",
                      index === active ? "bg-paper text-ink-950" : "text-stone hover:text-paper",
                    )}
                  >
                    <span className="opacity-80">0{index + 1}</span>
                    {step.short}
                  </button>
                ))}
              </div>

              <div className="relative flex min-h-0 w-full flex-1 items-center justify-center">
                {/* Halo */}
                <div
                  aria-hidden
                  className="absolute left-1/2 top-1/2 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(67,215,189,0.13),transparent)]"
                />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active}
                    className="relative flex w-full justify-center"
                    initial={{ opacity: 0, y: 26, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -18, scale: 0.98 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Stage step={active} onGo={goTo} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type StageProps = { step: number; onGo: (index: number) => void };

/** Interfaz de demostración que corresponde a cada paso. Comparte el mismo pedido. */
function Stage({ step, onGo }: StageProps) {
  const sim = useOrderSim();
  const theme = restaurant.theme;
  const zoom = "var(--phone-zoom, 1)";

  if (step === 0) {
    return (
      <PhoneFrame label="App del cliente: catálogo" zoom={zoom}>
        <CatalogScreen
          sector={restaurant}
          cart={sim.cart}
          onAdd={sim.add}
          onRemove={sim.remove}
          onOpenCart={() => onGo(1)}
        />
      </PhoneFrame>
    );
  }

  if (step === 1) {
    const justPlaced = sim.cartCount === 0 && sim.placed > 0 && sim.order;
    return (
      <PhoneFrame label="App del cliente: pedido" zoom={zoom}>
        {justPlaced ? (
          <ConfirmedScreen
            theme={theme}
            orderId={justPlaced.id}
            total={justPlaced.total}
            onTrack={() => onGo(2)}
            trackLabel="Ver cómo llega al panel"
          />
        ) : (
          <CartScreen
            theme={theme}
            products={restaurant.products}
            items={sim.cartItems}
            total={sim.cartTotal}
            onAdd={sim.add}
            onRemove={sim.remove}
            onConfirm={sim.placeOrder}
            onBack={() => onGo(0)}
            onSeed={sim.seedCart}
          />
        )}
      </PhoneFrame>
    );
  }

  if (step === 2) {
    return (
      <BrowserFrame label="Panel administrativo de demostración" className="w-full max-w-[660px] lg:h-[470px]">
        <AdminPanel order={sim.order} onAdvance={sim.advance} onReject={sim.reject} className="h-full" />
      </BrowserFrame>
    );
  }

  const order = sim.order;
  const meta = order ? STATUS_META[order.status] : null;
  return (
    <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-center lg:gap-8">
      <PhoneFrame label="App del cliente: seguimiento" zoom={zoom}>
        {order ? (
          <TrackingScreen theme={theme} order={order} />
        ) : (
          <div className="grid h-full place-items-center bg-[#17110e] px-8 text-center text-[12px] text-[#b3a296]">
            Aún no hay un pedido que seguir.
          </div>
        )}
      </PhoneFrame>
      <div className="w-full max-w-[280px] rounded-3xl border border-white/10 bg-white/4 p-5 lg:w-[230px]">
        <p className="eyebrow text-stone">Control de la simulación</p>
        <p className="mt-3 text-sm text-stone">Estado actual</p>
        <p aria-live="polite" className="h-card mt-0.5 text-xl">
          {meta ? meta.label : "Sin pedido"}
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {meta?.action ? (
            <button
              type="button"
              onClick={sim.advance}
              className="min-h-11 rounded-full bg-aqua px-4 text-sm font-semibold text-ink-950 transition-[background-color,transform] duration-200 hover:bg-aqua-300 active:scale-[0.98]"
            >
              Simular avance
            </button>
          ) : null}
          <button
            type="button"
            onClick={sim.reset}
            className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold text-paper transition-colors duration-200 hover:bg-white/8"
          >
            <RotateCcw size={14} />
            Reiniciar pedido
          </button>
        </div>
      </div>
    </div>
  );
}
