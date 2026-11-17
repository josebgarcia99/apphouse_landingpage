"use client";

import { Clock, CornerDownRight } from "lucide-react";
import { motion } from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STAGES = [
  {
    title: "Elige y contrata tu plan",
    text: "Selecciona el plan que se adapta a tu negocio y completa tu contratación.",
  },
  {
    title: "Recibe tus accesos",
    text: "Recibes por correo las credenciales para ingresar a la plataforma.",
  },
  {
    title: "Personaliza la identidad de tu aplicación",
    text: "Configura tu identidad visual, tu logotipo, tu catálogo y los elementos disponibles.",
  },
  {
    title: "Comienza a recibir pedidos una vez habilitado el servicio",
    text: "Administra tu app y tus pedidos desde el panel de Apphouse.",
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;
const VIEWPORT = { once: true, margin: "0px 0px -20% 0px" } as const;

/** Activación del servicio para el negocio (distinta del recorrido de un pedido). */
export function Activation() {
  return (
    <section id="activacion" aria-labelledby="activacion-titulo" className="relative bg-paper text-ink-950">
      <div className="container-x border-t border-ink-900/10 pb-24 pt-20 sm:pt-24 lg:pb-32 lg:pt-28">
        <SectionHeading
          id="activacion-titulo"
          tone="light"
          marker="terra"
          eyebrow="Activación · Para tu negocio"
          title="Comenzar con Apphouse es sencillo."
          subtitle="Cuatro etapas, de la contratación a tu primer pedido."
        />

        <ol className="relative mt-14 grid gap-10 lg:mt-20 lg:grid-cols-4 lg:gap-8">
          {/* Línea de progreso: vertical en móvil, horizontal en escritorio */}
          <span aria-hidden className="absolute bottom-6 left-[1.4rem] top-6 w-px bg-ink-900/12 lg:bottom-auto lg:left-0 lg:right-[calc(25%-46px)] lg:top-[1.4rem] lg:h-px lg:w-auto">
            <motion.span
              className="absolute inset-0 origin-top bg-teal-700 lg:hidden"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: 1.8, ease: EASE }}
            />
            <motion.span
              className="absolute inset-0 hidden origin-left bg-teal-700 lg:block"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: 1.8, ease: EASE }}
            />
          </span>

          {STAGES.map((stage, index) => (
            <li key={stage.title} className="relative flex gap-6 lg:block">
              <motion.span
                className="tabular relative z-10 grid size-[2.8rem] shrink-0 place-items-center rounded-full border border-teal-700 bg-paper font-display text-base font-semibold text-teal-700"
                initial={{ scale: 0.6, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.6, delay: 0.25 + index * 0.3, ease: EASE }}
              >
                {index + 1}
              </motion.span>
              <Reveal delay={0.15 + index * 0.1} className="lg:mt-7">
                <h3 className="h-card max-w-[16rem] text-[1.35rem] lg:text-[1.5rem]">{stage.title}</h3>
                <p className="mt-3 max-w-[18rem] leading-relaxed text-ink-400">{stage.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal delay={0.1}>
          <div className="mt-14 grid gap-3 lg:mt-20 lg:grid-cols-2">
            <p className="flex items-start gap-3.5 rounded-2xl border border-ink-900/10 bg-white/70 p-5 leading-relaxed text-ink-500">
              <Clock size={18} className="mt-1 shrink-0 text-teal-700" />
              <span>
                La configuración y publicación de tu aplicación pueden tardar{" "}
                <strong className="font-semibold text-ink-950">hasta 30 días</strong>, sujetos al proceso de
                revisión de las tiendas de aplicaciones, conforme a la información publicada actualmente.
              </span>
            </p>
            <p className="flex items-start gap-3.5 rounded-2xl border border-ink-900/10 bg-white/70 p-5 leading-relaxed text-ink-500">
              <CornerDownRight size={18} className="mt-1 shrink-0 text-terra-700" />
              <span>
                Estas etapas describen la activación de tu servicio. El recorrido que siguen tus clientes
                para hacer un pedido se explica en{" "}
                <a href="#como-funciona" className="font-semibold text-ink-950 underline underline-offset-4">
                  Cómo funciona
                </a>
                .
              </span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
