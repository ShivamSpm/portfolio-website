import { hero } from "@/content/home";

const { schematic } = hero;

// Connector between layers: horizontal from sm up, vertical on phones. Packets arrive in M3.
function Arrow() {
  return (
    <div aria-hidden className="flex items-center justify-center text-accent">
      <svg viewBox="0 0 32 12" className="h-3 w-8 rotate-90 sm:rotate-0">
        <path d="M0 6h28" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M24 1.5 30 6l-6 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  );
}

// "How I build" blueprint: Interface → APIs → AI agents on an AWS foundation.
export function Schematic() {
  return (
    <figure
      role="img"
      aria-label={schematic.ariaLabel}
      className="bg-dot-grid rounded-[14px] border border-line bg-surface-2 p-5 sm:p-6"
    >
      <p className="label-mono text-muted">{schematic.caption}</p>

      <div className="mt-6 grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch">
        {schematic.layers.map((layer, i) => (
          <div key={layer.label} className="contents">
            {i > 0 && <Arrow />}
            <div className="rounded-lg border border-line bg-surface px-4 py-3">
              <p className="label-mono text-ink">{layer.label}</p>
              <ul className="mt-2 flex flex-wrap gap-x-2 font-mono text-[12px] leading-5 text-muted sm:block">
                {layer.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-dashed border-muted/60 px-4 py-3">
        <p className="font-mono text-[12px] leading-5 text-muted">
          <span className="label-mono text-ink">{schematic.foundation.label}</span>
          <span aria-hidden> — </span>
          {schematic.foundation.items.join(" · ")}
        </p>
      </div>
    </figure>
  );
}
