"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as m from "motion/react-m";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import { storyUi } from "@/content/home";
import { ease, instant } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Pop-up shell for an intercepted story route. Radix handles the focus trap, Esc and
// scroll lock. Closing goes back in history; with Cache Components the route is then
// hidden by <Activity> (not unmounted), which also hides this dialog.
export function StoryDialog({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  // Radix only returns focus on unmount, and an <Activity>-hidden route doesn't unmount.
  // Layout effects run before Radix moves focus, so this still sees the link that
  // opened the story; give focus back to it when the story is hidden, unless another
  // story dialog just opened ("Next story").
  useLayoutEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    return () => {
      window.setTimeout(() => {
        const dialogOpen = [...document.querySelectorAll('[role="dialog"]')].some(
          (el) => el.getClientRects().length > 0,
        );
        if (!dialogOpen && opener?.isConnected) opener.focus({ preventScroll: true });
      }, 0);
    };
  }, []);

  return (
    <Dialog.Root
      open
      onOpenChange={(next) => {
        if (!next) router.back();
      }}
    >
      <Dialog.Portal>
        {/* Overlay doubles as the scroll container so tall content can scroll on short screens. */}
        <Dialog.Overlay className="fixed inset-0 z-50 grid overflow-y-auto bg-bg/70 backdrop-blur-[8px] md:place-items-center md:p-6">
          <Dialog.Content
            asChild
            aria-describedby={undefined}
            // Focus the panel, not the first button: otherwise Space (pause) would hit Close.
            onOpenAutoFocus={(e) => {
              e.preventDefault();
              panelRef.current?.focus();
            }}
          >
            <m.div
              ref={panelRef}
              tabIndex={-1}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={reduced ? instant : { duration: 0.45, ease }}
              className="relative flex min-h-dvh w-full flex-col bg-surface outline-none md:min-h-0 md:max-w-[1120px] md:rounded-[18px] md:border md:border-line"
            >
              {children}
            </m.div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Shown for a moment while the story streams in; Radix requires a title in every dialog. */
export function StoryDialogLoading() {
  return (
    <div className="min-h-[60vh]">
      <Dialog.Title className="sr-only">{storyUi.loadingLabel}</Dialog.Title>
    </div>
  );
}
