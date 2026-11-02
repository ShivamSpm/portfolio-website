import { hero } from "@/content/home";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { AccentTitle } from "@/components/ui/AccentTitle";
import { Schematic } from "./Schematic";

// Headline spans the full width so its three lines stay three lines on desktop;
// sub-copy and CTAs sit beside the schematic underneath.
export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="scroll-mt-16">
      <Container className="pt-14 pb-20 md:pt-20 lg:pb-28">
        <p className="label-mono flex items-center gap-2 text-muted">
          {site.availability.openToWork && (
            <span aria-hidden className="size-2 shrink-0 rounded-full bg-ok" />
          )}
          {hero.status}
        </p>

        <h1 id="hero-title" className="mt-7 font-display text-hero text-ink">
          {hero.headline.map((line) => (
            <span key={line} className="block text-balance">
              <AccentTitle text={line} accent={hero.accent} />
            </span>
          ))}
        </h1>

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-16">
          <div>
            <p className="max-w-[52ch] text-body text-muted">{hero.subcopy}</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href={hero.primaryCta.href}>{hero.primaryCta.label}</ButtonLink>
              {site.resumeUrl && (
                <ButtonLink href={site.resumeUrl} variant="secondary" external>
                  {hero.resumeCta}
                </ButtonLink>
              )}
              <SocialLinks className="sm:ml-2" />
            </div>
          </div>
          <Schematic />
        </div>
      </Container>
    </section>
  );
}
