import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PhoneFrameProps = {
  children: ReactNode;
  /** Nombre accesible del dispositivo, p. ej. "Aplicación para clientes". */
  label: string;
  className?: string;
  /** Factor de escala del dispositivo completo (1 = 280 px de ancho). Admite una variable CSS. */
  zoom?: number | string;
};

/**
 * Teléfono dibujado con CSS. Las pantallas se diseñan para 262 × 572 px;
 * `zoom` escala todo el dispositivo sin alterar esas medidas internas.
 */
export function PhoneFrame({ children, label, className, zoom }: PhoneFrameProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("relative w-[280px] shrink-0", className)}
      style={zoom ? { zoom } : undefined}
    >
      {/* Botones laterales */}
      <span aria-hidden className="absolute -left-[2px] top-[104px] h-7 w-[3px] rounded-l bg-[#2a2f2e]" />
      <span aria-hidden className="absolute -left-[2px] top-[146px] h-12 w-[3px] rounded-l bg-[#2a2f2e]" />
      <span aria-hidden className="absolute -right-[2px] top-[132px] h-16 w-[3px] rounded-r bg-[#2a2f2e]" />

      <div className="relative h-[590px] rounded-[46px] bg-[#0c0f0f] p-[9px] shadow-[0_0_0_1px_rgba(255,255,255,0.1),inset_0_0_0_2px_rgba(255,255,255,0.05),0_40px_70px_-30px_rgba(0,0,0,0.75)]">
        <div className="relative h-full w-full overflow-hidden rounded-[37px] bg-black">
          {children}
          {/* Isla */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[9px] z-40 h-[21px] w-[78px] -translate-x-1/2 rounded-full bg-black"
          />
          {/* Indicador inferior */}
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-[6px] left-1/2 z-40 h-1 w-[92px] -translate-x-1/2 rounded-full bg-white/35 mix-blend-difference"
          />
        </div>
      </div>
    </div>
  );
}
