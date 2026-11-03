"use client";

import Image from "next/image";
import * as m from "motion/react-m";
import { hackathonPhotos } from "@/content/stories";
import { ease, instant } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Hackathon photos for the Result step. Until Shivam adds some (content/stories.ts),
// the plan's fallback: a large medal-style number.
export function PhotoStrip({ fallback }: { fallback?: string }) {
  const reduced = useReducedMotion();
  if (hackathonPhotos.length === 0) {
    return (
      <div className="flex h-full min-h-[240px] items-center justify-center">
        <m.p
          className="font-display text-[clamp(96px,14vw,180px)] leading-none tracking-[-0.04em] text-accent"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={reduced ? instant : { duration: 0.6, ease }}
        >
          {fallback}
        </m.p>
      </div>
    );
  }
  return (
    <ul className="grid h-full grid-cols-2 gap-3 p-4 md:p-6">
      {hackathonPhotos.map((photo, i) => (
        <m.li
          key={photo.src}
          className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-surface"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduced ? instant : { duration: 0.5, ease, delay: i * 0.08 }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            // Mounted only once the Result step is on screen, so load right away.
            loading="eager"
            sizes="(min-width: 768px) 300px, 45vw"
            className="object-cover"
          />
        </m.li>
      ))}
    </ul>
  );
}
