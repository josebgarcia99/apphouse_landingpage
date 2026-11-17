import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
  /** Color del marcador del antetítulo. */
  marker?: "aqua" | "terra";
};

/** Encabezado de sección: antetítulo, titular editorial y subtítulo. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  subtitle,
  tone = "dark",
  align = "left",
  className,
  marker = "aqua",
}: SectionHeadingProps) {
  const onDark = tone === "dark";
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-4xl", className)}>
      <Reveal>
        <p
          className={cn(
            "eyebrow flex items-center gap-3",
            align === "center" && "justify-center",
            onDark ? "text-stone" : "text-ink-400",
          )}
        >
          <span
            aria-hidden
            className={cn("h-px w-8", marker === "aqua" ? "bg-aqua" : "bg-terra")}
          />
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 id={id} className={cn("h-section mt-5", onDark ? "text-paper" : "text-ink-950")}>
          {title}
        </h2>
      </Reveal>
      {subtitle ? (
        <Reveal delay={0.12}>
          <p
            className={cn(
              "lede mt-6 max-w-2xl",
              align === "center" && "mx-auto",
              onDark ? "text-stone" : "text-ink-400",
            )}
          >
            {subtitle}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
