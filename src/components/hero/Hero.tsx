"use client";

import { Pause, Play } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { CatalogScreen } from "@/components/appui/CatalogScreen";
import { PhoneFrame } from "@/components/devices/PhoneFrame";
import { useMotionPref } from "@/components/providers/MotionProvider";
import { Button } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { restaurant } from "@/data/sectors";
import type { ResolvedHeroScene } from "@/lib/media.server";
import { cn } from "@/lib/utils";

const HEADLINE = "Haz que tu negocio tenga su propio lugar en el mundo digital.";
const PREVIEW_CART = { "r-tacos": 1, "r-limonada": 1 };
const noop = () => {};

function subscribeMobile(callback: () => void) {
  const query = window.matchMedia("(max-width: 767px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const useIsMobile = () =>
  useSyncExternalStore(
    subscribeMobile,
    () => window.matchMedia("(max-width: 767px)").matches,
    () => false,
  );

function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}
const useTabVisible = () =>
  useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "visible",
    () => true,
  );

type HeroProps = { scenes: ResolvedHeroScene[] };

/**
 * Portada cinematográfica.
 * Reproduce una secuencia de escenas (video si el archivo existe; si no, su
 * póster con un movimiento de cámara suave) con fundidos cruzados. El avance
 * lo marca una animación CSS, de modo que la pausa, la pestaña oculta y el
 * movimiento reducido detienen la secuencia sin temporizadores.
 */
export function Hero({ scenes }: HeroProps) {
  const { reduced } = useMotionPref();
  const isMobile = useIsMobile();
  const tabVisible = useTabVisible();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [cycle, setCycle] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [seen, setSeen] = useState<boolean[]>(() => scenes.map((_, index) => index <= 1));
  const [videoFailed, setVideoFailed] = useState<Record<number, boolean>>({});

  const playing = !userPaused && inView && tabVisible && !reduced;
  const scene = scenes[active];

  const goTo = (target: number) => {
    const index = (target + scenes.length) % scenes.length;
    const upcoming = (index + 1) % scenes.length;
    setPrevious(active === index ? previous : active);
    setActive(index);
    setCycle((value) => value + 1);
    setSeen((state) => state.map((value, i) => value || i === index || i === upcoming));
  };

  // La secuencia se detiene cuando el hero sale de la pantalla.
  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.2,
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Sincroniza los videos (cuando existen) con la escena activa y la pausa.
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === active && playing) {
        video.play().catch(() => {
          // El navegador bloqueó la reproducción: queda visible el póster.
        });
      } else {
        video.pause();
      }
    });
  }, [active, playing, cycle]);

  const videoFor = (index: number): string | null => {
    const item = scenes[index];
    if (reduced || videoFailed[index]) return null;
    return (isMobile && item.videoMobile) || item.video;
  };

  const words = HEADLINE.split(" ");

  return (
    <section
      id="inicio"
      ref={sectionRef}
      aria-labelledby="hero-titulo"
      className="grain relative isolate flex h-svh min-h-[640px] flex-col overflow-hidden bg-ink-950 text-paper"
    >
      {/* ---------- Secuencia de escenas ---------- */}
      <div className="absolute inset-0">
        {scenes.map((item, index) => {
          const isActive = index === active;
          const animated = isActive || index === previous;
          const video = isActive || index === previous ? videoFor(index) : null;
          const position = {
            "--pos-m": item.focal.mobile,
            "--pos-d": item.focal.desktop,
            filter: item.grade,
          } as CSSProperties;
          return (
            <div
              key={item.id}
              aria-hidden={!isActive}
              className={cn(
                "absolute inset-0 transition-opacity duration-[1600ms] ease-soft",
                isActive ? "opacity-100" : "opacity-0",
              )}
            >
              {seen[index] ? (
                <div
                  className={cn(
                    "motion-ambient absolute inset-0",
                    animated && !video && (item.drift === "a" ? "animate-kenburns-a" : "animate-kenburns-b"),
                  )}
                  style={{ animationPlayState: playing ? "running" : "paused" }}
                >
                  <SmartImage
                    src={item.poster}
                    alt={isActive ? item.alt : ""}
                    sizes="100vw"
                    preload={index === 0}
                    eager
                    className="[object-position:var(--pos-m)] md:[object-position:var(--pos-d)]"
                    style={position}
                  />
                  {video ? (
                    <video
                      ref={(element) => {
                        videoRefs.current[index] = element;
                      }}
                      key={video}
                      src={video}
                      poster={item.poster ?? undefined}
                      muted
                      loop
                      playsInline
                      preload="auto"
                      aria-hidden
                      tabIndex={-1}
                      onError={() => setVideoFailed((state) => ({ ...state, [index]: true }))}
                      className="absolute inset-0 h-full w-full object-cover [object-position:var(--pos-m)] md:[object-position:var(--pos-d)]"
                      style={position}
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* ---------- Capas de oscurecimiento para la legibilidad ---------- */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] bg-[linear-gradient(to_top,rgba(10,14,14,0.97)_0%,rgba(10,14,14,0.78)_30%,rgba(10,14,14,0.22)_62%,rgba(10,14,14,0.5)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 z-[1] bg-[linear-gradient(to_right,rgba(10,14,14,0.72)_0%,rgba(10,14,14,0.25)_52%,rgba(10,14,14,0)_100%)]"
      />

      {/* ---------- Escena E: la app de un establecimiento de ejemplo ---------- */}
      <AnimatePresence>
        {scene.id === "apphouse-experiencia" && !videoFor(active) ? (
          <motion.div
            key="preview-phone"
            inert
            aria-hidden
            className="pointer-events-none absolute bottom-[19%] right-[7%] z-[3] hidden xl:block"
            initial={{ opacity: 0, y: 70, rotate: 7 }}
            animate={{ opacity: 1, y: 0, rotate: 4 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <PhoneFrame label="App de un establecimiento de ejemplo" zoom={0.84}>
              <CatalogScreen sector={restaurant} cart={PREVIEW_CART} onAdd={noop} onRemove={noop} />
            </PhoneFrame>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* ---------- Mensaje ---------- */}
      <div className="container-x relative z-10 flex min-h-0 flex-1 flex-col justify-end pb-7 pt-24 sm:pb-9">
        <p className="eyebrow motion-ambient flex animate-fade-up items-center gap-3 text-[0.68rem] tracking-[0.12em] text-paper/90 sm:text-xs sm:tracking-[0.16em]">
          <span aria-hidden className="h-px w-6 shrink-0 bg-aqua sm:w-8" />
          Tu negocio. Tu marca. Tu propia app.
        </p>
        <h1
          id="hero-titulo"
          aria-label={HEADLINE}
          className="h-display mt-5 max-w-[19ch] text-[clamp(3rem,min(7.3vw,12.4vh),6.75rem)]"
        >
          {words.map((word, index) => (
            <span key={`${word}-${index}`} aria-hidden>
              <span className="hero-word">
                <span style={{ "--i": index } as CSSProperties}>{word}</span>
              </span>
              {index < words.length - 1 ? " " : null}
            </span>
          ))}
        </h1>
        <p className="lede motion-ambient mt-5 max-w-xl animate-fade-up text-paper/85 [animation-delay:780ms] sm:mt-6">
          Una aplicación con tu marca, tus productos y un canal directo para recibir pedidos de tus
          clientes.
        </p>
        <div className="motion-ambient mt-7 flex animate-fade-up flex-col gap-3 [animation-delay:920ms] sm:mt-8 sm:flex-row">
          <Button href="#establecimientos" variant="light">
            Explorar la experiencia
          </Button>
          <Button href="#planes" variant="outline-light" icon="none" className="px-6">
            Conocer los planes
          </Button>
        </div>
      </div>

      {/* ---------- Indicador de escenas, pausa y desplazamiento ---------- */}
      <div className="container-x relative z-10 shrink-0 pb-[calc(2.75rem+env(safe-area-inset-bottom))]">
        <div className="flex items-end gap-4 border-t border-white/15 pt-1 sm:gap-8">
          <div className="min-w-0 flex-1">
            <p className="tabular flex items-baseline gap-2 pt-3 text-[0.78rem] font-medium sm:hidden" aria-hidden>
              <span className="text-paper/55">0{active + 1}</span>
              {scene.label}
            </p>
            <ol className="flex max-w-3xl gap-2 sm:gap-5" aria-label="Escenas de la portada">
              {scenes.map((item, index) => {
                const isActive = index === active;
                return (
                  <li key={item.id} className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => goTo(index)}
                      aria-current={isActive ? "true" : undefined}
                      className="group block w-full py-3 text-left"
                    >
                      <span className="sr-only">
                        Escena {index + 1} de {scenes.length}: {item.label}
                      </span>
                      <span className="relative block h-[3px] overflow-hidden rounded-full bg-white/22">
                        {isActive ? (
                          <span
                            key={cycle}
                            className="scene-progress absolute inset-0 rounded-full bg-paper"
                            style={{
                              animationDuration: `${item.durationMs}ms`,
                              animationPlayState: playing ? "running" : "paused",
                            }}
                            onAnimationEnd={() => goTo(index + 1)}
                          />
                        ) : null}
                      </span>
                      <span aria-hidden className="mt-2.5 hidden items-baseline gap-2 text-[0.8rem] font-medium sm:flex">
                        <span className="tabular text-paper/45">0{index + 1}</span>
                        <span
                          className={cn(
                            "truncate transition-colors duration-300",
                            isActive ? "text-paper" : "text-paper/55 group-hover:text-paper/85",
                          )}
                        >
                          {item.label}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="flex shrink-0 items-center gap-4 pb-2 sm:pb-3">
            {reduced ? (
              <p className="max-w-28 text-right text-[0.7rem] leading-tight text-paper/60">
                Secuencia en pausa: movimiento reducido
              </p>
            ) : (
              <button
                type="button"
                onClick={() => setUserPaused((value) => !value)}
                aria-pressed={userPaused}
                aria-label={userPaused ? "Reproducir la secuencia" : "Pausar la secuencia"}
                className="grid size-11 place-items-center rounded-full border border-white/30 bg-white/5 backdrop-blur-sm transition-colors duration-300 hover:bg-white/15"
              >
                {userPaused ? <Play size={16} className="ml-0.5" /> : <Pause size={16} />}
              </button>
            )}
            <a
              href="#establecimientos"
              className="hidden items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-paper/70 transition-colors hover:text-paper md:flex"
            >
              Desliza
              <span aria-hidden className="relative block h-10 w-px overflow-hidden bg-white/25">
                <span className="motion-ambient absolute inset-0 animate-scroll-hint bg-paper" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
