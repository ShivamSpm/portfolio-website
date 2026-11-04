import { heroDelay, heroTiming } from "@/lib/motion";

// One headline line rising out of a mask (CSS, so it plays at first paint). The
// padding/negative margin pair keeps descenders and the italic overhang inside the clip box.
export function MaskLine({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
      <span
        className="hero-line block text-balance"
        style={heroDelay(index * heroTiming.lineStagger)}
      >
        {children}
      </span>
    </span>
  );
}
