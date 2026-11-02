"use client";

import type { StepId, Story } from "@/content/types";
import { WaterfallDiagram } from "@/components/diagrams/WaterfallDiagram";

// Picks the diagram for a story. FlowDiagram, LossDiagram and LoopDiagram arrive in
// M5; until then those stories show the empty canvas and rely on the step text.
export function DiagramCanvas({ story, stepId }: { story: Story; stepId: StepId }) {
  switch (story.diagram.kind) {
    case "waterfall":
      return <WaterfallDiagram spec={story.diagram} stepId={stepId} />;
    default:
      return null;
  }
}
