"use client";

import * as m from "motion/react-m";
import { storyUi } from "@/content/home";
import type { Story, StoryStep, StepHighlight } from "@/content/types";
import { Chip } from "@/components/ui/Badge";
import { ease, instant } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

const pad = (n: number) => String(n).padStart(2, "0");

function Highlight({ h }: { h: StepHighlight }) {
  switch (h.type) {
    case "metrics":
      return (
        <div className="flex flex-wrap gap-x-10 gap-y-4">
          {h.items.map((item) => (
            <div key={item.label}>
              <p className="font-display text-[clamp(44px,5vw,64px)] leading-none tracking-[-0.03em] text-accent">
                {item.value}
              </p>
              <p className="label-mono mt-2 text-muted">{item.label}</p>
            </div>
          ))}
        </div>
      );
    case "chip":
      return (
        <p className="label-mono inline-flex rounded-full bg-accent-soft px-3 py-1.5 text-accent">
          {h.text}
        </p>
      );
    case "transition":
      return (
        <p className="font-display text-[28px] leading-tight text-ink">
          <span className="text-muted line-through decoration-1">{h.from}</span>
          <span aria-hidden className="px-3 text-accent">
            →
          </span>
          <span className="text-accent">{h.to}</span>
        </p>
      );
    case "bar":
      return (
        <div>
          <p className="label-mono text-muted">{h.label}</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full origin-left bg-accent"
              style={{ transform: `scaleX(${h.to / 100})` }}
            />
          </div>
          <p className="mt-2 font-mono text-[13px] text-muted">
            {h.from}
            {h.unit} →{" "}
            <span className="text-accent">
              {h.to}
              {h.unit}
            </span>
          </p>
        </div>
      );
    case "cards":
      return (
        <ul className="grid gap-3">
          {h.items.map((c) => (
            <li key={c.title} className="rounded-[10px] border border-line p-4">
              <p className="label-mono text-ink">{c.title}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-muted">{c.body}</p>
            </li>
          ))}
        </ul>
      );
    case "list":
      return (
        <div>
          <p className="label-mono text-muted">{h.title}</p>
          <ul className="mt-2 space-y-1.5 text-[15px] leading-relaxed text-muted">
            {h.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      );
    case "photos":
      // Photos land in M5; until then the plan's fallback is a large medal-style number.
      return (
        <p className="font-display text-[clamp(72px,9vw,120px)] leading-none tracking-[-0.04em] text-accent">
          {h.fallback}
        </p>
      );
  }
}

// Right-hand column: counter, heading, body, highlights and (on "What I did") the stack.
export function StepPanel({
  story,
  step,
  index,
  count,
  headingAs: Heading,
}: {
  story: Story;
  step: StoryStep;
  index: number;
  count: number;
  /** One level below the story title: h2 on the full page, h3 in the dialog. */
  headingAs: "h2" | "h3";
}) {
  const reduced = useReducedMotion();
  return (
    <m.div
      key={step.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? instant : { duration: 0.35, ease }}
    >
      {/* Short live region: announces the step change, not the whole body. */}
      <div aria-live="polite" aria-atomic="true">
        <p className="label-mono text-muted">
          {pad(index + 1)} / {pad(count)} — {storyUi.stepLabels[step.id]}
        </p>
        <Heading className="mt-3 font-display text-[26px] leading-tight text-ink">
          {step.heading}
        </Heading>
      </div>
      <p className="mt-4 text-[17px] leading-relaxed text-muted">{step.body}</p>

      {step.highlights && (
        <div className="mt-7 space-y-6">
          {step.highlights.map((h, i) => (
            <Highlight key={i} h={h} />
          ))}
        </div>
      )}

      {step.id === "approach" && (
        <div className="mt-7">
          <p className="label-mono text-muted">{storyUi.stackLabel}</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {story.stack.map((s) => (
              <li key={s}>
                <Chip>{s}</Chip>
              </li>
            ))}
          </ul>
        </div>
      )}
    </m.div>
  );
}
