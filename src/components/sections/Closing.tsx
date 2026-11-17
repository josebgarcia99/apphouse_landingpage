import { Button } from "@/components/ui/Button";
import { DemoButton } from "@/components/ui/DemoButton";
import { Reveal } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";

type ClosingProps = { image: string | null; imageAlt: string; focal: string };

/** Cierre de alto impacto: un establecimiento en operación y la invitación final. */
export function Closing({ image, imageAlt, focal }: ClosingProps) {
  return (
    <section
      aria-labelledby="cierre-titulo"
      className="grain relative isolate -mt-8 flex min-h-[88svh] items-end overflow-hidden rounded-t-[2rem] bg-ink-950 text-paper lg:rounded-t-[3rem]"
    >
      <div className="absolute inset-0 -z-10">
        <SmartImage src={image} alt={imageAlt} sizes="100vw" style={{ objectPosition: focal }} />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,14,14,0.96)_0%,rgba(10,14,14,0.7)_40%,rgba(10,14,14,0.35)_100%)]"
        />
      </div>

      <div className="container-x relative z-10 pb-20 pt-40 sm:pb-24 lg:pb-28">
        <Reveal>
          <p className="eyebrow flex items-center gap-3 text-paper/80">
            <span aria-hidden className="h-px w-8 bg-aqua" />
            Tu negocio en movimiento
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 id="cierre-titulo" className="h-display mt-5 max-w-[16ch] text-[clamp(2.75rem,7.6vw,7.25rem)]">
            Tu siguiente pedido puede llevar el nombre de tu negocio.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="lede mt-7 max-w-xl text-paper/85">
            Conoce cómo Apphouse puede ayudarte a crear un canal de pedidos con tu propia identidad.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <DemoButton variant="light">Explorar demostración</DemoButton>
            <Button href="#planes" variant="outline-light" icon="none" className="px-6">
              Ver planes
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
