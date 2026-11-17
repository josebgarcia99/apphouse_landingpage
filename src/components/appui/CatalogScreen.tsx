"use client";

import { ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Sector } from "@/data/sectors";
import type { Cart } from "@/lib/order-sim";
import { cn, formatMXN } from "@/lib/utils";
import { ProductThumb, QtyControl, StatusBar, themeVars } from "./shared";

type CatalogScreenProps = {
  sector: Sector;
  cart: Cart;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  /** Si se define, la barra del carrito es un botón que abre el carrito. */
  onOpenCart?: () => void;
};

/** App del cliente: catálogo con la identidad del establecimiento de ejemplo. */
export function CatalogScreen({ sector, cart, onAdd, onRemove, onOpenCart }: CatalogScreenProps) {
  const [category, setCategory] = useState("Todo");
  const { theme, products } = sector;

  const visible = category === "Todo" ? products : products.filter((item) => item.category === category);
  const count = products.reduce((sum, item) => sum + (cart[item.id] ?? 0), 0);
  const total = products.reduce((sum, item) => sum + (cart[item.id] ?? 0) * item.price, 0);
  const [featured, ...rest] = visible;

  const cartSummary = (
    <>
      <span className="flex items-center gap-2">
        <span className="tabular grid size-5 place-items-center rounded-full bg-[var(--app-on-primary)] text-[10px] font-bold text-[var(--app-primary)]">
          {count}
        </span>
        {onOpenCart ? "Ver carrito" : "En tu carrito"}
      </span>
      <span className="tabular">{formatMXN(total)}</span>
    </>
  );
  const cartBarClass =
    "flex h-11 w-full items-center justify-between rounded-full bg-[var(--app-primary)] px-3 pr-4 text-[12px] font-bold text-[var(--app-on-primary)] shadow-[0_10px_24px_-10px_rgba(0,0,0,0.6)]";

  return (
    <div
      className="relative flex h-full flex-col bg-[var(--app-bg)] text-[var(--app-text)]"
      style={themeVars(theme)}
    >
      <div className="shrink-0 bg-[var(--app-header)] text-[var(--app-on-header)]">
        <StatusBar />
        <div className="flex items-center gap-2.5 px-4 pb-3 pt-2">
          <span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-[var(--app-primary)] font-display text-[11px] font-bold text-[var(--app-on-primary)]">
            {theme.monogram}
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-[15px] font-semibold leading-tight">{theme.brand}</p>
            <p className="truncate text-[10px] opacity-65">{theme.tagline}</p>
          </div>
          <span
            aria-hidden
            className="relative ml-auto grid size-9 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--app-on-header)_10%,transparent)]"
          >
            <ShoppingBag size={15} />
            {count > 0 ? (
              <span className="tabular absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--app-primary)] px-1 text-[9px] font-bold text-[var(--app-on-primary)] ring-2 ring-[var(--app-header)]">
                {count}
              </span>
            ) : null}
          </span>
        </div>
      </div>

      <div role="group" aria-label="Categorías" className="no-scrollbar flex shrink-0 gap-1.5 overflow-x-auto px-3 py-2.5">
        {["Todo", ...sector.categories].map((item) => {
          const active = item === category;
          return (
            <button
              key={item}
              type="button"
              aria-pressed={active}
              onClick={() => setCategory(item)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors duration-200",
                active
                  ? "bg-[var(--app-primary)] text-[var(--app-on-primary)]"
                  : "bg-[var(--app-surface)] text-[var(--app-muted)] ring-1 ring-inset ring-[var(--app-line)]",
              )}
            >
              {item}
            </button>
          );
        })}
      </div>

      <div
        tabIndex={0}
        role="group"
        aria-label={`Catálogo ilustrativo de ${theme.brand}`}
        className="no-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto px-3 pb-20"
      >
        {featured ? (
          <article className="overflow-hidden rounded-2xl bg-[var(--app-surface)] ring-1 ring-inset ring-[var(--app-line)]">
            <ProductThumb src={featured.image} className="h-[112px] w-full" sizes="280px" />
            <div className="flex items-end justify-between gap-2 p-3">
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--app-primary)]">
                  Destacado
                </p>
                <p className="truncate text-[13px] font-semibold leading-snug">{featured.name}</p>
                <p className="tabular text-[12px] font-semibold text-[var(--app-muted)]">
                  {formatMXN(featured.price)}
                </p>
              </div>
              <QtyControl
                qty={cart[featured.id] ?? 0}
                name={featured.name}
                onAdd={() => onAdd(featured.id)}
                onRemove={() => onRemove(featured.id)}
              />
            </div>
          </article>
        ) : null}

        {rest.map((product) => (
          <article
            key={product.id}
            className="flex items-center gap-2.5 rounded-2xl bg-[var(--app-surface)] p-2 ring-1 ring-inset ring-[var(--app-line)]"
          >
            <ProductThumb src={product.image} className="size-[58px] rounded-xl" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-semibold leading-snug">{product.name}</p>
              <p className="line-clamp-1 text-[10px] leading-snug text-[var(--app-muted)]">
                {product.description}
              </p>
              <p className="tabular mt-0.5 text-[12px] font-semibold">{formatMXN(product.price)}</p>
            </div>
            <QtyControl
              qty={cart[product.id] ?? 0}
              name={product.name}
              onAdd={() => onAdd(product.id)}
              onRemove={() => onRemove(product.id)}
            />
          </article>
        ))}
      </div>

      <AnimatePresence>
        {count > 0 ? (
          <motion.div
            key="cart-bar"
            className="absolute inset-x-3 bottom-4 z-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {onOpenCart ? (
              <button type="button" onClick={onOpenCart} className={cn(cartBarClass, "transition-transform active:scale-[0.98]")}>
                {cartSummary}
              </button>
            ) : (
              <div className={cartBarClass}>{cartSummary}</div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
