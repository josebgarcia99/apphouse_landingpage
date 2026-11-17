"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, type KeyboardEvent } from "react";
import { CatalogScreen } from "@/components/appui/CatalogScreen";
import { PhoneFrame } from "@/components/devices/PhoneFrame";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { sectorMedia } from "@/config/media";
import { sectorById, sectors, type SectorId } from "@/data/sectors";
import type { Cart } from "@/lib/order-sim";
import { cn, formatMXN } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Selector de establecimientos: al cambiar de sector se transforman la
 * fotografía, el tinte de la sección, la identidad del teléfono y el catálogo.
 */
export function Sectors() {
  const [activeId, setActiveId] = useState<SectorId>("restaurante");
  const [carts, setCarts] = useState<Partial<Record<SectorId, Cart>>>({});
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const sector = sectorById(activeId);
  const media = sectorMedia[activeId];
  const cart = carts[activeId] ?? {};

  const changeQty = (id: string, delta: number) =>
    setCarts((state) => {
      const current = { ...(state[activeId] ?? {}) };
      const qty = (current[id] ?? 0) + delta;
      if (qty <= 0) delete current[id];
      else current[id] = qty;
      return { ...state, [activeId]: current };
    });

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = sectors.length - 1;
    let target: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") target = index === last ? 0 : index + 1;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") target = index === 0 ? last : index - 1;
    if (event.key === "Home") target = 0;
    if (event.key === "End") target = last;
    if (target === null) return;
    event.preventDefault();
    setActiveId(sectors[target].id);
    tabRefs.current[target]?.focus();
  };

  return (
    <section
      id="establecimientos"
      aria-labelledby="establecimientos-titulo"
      className="relative -mt-8 rounded-t-[2rem] bg-paper text-ink-950 lg:rounded-t-[3rem]"
    >
      {/* Tinte ambiental que adopta el color del sector activo. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-t-[inherit]">
        <div
          className="absolute -right-[12%] top-[6%] size-[52rem] rounded-full opacity-[0.14] blur-[110px] transition-[background-color] duration-1000"
          style={{ backgroundColor: sector.accent }}
        />
      </div>

      <div className="container-x relative pb-28 pt-20 sm:pt-28 lg:pb-40 lg:pt-36">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="establecimientos-titulo"
            tone="light"
            marker="terra"
            eyebrow="Establecimientos de ejemplo"
            title="Cada negocio es diferente. Su aplicación también debería serlo."
            subtitle="Explora cómo una experiencia digital con identidad propia puede adaptarse a distintos tipos de comercio."
          />
          <Reveal delay={0.15} className="shrink-0">
            <DemoBadge tone="light">Marcas y datos ficticios</DemoBadge>
          </Reveal>
        </div>

        {/* ---------- Selector ---------- */}
        <Reveal delay={0.1}>
          <div
            role="tablist"
            aria-label="Tipo de establecimiento"
            className="no-scrollbar -mx-5 mt-12 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0 lg:mt-16 lg:grid lg:grid-cols-4 lg:gap-3"
          >
            {sectors.map((item, index) => {
              const selected = item.id === activeId;
              return (
                <button
                  key={item.id}
                  ref={(element) => {
                    tabRefs.current[index] = element;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${item.id}`}
                  aria-selected={selected}
                  aria-controls="panel-establecimiento"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveId(item.id)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  className={cn(
                    "relative shrink-0 rounded-2xl border px-4 py-3.5 pr-10 text-left transition-colors duration-300 lg:px-5 lg:py-4",
                    selected
                      ? "border-ink-950 bg-ink-950 text-paper"
                      : "border-ink-900/12 bg-paper/60 text-ink-900 hover:border-ink-900/45",
                  )}
                >
                  <span className="tabular block text-[0.7rem] font-semibold tracking-[0.14em] opacity-80">
                    {item.index}
                  </span>
                  <span className="h-card mt-1 block whitespace-nowrap text-[1.05rem] lg:text-[1.3rem]">
                    {item.name}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "absolute right-4 top-4 size-2 rounded-full transition-transform duration-300",
                      selected ? "scale-125" : "scale-100",
                    )}
                    style={{ backgroundColor: item.accent }}
                  />
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* ---------- Panel del sector ---------- */}
        <div
          role="tabpanel"
          id="panel-establecimiento"
          aria-labelledby={`tab-${activeId}`}
          className="mt-5 grid grid-cols-1 gap-x-8 gap-y-0 lg:mt-6 lg:grid-cols-12"
        >
          {/* Fotografía editorial */}
          <Reveal className="min-w-0 lg:col-span-8">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-ink-900 sm:aspect-[16/12] lg:aspect-auto lg:h-[680px]">
              <AnimatePresence initial={false}>
                <motion.div
                  key={activeId}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.07 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: EASE }}
                >
                  <SmartImage
                    src={media.image}
                    alt={media.alt}
                    sizes="(min-width: 1024px) 64vw, 100vw"
                    style={{ objectPosition: media.focal }}
                  />
                </motion.div>
              </AnimatePresence>
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-b from-ink-950/80 via-ink-950/15 to-ink-950/30 lg:bg-linear-to-t lg:from-ink-950/85 lg:via-ink-950/20 lg:to-transparent"
              />
              <div className="absolute inset-x-0 top-0 p-6 text-paper sm:p-8 lg:bottom-0 lg:top-auto lg:max-w-[18.5rem] xl:max-w-[26rem] xl:p-10">
                <p className="eyebrow text-paper/70">
                  {sector.index} · {sector.name}
                </p>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={activeId}
                    className="h-card mt-3 text-[1.35rem] sm:text-[1.6rem] lg:text-[1.3rem] xl:text-[1.75rem]"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    {sector.description}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Teléfono sobre la fotografía (escritorio) */}
              <div className="absolute bottom-0 right-8 top-0 hidden items-center lg:flex xl:right-14">
                <SectorPhone sectorId={activeId} cart={cart} onChange={changeQty} />
              </div>
            </div>
          </Reveal>

          {/* Teléfono bajo la fotografía (móvil y tablet) */}
          <div className="relative z-10 -mt-48 flex justify-center sm:-mt-56 lg:hidden">
            <SectorPhone sectorId={activeId} cart={cart} onChange={changeQty} />
          </div>

          {/* Identidad y catálogo */}
          <div className="mt-10 min-w-0 lg:col-span-4 lg:mt-0 lg:pt-4">
            <p className="eyebrow text-ink-400">Identidad de ejemplo</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeId}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <div className="mt-4 flex items-center gap-3.5">
                  <span
                    aria-hidden
                    className="grid size-13 shrink-0 place-items-center rounded-2xl font-display text-lg font-bold"
                    style={{ backgroundColor: sector.theme.primary, color: sector.theme.onPrimary }}
                  >
                    {sector.theme.monogram}
                  </span>
                  <div>
                    <p className="h-card text-[1.6rem]">{sector.theme.brand}</p>
                    <p className="text-sm text-ink-400">{sector.theme.tagline}</p>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <span className="flex -space-x-1.5" aria-hidden>
                    {[sector.theme.primary, sector.theme.header, sector.theme.bg, sector.theme.muted].map(
                      (color, index) => (
                        <span
                          key={`${color}-${index}`}
                          className="size-7 rounded-full ring-2 ring-paper"
                          style={{ backgroundColor: color, boxShadow: "inset 0 0 0 1px rgba(16,20,19,0.12)" }}
                        />
                      ),
                    )}
                  </span>
                  <span className="text-sm text-ink-400">Colores de la marca en su app</span>
                </div>

                <p className="eyebrow mt-10 text-ink-400">Catálogo ilustrativo</p>
                <ul
                  tabIndex={0}
                  aria-label={`Catálogo ilustrativo de ${sector.theme.brand}`}
                  className="no-scrollbar -mx-5 mt-4 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 sm:mx-0 sm:scroll-px-0 sm:px-0 lg:grid lg:grid-cols-2 lg:overflow-visible"
                >
                  {sector.products.slice(0, 4).map((product) => (
                    <li key={product.id} className="w-[44vw] max-w-[200px] shrink-0 snap-start lg:w-auto lg:max-w-none">
                      <div className="relative aspect-square overflow-hidden rounded-2xl bg-paper-300">
                        <SmartImage
                          src={product.image}
                          alt={product.name}
                          sizes="(min-width: 1024px) 14vw, 44vw"
                          fallbackClassName="bg-[linear-gradient(135deg,#e3dfd4,#cfcabd)]"
                          className="transition-transform duration-700 ease-expo hover:scale-105"
                        />
                      </div>
                      <p className="mt-2.5 text-[0.92rem] font-semibold leading-snug">{product.name}</p>
                      <p className="tabular text-sm text-ink-400">{formatMXN(product.price)}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
            <p className="mt-6 text-xs leading-relaxed text-ink-400">
              Ejemplos conceptuales: nombres, productos y precios son ficticios y no representan a
              clientes de Apphouse.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

type SectorPhoneProps = {
  sectorId: SectorId;
  cart: Cart;
  onChange: (id: string, delta: number) => void;
};

function SectorPhone({ sectorId, cart, onChange }: SectorPhoneProps) {
  const sector = sectorById(sectorId);
  return (
    <PhoneFrame label={`App de ejemplo: ${sector.theme.brand}`}>
      <AnimatePresence initial={false}>
        <motion.div
          key={sectorId}
          className="absolute inset-0"
          initial={{ opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -36 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <CatalogScreen
            sector={sector}
            cart={cart}
            onAdd={(id) => onChange(id, 1)}
            onRemove={(id) => onChange(id, -1)}
          />
        </motion.div>
      </AnimatePresence>
    </PhoneFrame>
  );
}
