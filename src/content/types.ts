// Shared content types. Story shape follows docs/PLAN.md Section 6.4; diagram
// shapes follow Section 5.4.
//
// Review markers:
// - `needsReview: true` marks drafted wording Shivam hasn't approved ([CONFIRM] in the plan).
//   `reviewNote` says what to check. `pnpm check:content` lists all of them.
// - Text containing "TODO(shivam)" marks missing information. Steps whose body is a
//   TODO are hidden on the site until real content replaces it.

export interface Reviewable {
  needsReview?: boolean;
  reviewNote?: string;
}

export const storySlugs = [
  "ai-agents",
  "faster-api",
  "missing-errors",
  "hackathon-3rd-place",
  "vacate",
  "hollow-manor",
  "appeal-agent",
  "incident-investigator",
] as const;

export type StorySlug = (typeof storySlugs)[number];

export type StepId = "situation" | "challenge" | "approach" | "result" | "learned";

export type Badge = "hackathon" | "live" | "in-progress";

// ---------- FlowDiagram (generic, data-driven) ----------

export interface DiagramNode extends Reviewable {
  id: string;
  label: string;
  sublabel?: string;
  /** Drawn with a "planned" tag for parts that aren't built yet. */
  status?: "planned";
}

export interface DiagramEdge {
  id: string;
  /** Node or group id. */
  from: string;
  /** Node or group id. */
  to: string;
  label?: string;
}

/** Dashed band with a label drawn around its members. */
export interface DiagramGroup {
  id: string;
  label: string;
  members: string[];
}

/** Callout attached to a node, edge or group. */
export interface DiagramAnnotation {
  id: string;
  text: string;
  target: string;
}

export interface FlowDiagramSpec {
  kind: "flow";
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  groups?: DiagramGroup[];
  annotations?: DiagramAnnotation[];
  /** Short line drawn on the diagram itself. */
  tagline?: string;
  /** Small print under the diagram. */
  footnote?: string;
  /** Desktop flows left to right; on phones every flow switches to vertical. */
  mobile: "vertical";
}

/** Which ids (nodes, edges, groups, annotations) are visible and how, for one step. */
export interface DiagramState {
  show: string[];
  highlight?: string[];
  flow?: string[];
  dim?: string[];
  annotate?: string[];
}

// ---------- Custom diagrams (driven by the step index) ----------

export interface WaterfallDiagramSpec {
  kind: "waterfall";
  before: { label: string; bars: string[] };
  after: { label: string; bars: string[] };
  caption: string;
}

export interface LossDiagramSpec {
  kind: "loss";
  before: { source: string; sink: string };
  after: { stages: string[] };
}

export interface LoopDiagramSpec {
  kind: "loop";
  steps: string[];
  loopBackLabel: string;
  panels: { title: string; steps: string[] }[];
}

export type DiagramSpec =
  FlowDiagramSpec | WaterfallDiagramSpec | LossDiagramSpec | LoopDiagramSpec;

// ---------- Extra visuals shown with a step's text ----------

export type StepHighlight =
  /** Big count-up numbers. */
  | { type: "metrics"; items: { value: string; label: string }[] }
  /** Small secondary chip. */
  | { type: "chip"; text: string }
  /** Animated "before → after" state change. */
  | { type: "transition"; from: string; to: string }
  /** Horizontal bar animating from one value to another. */
  | { type: "bar"; label: string; from: number; to: number; unit: string }
  /** Small stat cards. */
  | { type: "cards"; items: { title: string; body: string }[] }
  /** Labeled bullet list. */
  | { type: "list"; title: string; items: string[] }
  /** Hackathon photos; falls back to `fallback` while there are none. */
  | { type: "photos"; fallback: string };

export interface StoryStep extends Reviewable {
  id: StepId;
  heading: string;
  body: string;
  diagramState?: DiagramState;
  highlights?: StepHighlight[];
  /** Defaults to max(6000, words × 260) ms. */
  durationMs?: number;
}

export interface Story extends Reviewable {
  slug: StorySlug;
  section: "work" | "project";
  order: number;
  title: string;
  /** Word(s) of `title` rendered in accent italic. */
  titleAccent?: string;
  org?: string;
  category?: string;
  /** Shivam's role, when the plan states it. */
  role?: string;
  metric?: { value: string; label: string };
  pitch: string;
  badges?: Badge[];
  stack: string[];
  links?: { label: string; href: string }[];
  diagram: DiagramSpec;
  steps: StoryStep[];
}

// ---------- Experience and skills ----------

export interface Role {
  title: string;
  org: string;
  dates: string;
  highlights: string[];
  stories?: StorySlug[];
}

export interface Education {
  degree: string;
  school: string;
  dates: string;
  detail?: string;
}

export interface Award {
  title: string;
  date?: string;
  story?: StorySlug;
}

export interface Skill {
  name: string;
  usedIn?: StorySlug[];
}

export interface SkillGroup {
  title: string;
  skills: Skill[];
}

export interface Photo {
  src: string;
  alt: string;
}
