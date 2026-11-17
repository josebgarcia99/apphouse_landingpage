"use client";

import { Check, Minus, Smartphone, Store, User } from "lucide-react";
import { motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

/** Los cuatro pilares que presenta Apphouse, cada uno con un recurso visual. */
export function Benefits() {
  return (
    <section
      id="beneficios"
      aria-labelledby="beneficios-titulo"
      className="relative -mt-8 rounded-t-[2rem] bg-paper text-ink-950 lg:rounded-t-[3rem]"
    >
      <div className="container-x pb-28 pt-20 sm:pt-28 lg:pb-40 lg:pt-36">
        <SectionHeading
          id="beneficios-titulo"
          tone="light"
          marker="terra"
          eyebrow="Beneficios comerciales"
          title="Más control sobre tu operación. Más información para decidir."
          subtitle="Los cuatro pilares de Apphouse: controla tu operación de principio a fin, vende por un canal directo y toma decisiones con los datos de tu negocio."
        />

        <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-2 lg:gap-5">
          <Pillar
            index="01"
            title="Control del establecimiento"
            text="Mantienes el control de tu catálogo, tus precios, tus pedidos y la organización de tus entregas. Cada colaborador accede a las funciones e información que corresponden a su rol."
          >
            <RolesVisual />
          </Pillar>

          <Pillar
            index="02"
            title="Canal directo sin comisiones de intermediación"
            text="Los pedidos hechos en la app de tu establecimiento no pasan por plataformas de reparto de terceros ni generan sus comisiones. Sí aplican el licenciamiento mensual de tu plan y, en su caso, los cargos por pedidos adicionales."
            delay={0.08}
          >
            <DirectChannelVisual />
          </Pillar>

          <Pillar
            index="03"
            title="Información para tomar decisiones"
            text="Reúne estadísticas de pedidos, ventas, productos, horarios y consumidores para entender qué ocurre en tu negocio y qué requiere atención."
          >
            <InsightsVisual />
          </Pillar>

          <Pillar
            index="04"
            title="Herramientas para planear crecimiento y expansión"
            text="El control de la operación y el conocimiento de la demanda aportan elementos para mejorar tu oferta, organizar recursos y evaluar nuevas zonas de atención o sucursales."
            delay={0.08}
            footnote="Apphouse apoya estas decisiones; no garantiza su resultado."
          >
            <GrowthVisual />
          </Pillar>
        </div>
      </div>
    </section>
  );
}

type PillarProps = {
  index: string;
  title: string;
  text: string;
  children: ReactNode;
  delay?: number;
  footnote?: string;
};

function Pillar({ index, title, text, children, delay = 0, footnote }: PillarProps) {
  return (
    <Reveal delay={delay} className="h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-ink-900/8 bg-white/70 transition-[border-color,background-color] duration-500 hover:border-ink-900/20 hover:bg-white">
        <div className="p-7 sm:p-9">
          <p className="tabular eyebrow text-terra-700">{index}</p>
          <h3 className="h-card mt-4 max-w-md text-[1.65rem] sm:text-[1.9rem]">{title}</h3>
          <p className="mt-4 max-w-lg leading-relaxed text-ink-400">{text}</p>
          {footnote ? <p className="mt-3 text-sm font-medium text-ink-500">{footnote}</p> : null}
        </div>
        <div className="mt-auto border-t border-ink-900/8 bg-paper/70 p-5 sm:p-7">{children}</div>
      </article>
    </Reveal>
  );
}

/* ---------------------- 01 · Accesos por rol ---------------------- */

const ROLES = [
  { id: "propietario", label: "Propietario", access: [true, true, true, true] },
  { id: "gerente", label: "Gerente", access: [true, true, true, false] },
  { id: "mostrador", label: "Mostrador", access: [true, false, false, false] },
] as const;
const AREAS = ["Pedidos", "Catálogo y precios", "Reportes", "Accesos del equipo"];

function RolesVisual() {
  const [role, setRole] = useState<(typeof ROLES)[number]["id"]>("gerente");
  const current = ROLES.find((item) => item.id === role) ?? ROLES[0];
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Rol de ejemplo" className="flex gap-1 rounded-full bg-ink-900/6 p-1">
          {ROLES.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === role}
              onClick={() => setRole(item.id)}
              className={cn(
                "rounded-full px-3.5 py-2 text-[0.82rem] font-semibold transition-colors duration-200",
                item.id === role ? "bg-ink-950 text-paper" : "text-ink-500 hover:text-ink-950",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <DemoBadge tone="light">Roles de ejemplo</DemoBadge>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2" aria-live="polite">
        {AREAS.map((area, index) => {
          const allowed = current.access[index];
          return (
            <li
              key={area}
              className={cn(
                "flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-sm font-medium transition-colors duration-300",
                allowed ? "border-ink-900/10 bg-white text-ink-900" : "border-transparent bg-ink-900/4 text-ink-400",
              )}
            >
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full transition-colors duration-300",
                  allowed ? "bg-teal-700 text-white" : "bg-ink-900/10 text-ink-400",
                )}
              >
                {allowed ? <Check size={12} strokeWidth={3} /> : <Minus size={12} strokeWidth={3} />}
              </span>
              {area}
              <span className="sr-only">{allowed ? ": con acceso" : ": sin acceso"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------------------- 02 · Canal directo ---------------------- */

function DirectChannelVisual() {
  const nodes = [
    { icon: User, label: "Tu cliente" },
    { icon: Smartphone, label: "La app de tu negocio" },
    { icon: Store, label: "Tu establecimiento" },
  ];
  return (
    <div>
      <div className="relative grid grid-cols-3 gap-2" role="img" aria-label="El pedido va de tu cliente a tu establecimiento a través de la app de tu negocio, sin plataformas intermediarias.">
        <span aria-hidden className="absolute left-[16.6%] right-[16.6%] top-6 h-px bg-ink-900/15">
          <motion.span
            className="absolute inset-y-0 left-0 w-full origin-left bg-teal-700"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />
        </span>
        {nodes.map(({ icon: Icon, label }, index) => (
          <div key={label} className="relative flex flex-col items-center gap-2.5 text-center">
            <span
              className={cn(
                "grid size-12 place-items-center rounded-full border",
                index === 1 ? "border-teal-700 bg-teal-700 text-white" : "border-ink-900/15 bg-white text-ink-900",
              )}
            >
              <Icon size={19} />
            </span>
            <span className="text-[0.82rem] font-semibold leading-tight">{label}</span>
          </div>
        ))}
      </div>
      <dl className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
        <div className="rounded-xl border border-ink-900/10 bg-white px-3.5 py-3">
          <dt className="font-semibold text-ink-900">Lo que no se genera</dt>
          <dd className="mt-0.5 text-ink-400">Comisiones de intermediación de plataformas externas.</dd>
        </div>
        <div className="rounded-xl border border-ink-900/10 bg-white px-3.5 py-3">
          <dt className="font-semibold text-ink-900">Lo que sí aplica</dt>
          <dd className="mt-0.5 text-ink-400">Mensualidad de tu plan y pedidos adicionales, si los hay.</dd>
        </div>
      </dl>
    </div>
  );
}

/* ---------------------- 03 · Información ---------------------- */

const WEEK = [
  { day: "L", value: 42 },
  { day: "M", value: 38 },
  { day: "M", value: 51 },
  { day: "J", value: 57 },
  { day: "V", value: 78 },
  { day: "S", value: 96 },
  { day: "D", value: 74 },
];

function InsightsVisual() {
  return (
    <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
      <div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold">Pedidos por día</p>
          <DemoBadge tone="light">Datos ilustrativos</DemoBadge>
        </div>
        <ul
          className="mt-4 flex h-28 items-end gap-2 border-b border-ink-900/15"
          aria-label="Pedidos por día de la semana (ejemplo): el sábado es el día con más pedidos"
        >
          {WEEK.map((item, index) => (
            <li key={`${item.day}-${index}`} className="flex h-full flex-1 items-end justify-center" aria-hidden>
              <motion.span
                className="block w-full max-w-6 origin-bottom rounded-t-[4px] bg-[#1fa694]"
                style={{ height: `${item.value}%` }}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.9, delay: 0.1 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              />
            </li>
          ))}
        </ul>
        <ul aria-hidden className="mt-1.5 flex gap-2 text-center text-[11px] text-ink-400">
          {WEEK.map((item, index) => (
            <li key={`${item.day}-label-${index}`} className="flex-1">
              {item.day}
            </li>
          ))}
        </ul>
      </div>
      <dl className="grid grid-cols-2 gap-2 sm:w-40 sm:grid-cols-1">
        <div className="rounded-xl border border-ink-900/10 bg-white px-3.5 py-3">
          <dt className="text-xs text-ink-400">Día con más pedidos</dt>
          <dd className="mt-0.5 text-lg font-semibold">Sábado</dd>
        </div>
        <div className="rounded-xl border border-ink-900/10 bg-white px-3.5 py-3">
          <dt className="text-xs text-ink-400">Hora de mayor actividad</dt>
          <dd className="mt-0.5 text-lg font-semibold">14 h</dd>
        </div>
      </dl>
    </div>
  );
}

/* ---------------------- 04 · Crecimiento ---------------------- */

function GrowthVisual() {
  return (
    <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
      <div
        role="img"
        aria-label="Plano esquemático con una sucursal actual y una zona con demanda que podría evaluarse para ampliar la cobertura."
        className="relative aspect-[16/8] overflow-hidden rounded-2xl border border-ink-900/10 bg-white"
      >
        <svg aria-hidden viewBox="0 0 160 80" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <g stroke="#101413" strokeOpacity="0.09" strokeWidth="0.7" fill="none">
            <path d="M0 20 H160 M0 44 H160 M0 64 H160 M30 0 V80 M66 0 V80 M104 0 V80 M136 0 V80" />
            <path d="M0 74 L60 26 L160 6" strokeWidth="1.1" />
          </g>
        </svg>
        {/* Zona atendida */}
        <span className="absolute left-[30%] top-[56%] size-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1fa694]/18" />
        <span className="absolute left-[30%] top-[56%] flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5">
          <span className="grid size-6 place-items-center rounded-full bg-teal-700 text-white">
            <Store size={12} />
          </span>
        </span>
        {/* Zona por evaluar */}
        <motion.span
          className="absolute left-[72%] top-[36%] size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-terra-600/70 bg-terra/10"
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
        <span className="absolute left-[72%] top-[36%] size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-terra-600" />
      </div>
      <ul className="space-y-2.5 text-sm sm:w-44">
        <li className="flex items-center gap-2.5">
          <span aria-hidden className="size-3 shrink-0 rounded-full bg-teal-700" />
          Sucursal actual
        </li>
        <li className="flex items-center gap-2.5">
          <span aria-hidden className="size-3 shrink-0 rounded-full border-2 border-dashed border-terra-600" />
          Zona con demanda por evaluar
        </li>
        <li className="pt-1">
          <DemoBadge tone="light">Ejemplo ilustrativo</DemoBadge>
        </li>
      </ul>
    </div>
  );
}
