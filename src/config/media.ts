/**
 * CONFIGURACIÓN DE RECURSOS AUDIOVISUALES
 * ------------------------------------------------------------------
 * Este archivo es el único lugar que hay que tocar para sustituir los
 * videos e imágenes del sitio. Los componentes no contienen rutas fijas.
 *
 * Cómo agregar un video del hero:
 *   1. Copia el archivo en `public/media/hero/` con el nombre indicado en `video`
 *      (por ejemplo `public/media/hero/restaurante.mp4`).
 *   2. Opcional: agrega un encuadre vertical para móvil con el sufijo `-movil`
 *      (por ejemplo `restaurante-movil.mp4`).
 *   3. Reinicia `npm run dev` (o vuelve a ejecutar `npm run build`).
 *
 * Si el archivo no existe, la escena usa su póster con un movimiento de cámara
 * suave. Nunca se genera una referencia rota ni una pantalla en negro: la
 * existencia de cada archivo se comprueba en el servidor (src/lib/media.server.ts).
 */

export type HeroSceneConfig = {
  id: string;
  /** Etiqueta corta del indicador de escenas. */
  label: string;
  /** Guion de la escena: referencia para la producción audiovisual definitiva. */
  brief: string;
  /** Ruta del video dentro de /public. Se ignora si el archivo no existe. */
  video: string;
  /** Encuadre vertical opcional para móvil. */
  videoMobile: string;
  /** Imagen de respaldo y póster del video. */
  poster: string;
  /** Texto alternativo de la imagen de respaldo. */
  alt: string;
  /** Duración de la escena en la secuencia. */
  durationMs: number;
  /** Punto de interés del encuadre (object-position) por tamaño de pantalla. */
  focal: { desktop: string; mobile: string };
  /** Dirección del movimiento de cámara cuando se usa la imagen de respaldo. */
  drift: "a" | "b";
  /**
   * Ajuste de color opcional (filtro CSS) para igualar el material provisional,
   * que proviene de fotógrafos distintos. Quitar al usar material propio ya etalonado.
   */
  grade?: string;
};

/** Secuencia completa: 5 escenas × 5.4 s = 27 s (objetivo: 20 a 30 s). */
export const heroScenes: HeroSceneConfig[] = [
  {
    id: "restaurante",
    label: "Restaurante",
    brief:
      "Un chef prepara un platillo, un empleado organiza pedidos y se observa actividad real en el establecimiento.",
    video: "/media/hero/restaurante.mp4",
    videoMobile: "/media/hero/restaurante-movil.mp4",
    poster: "/media/posters/restaurante.jpg",
    alt: "Cocinero emplatando bajo una lámpara cálida en la barra de una cocina de restaurante.",
    durationMs: 5400,
    focal: { desktop: "59% 58%", mobile: "58% 50%" },
    drift: "a",
  },
  {
    id: "cosmeticos",
    label: "Cosméticos",
    brief:
      "Una tienda de belleza con productos organizados. Una persona selecciona artículos y prepara una compra.",
    video: "/media/hero/cosmeticos.mp4",
    videoMobile: "/media/hero/cosmeticos-movil.mp4",
    poster: "/media/posters/cosmeticos.jpg",
    alt: "Clienta de espaldas frente a las estanterías iluminadas de una tienda de cosméticos.",
    durationMs: 5400,
    focal: { desktop: "56% 52%", mobile: "56% 50%" },
    drift: "b",
    grade: "saturate(0.62) brightness(0.86) contrast(1.04)",
  },
  {
    id: "ferreteria",
    label: "Ferretería",
    brief:
      "Un empleado recorre estanterías, selecciona una herramienta y organiza un pedido.",
    video: "/media/hero/ferreteria.mp4",
    videoMobile: "/media/hero/ferreteria-movil.mp4",
    poster: "/media/posters/ferreteria.jpg",
    alt: "Banco de trabajo con herramientas de mano colgadas en la pared bajo dos lámparas cálidas.",
    durationMs: 5400,
    focal: { desktop: "48% 52%", mobile: "50% 50%" },
    drift: "a",
  },
  {
    id: "autopartes",
    label: "Autopartes",
    brief:
      "Un trabajador selecciona un repuesto, revisa la pieza y la coloca sobre un mostrador.",
    video: "/media/hero/autopartes.mp4",
    videoMobile: "/media/hero/autopartes-movil.mp4",
    poster: "/media/posters/autopartes.jpg",
    alt: "Manos de un mecánico revisando una pieza metálica sobre su banco de trabajo.",
    durationMs: 5400,
    focal: { desktop: "50% 58%", mobile: "48% 50%" },
    drift: "b",
  },
  {
    id: "apphouse-experiencia",
    label: "Tu app",
    brief:
      "Un cliente utiliza su teléfono y aparece la aplicación de un establecimiento de ejemplo, con una identidad visual personalizada.",
    video: "/media/hero/apphouse-experiencia.mp4",
    videoMobile: "/media/hero/apphouse-experiencia-movil.mp4",
    poster: "/media/posters/apphouse-experiencia.jpg",
    alt: "Manos de un cliente usando su teléfono junto a un vaso de té.",
    durationMs: 5400,
    focal: { desktop: "52% 67%", mobile: "76% 60%" },
    drift: "a",
    grade: "saturate(0.8) brightness(0.8)",
  },
];

/** Fotografía editorial del selector de establecimientos. */
export const sectorMedia = {
  restaurante: {
    image: "/media/sectors/restaurante.jpg",
    alt: "Interior de un restaurante con una parrilla de leña encendida tras la barra.",
    focal: "58% 70%",
  },
  belleza: {
    image: "/media/sectors/belleza.jpg",
    alt: "Manos de una maquillista sobre una mesa con paleta de sombras, brochas y bases.",
    focal: "30% 50%",
  },
  ferreteria: {
    image: "/media/sectors/ferreteria.jpg",
    alt: "Interior de una ferretería tradicional con bandas, mangueras y vitrinas de refacciones.",
    focal: "40% 70%",
  },
  autopartes: {
    image: "/media/sectors/autopartes.jpg",
    alt: "Componentes de escape automotrices colgados sobre un panel de rejilla.",
    focal: "50% 55%",
  },
} as const;

/** Fondos cinematográficos de secciones. */
export const sectionMedia = {
  closing: {
    image: "/media/posters/cierre.jpg",
    alt: "Cafetería al anochecer: un empleado atiende a una clienta en la barra.",
    focal: "66% 53%",
  },
  demo: {
    image: "/media/posters/pedido-entrega.jpg",
    alt: "Una mano coloca una charola con hamburguesas sobre la barra de entrega de un restaurante.",
    focal: "58% 58%",
  },
} as const;
