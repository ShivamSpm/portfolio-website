"use client";

import * as m from "motion/react-m";
import { storyUi } from "@/content/home";
import type { StepId, WaterfallDiagramSpec } from "@/content/types";
import { ease, instant } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Illustrative durations (the caption says so). The slowest "after" call is 20% of
// the whole "before" chain, matching the real 80% drop.
const BEFORE = [150, 130, 170];
const AFTER_SHARE = 0.2;

const ROW = 26;
const GAP = 12;

type Layout = { w: number; h: number; labelX: number; x0: number; xMax: number };
const LAYOUTS: Record<"wide" | "narrow", Layout> = {
  wide: { w: 640, h: 380, labelX: 20, x0: 112, xMax: 612 },
  narrow: { w: 340, h: 380, labelX: 8, x0: 74, xMax: 330 },
};
const BEFORE_TOP = 64;
const AFTER_TOP = 232;

const ORDER: StepId[] = ["situation", "challenge", "approach", "result", "learned"];

/** Which parts are on screen at each step. Driven by step id so hidden steps can't shift it. */
function stateFor(stepId: StepId) {
  const at = ORDER.indexOf(stepId);
  return {
    beforeBracket: at >= 1,
    beforeDim: at === 2 || at === 3,
    after: at >= 2,
    afterBracket: at >= 3,
  };
}

function Bracket({
  x1,
  x2,
  y,
  show,
  className,
  reduced,
}: {
  x1: number;
  x2: number;
  y: number;
  show: boolean;
  className: string;
  reduced: boolean;
}) {
  return (
    <m.path
      d={`M${x1} ${y + 6}V${y}H${x2}V${y + 6}`}
      fill="none"
      strokeWidth={1.5}
      className={className}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
      transition={reduced ? instant : { duration: 0.6, ease }}
    />
  );
}

function Chart({
  spec,
  stepId,
  layout,
  className,
}: {
  spec: WaterfallDiagramSpec;
  stepId: StepId;
  layout: Layout;
  className: string;
}) {
  const reduced = useReducedMotion();
  const s = stateFor(stepId);
  const { w, h, labelX, x0, xMax } = layout;
  const total = BEFORE.reduce((a, b) => a + b, 0);
  const scale = (xMax - x0) / total;
  const afterFactor = (AFTER_SHARE * total) / Math.max(...BEFORE);
  const starts = BEFORE.map((_, i) => BEFORE.slice(0, i).reduce((a, b) => a + b, 0));
  const rowY = (top: number, i: number) => top + i * (ROW + GAP);
  const textProps = {
    className: "fill-muted font-mono",
    fontSize: 12,
    dominantBaseline: "middle" as const,
  };
  const sectionLabel = { className: "fill-ink font-mono", fontSize: 12, letterSpacing: "0.04em" };
  const barStyle = { originX: 0, transformBox: "fill-box" } as const;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={`${spec.alt} ${storyUi.diagramStepLabel}: ${storyUi.stepLabels[stepId]}.`}
      className={`h-full w-full ${className}`}
    >
      {/* Before: three calls, one after another. */}
      <text x={labelX} y={BEFORE_TOP - 24} {...sectionLabel}>
        {spec.before.label.toUpperCase()}
      </text>
      <Bracket
        x1={x0}
        x2={x0 + total * scale}
        y={BEFORE_TOP - 14}
        show={s.beforeBracket}
        className="stroke-muted"
        reduced={reduced}
      />
      <m.g
        animate={{ opacity: s.beforeDim ? 0.35 : 1 }}
        transition={reduced ? instant : { duration: 0.4 }}
      >
        {spec.before.bars.map((bar, i) => (
          <g key={bar}>
            <text x={labelX} y={rowY(BEFORE_TOP, i) + ROW / 2} {...textProps}>
              {bar}
            </text>
            <m.rect
              x={x0 + starts[i] * scale}
              y={rowY(BEFORE_TOP, i)}
              width={BEFORE[i] * scale}
              height={ROW}
              rx={4}
              className="fill-muted"
              style={barStyle}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              // Staircase: each bar starts when the previous one ends.
              transition={
                reduced ? instant : { duration: 0.45, ease: "linear", delay: 0.2 + i * 0.45 }
              }
            />
          </g>
        ))}
      </m.g>

      {/* After: the same calls in parallel, from t = 0. */}
      <m.text
        x={labelX}
        y={AFTER_TOP - 24}
        {...sectionLabel}
        animate={{ opacity: s.after ? 1 : 0 }}
        transition={reduced ? instant : { duration: 0.3 }}
      >
        {spec.after.label.toUpperCase()}
      </m.text>
      <Bracket
        x1={x0}
        x2={x0 + Math.max(...BEFORE) * afterFactor * scale}
        y={AFTER_TOP - 14}
        show={s.afterBracket}
        className="stroke-accent"
        reduced={reduced}
      />
      {spec.after.bars.map((bar, i) => (
        <g key={bar}>
          <m.text
            x={labelX}
            y={rowY(AFTER_TOP, i) + ROW / 2}
            {...textProps}
            animate={{ opacity: s.after ? 1 : 0 }}
            transition={reduced ? instant : { duration: 0.3 }}
          >
            {bar}
          </m.text>
          <m.rect
            x={x0}
            y={rowY(AFTER_TOP, i)}
            width={BEFORE[i] * afterFactor * scale}
            height={ROW}
            rx={4}
            className="fill-accent"
            style={barStyle}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: s.after ? 1 : 0 }}
            transition={reduced ? instant : { duration: 0.6, ease, delay: s.after ? 0.15 : 0 }}
          />
        </g>
      ))}

      {/* Time axis. */}
      <path d={`M${x0} ${h - 18}H${xMax}`} className="stroke-line" strokeWidth={1.5} fill="none" />
      <path
        d={`M${xMax - 6} ${h - 22}L${xMax} ${h - 18}L${xMax - 6} ${h - 14}`}
        className="stroke-line"
        strokeWidth={1.5}
        fill="none"
      />
    </svg>
  );
}

// Before/after request timeline for the faster-api story. Two layouts, one per
// breakpoint, so the labels stay legible on phones; CSS shows exactly one.
export function WaterfallDiagram({ spec, stepId }: { spec: WaterfallDiagramSpec; stepId: StepId }) {
  return (
    <div className="flex h-full flex-col p-4 md:p-6">
      <div className="min-h-0 flex-1">
        <Chart spec={spec} stepId={stepId} layout={LAYOUTS.narrow} className="md:hidden" />
        <Chart spec={spec} stepId={stepId} layout={LAYOUTS.wide} className="hidden md:block" />
      </div>
      <p className="mt-3 font-mono text-[12px] leading-5 text-muted">{spec.caption}</p>
    </div>
  );
}
