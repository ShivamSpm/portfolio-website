"use client";

import { useReducedMotion as useMotionReducedMotion } from "motion/react";

/**
 * True when the visitor prefers reduced motion. Components keep the same `initial`
 * state on server and client (so hydration matches) and swap in `instant`
 * transitions instead, so everything lands in its final state with no movement.
 */
export function useReducedMotion(): boolean {
  return useMotionReducedMotion() ?? false;
}
