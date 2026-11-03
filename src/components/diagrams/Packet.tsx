"use client";

import * as m from "motion/react-m";
import { packetKeyframes, type Point } from "./flow/geometry";

const SPEED = 110; // viewBox px per second

// A small accent dot that travels an edge's route on a loop (transform only).
// Callers render it only while the edge is flowing and motion is allowed.
export function Packet({ points, delay = 0 }: { points: Point[]; delay?: number }) {
  const { x, y, times, length } = packetKeyframes(points);
  const duration = Math.max(0.8, length / SPEED);
  return (
    <m.circle
      r={3.5}
      cx={0}
      cy={0}
      className="fill-accent"
      initial={{ x: x[0], y: y[0] }}
      animate={{ x, y }}
      transition={{ duration, times, ease: "linear", repeat: Infinity, repeatDelay: 0.25, delay }}
    />
  );
}
