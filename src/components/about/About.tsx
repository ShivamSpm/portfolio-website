import { HandFist, Mountain, WavesLadder, type LucideIcon } from "lucide-react";
import { about, sections } from "@/content/home";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

const icons: Record<string, LucideIcon> = {
  boxing: HandFist,
  swimming: WavesLadder,
  hiking: Mountain,
};

export function About({ index }: { index: number }) {
  const { id, title } = sections.about;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-16 py-20 md:py-28">
      <Container>
        <SectionHeader index={index} id={id} title={title} />
        <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
          <p className="max-w-[40ch] font-display text-[clamp(22px,2.3vw,30px)] leading-[1.35] text-ink">
            {about.bio.text}
          </p>
          <div>
            <h3 className="label-mono border-b border-line pb-3 text-muted">
              {about.outsideTitle}
            </h3>
            <ul className="grid grid-cols-3 gap-3 pt-5">
              {about.outside.map((item) => {
                const Icon = icons[item.icon];
                return (
                  <li
                    key={item.name}
                    className="flex flex-col items-start gap-4 rounded-[10px] border border-line bg-surface p-4"
                  >
                    {Icon && <Icon aria-hidden className="size-6 text-accent" strokeWidth={1.5} />}
                    <span className="text-[15px] text-ink">{item.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
