import { Reveal } from "@/components/motion/Reveal";

// Editorial section opener: a hairline, a mono index and a serif title.
export function SectionHeader({ index, id, title }: { index: number; id: string; title: string }) {
  return (
    <Reveal className="mb-10 border-t border-line pt-6 md:mb-14">
      <p className="label-mono text-muted" aria-hidden>
        {String(index).padStart(2, "0")}
      </p>
      <h2
        id={`${id}-title`}
        className="mt-3 font-display text-[clamp(34px,4.4vw,56px)] leading-[1.02] tracking-[-0.02em] text-ink"
      >
        {title}
      </h2>
    </Reveal>
  );
}
