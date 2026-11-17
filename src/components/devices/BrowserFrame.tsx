import { Lock } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BrowserFrameProps = {
  children: ReactNode;
  label: string;
  /** Texto ilustrativo de la barra de direcciones. */
  address?: string;
  className?: string;
};

/** Ventana de escritorio para el panel administrativo. */
export function BrowserFrame({
  children,
  label,
  address = "panel de administración · demo local",
  className,
}: BrowserFrameProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "flex flex-col overflow-hidden rounded-[18px] bg-[#1b2221] shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_40px_80px_-35px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      <div aria-hidden className="flex h-9 shrink-0 items-center gap-3 px-3.5">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
        </span>
        <span className="mx-auto flex h-[22px] min-w-0 max-w-[70%] flex-1 items-center justify-center gap-1.5 rounded-md bg-black/30 px-3 text-[10.5px] text-white/55">
          <Lock size={9} />
          <span className="truncate">{address}</span>
        </span>
        <span className="w-[42px]" />
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}
