"use client";

import { ArrowUpRight, Check, Info, X } from "lucide-react";
import { useRef, useState } from "react";
import { AnimatedNumber } from "@/components/dashboard/charts";
import { Button } from "@/components/ui/Button";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  OFFICIAL_URL,
  PRICING_REFERENCE_DATE,
  estimateMonthly,
  planById,
  plans,
  type PlanId,
} from "@/data/plans";
import { clamp, cn, formatInt, formatMXN } from "@/lib/utils";

const MAX_ORDERS = 50000;
const formatTotal = (value: number) => formatMXN(value, 2);

/** Planes, calculadora ilustrativa y resumen simulado de selección (sin pagos). */
export function Pricing() {
  const [planId, setPlanId] = useState<PlanId>("pyme");
  const [ordersText, setOrdersText] = useState("420");
  const dialogRef = useRef<HTMLDialogElement>(null);

  const plan = planById(planId);
  const orders = clamp(Number.parseInt(ordersText, 10) || 0, 0, MAX_ORDERS);
  const estimate = estimateMonthly(plan, orders);

  const choosePlan = (id: PlanId) => {
    setPlanId(id);
    dialogRef.current?.showModal();
  };

  return (
    <section
      id="planes"
      aria-labelledby="planes-titulo"
      className="relative -mt-8 rounded-t-[2rem] bg-paper text-ink-950 lg:rounded-t-[3rem]"
    >
      <div className="container-x pb-24 pt-20 sm:pt-28 lg:pb-32 lg:pt-36">
        <SectionHeading
          id="planes-titulo"
          tone="light"
          marker="terra"
          eyebrow="Planes y precios"
          title="Elige el plan ideal para tu negocio."
          subtitle="Licenciamiento mensual con una cantidad de pedidos incluida. Si la superas, se suma una tarifa fija por cada pedido adicional."
        />

        {/* Nota visible: precios de referencia */}
        <Reveal delay={0.1}>
          <p className="mt-8 flex max-w-3xl items-start gap-3 rounded-2xl border border-terra-600/35 bg-terra/10 p-4 text-sm leading-relaxed text-ink-700">
            <Info size={17} className="mt-0.5 shrink-0 text-terra-700" />
            <span>
              <strong className="font-semibold">Precios de referencia del prototipo.</strong> Valores
              públicos de Apphouse al {PRICING_REFERENCE_DATE}. No son condiciones contractuales y deben
              confirmarse antes de publicar.
            </span>
          </p>
        </Reveal>

        {/* ---------- Planes ---------- */}
        <div className="mt-10 grid gap-4 lg:grid-cols-3 lg:gap-5">
          {plans.map((item, index) => {
            const selected = item.id === planId;
            return (
              <Reveal key={item.id} delay={index * 0.08} className="h-full">
                <article
                  className={cn(
                    "flex h-full flex-col rounded-[1.75rem] border p-7 transition-[background-color,border-color,color] duration-500 sm:p-8",
                    selected ? "border-ink-950 bg-ink-950 text-paper" : "border-ink-900/10 bg-white/70 text-ink-950",
                  )}
                >
                  <p className={cn("eyebrow", selected ? "text-aqua" : "text-terra-700")}>{item.branches}</p>
                  <h3 className="h-card mt-3 text-[2rem]">Plan {item.name}</h3>
                  <p className={cn("mt-1.5 text-sm", selected ? "text-stone" : "text-ink-400")}>{item.audience}</p>

                  <p className="mt-8 flex items-baseline gap-2">
                    <span className="h-display text-[3.5rem] sm:text-[4rem]">{formatMXN(item.monthly)}</span>
                    <span className={cn("text-sm font-medium", selected ? "text-stone" : "text-ink-400")}>
                      MXN al mes
                    </span>
                  </p>
                  <p className={cn("mt-1 text-sm", selected ? "text-stone" : "text-ink-400")}>IVA incluido</p>

                  <ul
                    className={cn(
                      "mt-7 space-y-3 border-t pt-7 text-[0.95rem]",
                      selected ? "border-white/12" : "border-ink-900/10",
                    )}
                  >
                    {[
                      `${formatInt(item.includedOrders)} pedidos incluidos mensualmente`,
                      `${formatMXN(item.extraOrderFee, 2)} MXN por pedido adicional`,
                      ...item.features,
                    ].map((feature, featureIndex) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check
                          size={16}
                          strokeWidth={2.6}
                          className={cn("mt-1 shrink-0", selected ? "text-aqua" : "text-teal-700")}
                        />
                        <span className={featureIndex < 2 ? "font-semibold" : undefined}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    <Button
                      variant={selected ? "light" : "dark"}
                      onClick={() => choosePlan(item.id)}
                      className="w-full justify-between"
                    >
                      {`Elegir plan ${item.name}`}
                    </Button>
                    <button
                      type="button"
                      onClick={() => setPlanId(item.id)}
                      aria-pressed={selected}
                      className={cn(
                        "mt-3 min-h-11 w-full rounded-full text-sm font-semibold underline-offset-4 hover:underline",
                        selected ? "text-stone" : "text-ink-500",
                      )}
                    >
                      {selected ? "Plan usado en la calculadora" : "Usar en la calculadora"}
                    </button>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* ---------- Calculadora ---------- */}
        <Reveal delay={0.1}>
          <div className="mt-5 grid gap-10 rounded-[1.75rem] border border-ink-900/10 bg-white/70 p-7 sm:p-9 lg:grid-cols-2 lg:gap-16 lg:p-12">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="h-card text-[1.75rem] sm:text-[2rem]">Calculadora ilustrativa</h3>
                <DemoBadge tone="light">Estimación</DemoBadge>
              </div>
              <p className="mt-3 max-w-md leading-relaxed text-ink-400">
                Elige un plan y escribe cuántos pedidos esperas recibir al mes para estimar tu mensualidad.
              </p>

              <fieldset className="mt-7">
                <legend className="text-sm font-semibold">Plan</legend>
                <div className="mt-2.5 grid grid-cols-3 gap-1 rounded-full bg-ink-900/6 p-1">
                  {plans.map((item) => (
                    <label
                      key={item.id}
                      className={cn(
                        "flex min-h-11 cursor-pointer items-center justify-center rounded-full px-2 text-center text-[0.85rem] font-semibold transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-teal-700",
                        item.id === planId ? "bg-ink-950 text-paper" : "text-ink-500 hover:text-ink-950",
                      )}
                    >
                      <input
                        type="radio"
                        name="plan-calculadora"
                        value={item.id}
                        checked={item.id === planId}
                        onChange={() => setPlanId(item.id)}
                        className="sr-only"
                      />
                      {item.name}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="mt-6">
                <label htmlFor="pedidos-mensuales" className="text-sm font-semibold">
                  Pedidos al mes
                </label>
                <input
                  id="pedidos-mensuales"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={MAX_ORDERS}
                  step={1}
                  value={ordersText}
                  onChange={(event) => setOrdersText(event.target.value.replace(/[^\d]/g, "").slice(0, 5))}
                  aria-describedby="pedidos-ayuda"
                  className="tabular mt-2.5 h-14 w-full rounded-2xl border border-ink-900/15 bg-white px-5 font-display text-2xl font-semibold outline-none transition-colors focus:border-ink-950"
                />
                <input
                  type="range"
                  min={0}
                  max={2500}
                  step={10}
                  value={Math.min(orders, 2500)}
                  onChange={(event) => setOrdersText(event.target.value)}
                  aria-label="Pedidos al mes (control deslizante)"
                  className="mt-4 w-full accent-ink-950"
                />
                <p id="pedidos-ayuda" className="mt-1.5 text-xs text-ink-400">
                  El plan {plan.name} incluye {formatInt(plan.includedOrders)} pedidos al mes.
                </p>
              </div>
            </div>

            <div className="flex flex-col">
              <dl className="space-y-3.5 text-[0.95rem]" aria-live="polite">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-ink-400">Mensualidad base · Plan {plan.name}</dt>
                  <dd className="tabular font-semibold">{formatMXN(plan.monthly, 2)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-ink-400">Pedidos incluidos</dt>
                  <dd className="tabular font-semibold">{formatInt(plan.includedOrders)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-ink-400">
                    Pedidos adicionales
                    <span className="tabular block text-xs sm:inline sm:pl-2">
                      {formatInt(estimate.extraOrders)} × {formatMXN(plan.extraOrderFee, 2)}
                    </span>
                  </dt>
                  <dd className="tabular font-semibold">{formatMXN(estimate.extraCost, 2)}</dd>
                </div>
                <div className="border-t border-ink-900/10 pt-5">
                  <dt className="text-sm font-semibold">Estimación mensual</dt>
                  <dd className="h-display mt-2 text-[clamp(2.75rem,6vw,4.25rem)]">
                    <AnimatedNumber value={estimate.total} format={formatTotal} />
                    <span className="ml-2 font-sans text-base font-medium tracking-normal text-ink-400">MXN</span>
                  </dd>
                </div>
              </dl>

              {planId === "micro" && orders > 200 ? (
                <p role="status" className="mt-5 rounded-2xl bg-ink-900/5 p-4 text-sm leading-relaxed text-ink-500">
                  La página pública indica que, en el plan Micro, si superas los 200 pedidos desde el primer
                  mes se te avisará para cambiarte a PYME, siempre que lo autorice el representante legal o
                  quien contrató el servicio.
                </p>
              ) : null}

              <p className="mt-auto pt-6 text-xs leading-relaxed text-ink-400">
                Cálculo: mensualidad base + (pedidos que exceden los incluidos × tarifa por pedido adicional).
                Es una estimación simple con fines ilustrativos, IVA incluido; no es una cotización ni una
                condición contractual.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ---------- Resumen simulado de selección ---------- */}
      <dialog
        ref={dialogRef}
        aria-labelledby="resumen-titulo"
        className="dialog-card"
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <div className="rounded-[1.75rem] bg-paper p-7 text-ink-950 sm:p-9">
          <div className="flex items-start justify-between gap-4">
            <DemoBadge tone="light">Simulación · sin pago</DemoBadge>
            <button
              type="button"
              aria-label="Cerrar resumen"
              onClick={() => dialogRef.current?.close()}
              className="-mr-2 -mt-2 grid size-11 place-items-center rounded-full transition-colors hover:bg-ink-900/8"
            >
              <X size={18} />
            </button>
          </div>
          <h3 id="resumen-titulo" className="h-card mt-4 text-[1.9rem]">
            Seleccionaste el plan {plan.name}
          </h3>
          <dl className="mt-6 space-y-3 border-y border-ink-900/10 py-5 text-[0.95rem]">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-400">Mensualidad</dt>
              <dd className="tabular font-semibold">{formatMXN(plan.monthly)} MXN · IVA incluido</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-400">Sucursales</dt>
              <dd className="font-semibold">{plan.branches}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-400">Pedidos incluidos al mes</dt>
              <dd className="tabular font-semibold">{formatInt(plan.includedOrders)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-400">Pedido adicional</dt>
              <dd className="tabular font-semibold">{formatMXN(plan.extraOrderFee, 2)} MXN</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-400">Estimación con {formatInt(orders)} pedidos</dt>
              <dd className="tabular font-semibold">{formatMXN(estimate.total, 2)} MXN</dd>
            </div>
          </dl>
          <p className="mt-5 text-sm leading-relaxed text-ink-400">
            Este prototipo no procesa pagos, no solicita datos y no envía información. Los valores son de
            referencia al {PRICING_REFERENCE_DATE}; la contratación real se realiza en la página oficial de
            Apphouse.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button variant="dark" icon="none" onClick={() => dialogRef.current?.close()} className="px-6">
              Entendido
            </Button>
            <a
              href={OFFICIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-ink-900/20 px-6 text-[0.98rem] font-semibold transition-colors hover:border-ink-900/50"
            >
              Ir a la página oficial
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </dialog>
    </section>
  );
}
