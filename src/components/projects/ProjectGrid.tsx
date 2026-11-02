import { sections } from "@/content/home";
import { projectStories } from "@/content/stories";
import type { Story } from "@/content/types";
import { Badge, Chip } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StoryLink } from "@/components/ui/StoryLink";
import { Reveal } from "@/components/motion/Reveal";
import { FlowThumbnail } from "@/components/diagrams/FlowDiagram";
import { flowLayouts } from "@/components/diagrams/flow/layouts";

const MAX_STACK = 5;

// Animated, text-free miniature of the story's own diagram, as it stands at the Result step.
function Thumbnail({ story }: { story: Story }) {
  const layouts = flowLayouts[story.slug];
  const show = story.steps.find((s) => s.id === "result")?.diagramState?.show;
  return (
    <div
      aria-hidden
      className="bg-dot-grid flex h-36 items-center justify-center rounded-[10px] bg-surface-2 p-3"
    >
      {story.diagram.kind === "flow" && layouts && show && (
        <div className="h-full w-full [&>svg]:h-full">
          <FlowThumbnail spec={story.diagram} layouts={layouts} show={show} />
        </div>
      )}
    </div>
  );
}

export function ProjectGrid({ index }: { index: number }) {
  const { id, title } = sections.projects;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-16 py-20 md:py-28">
      <Container>
        <SectionHeader index={index} id={id} title={title} />
        <ul className="grid gap-5 md:grid-cols-2">
          {projectStories.map((story, i) => {
            const extra = story.stack.length - MAX_STACK;
            return (
              <Reveal as="li" key={story.slug} delay={(i % 2) * 0.08}>
                {/* Hover: the card lifts 3px. */}
                <StoryLink
                  slug={story.slug}
                  className="flex h-full flex-col rounded-[14px] border border-line bg-surface p-5 transition-[translate,border-color] duration-300 ease-editorial hover:border-muted focus-visible:border-muted sm:p-6 motion-safe:hover:-translate-y-[3px] motion-safe:focus-visible:-translate-y-[3px]"
                >
                  <Thumbnail story={story} />
                  {story.badges && (
                    <span className="mt-5 flex flex-wrap gap-2">
                      {story.badges.map((b) => (
                        <Badge key={b} kind={b} />
                      ))}
                    </span>
                  )}
                  <span className="mt-4 block font-display text-[clamp(24px,2.4vw,30px)] leading-[1.12] tracking-[-0.01em] text-ink">
                    {story.title}
                  </span>
                  <span className="mt-3 block text-[16px] leading-relaxed text-muted">
                    {story.pitch}
                  </span>
                  <span className="mt-auto flex flex-wrap gap-1.5 pt-6">
                    {story.stack.slice(0, MAX_STACK).map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                    {extra > 0 && <Chip>+{extra}</Chip>}
                  </span>
                </StoryLink>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
