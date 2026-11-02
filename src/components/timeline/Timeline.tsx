import { Plus } from "lucide-react";
import { sections, timeline } from "@/content/home";
import { awards, education, roles } from "@/content/experience";
import { getStory } from "@/content/stories";
import type { StorySlug } from "@/content/types";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StoryLink } from "@/components/ui/StoryLink";
import { Reveal } from "@/components/motion/Reveal";

// One row of the timeline: mono date column, then a hairline rail with a marker.
function Row({ dates, children }: { dates?: string; children: React.ReactNode }) {
  return (
    <Reveal as="li" className="grid gap-2 md:grid-cols-[200px_1fr] md:gap-10">
      <p className="label-mono pt-1.5 text-muted">{dates}</p>
      <div className="relative border-l border-line pb-12 pl-6 md:pl-8">
        <span
          aria-hidden
          className="absolute top-3 -left-[4.5px] size-2 rounded-full border border-accent bg-bg"
        />
        {children}
      </div>
    </Reveal>
  );
}

function StoryLinks({ slugs }: { slugs: StorySlug[] }) {
  return (
    <p className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="label-mono text-muted">{timeline.storiesLabel}</span>
      {slugs.map((slug) => (
        <StoryLink
          key={slug}
          slug={slug}
          className="text-[15px] text-accent underline-offset-4 hover:underline"
        >
          {getStory(slug)?.title}
        </StoryLink>
      ))}
    </p>
  );
}

const subhead = "label-mono mb-6 text-muted md:ml-[240px]";

export function Timeline({ index }: { index: number }) {
  const { id, title } = sections.experience;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-16 py-20 md:py-28">
      <Container>
        <SectionHeader index={index} id={id} title={title} />

        <ol>
          {roles.map((role) => (
            <Row key={`${role.title}-${role.dates}`} dates={role.dates}>
              <h3 className="font-display text-[clamp(26px,2.8vw,34px)] leading-tight text-ink">
                {role.title}
              </h3>
              <p className="mt-1 text-[17px] text-muted">{role.org}</p>
              <details className="group mt-5">
                <summary className="label-mono inline-flex min-h-11 cursor-pointer list-none items-center gap-2 text-ink [&::-webkit-details-marker]:hidden">
                  <Plus
                    aria-hidden
                    className="size-4 text-accent group-open:rotate-45"
                    strokeWidth={1.75}
                  />
                  {timeline.highlightsLabel}
                </summary>
                <ul className="mt-3 max-w-[68ch] space-y-3">
                  {role.highlights.map((h) => (
                    <li
                      key={h}
                      className="relative pl-5 text-[17px] leading-relaxed text-muted before:absolute before:top-[0.8em] before:left-0 before:h-px before:w-2.5 before:bg-muted"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </details>
              {role.stories && <StoryLinks slugs={role.stories} />}
            </Row>
          ))}
        </ol>

        <h3 className={subhead}>{timeline.educationTitle}</h3>
        <ol>
          {education.map((e) => (
            <Row key={e.degree} dates={e.dates}>
              <p className="font-display text-[clamp(22px,2.2vw,28px)] leading-tight text-ink">
                {e.degree}
              </p>
              <p className="mt-1 text-[17px] text-muted">
                {[e.school, e.detail].filter(Boolean).join(" · ")}
              </p>
            </Row>
          ))}
        </ol>

        <h3 className={subhead}>{timeline.awardsTitle}</h3>
        <ol>
          {awards.map((a) => (
            <Row key={a.title} dates={a.date}>
              {a.story ? (
                <StoryLink
                  slug={a.story}
                  className="font-display text-[clamp(22px,2.2vw,28px)] leading-tight text-ink underline decoration-accent decoration-1 underline-offset-[6px] hover:text-accent"
                >
                  {a.title}
                </StoryLink>
              ) : (
                <p className="font-display text-[clamp(22px,2.2vw,28px)] leading-tight text-ink">
                  {a.title}
                </p>
              )}
            </Row>
          ))}
        </ol>
      </Container>
    </section>
  );
}
