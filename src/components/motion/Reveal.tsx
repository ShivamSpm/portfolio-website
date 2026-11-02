"use client";

import * as m from "motion/react-m";
import { instant, rise, riseTransition } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "p";
  delay?: number;
  /** "view" plays once when scrolled into view; "mount" plays on page load. */
  trigger?: "view" | "mount";
};

const tags = { div: m.div, li: m.li, p: m.p };

// Rise-and-fade reveal. Plays once and never re-animates on scroll back.
export function Reveal({ children, className, as = "div", delay = 0, trigger = "view" }: Props) {
  const reduced = useReducedMotion();
  const Tag = tags[as];
  const play =
    trigger === "mount"
      ? { animate: "visible" }
      : { whileInView: "visible", viewport: { once: true, margin: "0px 0px -8% 0px" } };

  return (
    <Tag
      className={className}
      variants={rise}
      initial="hidden"
      {...play}
      transition={reduced ? instant : riseTransition(delay)}
    >
      {children}
    </Tag>
  );
}
