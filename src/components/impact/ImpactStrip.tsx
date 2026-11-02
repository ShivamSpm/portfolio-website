import { impact } from "@/content/home";
import { Container } from "@/components/ui/Container";
import { StoryLink } from "@/components/ui/StoryLink";

// Four headline numbers; each opens its story. Count-up arrives in M3.
export function ImpactStrip() {
  return (
    <Container>
      <ul className="grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
        {impact.map((item) => (
          <li key={item.story} className="border-b border-line lg:border-b-0">
            <StoryLink
              slug={item.story}
              className="flex h-full flex-col gap-3 px-1 py-7 transition-colors hover:bg-accent-soft sm:px-4 lg:py-9"
            >
              <span className="font-display text-[clamp(48px,5.2vw,76px)] leading-none tracking-[-0.03em] text-accent">
                {item.value}
              </span>
              <span className="max-w-[28ch] text-[15px] leading-snug text-muted">
                {item.caption}
              </span>
            </StoryLink>
          </li>
        ))}
      </ul>
    </Container>
  );
}
