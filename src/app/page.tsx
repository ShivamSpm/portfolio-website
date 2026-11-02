import { site } from "@/content/site";

// M0 placeholder that exercises the tokens and fonts. The real Home sections arrive in M2.
export default function Home() {
  return (
    <section id="top" className="mx-auto max-w-[1280px] px-5 py-24 md:px-8 md:py-32">
      <p className="label-mono flex items-center gap-2 text-muted">
        <span aria-hidden className="size-2 rounded-full bg-ok" />
        {site.availability.text}
      </p>
      <h1 className="mt-6 max-w-[14ch] font-display text-hero text-ink">{site.name}</h1>
      <p className="mt-6 max-w-[40ch] font-display text-story-title text-accent italic">
        {site.role}
      </p>
      <p className="label-mono mt-10 text-muted">{site.location}</p>
    </section>
  );
}
