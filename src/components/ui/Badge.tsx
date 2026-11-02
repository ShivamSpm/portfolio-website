import { badgeLabels } from "@/content/home";
import type { Badge as BadgeKind } from "@/content/types";

export function Badge({ kind }: { kind: BadgeKind }) {
  const tone =
    kind === "live" ? "border-transparent bg-accent-soft text-accent" : "border-line text-muted";
  return (
    <span className={`label-mono inline-flex rounded-full border px-2.5 py-1 ${tone}`}>
      {badgeLabels[kind]}
    </span>
  );
}

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[12px] leading-5 text-muted">
      {children}
    </span>
  );
}
