import { ArrowRight, ArrowUpRight, Play } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "light" | "dark" | "accent" | "outline-light" | "outline-dark";
type Size = "md" | "lg";
type Icon = "arrow" | "external" | "play" | "none";

const variants: Record<Variant, string> = {
  light: "bg-paper text-ink-950 hover:bg-white",
  dark: "bg-ink-950 text-paper hover:bg-ink-600",
  accent: "bg-aqua text-ink-950 hover:bg-aqua-300",
  "outline-light":
    "border border-white/30 bg-white/5 text-paper backdrop-blur-sm hover:border-white/60 hover:bg-white/12",
  "outline-dark":
    "border border-ink-900/20 text-ink-900 hover:border-ink-900/50 hover:bg-ink-900/5",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 text-[0.9rem]",
  lg: "min-h-13 px-6 text-[0.98rem]",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: Icon;
  className?: string;
};

type ButtonProps = CommonProps &
  (
    | { href: string; external?: boolean; onClick?: never; type?: never; disabled?: never }
    | {
        href?: never;
        external?: never;
        onClick?: () => void;
        type?: "button" | "submit";
        disabled?: boolean;
      }
  );

const iconMap = { arrow: ArrowRight, external: ArrowUpRight, play: Play } as const;

/** Botón principal del sitio. Con `href` se renderiza como enlace. */
export function Button({
  children,
  variant = "light",
  size = "lg",
  icon = "arrow",
  className,
  ...rest
}: ButtonProps) {
  const classes = cn(
    "group inline-flex items-center justify-center gap-2.5 rounded-full font-semibold tracking-[-0.01em]",
    "transition-[background-color,border-color,color,transform] duration-300 ease-expo active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-45",
    variants[variant],
    sizes[size],
    icon !== "none" && "pr-2.5",
    className,
  );

  const IconComponent = icon === "none" ? null : iconMap[icon];
  const content = (
    <>
      <span>{children}</span>
      {IconComponent ? (
        <span
          aria-hidden
          className={cn(
            "grid size-8 place-items-center rounded-full transition-transform duration-300 ease-expo",
            icon === "play" ? "group-hover:scale-110" : "group-hover:translate-x-0.5",
            variant === "light" || variant === "accent"
              ? "bg-ink-950 text-paper"
              : variant === "dark"
                ? "bg-paper text-ink-950"
                : variant === "outline-light"
                  ? "bg-white/15 text-paper"
                  : "bg-ink-900/10 text-ink-900",
          )}
        >
          <IconComponent size={15} strokeWidth={2.4} className={icon === "play" ? "ml-0.5" : ""} />
        </span>
      ) : null}
    </>
  );

  if ("href" in rest && rest.href) {
    return (
      <a
        href={rest.href}
        className={classes}
        {...(rest.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={rest.type ?? "button"}
      onClick={rest.onClick}
      disabled={rest.disabled}
      className={classes}
    >
      {content}
    </button>
  );
}
