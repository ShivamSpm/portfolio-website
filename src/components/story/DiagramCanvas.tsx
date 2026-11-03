"use client";

import { storyUi } from "@/content/home";
import type { StepId, Story } from "@/content/types";
import { FlowDiagram } from "@/components/diagrams/FlowDiagram";
import { flowLayouts } from "@/components/diagrams/flow/layouts";
import { LoopDiagram } from "@/components/diagrams/LoopDiagram";
import { LossDiagram } from "@/components/diagrams/LossDiagram";
import { WaterfallDiagram } from "@/components/diagrams/WaterfallDiagram";

// Picks the story's diagram and hands it the current step.
export function DiagramCanvas({ story, stepId }: { story: Story; stepId: StepId }) {
  const { diagram } = story;
  switch (diagram.kind) {
    case "waterfall":
      return <WaterfallDiagram spec={diagram} stepId={stepId} />;
    case "loss":
      return <LossDiagram spec={diagram} stepId={stepId} />;
    case "loop":
      return <LoopDiagram spec={diagram} stepId={stepId} fallback={story.metric?.value} />;
    case "flow": {
      const layouts = flowLayouts[story.slug];
      const state = story.steps.find((s) => s.id === stepId)?.diagramState;
      if (!layouts || !state) return null;
      return (
        <FlowDiagram
          spec={diagram}
          state={state}
          layouts={layouts}
          stepLabel={storyUi.stepLabels[stepId]}
        />
      );
    }
  }
}
