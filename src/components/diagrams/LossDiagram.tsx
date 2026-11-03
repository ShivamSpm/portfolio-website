"use client";

import * as m from "motion/react-m";
import { storyUi } from "@/content/home";
import type { DiagramState, FlowDiagramSpec, LossDiagramSpec, StepId } from "@/content/types";
import { FlowChart } from "./FlowDiagram";
import { nodeShape, route, type Point } from "./flow/geometry";
import type { FlowLayout } from "./flow/layouts";

const PACKETS = 10; // one of every ten is lost, as in the story
const LOST = 6;
const PERIOD = 3.2;

const SRC = "src";
const SINK = "sink";
const BEFORE_EDGE = "before";

const LAYOUTS: Record<"wide" | "narrow", FlowLayout> = {
  wide: {
    w: 680,
    h: 340,
    nodes: {
      [SRC]: { x: 110, y: 85, w: 150 },
      [SINK]: { x: 570, y: 85, w: 150 },
      s0: { x: 90, y: 255, w: 140 },
      s1: { x: 250, y: 255, w: 140 },
      s2: { x: 410, y: 255, w: 140 },
      s3: { x: 570, y: 255, w: 140 },
    },
  },
  narrow: {
    w: 340,
    h: 560,
    nodes: {
      [SRC]: { x: 150, y: 40, w: 180 },
      [SINK]: { x: 150, y: 210, w: 180 },
      s0: { x: 170, y: 310, w: 240 },
      s1: { x: 170, y: 385, w: 240 },
      s2: { x: 170, y: 460, w: 240 },
      s3: { x: 170, y: 530, w: 240 },
    },
  },
};

/** The loss story as a flow: source → sink before, then the four-stage pipeline after. */
function toFlow(spec: LossDiagramSpec): FlowDiagramSpec {
  const stages = spec.after.stages.map((label, i) => ({ id: `s${i}`, label }));
  return {
    kind: "flow",
    nodes: [
      { id: SRC, label: spec.before.source },
      { id: SINK, label: spec.before.sink },
      ...stages,
    ],
    edges: [
      { id: BEFORE_EDGE, from: SRC, to: SINK },
      ...stages.slice(1).map((s, i) => ({ id: `a${i}`, from: stages[i].id, to: s.id })),
    ],
    mobile: "vertical",
  };
}

function stateFor(flow: FlowDiagramSpec, stepId: StepId): { state: DiagramState; before: boolean } {
  const beforeIds = [SRC, SINK, BEFORE_EDGE];
  const before = stepId === "situation" || stepId === "challenge";
  if (before) return { state: { show: beforeIds }, before };
  const after = [...flow.nodes.slice(2).map((n) => n.id), ...flow.edges.slice(1).map((e) => e.id)];
  return {
    before,
    state: {
      show: [...beforeIds, ...after],
      dim: beforeIds,
      flow: flow.edges.slice(1).map((e) => e.id),
    },
  };
}

// Packets on the broken path: nine arrive, one drops away midway, in muted color.
function LossyPackets({ points, narrow }: { points: Point[]; narrow: boolean }) {
  const [s, e] = [points[0], points[points.length - 1]];
  const mid: Point = [(s[0] + e[0]) / 2, (s[1] + e[1]) / 2];
  const fall: Point = narrow ? [mid[0] + 60, mid[1] + 20] : [mid[0] + 10, mid[1] + 70];
  return (
    <>
      {Array.from({ length: PACKETS }, (_, i) => {
        const lost = i === LOST;
        const xs = lost ? [s[0], mid[0], fall[0]] : [s[0], e[0]];
        const ys = lost ? [s[1], mid[1], fall[1]] : [s[1], e[1]];
        return (
          <m.circle
            key={i}
            r={3.5}
            cx={0}
            cy={0}
            className={lost ? "fill-muted" : "fill-accent"}
            initial={{ x: s[0], y: s[1], opacity: 0 }}
            animate={{ x: xs, y: ys, opacity: lost ? [1, 1, 0] : [1, 1] }}
            transition={{
              duration: PERIOD,
              times: lost ? [0, 0.5, 1] : [0, 1],
              ease: "linear",
              repeat: Infinity,
              repeatDelay: PERIOD / PACKETS / 2,
              delay: (i * PERIOD) / PACKETS,
            }}
          />
        );
      })}
    </>
  );
}

// "The case of the missing errors": a lossy path before, a clean pipeline after.
export function LossDiagram({ spec, stepId }: { spec: LossDiagramSpec; stepId: StepId }) {
  const flow = toFlow(spec);
  const { state, before } = stateFor(flow, stepId);
  const ariaLabel = `${spec.alt} ${storyUi.diagramStepLabel}: ${storyUi.stepLabels[stepId]}.`;

  const chart = (layout: FlowLayout, narrow: boolean, className: string) => {
    const a = layout.nodes[SRC];
    const b = layout.nodes[SINK];
    const points = route(
      nodeShape(spec.before.source, undefined, a.x, a.y, a.w),
      nodeShape(spec.before.sink, undefined, b.x, b.y, b.w),
    );
    return (
      <FlowChart
        spec={flow}
        state={state}
        layout={layout}
        variant="full"
        className={className}
        ariaLabel={ariaLabel}
        extra={({ live, reduced }) =>
          before && live && !reduced ? <LossyPackets points={points} narrow={narrow} /> : null
        }
      />
    );
  };

  return (
    <div className="flex h-full flex-col justify-center p-4 md:p-6">
      {chart(LAYOUTS.narrow, true, "md:hidden")}
      {chart(LAYOUTS.wide, false, "hidden md:block")}
    </div>
  );
}
