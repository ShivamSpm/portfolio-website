"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { ease } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

// "−80%" → { prefix: "−", n: 80, suffix: "%" }. Only percentages count up;
// counting through "0rd, 1rd, 2rd" would read badly, so "3rd" stays still.
function parse(value: string) {
  const m = value.match(/^(\D*)(\d+)(%)$/);
  return m ? { prefix: m[1], n: Number(m[2]), suffix: m[3] } : null;
}

// The server renders the final value, so crawlers, screen readers and no-JS
// visitors always get the real number. The visible digits count up once, in view.
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    const parts = parse(value);
    if (!el || !parts || reduced || !inView) return;
    const { prefix, n, suffix } = parts;
    const controls = animate(0, n, {
      duration: 1.2,
      ease,
      onUpdate: (v) => {
        el.textContent = `${prefix}${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduced, value]);

  return (
    <span className={className}>
      <span className="sr-only">{value}</span>
      <span ref={ref} aria-hidden>
        {value}
      </span>
    </span>
  );
}
