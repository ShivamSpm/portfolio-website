"use client";

import { useInView } from "motion/react";
import * as m from "motion/react-m";
import { useRef } from "react";
import { hero } from "@/content/home";
import { ease, heroTiming, instant, rise } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

const { schematic } = hero;
const PACKET_PERIOD = 1.6;

// Step i of the build-up: layers, then arrows, then the foundation bar.
function at(step: number) {
  return heroTiming.schematic + step * 0.12;
}

// Connector between layers: horizontal from sm up, vertical on phones (the whole
// SVG rotates, so the packet follows). Packets loop only while the schematic is on
// screen and never under reduced motion.
function Arrow({ index, live, reduced }: { index: number; live: boolean; reduced: boolean }) {
  const drawDelay = at(index * 2 + 1);
  return (
    <div aria-hidden className="flex items-center justify-center text-accent">
      <svg viewBox="0 0 44 12" className="h-3 w-11 rotate-90 overflow-visible sm:rotate-0">
        <m.path
          d="M0 6h40"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={reduced ? instant : { duration: 0.5, ease, delay: drawDelay }}
        />
        <m.path
          d="M36 1.5 42 6l-6 4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduced ? instant : { duration: 0.2, delay: drawDelay + 0.4 }}
        />
        {live && !reduced && (
          <m.circle
            cx="0"
            cy="6"
            r="2.5"
            fill="currentColor"
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: [0, 34], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: PACKET_PERIOD,
              ease: "linear",
              times: [0, 0.15, 0.85, 1],
              repeat: Infinity,
              repeatDelay: 0.4,
              delay: index * (PACKET_PERIOD / 2),
            }}
          />
        )}
      </svg>
    </div>
  );
}

// "How I build" blueprint: Interface → APIs → AI agents on an AWS foundation.
export function Schematic() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  const reduced = useReducedMotion();
  const layer = (step: number) => ({
    variants: rise,
    initial: "hidden",
    animate: "visible",
    transition: reduced ? instant : { duration: 0.5, ease, delay: at(step) },
  });

  return (
    <m.figure
      ref={ref}
      role="img"
      aria-label={schematic.ariaLabel}
      className="bg-dot-grid rounded-[14px] border border-line bg-surface-2 p-5 sm:p-6"
      {...layer(0)}
    >
      <p className="label-mono text-muted">{schematic.caption}</p>

      <div className="mt-6 grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch">
        {schematic.layers.map((item, i) => (
          <div key={item.label} className="contents">
            {i > 0 && <Arrow index={i - 1} live={inView} reduced={reduced} />}
            <m.div className="rounded-lg border border-line bg-surface px-4 py-3" {...layer(i * 2)}>
              <p className="label-mono text-ink">{item.label}</p>
              <ul className="mt-2 flex flex-wrap gap-x-2 font-mono text-[12px] leading-5 text-muted sm:block">
                {item.items.map((entry) => (
                  <li key={entry}>{entry}</li>
                ))}
              </ul>
            </m.div>
          </div>
        ))}
      </div>

      <m.div
        className="mt-4 rounded-lg border border-dashed border-muted/60 px-4 py-3"
        {...layer(schematic.layers.length * 2)}
      >
        <p className="font-mono text-[12px] leading-5 text-muted">
          <span className="label-mono text-ink">{schematic.foundation.label}</span>
          <span aria-hidden> — </span>
          {schematic.foundation.items.join(" · ")}
        </p>
      </m.div>
    </m.figure>
  );
}
