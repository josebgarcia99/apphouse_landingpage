/**
 * PLANES Y PRECIOS — VALORES DE REFERENCIA DEL PROTOTIPO
 * ------------------------------------------------------------------
 * Tomados de la página pública de Apphouse (https://apphouse.tupide.mx/)
 * el 15 de noviembre de 2026. NO son condiciones contractuales verificadas:
 * deben confirmarse con el equipo comercial antes de publicar.
 */

export type PlanId = "micro" | "pyme" | "multisucursal";

export type Plan = {
  id: PlanId;
  name: string;
  audience: string;
  /** Mensualidad en MXN, IVA incluido. */
  monthly: number;
  branches: string;
  /** Pedidos incluidos al mes. */
  includedOrders: number;
  /** Tarifa por pedido adicional en MXN, IVA incluido. */
  extraOrderFee: number;
  features: string[];
};

export const PRICING_REFERENCE_DATE = "15 de noviembre de 2026";
export const OFFICIAL_URL = "https://apphouse.tupide.mx/";

export const plans: Plan[] = [
  {
    id: "micro",
    name: "Micro",
    audience: "Para negocios con una sucursal.",
    monthly: 4000,
    branches: "Una sucursal",
    includedOrders: 100,
    extraOrderFee: 7.5,
    features: [
      "App personalizada con tu marca",
      "Catálogo digital y panel administrativo",
      "Reportes, estadísticas y soporte tecnológico",
    ],
  },
  {
    id: "pyme",
    name: "PYME",
    audience: "Para una sucursal y mayor volumen de pedidos.",
    monthly: 7650,
    branches: "Una sucursal",
    includedOrders: 350,
    extraOrderFee: 2.5,
    features: [
      "App personalizada con tu marca",
      "Catálogo digital y panel administrativo",
      "Reportes, estadísticas y soporte tecnológico",
    ],
  },
  {
    id: "multisucursal",
    name: "Multisucursal",
    audience: "Para negocios con dos o más sucursales.",
    monthly: 13500,
    branches: "Dos o más sucursales",
    includedOrders: 1100,
    extraOrderFee: 2,
    features: [
      "App personalizada para tus sucursales",
      "Catálogo digital y panel administrativo",
      "Reportes por sucursal, estadísticas y soporte tecnológico",
    ],
  },
];

export const planById = (id: PlanId): Plan => plans.find((plan) => plan.id === id) ?? plans[0];

export type Estimate = {
  extraOrders: number;
  extraCost: number;
  total: number;
};

/**
 * Estimación simple: mensualidad base + max(0, pedidos − incluidos) × tarifa adicional.
 * No incluye descuentos, paquetes ni otros conceptos.
 */
export function estimateMonthly(plan: Plan, orders: number): Estimate {
  const safeOrders = Number.isFinite(orders) ? Math.max(0, Math.floor(orders)) : 0;
  const extraOrders = Math.max(0, safeOrders - plan.includedOrders);
  const extraCost = extraOrders * plan.extraOrderFee;
  return { extraOrders, extraCost, total: plan.monthly + extraCost };
}
