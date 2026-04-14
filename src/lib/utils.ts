import { type ClassValue, clsx } from "clsx";

/** Merge Tailwind class names safely */
export function cn(...inputs: ClassValue[]) {
  // Lightweight merge — install `clsx` for full support
  return inputs.filter(Boolean).join(" ");
}

/** Format a percentage number with a % sign */
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

/** Capitalize first letter */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
