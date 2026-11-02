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

/** Hero timing: headline lines first (120ms apart), then everything else. */
export const heroTiming = {
  lineStagger: 0.12,
  lineDuration: 0.8,
  status: 0.45,
  subcopy: 0.55,
  ctas: 0.65,
  schematic: 0.75,
};
