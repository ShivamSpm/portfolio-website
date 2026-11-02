import { sections } from "@/content/home";
import { projectStories } from "@/content/stories";
import type { DiagramNode, Story } from "@/content/types";
import { Badge, Chip } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StoryLink } from "@/components/ui/StoryLink";

const MAX_STACK = 5;
const THUMB_NODES = 4;

// Walks the story's flow diagram from its first node along the first outgoing edge each time.
function mainPath(story: Story): DiagramNode[] {
  if (story.diagram.kind !== "flow") return [];
  const { nodes, edges } = story.diagram;
  const path: DiagramNode[] = [];
  let current: DiagramNode | undefined = nodes[0];
  while (current && path.length < THUMB_NODES && !path.includes(current)) {
    path.push(current);
    const next = edges.find((e) => e.from === current!.id)?.to;
    current = nodes.find((n) => n.id === next);
  }
  return path;
}

// Static preview of the story's diagram. M5 swaps in the animated version.
function Thumbnail({ story }: { story: Story }) {
  const path = mainPath(story);
  return (
    <div
      aria-hidden
      className="bg-dot-grid flex min-h-32 flex-wrap items-center gap-x-1.5 gap-y-2 rounded-[10px] bg-surface-2 p-4"
    >
      {path.map((node, i) => (
        <span key={node.id} className="flex items-center gap-1.5">
          {i > 0 && <span className="font-mono text-[12px] text-accent">→</span>}
          <span className="rounded-md border border-line bg-surface px-2 py-1 font-mono text-[11px] leading-4 text-muted">
            {node.label}
          </span>
        </span>
      ))}
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
          {projectStories.map((story) => {
            const extra = story.stack.length - MAX_STACK;
            return (
              <li key={story.slug}>
                <StoryLink
                  slug={story.slug}
                  className="flex h-full flex-col rounded-[14px] border border-line bg-surface p-5 transition-colors hover:border-muted sm:p-6"
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
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
