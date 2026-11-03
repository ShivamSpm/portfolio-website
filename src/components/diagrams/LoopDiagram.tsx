"use client";

import { useInView } from "motion/react";
import * as m from "motion/react-m";
import { useRef } from "react";
import { storyUi } from "@/content/home";
import type { LoopDiagramSpec, StepId } from "@/content/types";
import { ease, instant } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import {
  LABEL_SIZE,
  SUB_SIZE,
  arrowD,
  nodeShape,
  pathD,
  r2,
  textRows,
  wrap,
  type NodeShape,
  type Point,
} from "./flow/geometry";
import { PhotoStrip } from "./PhotoStrip";

type Mode = "loop" | "panels" | "photos";

// Situation and the last steps show the loop; Challenge shows the two challenge
// flows; Result shows the photos (or the big "3rd").
function modeFor(stepId: StepId): Mode {
  if (stepId === "challenge") return "panels";
  if (stepId === "result") return "photos";
  return "loop";
}

function Pill({
  s,
  accent = false,
  delay = 0,
}: {
  s: NodeShape;
  accent?: boolean;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <m.g
      style={{ transformBox: "fill-box", originX: 0.5, originY: 0.5 }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={reduced ? instant : { duration: 0.4, ease, delay }}
    >
      <rect
        x={s.x0}
        y={s.y0}
        width={s.w}
        height={s.h}
        rx={10}
        strokeWidth={accent ? 1.75 : 1}
        className={`fill-surface ${accent ? "stroke-accent" : "stroke-line"}`}
      />
      {textRows(s).map((row, i) => (
        <text
          key={i}
          x={s.cx}
          y={row.y}
          textAnchor="middle"
          fontSize={LABEL_SIZE}
          className="fill-ink font-sans font-medium"
        >
          {row.text}
        </text>
      ))}
    </m.g>
  );
}

function LoopPacket({ points, duration }: { points: Point[]; duration: number }) {
  return (
    <m.circle
      r={4}
      cx={0}
      cy={0}
      className="fill-accent"
      initial={{ x: points[0][0], y: points[0][1] }}
      animate={{ x: points.map((p) => p[0]), y: points.map((p) => p[1]) }}
      transition={{ duration, ease: "linear", repeat: Infinity }}
    />
  );
}

function CenterLabel({ text, x, y }: { text: string; x: number; y: number }) {
  const lines = wrap(text, 22);
  return (
    <text
      x={x}
      y={y - ((lines.length - 1) * 16) / 2}
      textAnchor="middle"
      fontSize={SUB_SIZE}
      className="fill-accent font-mono"
    >
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : 16}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

// Wide: the steps sit on an ellipse, travelled clockwise.
function WideLoop({ spec, moving }: { spec: LoopDiagramSpec; moving: boolean }) {
  const [cx, cy, rx, ry] = [340, 200, 250, 140];
  const n = spec.steps.length;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const at = (a: number): Point => [r2(cx + rx * Math.cos(a)), r2(cy + ry * Math.sin(a))];
  const shapes = spec.steps.map((label, i) => {
    const [x, y] = at(angle(i));
    return nodeShape(label, undefined, x, y, 128);
  });
  const chevrons = spec.steps.map((_, i) => {
    const a = angle(i) + Math.PI / n;
    const p = at(a);
    const tangent: Point = [-rx * Math.sin(a), ry * Math.cos(a)];
    const len = Math.hypot(...tangent);
    return arrowD([[p[0] - (tangent[0] / len) * 6, p[1] - (tangent[1] / len) * 6], p], 7);
  });
  const [last, first] = [at(angle(n - 1)), at(angle(0))];
  const track: Point[] = Array.from({ length: 73 }, (_, i) =>
    at(-Math.PI / 2 + (i * 2 * Math.PI) / 72),
  );
  return (
    <svg viewBox="0 0 680 400" className="h-auto w-full" aria-hidden>
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill="none"
        strokeWidth={1.5}
        className="stroke-muted"
      />
      {/* The loop back to the spec, from the last check to the first step. */}
      <path
        d={`M${last[0]} ${last[1]}A${rx} ${ry} 0 0 1 ${first[0]} ${first[1]}`}
        fill="none"
        strokeWidth={2}
        strokeDasharray="5 5"
        className="stroke-accent"
      />
      {chevrons.map((d, i) => (
        <path key={i} d={d} fill="none" strokeWidth={1.5} className="stroke-muted" />
      ))}
      <CenterLabel text={spec.loopBackLabel} x={cx} y={cy} />
      {shapes.map((s, i) => (
        <Pill key={spec.steps[i]} s={s} accent={i === 0} delay={i * 0.06} />
      ))}
      {moving && <LoopPacket points={track} duration={9} />}
    </svg>
  );
}

// Narrow: the steps stack top to bottom; the loop returns up the left edge.
function NarrowLoop({ spec, moving }: { spec: LoopDiagramSpec; moving: boolean }) {
  const x = 200;
  const shapes = spec.steps.map((label, i) => nodeShape(label, undefined, x, 34 + i * 60, 220));
  const lastS = shapes[shapes.length - 1];
  const back: Point[] = [
    [lastS.x0, lastS.cy],
    [40, lastS.cy],
    [40, shapes[0].cy],
    [shapes[0].x0, shapes[0].cy],
  ];
  const labelY = lastS.y1 + 34;
  return (
    <svg viewBox={`0 0 340 ${labelY + 30}`} className="h-auto w-full" aria-hidden>
      {shapes.slice(1).map((s, i) => {
        const pts: Point[] = [
          [x, shapes[i].y1],
          [x, s.y0],
        ];
        return (
          <g key={i}>
            <path d={pathD(pts)} fill="none" strokeWidth={1.5} className="stroke-muted" />
            <path d={arrowD(pts)} fill="none" strokeWidth={1.5} className="stroke-muted" />
          </g>
        );
      })}
      <path
        d={pathD(back)}
        fill="none"
        strokeWidth={2}
        strokeDasharray="5 5"
        className="stroke-accent"
      />
      <path d={arrowD(back)} fill="none" strokeWidth={2} className="stroke-accent" />
      <CenterLabel text={spec.loopBackLabel} x={190} y={labelY} />
      {shapes.map((s, i) => (
        <Pill key={spec.steps[i]} s={s} accent={i === 0} delay={i * 0.06} />
      ))}
      {moving && (
        <LoopPacket points={[[x, shapes[0].cy], [x, lastS.cy], ...back.slice(1)]} duration={8} />
      )}
    </svg>
  );
}

// Stacks each panel's steps under its title: side by side when wide, one after
// the other when narrow. Returns the columns and the total height.
function panelLayout(spec: LoopDiagramSpec, narrow: boolean) {
  const GAP = 24;
  const columns: {
    panel: LoopDiagramSpec["panels"][number];
    x: number;
    titleY: number;
    shapes: NodeShape[];
  }[] = [];
  let y = 0;
  let height = 0;
  spec.panels.forEach((panel, p) => {
    const x = narrow ? 170 : p === 0 ? 175 : 505;
    const w = narrow ? 300 : 270;
    if (!narrow) y = 0;
    const titleY = y + 22;
    y = titleY + 18;
    const shapes: NodeShape[] = [];
    for (const label of panel.steps) {
      const probe = nodeShape(label, undefined, x, 0, w);
      const s = nodeShape(label, undefined, x, y + probe.h / 2, w);
      shapes.push(s);
      y = s.y1 + GAP;
    }
    height = Math.max(height, y);
    y += 16;
    columns.push({ panel, x, titleY, shapes });
  });
  return { columns, height };
}

// The two challenge flows, side by side (wide) or stacked (narrow).
function Panels({ spec, narrow }: { spec: LoopDiagramSpec; narrow: boolean }) {
  const { columns, height } = panelLayout(spec, narrow);
  return (
    <svg viewBox={`0 0 ${narrow ? 340 : 680} ${height}`} className="h-auto w-full" aria-hidden>
      {columns.map(({ panel, x, titleY, shapes }, p) => (
        <g key={panel.title}>
          <text
            x={x}
            y={titleY}
            textAnchor="middle"
            fontSize={SUB_SIZE}
            letterSpacing="0.04em"
            className="fill-accent font-mono"
          >
            {panel.title.toUpperCase()}
          </text>
          {shapes.slice(1).map((s, i) => {
            const pts: Point[] = [
              [x, shapes[i].y1],
              [x, s.y0],
            ];
            return (
              <g key={i}>
                <path d={pathD(pts)} fill="none" strokeWidth={1.5} className="stroke-muted" />
                <path d={arrowD(pts, 5)} fill="none" strokeWidth={1.5} className="stroke-muted" />
              </g>
            );
          })}
          {shapes.map((s, i) => (
            <Pill key={panel.steps[i]} s={s} delay={p * 0.15 + i * 0.06} />
          ))}
        </g>
      ))}
    </svg>
  );
}

// Hackathon story: the spec-driven loop, the two challenges, then the result.
export function LoopDiagram({
  spec,
  stepId,
  fallback,
}: {
  spec: LoopDiagramSpec;
  stepId: StepId;
  fallback?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const live = useInView(ref);
  const reduced = useReducedMotion();
  const mode = modeFor(stepId);
  const moving = live && !reduced && (stepId === "approach" || stepId === "learned");

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`${spec.alt} ${storyUi.diagramStepLabel}: ${storyUi.stepLabels[stepId]}.`}
      className="flex h-full flex-col justify-center p-4 md:p-6"
    >
      <m.div
        key={mode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduced ? instant : { duration: 0.4, ease }}
        className="h-full"
      >
        {mode === "photos" && <PhotoStrip fallback={fallback} />}
        {mode === "panels" && (
          <>
            <div className="md:hidden">
              <Panels spec={spec} narrow />
            </div>
            <div className="hidden md:block">
              <Panels spec={spec} narrow={false} />
            </div>
          </>
        )}
        {mode === "loop" && (
          <>
            <div className="md:hidden">
              <NarrowLoop spec={spec} moving={moving} />
            </div>
            <div className="hidden md:block">
              <WideLoop spec={spec} moving={moving} />
            </div>
          </>
        )}
      </m.div>
    </div>
  );
}
