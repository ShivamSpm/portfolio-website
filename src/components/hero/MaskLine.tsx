"use client";

import * as m from "motion/react-m";
import { ease, heroTiming, instant } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

// One headline line rising out of a mask. The padding/negative margin pair keeps
// descenders and the italic overhang inside the clip box.
export function MaskLine({ index, children }: { index: number; children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
      <m.span
        className="block text-balance"
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={
          reduced
            ? instant
            : { duration: heroTiming.lineDuration, ease, delay: index * heroTiming.lineStagger }
        }
      >
        {children}
      </m.span>
    </span>
  );
}
