"use client";

import { ArrowUpRight, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useMotionPref } from "@/components/providers/MotionProvider";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faq } from "@/data/faq";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/** Preguntas frecuentes: acordeón accesible (botones con aria-expanded y regiones). */
export function Faq() {
  const { reduced } = useMotionPref();
  const [open, setOpen] = useState<Record<string, boolean>>({ [faq[0].id]: true });

  return (
    <section id="preguntas" aria-labelledby="preguntas-titulo" className="relative bg-paper text-ink-950">
      <div className="container-x grid gap-12 border-t border-ink-900/10 pb-28 pt-20 sm:pt-24 lg:grid-cols-12 lg:gap-16 lg:pb-40 lg:pt-28">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              id="preguntas-titulo"
              tone="light"
              marker="terra"
              eyebrow="Preguntas frecuentes"
              title="Lo que conviene saber antes de empezar."
            />
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-sm leading-relaxed text-ink-400">
                Respuestas basadas en la información pública de Apphouse. Para condiciones vigentes y
                contratación, consulta la página oficial.
              </p>
              <a
                href={site.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold underline underline-offset-4"
              >
                Página oficial de Apphouse
                <ArrowUpRight size={16} />
              </a>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <ul className="border-t border-ink-900/15">
            {faq.map((item) => {
              const isOpen = Boolean(open[item.id]);
              return (
                <li key={item.id} className="border-b border-ink-900/15">
                  <h3>
                    <button
                      type="button"
                      id={`faq-boton-${item.id}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${item.id}`}
                      onClick={() => setOpen((state) => ({ ...state, [item.id]: !isOpen }))}
                      className="group flex w-full items-center justify-between gap-6 py-5 text-left sm:py-6"
                    >
                      <span className="h-card text-[1.2rem] sm:text-[1.4rem]">{item.question}</span>
                      <span
                        aria-hidden
                        className={cn(
                          "grid size-10 shrink-0 place-items-center rounded-full border transition-[transform,background-color,color,border-color] duration-500 ease-expo",
                          isOpen
                            ? "rotate-45 border-ink-950 bg-ink-950 text-paper"
                            : "border-ink-900/20 group-hover:border-ink-950",
                        )}
                      >
                        <Plus size={18} />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        id={`faq-panel-${item.id}`}
                        role="region"
                        aria-labelledby={`faq-boton-${item.id}`}
                        className="overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduced ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="max-w-2xl space-y-3 pb-7 pr-12 leading-relaxed text-ink-500">
                          {item.answer.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
