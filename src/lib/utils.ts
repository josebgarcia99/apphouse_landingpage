/** Une clases condicionales sin dependencias externas. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * Formatea pesos mexicanos de forma determinista (idéntica en servidor y navegador).
 * formatMXN(4000) → "$4,000" · formatMXN(7.5, 2) → "$7.50"
 */
export function formatMXN(value: number, decimals = 0): string {
  const fixed = Math.abs(value).toFixed(decimals);
  const [int, dec] = fixed.split(".");
  const withSeparators = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${value < 0 ? "-" : ""}$${withSeparators}${dec ? `.${dec}` : ""}`;
}

/** Enteros con separador de miles: 1100 → "1,100". */
export function formatInt(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
