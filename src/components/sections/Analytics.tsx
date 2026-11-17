"use client";

import { BarChart3, Table2 } from "lucide-react";
import { useMemo, useState, type CSSProperties } from "react";
import {
  AnimatedNumber,
  ChartCard,
  ColumnChart,
  HeatMap,
  RankedBars,
  StatusBar,
} from "@/components/dashboard/charts";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { branches, getAnalytics, periods, type BranchId, type PeriodId } from "@/data/analytics";
import { cn, formatInt, formatMXN } from "@/lib/utils";

/** Variables de color del dashboard. La serie y la rampa se validaron contra este fondo. */
const VIZ_VARS = {
  "--viz-surface": "#151b1a",
  "--viz-ink": "#f0efec",
  "--viz-ink-2": "#c3c2b7",
  "--viz-muted": "#8f948f",
  "--viz-grid": "#252c2b",
  "--viz-axis": "#3a4442",
  "--viz-series": "#1fa694",
  "--viz-good": "#0ca30c",
  "--viz-warning": "#fab219",
  "--viz-critical": "#d03b3b",
} as CSSProperties;

const formatSales = (value: number) => formatMXN(Math.round(value));
const formatTicket = (value: number) => formatMXN(Math.round(value));

/** Dashboard ficticio: los filtros recalculan todos los indicadores a la vez. */
export function Analytics() {
  const [period, setPeriod] = useState<PeriodId>("30d");
  const [branch, setBranch] = useState<BranchId>("todas");
  const [view, setView] = useState<"chart" | "table">("chart");

  const data = useMemo(() => getAnalytics(period, branch), [period, branch]);
  const showTable = view === "table";
  const periodLabel = periods.find((item) => item.id === period)?.label ?? "";
  const branchLabel = branches.find((item) => item.id === branch)?.label ?? "";
  const peakHour = data.hours.reduce((best, item) => (item.value > best.value ? item : best), data.hours[0]);

  return (
    <section
      id="datos"
      aria-labelledby="datos-titulo"
      className="relative -mt-8 rounded-t-[2rem] bg-ink-900 text-paper lg:rounded-t-[3rem]"
    >
      <div className="container-x pb-28 pt-20 sm:pt-28 lg:pb-40 lg:pt-36">
        <SectionHeading
          id="datos-titulo"
          eyebrow="Datos y estadísticas"
          title="Conoce mejor lo que sucede en tu negocio."
          subtitle="Pedidos, ventas, productos, horarios y zonas de demanda en un mismo lugar. Cambia el periodo o la sucursal y observa cómo responde el tablero de ejemplo."
        />

        <Reveal delay={0.1}>
          <div
            className="mt-12 rounded-[1.75rem] border border-white/10 bg-ink-950/60 p-3 sm:p-5 lg:mt-16 lg:p-6"
            style={VIZ_VARS}
          >
            {/* ---------- Encabezado y filtros (una sola fila sobre todo lo que filtran) ---------- */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-4 pt-2 sm:px-1">
              <p className="text-[0.95rem] font-semibold">
                Reportes <span className="font-normal text-stone">· Brasa Norte (marca ficticia)</span>
              </p>
              <DemoBadge>Datos ilustrativos</DemoBadge>
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-[var(--viz-surface)] p-2.5 ring-1 ring-inset ring-white/6">
              <fieldset className="flex items-center gap-1">
                <legend className="sr-only">Periodo</legend>
                {periods.map((item) => (
                  <label
                    key={item.id}
                    className={cn(
                      "cursor-pointer rounded-full px-3.5 py-2 text-[0.82rem] font-semibold transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-aqua",
                      period === item.id ? "bg-paper text-ink-950" : "text-stone hover:text-paper",
                    )}
                  >
                    <input
                      type="radio"
                      name="periodo"
                      value={item.id}
                      checked={period === item.id}
                      onChange={() => setPeriod(item.id)}
                      className="sr-only"
                    />
                    {item.label}
                  </label>
                ))}
              </fieldset>

              <span aria-hidden className="hidden h-6 w-px bg-white/10 sm:block" />

              <label className="flex items-center gap-2 text-[0.82rem] text-stone">
                <span className="sr-only sm:not-sr-only">Sucursal</span>
                <select
                  value={branch}
                  onChange={(event) => setBranch(event.target.value as BranchId)}
                  className="h-9 cursor-pointer rounded-full border border-white/12 bg-ink-800 px-3.5 pr-8 text-[0.82rem] font-semibold text-paper"
                >
                  {branches.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <div role="group" aria-label="Formato de los datos" className="ml-auto flex gap-1 rounded-full bg-ink-950/70 p-1">
                {(
                  [
                    { id: "chart", label: "Gráficas", icon: BarChart3 },
                    { id: "table", label: "Tablas", icon: Table2 },
                  ] as const
                ).map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={view === id}
                    onClick={() => setView(id)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.8rem] font-semibold transition-colors duration-200",
                      view === id ? "bg-white/12 text-paper" : "text-stone hover:text-paper",
                    )}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <p className="sr-only" role="status">
              Mostrando {periodLabel}, {branchLabel}.
            </p>

            {/* ---------- Indicadores ---------- */}
            <div className="mt-3 grid gap-3 lg:grid-cols-12">
              <section
                aria-label="Pedidos recibidos"
                className="rounded-2xl bg-[var(--viz-surface)] p-5 ring-1 ring-inset ring-white/6 sm:p-6 lg:col-span-6"
              >
                <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
                  <div>
                    <h3 className="text-[0.95rem] font-semibold">Pedidos recibidos</h3>
                    <p className="mt-2 text-[3.4rem] font-semibold leading-none tracking-[-0.03em] sm:text-[4rem]">
                      <AnimatedNumber value={data.received} format={formatInt} />
                    </p>
                  </div>
                  <p className="pb-1.5 text-[0.8rem] text-[var(--viz-muted)]">
                    Últimos {periodLabel} · {branchLabel}
                  </p>
                </div>
                <div className="mt-6">
                  <StatusBar completed={data.completed} cancelled={data.cancelled} rejected={data.rejected} />
                </div>
              </section>

              <StatTile
                label="Ventas registradas"
                caption="En pedidos completados"
                className="lg:col-span-3"
              >
                <AnimatedNumber value={data.sales} format={formatSales} />
              </StatTile>
              <StatTile label="Ticket promedio" caption="Por pedido completado" className="lg:col-span-3">
                <AnimatedNumber value={data.avgTicket} format={formatTicket} />
              </StatTile>

              {/* ---------- Gráficas ---------- */}
              <ChartCard
                title="Horarios de mayor actividad"
                subtitle={`Pedidos por hora del día · mayor actividad a las ${peakHour.label}`}
                className="lg:col-span-7"
                showTable={showTable}
                table={{
                  columns: ["Hora", "Pedidos"],
                  rows: data.hours.map((item) => [item.label, formatInt(item.value)]),
                }}
              >
                <ColumnChart data={data.hours} unit="pedidos" sparseLabels ariaLabel="Pedidos por hora del día" />
              </ChartCard>

              <ChartCard
                title="Distribución de pedidos por día"
                subtitle="Pedidos por día de la semana"
                className="lg:col-span-5"
                showTable={showTable}
                table={{
                  columns: ["Día", "Pedidos"],
                  rows: data.weekdays.map((item) => [item.label, formatInt(item.value)]),
                }}
              >
                <ColumnChart data={data.weekdays} unit="pedidos" ariaLabel="Pedidos por día de la semana" />
              </ChartCard>

              <ChartCard
                title="Productos más vendidos"
                subtitle="Unidades en pedidos completados"
                className="lg:col-span-5"
                showTable={showTable}
                table={{
                  columns: ["Producto", "Unidades"],
                  rows: data.products.map((item) => [item.label, formatInt(item.value)]),
                }}
              >
                <RankedBars data={data.products} unit="unidades" ariaLabel="Productos más vendidos" />
              </ChartCard>

              <ChartCard
                title="Zonas de demanda"
                subtitle="Mapa de calor ilustrativo de la concentración de pedidos"
                className="lg:col-span-7"
                showTable={showTable}
                table={{
                  columns: ["Zona", "Pedidos"],
                  rows: [...data.zones]
                    .sort((a, b) => b.orders - a.orders)
                    .map((zone) => [zone.name, `${formatInt(zone.orders)} (${(zone.share * 100).toFixed(0)}%)`]),
                }}
              >
                <HeatMap zones={data.zones} />
              </ChartCard>
            </div>

            <p className="px-2 pb-1 pt-4 text-xs leading-relaxed text-stone">
              Datos ilustrativos generados para este prototipo. No provienen de ninguna base de datos ni
              representan resultados de establecimientos reales. En Apphouse, cada usuario consulta la
              información que corresponde a su rol y a los permisos asignados.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

type StatTileProps = { label: string; caption: string; className?: string; children: React.ReactNode };

function StatTile({ label, caption, className, children }: StatTileProps) {
  return (
    <section
      aria-label={label}
      className={cn(
        "flex flex-col justify-between gap-6 rounded-2xl bg-[var(--viz-surface)] p-5 ring-1 ring-inset ring-white/6 sm:p-6",
        className,
      )}
    >
      <h3 className="text-[0.95rem] font-semibold">{label}</h3>
      <div>
        <p className="text-[2rem] font-semibold leading-none tracking-[-0.02em] sm:text-[2.3rem]">{children}</p>
        <p className="mt-2 text-[0.8rem] text-[var(--viz-muted)]">{caption}</p>
      </div>
    </section>
  );
}
