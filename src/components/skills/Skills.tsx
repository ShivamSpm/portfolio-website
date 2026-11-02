import { sections, skillsCopy } from "@/content/home";
import { skillGroups } from "@/content/skills";
import { getStory } from "@/content/stories";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StoryLink } from "@/components/ui/StoryLink";

// Grouped skills; each links to the stories where it was used instead of a logo wall.
export function Skills({ index }: { index: number }) {
  const { id, title } = sections.skills;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-16 py-20 md:py-28">
      <Container>
        <SectionHeader index={index} id={id} title={title} />
        <div className="grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div key={group.title}>
              <h3 className="label-mono border-b border-line pb-3 text-muted">{group.title}</h3>
              <ul>
                {group.skills.map((skill) => (
                  <li key={skill.name} className="border-b border-line py-3">
                    <p className="text-[17px] text-ink">{skill.name}</p>
                    {skill.usedIn && (
                      <p className="mt-1 text-[14px] leading-relaxed text-muted">
                        <span className="font-mono text-[12px]">{skillsCopy.usedInLabel}</span>{" "}
                        {skill.usedIn.map((slug, i) => (
                          <span key={slug}>
                            {i > 0 && ", "}
                            <StoryLink
                              slug={slug}
                              className="text-accent underline-offset-4 hover:underline"
                            >
                              {getStory(slug)?.title}
                            </StoryLink>
                          </span>
                        ))}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
