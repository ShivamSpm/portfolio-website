"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { storyUi, ui } from "@/content/home";
import { visibleSteps } from "@/content/stories";
import type { Story } from "@/content/types";
import { AccentTitle } from "@/components/ui/AccentTitle";
import { Badge } from "@/components/ui/Badge";
import { stepDuration, useAutoAdvance } from "@/lib/useAutoAdvance";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { DiagramCanvas } from "./DiagramCanvas";
import { ProgressSegments } from "./ProgressSegments";
import { StepControls } from "./StepControls";
import { StepPanel } from "./StepPanel";

const HOLD_MS = 10_000;
const SWIPE_PX = 40;
const pad = (n: number) => String(n).padStart(2, "0");

type Mode = "dialog" | "page";

/**
 * The story experience, shared by the pop-up and the full page (PLAN.md Section 5).
 * Auto-advances through the steps and pauses while the pointer is over it, while a
 * control inside has keyboard focus, for 10s after any manual navigation, while the
 * tab is hidden, and whenever the visitor pauses. It never advances into the next story.
 */
export function StoryPlayer({
  story,
  nextSlug,
  mode,
}: {
  story: Story;
  nextSlug: string;
  mode: Mode;
}) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const steps = visibleSteps(story);
  const rootRef = useRef<HTMLDivElement>(null);
  const holdTimer = useRef<number | undefined>(undefined);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);

  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  // null = no choice yet: auto-play, except under reduced motion where Play is offered.
  const [playChoice, setPlayChoice] = useState<"play" | "pause" | null>(null);
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [held, setHeld] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);

  const userPaused = playChoice === null ? reduced : playChoice === "pause";
  const running = !userPaused && !hovered && !keyboardFocus && !held && !tabHidden && !finished;
  const step = steps[index];
  const last = index === steps.length - 1;

  const progress = useAutoAdvance({
    stepKey: step.id,
    durationMs: stepDuration(step.body, step.durationMs),
    running,
    onComplete: () => (last ? setFinished(true) : setIndex((i) => i + 1)),
  });

  // Activity hides (rather than unmounts) a route we leave; start fresh next time.
  useLayoutEffect(() => {
    return () => {
      window.clearTimeout(holdTimer.current);
      setIndex(0);
      setFinished(false);
      setPlayChoice(null);
      setHovered(false);
      setKeyboardFocus(false);
      setHeld(false);
    };
  }, []);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  function hold() {
    setHeld(true);
    window.clearTimeout(holdTimer.current);
    holdTimer.current = window.setTimeout(() => setHeld(false), HOLD_MS);
  }

  function goTo(i: number) {
    if (i < 0 || i >= steps.length || i === index) return;
    setIndex(i);
    setFinished(false);
    hold();
  }

  // Relative moves use a functional update so quick repeated presses each count.
  function move(delta: 1 | -1) {
    setIndex((i) => Math.min(steps.length - 1, Math.max(0, i + delta)));
    setFinished(false);
    hold();
  }

  function togglePlay() {
    if (userPaused || finished) {
      if (finished) {
        setIndex(0);
        setFinished(false);
      }
      window.clearTimeout(holdTimer.current);
      setHeld(false);
      setPlayChoice("play");
    } else {
      setPlayChoice("pause");
    }
  }

  function goToNextStory() {
    // replace, so closing the next story still returns to Home instead of this one.
    router.replace(`/stories/${nextSlug}`, { scroll: false });
  }

  // Keyboard: ←/→ move between steps, Space toggles pause. Esc is Radix's (dialog only).
  const keyHandler = useRef<(e: KeyboardEvent) => void>(() => {});
  useEffect(() => {
    keyHandler.current = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        move(e.key === "ArrowRight" ? 1 : -1);
      } else if (e.key === " ") {
        // Let a focused control handle its own Space; on the full page, only
        // take Space when focus is inside the player so page scrolling still works.
        if (target.closest("button, a, input, textarea, select, summary")) return;
        if (mode === "page" && !rootRef.current?.contains(target)) return;
        e.preventDefault();
        togglePlay();
      }
    };
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => keyHandler.current(e);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Touch: tap the right 30% for next, the left 30% for previous, or swipe sideways.
  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType === "mouse") return;
    swipeStart.current = { x: e.clientX, y: e.clientY };
  }
  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy)) {
      move(dx < 0 ? 1 : -1);
    } else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      const rect = e.currentTarget.getBoundingClientRect();
      const at = (e.clientX - rect.left) / rect.width;
      if (at > 0.7) move(1);
      else if (at < 0.3) move(-1);
    }
  }

  const label = [
    `${story.section === "work" ? storyUi.storyLabel : storyUi.projectLabel} ${pad(story.order)}`,
    story.org,
    story.category,
  ]
    .filter(Boolean)
    .join(" · ");
  const title = <AccentTitle text={story.title} accent={story.titleAccent} />;
  const titleClass =
    "mt-2 font-display text-story-title tracking-[-0.02em] text-ink [text-wrap:balance]";

  const nextStoryClass =
    "label-mono inline-flex min-h-11 items-center rounded-full bg-accent px-4 text-bg transition-colors hover:bg-ink";
  const nextStory =
    mode === "dialog" ? (
      <button type="button" onClick={goToNextStory} className={nextStoryClass}>
        {storyUi.nextStory}
      </button>
    ) : (
      // A plain link: a soft navigation to /stories/* would open the pop-up instead.
      <a href={`/stories/${nextSlug}`} className={nextStoryClass}>
        {storyUi.nextStory}
      </a>
    );

  return (
    <div
      ref={rootRef}
      className={`flex flex-1 flex-col ${
        mode === "page" ? "rounded-[18px] border border-line bg-surface" : ""
      }`}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
      onFocus={(e) => setKeyboardFocus(e.target.matches(":focus-visible"))}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setKeyboardFocus(false);
      }}
    >
      <div className="px-5 pt-4 md:px-8 md:pt-6">
        <ProgressSegments count={steps.length} index={index} progress={progress} />
      </div>

      <header className="flex items-start gap-4 px-5 pt-5 md:px-8">
        <div className="min-w-0 flex-1">
          <p className="label-mono text-muted">{label}</p>
          {mode === "dialog" ? (
            <Dialog.Title className={titleClass}>{title}</Dialog.Title>
          ) : (
            <h1 className={titleClass}>{title}</h1>
          )}
          {(story.badges || story.links) && (
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              {story.badges?.map((b) => (
                <Badge key={b} kind={b} />
              ))}
              {story.links?.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="label-mono inline-flex min-h-11 items-center gap-1 text-accent hover:underline"
                >
                  {link.label}
                  <ArrowUpRight aria-hidden className="size-3.5" strokeWidth={1.75} />
                  <span className="sr-only"> {ui.newTab}</span>
                </a>
              ))}
            </div>
          )}
        </div>
        {mode === "dialog" && (
          <Dialog.Close
            aria-label={storyUi.close}
            className="-mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <X aria-hidden className="size-5" strokeWidth={1.75} />
          </Dialog.Close>
        )}
      </header>

      <div className="grid flex-1 gap-6 px-5 py-6 md:grid-cols-[3fr_2fr] md:gap-10 md:px-8 md:py-8">
        <div
          className="bg-dot-grid relative min-h-[45vh] touch-pan-y rounded-[14px] bg-surface-2 md:h-auto md:min-h-[420px]"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipeStart.current = null)}
        >
          <DiagramCanvas story={story} stepId={step.id} />
        </div>
        <div className="min-w-0">
          <StepPanel
            story={story}
            step={step}
            index={index}
            count={steps.length}
            headingAs={mode === "dialog" ? "h3" : "h2"}
          />
        </div>
      </div>

      <footer className="sticky bottom-0 border-t border-line bg-surface px-5 py-3 md:static md:rounded-b-[18px] md:px-8">
        <StepControls
          steps={steps}
          index={index}
          paused={userPaused || finished}
          onSelect={goTo}
          onPrevious={() => move(-1)}
          onNext={() => move(1)}
          onTogglePlay={togglePlay}
          nextStory={nextStory}
        />
      </footer>
    </div>
  );
}
