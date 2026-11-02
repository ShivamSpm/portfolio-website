"use client";

import { domAnimation, LazyMotion, MotionConfig } from "motion/react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {/* domAnimation covers animate, variants and in-view; `strict` rejects the full
          `motion` component so the heavier drag/layout features never sneak back in.
          Loading it lazily saved only ~4 KB and delayed the hero, so it stays sync. */}
      <LazyMotion features={domAnimation} strict>
        {/* "user" makes every motion component honor prefers-reduced-motion. */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </LazyMotion>
    </ThemeProvider>
  );
}
