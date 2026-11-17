import { DemoBadge } from "@/components/ui/DemoBadge";
import { DemoButton } from "@/components/ui/DemoButton";
import { Reveal } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";

const FLOW = [
  "Catálogo de restaurante de ejemplo",
  "Carrito interactivo",
  "Pedido ficticio",
  "Panel de gestión",
  "Cambio de estado",
  "Vista ilustrativa de seguimiento",
];

type DemoCtaProps = { image: string | null; imageAlt: string; focal: string };

/** Invitación a la demostración local. */
export function DemoCta({ image, imageAlt, focal }: DemoCtaProps) {
  return (
    <section
      id="demostracion"
      aria-labelledby="demostracion-titulo"
      className="grain relative isolate -mt-8 overflow-hidden rounded-t-[2rem] bg-ink-950 text-paper lg:rounded-t-[3rem]"
    >
      <div className="absolute inset-0 -z-10">
        <SmartImage src={image} alt={imageAlt} sizes="100vw" style={{ objectPosition: focal }} />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(100deg,rgba(10,14,14,0.95)_0%,rgba(10,14,14,0.82)_45%,rgba(10,14,14,0.5)_100%)]"
        />
      </div>

      <div className="container-x relative z-10 grid gap-12 pb-32 pt-24 sm:pt-32 lg:grid-cols-12 lg:items-end lg:pb-44 lg:pt-40">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow flex items-center gap-3 text-paper/80">
              <span aria-hidden className="h-px w-8 bg-aqua" />
              Demostración interactiva
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2
              id="demostracion-titulo"
              className="h-display mt-5 text-[clamp(2.6rem,6.4vw,5.75rem)]"
            >
              No imagines cómo funciona. Explóralo.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="lede mt-6 max-w-xl text-paper/85">
              Descubre cómo se conectan el catálogo, los pedidos y las herramientas de gestión en una
              experiencia interactiva.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-4">
              <DemoButton>Probar demostración</DemoButton>
              <DemoBadge>Local · sin datos personales</DemoBadge>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="lg:col-span-5">
          <ol className="rounded-[1.75rem] border border-white/12 bg-ink-950/55 p-6 backdrop-blur-md sm:p-7">
            {FLOW.map((item, index) => (
              <li
                key={item}
                className="flex items-center gap-4 border-b border-white/10 py-3.5 first:pt-0 last:border-b-0 last:pb-0"
              >
                <span className="tabular text-xs font-semibold text-aqua">0{index + 1}</span>
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
