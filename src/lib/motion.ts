// Shared motion vocabulary, PLAN.md Section 2.3: 200–800ms, one easing curve,
// only transform / opacity / clip-path / pathLength.
import type { Transition, Variants } from "motion/react";

export const ease = [0.2, 0.7, 0.2, 1] as const;

/** Used in place of every transition when the visitor prefers reduced motion. */
export const instant: Transition = { duration: 0 };

/** 16px rise plus fade, for section reveals and the hero's supporting lines. */
export const rise: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function riseTransition(delay = 0): Transition {
  return { duration: 0.6, ease, delay };
}

/**
 * Hero timing in seconds: headline lines first (120ms apart), then everything else.
 * The headline, status, sub-copy and CTAs play as CSS (hero-line / hero-fade in
 * globals.css); the schematic uses motion/react.
 */
export const heroTiming = {
  lineStagger: 0.12,
  status: 0.35,
  subcopy: 0.42,
  ctas: 0.5,
  schematic: 0.6,
};

/** CSS custom property carrying a hero delay, for the hero-line / hero-fade utilities. */
export function heroDelay(seconds: number): React.CSSProperties {
  return { "--d": `${Math.round(seconds * 1000)}ms` } as React.CSSProperties;
}
