import { Hero } from "@/components/hero/Hero";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Activation } from "@/components/sections/Activation";
import { Analytics } from "@/components/sections/Analytics";
import { Benefits } from "@/components/sections/Benefits";
import { Closing } from "@/components/sections/Closing";
import { DemoCta } from "@/components/sections/DemoCta";
import { Faq } from "@/components/sections/Faq";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Pricing } from "@/components/sections/Pricing";
import { Sectors } from "@/components/sections/Sectors";
import { Tools } from "@/components/sections/Tools";
import { sectionMedia } from "@/config/media";
import { resolveHeroScenes, resolveImage } from "@/lib/media.server";

/**
 * Página única del prototipo. La existencia de videos e imágenes se resuelve
 * en el servidor para no enviar nunca una referencia rota al navegador.
 */
export default function Home() {
  const scenes = resolveHeroScenes();

  return (
    <>
      <Navbar />
      <main id="contenido">
        <Hero scenes={scenes} />
        <Sectors />
        <HowItWorks />
        <Tools />
        <Benefits />
        <Analytics />
        <DemoCta
          image={resolveImage(sectionMedia.demo.image)}
          imageAlt={sectionMedia.demo.alt}
          focal={sectionMedia.demo.focal}
        />
        <Pricing />
        <Activation />
        <Faq />
        <Closing
          image={resolveImage(sectionMedia.closing.image)}
          imageAlt={sectionMedia.closing.alt}
          focal={sectionMedia.closing.focal}
        />
      </main>
      <Footer />
    </>
  );
}
