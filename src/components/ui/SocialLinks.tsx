import { site } from "@/content/site";
import { socialLabels, ui } from "@/content/home";
import { GitHubMark, LinkedInMark, XMark } from "./Icon";

const items = [
  { key: "github", href: site.links.github, Mark: GitHubMark },
  { key: "linkedin", href: site.links.linkedin, Mark: LinkedInMark },
  { key: "x", href: site.links.x, Mark: XMark },
] as const;

// Icon-only buttons; the accessible name comes from the content labels.
export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {items.map(({ key, href, Mark }) => (
        <li key={key}>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${socialLabels[key]} ${ui.newTab}`}
            className="inline-flex size-11 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-ink hover:text-ink"
          >
            <Mark className="size-[18px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
