import { contact, footer, nav, sections, ui } from "@/content/home";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { Reveal } from "@/components/motion/Reveal";

const valueClass =
  "font-display text-[clamp(26px,3.4vw,44px)] leading-tight tracking-[-0.015em] text-ink underline decoration-line decoration-1 underline-offset-[8px] transition-colors hover:decoration-accent";

export function Contact({ index }: { index: number }) {
  const { id, title } = sections.contact;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-16 pt-20 md:pt-28">
      <Container>
        <Reveal className="border-t border-line pt-6">
          <p className="label-mono text-muted" aria-hidden>
            {String(index).padStart(2, "0")}
          </p>
          <h2 id={`${id}-title`} className="mt-3 font-display text-hero text-ink">
            {title}
          </h2>
          {site.availability.openToWork && (
            <p className="label-mono mt-8 flex items-center gap-2 text-muted">
              <span aria-hidden className="size-2 shrink-0 rounded-full bg-ok" />
              {site.availability.text}
            </p>
          )}
        </Reveal>

        <Reveal delay={0.1}>
          <dl className="mt-14 grid gap-10 md:grid-cols-2">
            <div>
              <dt className="label-mono text-muted">{contact.emailLabel}</dt>
              <dd className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
                <a href={`mailto:${site.email}`} className={`${valueClass} break-all`}>
                  {site.email}
                </a>
                <CopyEmail email={site.email} />
              </dd>
            </div>
            <div>
              <dt className="label-mono text-muted">{contact.phoneLabel}</dt>
              <dd className="mt-3">
                <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`} className={valueClass}>
                  {site.phone}
                </a>
              </dd>
            </div>
          </dl>
        </Reveal>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <SocialLinks />
          {site.resumeUrl && (
            <a
              href={site.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="label-mono inline-flex min-h-11 items-center rounded-full border border-line px-4 text-ink hover:border-ink"
            >
              {nav.resumeLabel}
              <span className="sr-only"> {ui.newTab}</span>
            </a>
          )}
        </div>
      </Container>

      <footer className="mt-24 border-t border-line">
        <Container className="flex flex-col gap-2 py-8 font-mono text-[12px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            {footer.copyright} · {footer.builtWith}
          </p>
          <a
            href={site.links.repo}
            target="_blank"
            rel="noreferrer"
            className="underline-offset-4 hover:text-ink hover:underline"
          >
            {footer.sourceLabel}
            <span className="sr-only"> {ui.newTab}</span>
          </a>
        </Container>
      </footer>
    </section>
  );
}
