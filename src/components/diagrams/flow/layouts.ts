// Hand-tuned positions for each flow diagram, one wide (desktop) and one narrow
// (phone, flowing top to bottom). Presentation only: labels and connections live in
// the story content. Node x/y are centers; heights follow the wrapped text.
import type { StorySlug } from "@/content/types";
import type { Route } from "./geometry";

export type EdgeLayout = {
  route?: Route;
  /** Absolute label position, for edges whose default spot collides with something. */
  label?: { x: number; y: number; anchor?: "start" | "middle" | "end"; maxChars?: number };
};

export type FlowLayout = {
  w: number;
  h: number;
  nodes: Record<string, { x: number; y: number; w: number }>;
  edges?: Record<string, EdgeLayout>;
  tagline?: { x: number; y: number; anchor: "start" | "middle" | "end" };
};

export type FlowLayouts = { wide: FlowLayout; narrow: FlowLayout };

export const flowLayouts: Partial<Record<StorySlug, FlowLayouts>> = {
  // The manual path runs along the top; the agents zigzag below it inside the
  // "Tracing + evals" band.
  "ai-agents": {
    wide: {
      w: 680,
      h: 370,
      nodes: {
        req: { x: 80, y: 90, w: 110 },
        ado: { x: 250, y: 90, w: 110 },
        code: { x: 420, y: 90, w: 110 },
        eng: { x: 590, y: 90, w: 110 },
        plan: { x: 165, y: 260, w: 140 },
        impl: { x: 335, y: 260, w: 140 },
        review: { x: 505, y: 260, w: 140 },
      },
      // L-shaped hops between the rows, so the six agent edges don't merge into one line.
      edges: {
        "req-plan": { route: "vh" },
        "plan-ado": { route: "hv" },
        "ado-impl": { route: "vh" },
        "impl-code": { route: "hv" },
        "code-review": { route: "vh" },
        "review-eng": { route: "hv" },
      },
    },
    narrow: {
      w: 340,
      h: 540,
      nodes: {
        req: { x: 85, y: 40, w: 150 },
        ado: { x: 85, y: 190, w: 150 },
        code: { x: 85, y: 340, w: 150 },
        eng: { x: 85, y: 490, w: 150 },
        plan: { x: 255, y: 115, w: 150 },
        impl: { x: 255, y: 265, w: 150 },
        review: { x: 255, y: 415, w: 150 },
      },
    },
  },

  vacate: {
    wide: {
      w: 680,
      h: 420,
      nodes: {
        lease: { x: 75, y: 90, w: 120 },
        photos: { x: 75, y: 175, w: 120 },
        messages: { x: 75, y: 260, w: 120 },
        agent: { x: 230, y: 175, w: 110 },
        supabase: { x: 230, y: 320, w: 110 },
        policy: { x: 395, y: 175, w: 170 },
        review: { x: 395, y: 320, w: 170 },
        telegram: { x: 595, y: 255, w: 130 },
        muse: { x: 595, y: 320, w: 130 },
        bland: { x: 595, y: 385, w: 130 },
      },
      tagline: { x: 660, y: 44, anchor: "end" },
    },
    narrow: {
      w: 340,
      h: 560,
      nodes: {
        lease: { x: 60, y: 40, w: 100 },
        photos: { x: 170, y: 40, w: 100 },
        messages: { x: 280, y: 40, w: 100 },
        agent: { x: 120, y: 140, w: 140 },
        supabase: { x: 275, y: 140, w: 110 },
        policy: { x: 170, y: 250, w: 260 },
        review: { x: 170, y: 360, w: 260 },
        telegram: { x: 60, y: 470, w: 100 },
        muse: { x: 170, y: 470, w: 100 },
        bland: { x: 280, y: 470, w: 100 },
      },
      // Leave from the bottom so these don't cut through the neighbouring boxes.
      edges: {
        "messages-agent": { route: "vhv" },
        "review-telegram": { route: "vhv" },
        "review-bland": { route: "vhv" },
      },
      tagline: { x: 170, y: 540, anchor: "middle" },
    },
  },

  "hollow-manor": {
    wide: {
      w: 680,
      h: 380,
      nodes: {
        medium: { x: 80, y: 85, w: 140 },
        electrician: { x: 80, y: 185, w: 140 },
        locksmith: { x: 80, y: 285, w: 140 },
        relay: { x: 245, y: 185, w: 120 },
        orchestrator: { x: 400, y: 185, w: 130 },
        operator: { x: 400, y: 315, w: 130 },
        manor: { x: 580, y: 185, w: 160 },
        ui: { x: 580, y: 320, w: 130 },
      },
    },
    narrow: {
      w: 340,
      h: 500,
      nodes: {
        medium: { x: 60, y: 52, w: 100 },
        electrician: { x: 170, y: 52, w: 100 },
        locksmith: { x: 280, y: 52, w: 100 },
        relay: { x: 120, y: 165, w: 180 },
        orchestrator: { x: 120, y: 255, w: 180 },
        operator: { x: 280, y: 255, w: 100 },
        manor: { x: 120, y: 365, w: 220 },
        ui: { x: 120, y: 465, w: 180 },
      },
    },
  },

  // The agent's five stages snake inside the "Agent" band; evals feed the band from below.
  "appeal-agent": {
    wide: {
      w: 680,
      h: 370,
      nodes: {
        letter: { x: 75, y: 80, w: 120 },
        plandoc: { x: 75, y: 160, w: 120 },
        classify: { x: 240, y: 80, w: 140 },
        clause: { x: 400, y: 80, w: 140 },
        evidence: { x: 560, y: 80, w: 140 },
        deadline: { x: 560, y: 200, w: 140 },
        draft: { x: 400, y: 200, w: 140 },
        human: { x: 400, y: 320, w: 140 },
        evals: { x: 240, y: 320, w: 140 },
      },
    },
    narrow: {
      w: 340,
      h: 580,
      nodes: {
        letter: { x: 90, y: 40, w: 150 },
        plandoc: { x: 250, y: 40, w: 150 },
        classify: { x: 170, y: 130, w: 240 },
        clause: { x: 170, y: 200, w: 240 },
        evidence: { x: 170, y: 270, w: 240 },
        deadline: { x: 170, y: 340, w: 240 },
        draft: { x: 170, y: 420, w: 240 },
        human: { x: 100, y: 545, w: 150 },
        evals: { x: 255, y: 545, w: 150 },
      },
    },
  },

  "incident-investigator": {
    wide: {
      w: 680,
      h: 340,
      nodes: {
        console: { x: 75, y: 110, w: 120 },
        api: { x: 245, y: 110, w: 160 },
        hermes: { x: 420, y: 110, w: 130 },
        mcp: { x: 585, y: 110, w: 130 },
        otel: { x: 585, y: 260, w: 130 },
        remediation: { x: 245, y: 280, w: 160 },
      },
    },
    narrow: {
      w: 340,
      h: 480,
      nodes: {
        console: { x: 120, y: 45, w: 180 },
        api: { x: 120, y: 145, w: 180 },
        hermes: { x: 120, y: 265, w: 180 },
        mcp: { x: 120, y: 355, w: 180 },
        otel: { x: 120, y: 445, w: 180 },
        remediation: { x: 285, y: 355, w: 100 },
      },
      edges: {
        "api-remediation": {
          route: "hv",
          label: { x: 279, y: 248, anchor: "end", maxChars: 9 },
        },
      },
    },
  },
};
