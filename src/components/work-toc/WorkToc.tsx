import { sections } from "@/content/home";
import { workStories } from "@/content/stories";
import { AccentTitle } from "@/components/ui/AccentTitle";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StoryLink } from "@/components/ui/StoryLink";

// Selected work as a magazine table of contents: number, title, category, metric.
export function WorkToc({ index }: { index: number }) {
  const { id, title } = sections.work;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-16 py-20 md:py-28">
      <Container>
        <SectionHeader index={index} id={id} title={title} />
        <ol className="border-t border-line">
          {workStories.map((story) => (
            <li key={story.slug} className="border-b border-line">
              <StoryLink
                slug={story.slug}
                className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-4 px-1 py-7 transition-colors hover:bg-accent-soft sm:px-4 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-x-10 md:py-9"
              >
                <span
                  aria-hidden
                  className="font-display text-[clamp(28px,3vw,40px)] leading-none text-muted"
                >
                  {String(story.order).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-[clamp(26px,3.2vw,42px)] leading-[1.08] tracking-[-0.015em] text-ink">
                    <AccentTitle text={story.title} accent={story.titleAccent} />
                  </span>
                  <span className="mt-3 flex flex-wrap items-center gap-3">
                    <span className="label-mono text-muted">
                      {[story.org, story.category].filter(Boolean).join(" · ")}
                    </span>
                    {story.badges?.map((b) => (
                      <Badge key={b} kind={b} />
                    ))}
                  </span>
                </span>
                {story.metric && (
                  <span className="col-start-2 md:col-start-auto md:text-right">
                    <span className="block font-display text-[clamp(36px,4vw,60px)] leading-none tracking-[-0.03em] text-accent">
                      {story.metric.value}
                    </span>
                    <span className="label-mono mt-2 block text-muted">{story.metric.label}</span>
                  </span>
                )}
              </StoryLink>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
