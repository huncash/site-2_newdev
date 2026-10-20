import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";
import "@/styles/chart-surface.css";

/** Osztály, amely minden diagramot témafüggetlen világos felületre zár. */
export const CHART_SURFACE_CLASS = "chart-container";

/**
 * Explicit világos paletta. Nem hivatkozik --foreground / --muted / --cta
 * tokenekre: azok a sötét móddal együtt cserélődnek, vagy nem érvényes színértékek.
 */
export const chartColors = {
  paper: "#FFFFFF",
  ink: "#1A1F2E",
  muted: "#6B7280",
  grid: "#E2E5EB",
  wash: "#F3F5F8",
  amber: "#E88B6A",
  amberWash: "#FDF0EC",
  cta: "#F5D76E",
  ctaDeep: "#E8B84A",
  savings: "#4CAF6E",
  primary: "#5B8FBF",
  primaryWash: "#D6E6F2",
  lens: "#F8E4DC",
} as const;

export const chartSurfaceStyle: CSSProperties = {
  colorScheme: "light",
  isolation: "isolate",
  filter: "none",
  backgroundColor: chartColors.paper,
  color: chartColors.ink,
};

/**
 * Minden diagram-gyökér ezt kapja. A color-scheme és az isolation a hívó
 * stílusa után is megmarad, hogy egy dark-mode osztály ne tudja levenni.
 */
export function chartSurfaceProps(extra?: {
  className?: string;
  style?: CSSProperties;
}): { className: string; style: CSSProperties } {
  const className = cn(CHART_SURFACE_CLASS, extra?.className);
  if (!className.split(/\s+/).includes(CHART_SURFACE_CLASS)) {
    throw new Error(
      "Diagram felület hiányzik: a komponensnek a chart-container osztályt kell viselnie.",
    );
  }
  return {
    className,
    style: {
      ...chartSurfaceStyle,
      ...extra?.style,
      colorScheme: "light",
      isolation: "isolate",
      filter: "none",
      backgroundColor: chartColors.paper,
      color: chartColors.ink,
    },
  };
}
