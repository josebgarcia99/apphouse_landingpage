/**
 * ESTABLECIMIENTOS DE EJEMPLO
 * ------------------------------------------------------------------
 * Todas las marcas, productos y precios de este archivo son FICTICIOS y se
 * usan solo para ilustrar cómo una app puede adoptar la identidad de un
 * negocio. No describen clientes reales de Apphouse ni afirman compatibilidad
 * con requisitos especializados de ningún giro.
 */

export type SectorId = "restaurante" | "belleza" | "ferreteria" | "autopartes";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

/** Identidad visual de la app de ejemplo (se aplica como variables CSS). */
export type AppTheme = {
  brand: string;
  tagline: string;
  monogram: string;
  bg: string;
  surface: string;
  text: string;
  muted: string;
  line: string;
  primary: string;
  onPrimary: string;
  /** Color del encabezado de la app. */
  header: string;
  onHeader: string;
};

export type Sector = {
  id: SectorId;
  index: string;
  name: string;
  description: string;
  /** Tinte que adopta la sección al seleccionar el sector. */
  accent: string;
  theme: AppTheme;
  categories: string[];
  products: Product[];
};

const img = (file: string) => `/media/product/${file}.webp`;

export const sectors: Sector[] = [
  {
    id: "restaurante",
    index: "01",
    name: "Restaurante",
    description:
      "El menú del día, las categorías y las fotografías de cada platillo, presentados con el carácter de la casa.",
    accent: "#ee8260",
    theme: {
      brand: "Brasa Norte",
      tagline: "Cocina a la leña",
      monogram: "BN",
      bg: "#17110e",
      surface: "#231a15",
      text: "#f6ede4",
      muted: "#b3a296",
      line: "rgba(246,237,228,0.09)",
      primary: "#ee8260",
      onPrimary: "#1b120d",
      header: "#17110e",
      onHeader: "#f6ede4",
    },
    categories: ["Parrilla", "Entradas", "Bebidas", "Postres"],
    products: [
      {
        id: "r-tacos",
        name: "Tacos de arrachera",
        description: "Tres piezas en tortilla de maíz con salsa de la casa.",
        price: 149,
        category: "Parrilla",
        image: img("r-tacos"),
      },
      {
        id: "r-hamburguesa",
        name: "Hamburguesa a la brasa",
        description: "Res a la leña, queso fundido y pan artesanal.",
        price: 169,
        category: "Parrilla",
        image: img("r-hamburguesa"),
      },
      {
        id: "r-corte",
        name: "Corte a la leña",
        description: "Corte de res al carbón con guarnición del día.",
        price: 289,
        category: "Parrilla",
        image: img("r-corte"),
      },
      {
        id: "r-guacamole",
        name: "Guacamole con totopos",
        description: "Aguacate martajado, pico de gallo y totopos.",
        price: 95,
        category: "Entradas",
        image: img("r-guacamole"),
      },
      {
        id: "r-ensalada",
        name: "Bowl de la casa",
        description: "Aguacate, garbanzos, quinoa y vegetales.",
        price: 109,
        category: "Entradas",
        image: img("r-ensalada"),
      },
      {
        id: "r-limonada",
        name: "Limonada natural",
        description: "Vaso de 500 ml con hielo.",
        price: 45,
        category: "Bebidas",
        image: img("r-limonada"),
      },
      {
        id: "r-churros",
        name: "Churros con chocolate",
        description: "Orden recién hecha con chocolate caliente.",
        price: 79,
        category: "Postres",
        image: img("r-churros"),
      },
      {
        id: "r-pay-queso",
        name: "Pay de queso",
        description: "Rebanada con frutos rojos.",
        price: 85,
        category: "Postres",
        image: img("r-pay-queso"),
      },
    ],
  },
  {
    id: "belleza",
    index: "02",
    name: "Belleza y cosméticos",
    description:
      "Un catálogo cuidado, ordenado por línea y con el tono de la marca, para que cada producto se vea como en el aparador.",
    accent: "#c2587c",
    theme: {
      brand: "Lúmina",
      tagline: "Belleza y cuidado personal",
      monogram: "L",
      bg: "#fbf3ef",
      surface: "#ffffff",
      text: "#2c1c22",
      muted: "#8d747b",
      line: "rgba(44,28,34,0.09)",
      primary: "#b4476b",
      onPrimary: "#ffffff",
      header: "#fbf3ef",
      onHeader: "#2c1c22",
    },
    categories: ["Rostro", "Maquillaje"],
    products: [
      {
        id: "b-serum",
        name: "Sérum hidratante",
        description: "Frasco con gotero de 30 ml.",
        price: 389,
        category: "Rostro",
        image: img("b-serum"),
      },
      {
        id: "b-crema",
        name: "Crema facial",
        description: "Tarro de 50 ml para uso diario.",
        price: 349,
        category: "Rostro",
        image: img("b-crema"),
      },
      {
        id: "b-labial",
        name: "Labial mate",
        description: "Acabado mate de larga duración.",
        price: 219,
        category: "Maquillaje",
        image: img("b-labial"),
      },
      {
        id: "b-sombras",
        name: "Paleta de sombras",
        description: "Tonos neutros para todos los días.",
        price: 459,
        category: "Maquillaje",
        image: img("b-sombras"),
      },
    ],
  },
  {
    id: "ferreteria",
    index: "03",
    name: "Ferretería",
    description:
      "Herramientas y materiales organizados por categoría, con precios visibles y pedidos listos para preparar en mostrador.",
    accent: "#e2a21b",
    theme: {
      brand: "La Escuadra",
      tagline: "Ferretería y herramientas",
      monogram: "LE",
      bg: "#f3f1ea",
      surface: "#ffffff",
      text: "#1d1d1a",
      muted: "#716e64",
      line: "rgba(29,29,26,0.1)",
      primary: "#f2b01e",
      onPrimary: "#1d1d1a",
      header: "#1d1d1a",
      onHeader: "#f8f5ea",
    },
    categories: ["Eléctricas", "Manuales"],
    products: [
      {
        id: "f-taladro",
        name: "Taladro inalámbrico",
        description: "Con batería recargable y estuche.",
        price: 1899,
        category: "Eléctricas",
        image: img("f-taladro"),
      },
      {
        id: "f-desarmadores",
        name: "Juego de desarmadores",
        description: "Puntas planas y de cruz.",
        price: 329,
        category: "Manuales",
        image: img("f-desarmadores"),
      },
      {
        id: "f-martillo",
        name: "Martillo de uña",
        description: "Mango ergonómico de 16 oz.",
        price: 189,
        category: "Manuales",
        image: img("f-martillo"),
      },
      {
        id: "f-cinta",
        name: "Cinta métrica",
        description: "Flexómetro de 8 metros.",
        price: 129,
        category: "Manuales",
        image: img("f-cinta"),
      },
    ],
  },
  {
    id: "autopartes",
    index: "04",
    name: "Autopartes",
    description:
      "Refacciones presentadas con claridad, para que tus clientes encuentren la pieza y la pidan directamente a tu mostrador.",
    accent: "#5b8def",
    theme: {
      brand: "Vértice",
      tagline: "Refacciones y autopartes",
      monogram: "V",
      bg: "#0e131a",
      surface: "#171f2a",
      text: "#eef2f7",
      muted: "#8e9aab",
      line: "rgba(238,242,247,0.09)",
      primary: "#5b8def",
      onPrimary: "#0b1017",
      header: "#0e131a",
      onHeader: "#eef2f7",
    },
    categories: ["Frenos", "Motor"],
    products: [
      {
        id: "a-balatas",
        name: "Disco de freno",
        description: "Disco ventilado para eje delantero.",
        price: 1249,
        category: "Frenos",
        image: img("a-balatas"),
      },
      {
        id: "a-filtro",
        name: "Filtro de aire",
        description: "Filtro cónico de alto flujo.",
        price: 689,
        category: "Motor",
        image: img("a-filtro"),
      },
      {
        id: "a-bujias",
        name: "Bujías",
        description: "Juego de cuatro piezas.",
        price: 389,
        category: "Motor",
        image: img("a-bujias"),
      },
      {
        id: "a-aceite",
        name: "Aceite para motor",
        description: "Botella de un litro.",
        price: 219,
        category: "Motor",
        image: img("a-aceite"),
      },
    ],
  },
];

export const sectorById = (id: SectorId): Sector =>
  sectors.find((sector) => sector.id === id) ?? sectors[0];

/** El restaurante de ejemplo protagoniza el recorrido, las herramientas y la demo. */
export const restaurant = sectors[0];
