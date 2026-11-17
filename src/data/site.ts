import { OFFICIAL_URL } from "./plans";

export const site = {
  name: "Apphouse",
  concept: "Tu negocio en movimiento",
  officialUrl: OFFICIAL_URL,
  prototypeNotice:
    "Prototipo independiente de demostración. No es la página oficial de Apphouse, no procesa pagos ni recopila datos. Marcas de ejemplo, pedidos, cifras e imágenes son ilustrativos.",
};

export const navLinks = [
  { id: "establecimientos", label: "Establecimientos" },
  { id: "como-funciona", label: "Cómo funciona" },
  { id: "herramientas", label: "Herramientas" },
  { id: "beneficios", label: "Beneficios" },
  { id: "planes", label: "Planes" },
  { id: "preguntas", label: "Preguntas" },
] as const;

export const footerLinks = [
  { id: "establecimientos", label: "Establecimientos" },
  { id: "como-funciona", label: "Cómo funciona" },
  { id: "herramientas", label: "Las cuatro herramientas" },
  { id: "beneficios", label: "Beneficios" },
  { id: "datos", label: "Datos y estadísticas" },
  { id: "demostracion", label: "Demostración" },
  { id: "planes", label: "Planes y precios" },
  { id: "activacion", label: "Activación" },
  { id: "preguntas", label: "Preguntas frecuentes" },
] as const;
