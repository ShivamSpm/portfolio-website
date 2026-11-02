"use client";

import type { MotionValue } from "motion/react";
import * as m from "motion/react-m";

// Instagram-style segments: done ones full, the current one fills with `progress`,
// future ones empty. Purely visual; the step counter carries the same information.
export function ProgressSegments({
  count,
  index,
  progress,
}: {
  count: number;
  index: number;
  progress: MotionValue<number>;
}) {
  return (
    <div aria-hidden className="flex gap-1.5">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-line">
          {i === index ? (
            <m.div className="h-full origin-left bg-accent" style={{ scaleX: progress }} />
          ) : (
            <div
              className="h-full origin-left bg-accent"
              style={{ transform: `scaleX(${i < index ? 1 : 0})` }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
