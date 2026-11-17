"use client";

import { ArrowUpRight } from "lucide-react";
import { useMotionPref } from "@/components/providers/MotionProvider";
import { ApphouseLogo } from "@/components/ui/ApphouseLogo";
import { PRICING_REFERENCE_DATE } from "@/data/plans";
import { footerLinks, site } from "@/data/site";
import { cn } from "@/lib/utils";

/** Pie de página: enlaces, información comercial de referencia y aviso de prototipo. */
export function Footer() {
  const { userReduced, setUserReduced } = useMotionPref();

  return (
    <footer className="bg-ink-950 text-paper">
      <div className="container-x border-t border-white/10 pb-10 pt-16 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <ApphouseLogo className="h-9" />
            <p className="h-card mt-6 max-w-xs text-[1.5rem]">{site.concept}.</p>
            <a
              href={site.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-semibold transition-colors hover:border-white/50 hover:bg-white/8"
            >
              Página oficial de Apphouse
              <ArrowUpRight size={15} />
            </a>
          </div>

          <nav aria-label="Secciones de la página (pie)" className="lg:col-span-4">
            <p className="eyebrow text-stone">Secciones</p>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-1 text-[0.95rem]">
              {footerLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="inline-flex min-h-10 items-center text-paper/80 transition-colors hover:text-paper"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <p className="eyebrow text-stone">Información comercial</p>
            <ul className="mt-5 space-y-3 text-[0.95rem] leading-relaxed text-paper/80">
              <li>Servicio tecnológico por licenciamiento mensual.</li>
              <li>
                Planes Micro, PYME y Multisucursal desde $4,000 MXN al mes, IVA incluido (valores de
                referencia al {PRICING_REFERENCE_DATE}).
              </li>
              <li>Apphouse no suministra repartidores ni realiza entregas.</li>
              <li>
                Términos, aviso de privacidad y soporte: disponibles en la{" "}
                <a
                  href={site.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-paper underline underline-offset-4"
                >
                  página oficial
                </a>
                .
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 rounded-2xl border border-white/10 bg-white/4 p-5 text-sm leading-relaxed text-stone">
          <strong className="font-semibold text-paper">Aviso.</strong> {site.prototypeNotice}
        </div>

        <div className="mt-8 flex flex-col gap-5 text-xs text-stone sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl leading-relaxed">
            Fotografía provisional de Unsplash (Licencia Unsplash); créditos en{" "}
            <a href="/media/credits.json" className="underline underline-offset-4 hover:text-paper">
              /media/credits.json
            </a>
            . Tipografías Bricolage Grotesque y Figtree (SIL Open Font License).
          </p>
          <button
            type="button"
            role="switch"
            aria-checked={userReduced}
            onClick={() => setUserReduced(!userReduced)}
            className="group flex min-h-11 shrink-0 items-center gap-3 self-start rounded-full text-sm font-semibold text-paper sm:self-auto"
          >
            Reducir movimiento
            <span
              aria-hidden
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors duration-200",
                userReduced ? "bg-aqua" : "bg-white/20",
              )}
            >
              <span
                className={cn(
                  "absolute left-0.5 top-0.5 size-5 rounded-full bg-paper transition-transform duration-200",
                  userReduced ? "translate-x-5" : "translate-x-0",
                )}
              />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
