/**
 * PEDIDOS DE DEMOSTRACIÓN
 * ------------------------------------------------------------------
 * Datos ficticios. Ninguna persona, dirección o pedido es real y nada de
 * esto se envía a ningún servidor: todo vive en el estado local del navegador.
 */
import { restaurant } from "./sectors";

export type OrderStatus =
  | "nuevo"
  | "aceptado"
  | "preparando"
  | "listo"
  | "en_camino"
  | "entregado"
  | "rechazado";

export type OrderItem = { id: string; name: string; price: number; qty: number };

export type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  /** Hora ilustrativa en la que se recibió el pedido. */
  placedAt: string;
  customer: { name: string; address: string };
  courier: string;
};

/** Recorrido normal de un pedido. "rechazado" es una salida alterna desde "nuevo". */
export const STATUS_FLOW: OrderStatus[] = [
  "nuevo",
  "aceptado",
  "preparando",
  "listo",
  "en_camino",
  "entregado",
];

type StatusMeta = {
  /** Nombre del estado en las herramientas del establecimiento. */
  label: string;
  /** Cómo lo lee el cliente en su app. */
  customer: string;
  /** Texto del botón que avanza al siguiente estado. */
  action?: string;
  /** Quién ejecuta la siguiente acción. */
  actor?: "establecimiento" | "repartidor";
  tone: "new" | "active" | "done" | "bad";
};

export const STATUS_META: Record<OrderStatus, StatusMeta> = {
  nuevo: {
    label: "Nuevo",
    customer: "Pedido enviado",
    action: "Aceptar pedido",
    actor: "establecimiento",
    tone: "new",
  },
  aceptado: {
    label: "Aceptado",
    customer: "Pedido confirmado",
    action: "Iniciar preparación",
    actor: "establecimiento",
    tone: "active",
  },
  preparando: {
    label: "En preparación",
    customer: "Preparando tu pedido",
    action: "Marcar como listo",
    actor: "establecimiento",
    tone: "active",
  },
  listo: {
    label: "Listo para entrega",
    customer: "Listo para salir",
    action: "Enviar con repartidor",
    actor: "repartidor",
    tone: "active",
  },
  en_camino: {
    label: "En camino",
    customer: "Tu pedido va en camino",
    action: "Marcar como entregado",
    actor: "repartidor",
    tone: "active",
  },
  entregado: { label: "Entregado", customer: "Pedido entregado", tone: "done" },
  rechazado: { label: "Rechazado", customer: "Pedido no aceptado", tone: "bad" },
};

export function nextStatus(status: OrderStatus): OrderStatus | null {
  const index = STATUS_FLOW.indexOf(status);
  if (index === -1 || index === STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[index + 1];
}

/** Avance de 0 a 1 dentro del recorrido (para barras y mapas). */
export function statusProgress(status: OrderStatus): number {
  const index = STATUS_FLOW.indexOf(status);
  return index === -1 ? 0 : index / (STATUS_FLOW.length - 1);
}

export const DEMO_CUSTOMER = {
  name: "Mariana R.",
  address: "Av. Ejemplo 245, Col. Centro",
};

export const DEMO_COURIER = "Luis M.";

const pick = (id: string, qty: number): OrderItem => {
  const product = restaurant.products.find((item) => item.id === id);
  if (!product) throw new Error(`Producto de ejemplo no encontrado: ${id}`);
  return { id: product.id, name: product.name, price: product.price, qty };
};

export const orderTotal = (items: OrderItem[]): number =>
  items.reduce((sum, item) => sum + item.price * item.qty, 0);

const seedItems: OrderItem[] = [pick("r-tacos", 2), pick("r-guacamole", 1), pick("r-limonada", 2)];

/** Pedido protagonista: el mismo aparece en las cuatro herramientas. */
export const seedOrder: Order = {
  id: "A-1042",
  items: seedItems,
  total: orderTotal(seedItems),
  status: "nuevo",
  placedAt: "13:42",
  customer: DEMO_CUSTOMER,
  courier: DEMO_COURIER,
};

const historyA: OrderItem[] = [pick("r-hamburguesa", 1), pick("r-limonada", 1), pick("r-churros", 1)];
const historyB: OrderItem[] = [pick("r-corte", 1), pick("r-ensalada", 1), pick("r-pay-queso", 2)];
const historyC: OrderItem[] = [pick("r-tacos", 1), pick("r-limonada", 1)];

/** Pedidos anteriores que dan contexto al panel administrativo. */
export const historyOrders: Order[] = [
  {
    id: "A-1041",
    items: historyA,
    total: orderTotal(historyA),
    status: "entregado",
    placedAt: "13:18",
    customer: { name: "Jorge T.", address: "Calle Muestra 18, Col. Jardines" },
    courier: DEMO_COURIER,
  },
  {
    id: "A-1040",
    items: historyB,
    total: orderTotal(historyB),
    status: "entregado",
    placedAt: "12:51",
    customer: { name: "Daniela P.", address: "Privada Demo 7, Col. Reforma" },
    courier: "Sofía G.",
  },
  {
    id: "A-1039",
    items: historyC,
    total: orderTotal(historyC),
    status: "rechazado",
    placedAt: "12:30",
    customer: { name: "Rubén A.", address: "Av. Ficticia 902, Col. Norte" },
    courier: DEMO_COURIER,
  },
];
