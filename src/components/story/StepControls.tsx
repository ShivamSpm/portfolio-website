"use client";

import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { storyUi } from "@/content/home";
import type { StoryStep } from "@/content/types";

const iconButton =
  "inline-flex size-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink disabled:opacity-35 disabled:hover:border-line";

// Footer: clickable chapter list (desktop), Previous, Pause/Play and Next.
// On the last step Next becomes "Next story →"; the visitor always chooses that.
export function StepControls({
  steps,
  index,
  paused,
  onSelect,
  onPrevious,
  onNext,
  onTogglePlay,
  nextStory,
}: {
  steps: StoryStep[];
  index: number;
  paused: boolean;
  onSelect: (i: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  /** Rendered in place of Next on the last step. */
  nextStory: React.ReactNode;
}) {
  const last = index === steps.length - 1;
  return (
    <div className="flex items-center gap-4">
      <nav aria-label={storyUi.chaptersLabel} className="hidden min-w-0 flex-1 md:block">
        <ol className="flex flex-wrap items-center gap-x-1">
          {steps.map((step, i) => (
            <li key={step.id} className="flex items-center">
              {i > 0 && (
                <span aria-hidden className="px-1 text-line">
                  ·
                </span>
              )}
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-current={i === index ? "step" : undefined}
                className={`label-mono min-h-11 rounded-md px-1.5 transition-colors ${
                  i === index ? "text-accent" : "text-muted hover:text-ink"
                }`}
              >
                {storyUi.stepLabels[step.id]}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={index === 0}
          aria-label={storyUi.previous}
          className={iconButton}
        >
          <ArrowLeft aria-hidden className="size-4" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={paused ? storyUi.play : storyUi.pause}
          className={iconButton}
        >
          {paused ? (
            <Play aria-hidden className="size-4" strokeWidth={1.75} />
          ) : (
            <Pause aria-hidden className="size-4" strokeWidth={1.75} />
          )}
        </button>
        {last ? (
          nextStory
        ) : (
          <button type="button" onClick={onNext} aria-label={storyUi.next} className={iconButton}>
            <ArrowRight aria-hidden className="size-4" strokeWidth={1.75} />
          </button>
        )}
      </div>
    </div>
  );
}
