"use client";

import { Menu, X } from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useDemo } from "@/components/providers/DemoProvider";
import { ApphouseLogo } from "@/components/ui/ApphouseLogo";
import { Button } from "@/components/ui/Button";
import { navLinks } from "@/data/site";
import { cn } from "@/lib/utils";

/** Barra de navegación: transparente sobre el hero, sólida al desplazarse. */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const menuRef = useRef<HTMLDialogElement>(null);
  const { openDemo } = useDemo();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 24));

  // Resalta en el menú la sección que cruza el centro de la pantalla.
  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter((element): element is HTMLElement => element !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
          else setActive((current) => (current === entry.target.id ? null : current));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => menuRef.current?.close();

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500",
          scrolled
            ? "border-white/8 bg-ink-950/80 backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <div className="container-x flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
          <a href="#inicio" aria-label="Apphouse: ir al inicio" className="shrink-0 rounded-lg">
            <ApphouseLogo className="h-7 lg:h-8" title="" />
          </a>

          <nav aria-label="Secciones de la página" className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={active === link.id ? "true" : undefined}
                    className={cn(
                      "whitespace-nowrap rounded-full px-3 py-2 text-[0.88rem] font-medium transition-colors duration-300 xl:px-3.5 xl:text-[0.9rem]",
                      active === link.id
                        ? "bg-white/10 text-paper"
                        : "text-paper/75 hover:text-paper",
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <Button variant="light" size="md" icon="none" onClick={openDemo} className="whitespace-nowrap">
                Probar demostración
              </Button>
            </div>
            <button
              type="button"
              aria-label="Abrir menú"
              aria-haspopup="dialog"
              onClick={() => menuRef.current?.showModal()}
              className="grid size-11 place-items-center rounded-full border border-white/25 bg-white/5 text-paper backdrop-blur-sm transition-colors hover:bg-white/12 lg:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Menú móvil: <dialog> nativo (foco atrapado y cierre con Esc). */}
      <dialog ref={menuRef} aria-label="Menú principal" className="dialog-full">
        <div className="flex h-full flex-col bg-ink-950 text-paper">
          <div className="container-x flex h-16 shrink-0 items-center justify-between">
            <ApphouseLogo className="h-7" />
            <button
              type="button"
              aria-label="Cerrar menú"
              onClick={closeMenu}
              className="grid size-11 place-items-center rounded-full border border-white/25 bg-white/5"
            >
              <X size={20} />
            </button>
          </div>
          <nav aria-label="Secciones de la página" className="container-x min-h-0 flex-1 overflow-y-auto pt-4">
            <ul>
              {navLinks.map((link, index) => (
                <li key={link.id} className="border-b border-white/10">
                  <a
                    href={`#${link.id}`}
                    onClick={closeMenu}
                    className="h-display flex items-baseline gap-4 py-4 text-[2rem]"
                  >
                    <span className="tabular w-6 font-sans text-xs font-medium tracking-normal text-stone">
                      0{index + 1}
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="container-x flex shrink-0 flex-col gap-3 pb-8 pt-6">
            <Button
              variant="light"
              onClick={() => {
                closeMenu();
                openDemo();
              }}
              className="w-full justify-between"
            >
              Probar demostración
            </Button>
            <p className="text-center text-xs text-stone">Prototipo de demostración · datos ilustrativos</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
