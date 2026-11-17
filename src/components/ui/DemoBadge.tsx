import { cn } from "@/lib/utils";

type DemoBadgeProps = {
  children?: string;
  tone?: "dark" | "light";
  className?: string;
};

/** Etiqueta que identifica cualquier simulación o dato ficticio. */
export function DemoBadge({ children = "Datos ilustrativos", tone = "dark", className }: DemoBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em]",
        tone === "dark"
          ? "border border-white/15 bg-white/6 text-stone"
          : "border border-ink-900/12 bg-ink-900/4 text-ink-400",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-terra" />
      {children}
    </span>
  );
}
