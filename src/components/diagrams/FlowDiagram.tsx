"use client";

import { useInView } from "motion/react";
import * as m from "motion/react-m";
import { useRef } from "react";
import { storyUi } from "@/content/home";
import type { DiagramState, FlowDiagramSpec } from "@/content/types";
import { ease, instant } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import {
  LABEL_SIZE,
  SUB_SIZE,
  arrowD,
  boxAround,
  labelAnchor,
  nodeShape,
  pathD,
  route,
  textRows,
  wrap,
  type Box,
  type NodeShape,
} from "./flow/geometry";
import type { FlowLayout, FlowLayouts } from "./flow/layouts";
import { Packet } from "./Packet";

const GROUP_PAD = 12;
const GROUP_LABEL_SPACE = 22;
const DIM = 0.35;

type Variant = "full" | "thumbnail";

function useScene(spec: FlowDiagramSpec, layout: FlowLayout) {
  const nodes = new Map<string, NodeShape>();
  for (const n of spec.nodes) {
    const p = layout.nodes[n.id];
    if (p) nodes.set(n.id, nodeShape(n.label, n.sublabel, p.x, p.y, p.w));
  }
  const groups = new Map<string, Box>();
  for (const g of spec.groups ?? []) {
    const members = g.members.map((id) => nodes.get(id)).filter((b): b is NodeShape => !!b);
    if (members.length) groups.set(g.id, boxAround(members, GROUP_PAD, GROUP_LABEL_SPACE));
  }
  const boxOf = (id: string): Box | undefined => nodes.get(id) ?? groups.get(id);
  const edges = spec.edges.flatMap((e) => {
    const a = boxOf(e.from);
    const b = boxOf(e.to);
    return a && b ? [{ edge: e, points: route(a, b, layout.edges?.[e.id]?.route) }] : [];
  });
  return { nodes, groups, edges, boxOf };
}

/** One SVG at one layout. `extra` draws custom marks in the same coordinate space. */
export function FlowChart({
  spec,
  state,
  layout,
  variant,
  className,
  ariaLabel,
  extra,
}: {
  spec: FlowDiagramSpec;
  state: DiagramState;
  layout: FlowLayout;
  variant: Variant;
  className?: string;
  ariaLabel?: string;
  extra?: (ctx: { live: boolean; reduced: boolean }) => React.ReactNode;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const live = useInView(ref);
  const reduced = useReducedMotion();
  const { nodes, groups, edges, boxOf } = useScene(spec, layout);
  const full = variant === "full";

  const shown = (id: string) => state.show.includes(id);
  const opacityOf = (id: string) => (shown(id) ? (state.dim?.includes(id) ? DIM : 1) : 0);
  const hi = (id: string) => state.highlight?.includes(id) ?? false;
  const flowing = (id: string) => state.flow?.includes(id) ?? false;
  // Newly shown elements arrive in the order the step lists them.
  const t = (id: string, duration = 0.45) =>
    reduced ? instant : { duration, ease, delay: Math.max(0, state.show.indexOf(id)) * 0.05 };

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${layout.w} ${layout.h}`}
      role={full ? "img" : undefined}
      aria-label={full ? ariaLabel : undefined}
      aria-hidden={full ? undefined : true}
      className={`h-auto w-full ${className ?? ""}`}
    >
      {/* Group bands behind everything. */}
      {spec.groups?.map((g) => {
        const box = groups.get(g.id);
        if (!box) return null;
        return (
          <m.g
            key={g.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: opacityOf(g.id) }}
            transition={t(g.id)}
          >
            <rect
              x={box.x0}
              y={box.y0}
              width={box.x1 - box.x0}
              height={box.y1 - box.y0}
              rx={12}
              fill="none"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              className={hi(g.id) ? "stroke-accent" : "stroke-muted"}
            />
            {full && (
              <text
                x={box.x0 + 12}
                y={box.y1 - 9}
                fontSize={SUB_SIZE}
                letterSpacing="0.04em"
                className={`font-mono ${hi(g.id) ? "fill-accent" : "fill-muted"}`}
              >
                {g.label.toUpperCase()}
              </text>
            )}
          </m.g>
        );
      })}

      {/* Edges: they draw in (pathLength) when they first appear. */}
      {edges.map(({ edge, points }) => {
        const accent = hi(edge.id) || flowing(edge.id);
        const stroke = accent ? "stroke-accent" : "stroke-muted";
        return (
          <m.g
            key={edge.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: opacityOf(edge.id) }}
            transition={t(edge.id, 0.3)}
          >
            <m.path
              d={pathD(points)}
              fill="none"
              strokeWidth={1.5}
              className={stroke}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: shown(edge.id) ? 1 : 0 }}
              transition={
                reduced
                  ? instant
                  : { duration: 0.6, ease, delay: Math.max(0, state.show.indexOf(edge.id)) * 0.05 }
              }
            />
            <path d={arrowD(points)} fill="none" strokeWidth={1.5} className={stroke} />
          </m.g>
        );
      })}

      {/* Packets loop along flowing edges while the diagram is on screen. */}
      {!reduced &&
        live &&
        edges
          .filter(({ edge }) => shown(edge.id) && flowing(edge.id))
          .map(({ edge, points }, i) => <Packet key={edge.id} points={points} delay={i * 0.25} />)}

      {extra?.({ live, reduced })}

      {/* Nodes fade and scale in; highlight = accent border and label. */}
      {spec.nodes.map((n) => {
        const s = nodes.get(n.id);
        if (!s) return null;
        const h = hi(n.id);
        const planned = n.status === "planned";
        return (
          <m.g
            key={n.id}
            style={{ transformBox: "fill-box", originX: 0.5, originY: 0.5 }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: opacityOf(n.id), scale: shown(n.id) ? 1 : 0.96 }}
            transition={t(n.id)}
          >
            <rect
              x={s.x0}
              y={s.y0}
              width={s.w}
              height={s.h}
              rx={10}
              strokeWidth={h ? 1.75 : 1}
              strokeDasharray={planned ? "4 3" : undefined}
              className={`fill-surface ${h ? "stroke-accent" : "stroke-line"}`}
            />
            {full &&
              textRows(s).map((row, i) => (
                <text
                  key={i}
                  x={s.cx}
                  y={row.y}
                  textAnchor="middle"
                  fontSize={row.sub ? SUB_SIZE : LABEL_SIZE}
                  className={
                    row.sub
                      ? "fill-muted font-mono"
                      : `font-sans font-medium ${h ? "fill-accent" : "fill-ink"}`
                  }
                >
                  {row.text}
                </text>
              ))}
            {full && planned && (
              <text
                x={s.x1}
                y={s.y0 - 6}
                textAnchor="end"
                fontSize={SUB_SIZE}
                letterSpacing="0.04em"
                className="fill-muted font-mono"
              >
                {storyUi.plannedLabel.toUpperCase()}
              </text>
            )}
          </m.g>
        );
      })}

      {/* Edge labels, callouts and the tagline sit on top. */}
      {full &&
        edges.map(({ edge, points }) => {
          if (!edge.label) return null;
          const custom = layout.edges?.[edge.id]?.label;
          const a = labelAnchor(points);
          const x = custom?.x ?? (a.vertical ? a.x + 8 : a.x);
          const y = custom?.y ?? (a.vertical ? a.y : a.y + 15);
          const anchor = custom?.anchor ?? (a.vertical ? "start" : "middle");
          const lines = wrap(edge.label, custom?.maxChars ?? 40);
          return (
            <m.text
              key={`${edge.id}-label`}
              x={x}
              y={y}
              textAnchor={anchor}
              fontSize={SUB_SIZE}
              className="fill-muted font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: opacityOf(edge.id) }}
              transition={t(edge.id)}
            >
              {lines.map((line, i) => (
                <tspan key={i} x={x} dy={i === 0 ? 0 : 14}>
                  {line}
                </tspan>
              ))}
            </m.text>
          );
        })}

      {full &&
        spec.annotations?.map((note) => {
          const edge = edges.find((e) => e.edge.id === note.target);
          const box = boxOf(note.target);
          const at = edge ? labelAnchor(edge.points) : box ? { x: box.cx, y: box.y0 } : null;
          if (!at) return null;
          const on = state.annotate?.includes(note.id) ?? false;
          return (
            <m.g
              key={note.id}
              style={{ transformBox: "fill-box", originX: 0.5, originY: 0.5 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.8 }}
              transition={reduced ? instant : { duration: 0.35, ease }}
            >
              <circle
                cx={at.x}
                cy={at.y - 16}
                r={11}
                strokeWidth={1.5}
                className="fill-surface stroke-accent"
              />
              <text
                x={at.x}
                y={at.y - 11.5}
                textAnchor="middle"
                fontSize={14}
                className="fill-accent font-mono font-medium"
              >
                {note.text}
              </text>
            </m.g>
          );
        })}

      {full && spec.tagline && layout.tagline && (
        <text
          x={layout.tagline.x}
          y={layout.tagline.y}
          textAnchor={layout.tagline.anchor}
          fontSize={17}
          className="fill-ink font-display italic"
        >
          {spec.tagline}
        </text>
      )}
    </svg>
  );
}

/**
 * Data-driven diagram (PLAN.md 5.4): the same diagram evolves across a story's steps
 * through each step's DiagramState. Wide layout from md up, narrow below.
 */
export function FlowDiagram({
  spec,
  state,
  layouts,
  stepLabel,
}: {
  spec: FlowDiagramSpec;
  state: DiagramState;
  layouts: FlowLayouts;
  stepLabel: string;
}) {
  const shownLabels = spec.nodes.filter((n) => state.show.includes(n.id)).map((n) => n.label);
  const ariaLabel = `${storyUi.diagramShownLabel}: ${shownLabels.join(", ")}. ${storyUi.diagramStepLabel}: ${stepLabel}.`;
  return (
    <div className="flex h-full flex-col justify-center p-4 md:p-6">
      <FlowChart
        spec={spec}
        state={state}
        layout={layouts.narrow}
        variant="full"
        className="md:hidden"
        ariaLabel={ariaLabel}
      />
      <FlowChart
        spec={spec}
        state={state}
        layout={layouts.wide}
        variant="full"
        className="hidden md:block"
        ariaLabel={ariaLabel}
      />
      {spec.footnote && (
        <p className="mt-3 font-mono text-[12px] leading-5 text-muted">{spec.footnote}</p>
      )}
    </div>
  );
}

/**
 * Text-free animated miniature for project cards: the parts a step shows (usually
 * the Result step, where the system is complete), with every shown edge flowing.
 */
export function FlowThumbnail({
  spec,
  layouts,
  show,
}: {
  spec: FlowDiagramSpec;
  layouts: FlowLayouts;
  show: string[];
}) {
  const state: DiagramState = {
    show,
    flow: spec.edges.filter((e) => show.includes(e.id)).map((e) => e.id),
  };
  return <FlowChart spec={spec} state={state} layout={layouts.wide} variant="thumbnail" />;
}
