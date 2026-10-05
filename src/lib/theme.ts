import { Sprout, Hammer, Scissors, Lightbulb, Sparkles, type LucideIcon } from "lucide-react";
import type { Product } from "@/types/product";

export type Swatch = {
  /** Tinted surface + readable text for chips and tiles. */
  chip: string;
  /** Saturated fill for icon bubbles. */
  solid: string;
  /** Text colour alone, for icons on neutral panels. */
  text: string;
};

// Full class strings so Tailwind can see them at build time.
export const swatches = {
  grow: { chip: "bg-grow-soft text-grow-ink", solid: "bg-grow text-white", text: "text-grow-ink" },
  build: { chip: "bg-build-soft text-build-ink", solid: "bg-build text-white", text: "text-build-ink" },
  create: { chip: "bg-create-soft text-create-ink", solid: "bg-create text-white", text: "text-create-ink" },
  design: { chip: "bg-design-soft text-design-ink", solid: "bg-design text-white", text: "text-design-ink" },
  sun: { chip: "bg-sun-soft text-sun-ink", solid: "bg-sun text-on-sun", text: "text-sun-ink" },
  sky: { chip: "bg-sky-soft text-sky-ink", solid: "bg-sky text-white", text: "text-sky-ink" },
} satisfies Record<string, Swatch>;

export type SwatchName = keyof typeof swatches;

export const categoryTheme: Record<Product["category"] | "all", { swatch: SwatchName; icon: LucideIcon }> = {
  all: { swatch: "sky", icon: Sparkles },
  grow: { swatch: "grow", icon: Sprout },
  build: { swatch: "build", icon: Hammer },
  create: { swatch: "create", icon: Scissors },
  design: { swatch: "design", icon: Lightbulb },
};
