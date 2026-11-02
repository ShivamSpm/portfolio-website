"use client";

import { animate, useMotionValue, type MotionValue } from "motion/react";
import { useEffect, useRef } from "react";

/** PLAN.md 5.3: long enough to read, never shorter than 6s. */
export function stepDuration(body: string, override?: number): number {
  if (override) return override;
  const words = body.trim().split(/\s+/).length;
  return Math.max(6000, words * 260);
}

/**
 * Drives one step's progress from 0 to 1 over `durationMs` while `running`.
 * Pausing keeps the progress where it is; resuming finishes the remaining time.
 * A new `stepKey` starts again from 0.
 */
export function useAutoAdvance({
  stepKey,
  durationMs,
  running,
  onComplete,
}: {
  stepKey: string;
  durationMs: number;
  running: boolean;
  onComplete: () => void;
}): MotionValue<number> {
  const progress = useMotionValue(0);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  // Declared before the run effect so a new step resets before it starts running.
  useEffect(() => {
    progress.set(0);
  }, [stepKey, progress]);

  useEffect(() => {
    if (!running) return;
    const remaining = (1 - progress.get()) * durationMs;
    if (remaining <= 0) return;
    const controls = animate(progress, 1, {
      duration: remaining / 1000,
      ease: "linear",
      onComplete: () => onCompleteRef.current(),
    });
    return () => controls.stop();
  }, [running, stepKey, durationMs, progress]);

  return progress;
}
