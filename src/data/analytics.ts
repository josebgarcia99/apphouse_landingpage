/**
 * DATOS ILUSTRATIVOS DEL DASHBOARD
 * ------------------------------------------------------------------
 * Todas las cifras se generan aquí con una fórmula determinista a partir de
 * perfiles inventados por sucursal. No provienen de ninguna base de datos ni
 * representan resultados de clientes de Apphouse.
 */

export type PeriodId = "7d" | "30d" | "90d";
export type BranchId = "todas" | "centro" | "norte" | "sur";

export const periods: Array<{ id: PeriodId; label: string; days: number }> = [
  { id: "7d", label: "7 días", days: 7 },
  { id: "30d", label: "30 días", days: 30 },
  { id: "90d", label: "90 días", days: 90 },
];

export const branches: Array<{ id: BranchId; label: string }> = [
  { id: "todas", label: "Todas las sucursales" },
  { id: "centro", label: "Sucursal Centro" },
  { id: "norte", label: "Sucursal Norte" },
  { id: "sur", label: "Sucursal Sur" },
];

export const HOURS = ["11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"];
export const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
export const TOP_PRODUCTS = [
  "Tacos de arrachera",
  "Hamburguesa a la brasa",
  "Guacamole con totopos",
  "Limonada natural",
  "Churros con chocolate",
];

/** Zonas ficticias sobre un plano esquemático (coordenadas en % del mapa). */
export const ZONES = [
  { id: "centro", name: "Centro", x: 47, y: 54 },
  { id: "jardines", name: "Jardines", x: 71, y: 33 },
  { id: "reforma", name: "Reforma", x: 26, y: 30 },
  { id: "norte", name: "Norte", x: 55, y: 13 },
  { id: "industrial", name: "Industrial", x: 84, y: 70 },
  { id: "universidad", name: "Universidad", x: 21, y: 76 },
] as const;

type BranchProfile = {
  daily: number;
  ticket: number;
  cancelled: number;
  rejected: number;
  hours: number[];
  weekdays: number[];
  products: number[];
  zones: number[];
};

const PROFILES: Record<Exclude<BranchId, "todas">, BranchProfile> = {
  centro: {
    daily: 46,
    ticket: 287,
    cancelled: 0.05,
    rejected: 0.03,
    hours: [3, 6, 11, 14, 9, 5, 5, 7, 11, 13, 10, 6],
    weekdays: [10, 10, 12, 13, 17, 21, 17],
    products: [31, 24, 17, 16, 12],
    zones: [38, 17, 16, 9, 8, 12],
  },
  norte: {
    daily: 31,
    ticket: 312,
    cancelled: 0.04,
    rejected: 0.04,
    hours: [2, 4, 7, 9, 7, 5, 6, 9, 14, 17, 13, 7],
    weekdays: [9, 9, 11, 13, 18, 23, 17],
    products: [26, 29, 15, 14, 16],
    zones: [14, 29, 9, 33, 10, 5],
  },
  sur: {
    daily: 23,
    ticket: 254,
    cancelled: 0.06,
    rejected: 0.03,
    hours: [4, 8, 13, 15, 10, 6, 5, 6, 9, 11, 8, 5],
    weekdays: [12, 11, 12, 13, 16, 19, 17],
    products: [34, 19, 18, 19, 10],
    zones: [18, 8, 12, 4, 24, 34],
  },
};

/** Generador pseudoaleatorio con semilla: mismos filtros, mismas cifras. */
function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hash = (text: string) =>
  text.split("").reduce((value, char) => (Math.imul(value, 31) + char.charCodeAt(0)) >>> 0, 7);

/** Reparte un total entero según pesos, sin perder unidades por redondeo. */
function distribute(total: number, weights: number[], jitter: () => number): number[] {
  const adjusted = weights.map((weight) => weight * (0.94 + jitter() * 0.12));
  const sum = adjusted.reduce((a, b) => a + b, 0);
  const raw = adjusted.map((weight) => (weight / sum) * total);
  const result = raw.map(Math.floor);
  let remainder = total - result.reduce((a, b) => a + b, 0);
  const order = raw.map((value, index) => ({ index, frac: value - Math.floor(value) })).sort((a, b) => b.frac - a.frac);
  for (let i = 0; remainder > 0; i += 1, remainder -= 1) result[order[i % order.length].index] += 1;
  return result;
}

type BranchResult = {
  received: number;
  completed: number;
  cancelled: number;
  rejected: number;
  sales: number;
  hours: number[];
  weekdays: number[];
  products: number[];
  zones: number[];
};

function computeBranch(branch: Exclude<BranchId, "todas">, period: PeriodId): BranchResult {
  const profile = PROFILES[branch];
  const days = periods.find((item) => item.id === period)?.days ?? 30;
  const random = seeded(hash(`${branch}-${period}`));

  const received = Math.round(profile.daily * days * (0.95 + random() * 0.1));
  const cancelled = Math.round(received * profile.cancelled * (0.85 + random() * 0.3));
  const rejected = Math.round(received * profile.rejected * (0.85 + random() * 0.3));
  const completed = received - cancelled - rejected;
  const ticket = profile.ticket * (0.97 + random() * 0.06);

  return {
    received,
    completed,
    cancelled,
    rejected,
    sales: Math.round(completed * ticket),
    hours: distribute(received, profile.hours, random),
    weekdays: distribute(received, profile.weekdays, random),
    products: distribute(Math.round(completed * 1.8), profile.products, random),
    zones: distribute(received, profile.zones, random),
  };
}

const sumArrays = (arrays: number[][]) =>
  arrays[0].map((_, index) => arrays.reduce((sum, array) => sum + array[index], 0));

export type AnalyticsData = {
  received: number;
  completed: number;
  cancelled: number;
  rejected: number;
  sales: number;
  avgTicket: number;
  hours: Array<{ label: string; value: number }>;
  weekdays: Array<{ label: string; value: number }>;
  products: Array<{ label: string; value: number }>;
  zones: Array<{ id: string; name: string; x: number; y: number; orders: number; share: number }>;
};

export function getAnalytics(period: PeriodId, branch: BranchId): AnalyticsData {
  const ids = branch === "todas" ? (Object.keys(PROFILES) as Array<Exclude<BranchId, "todas">>) : [branch];
  const results = ids.map((id) => computeBranch(id, period));
  const total = (key: "received" | "completed" | "cancelled" | "rejected" | "sales") =>
    results.reduce((sum, result) => sum + result[key], 0);

  const received = total("received");
  const completed = total("completed");
  const sales = total("sales");
  const zones = sumArrays(results.map((result) => result.zones));

  return {
    received,
    completed,
    cancelled: total("cancelled"),
    rejected: total("rejected"),
    sales,
    avgTicket: completed === 0 ? 0 : sales / completed,
    hours: sumArrays(results.map((result) => result.hours)).map((value, index) => ({
      label: `${HOURS[index]} h`,
      value,
    })),
    weekdays: sumArrays(results.map((result) => result.weekdays)).map((value, index) => ({
      label: WEEKDAYS[index],
      value,
    })),
    products: sumArrays(results.map((result) => result.products))
      .map((value, index) => ({ label: TOP_PRODUCTS[index], value }))
      .sort((a, b) => b.value - a.value),
    zones: ZONES.map((zone, index) => ({
      ...zone,
      orders: zones[index],
      share: received === 0 ? 0 : zones[index] / received,
    })),
  };
}
