import Link from "next/link";
import { site } from "@/content/site";
import { nav, ui } from "@/content/home";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileMenu } from "./MobileMenu";

const linkClass =
  "inline-flex min-h-11 items-center rounded-md px-3 text-[15px] text-muted transition-colors hover:text-ink";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <nav
        aria-label={ui.primaryNav}
        className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 md:px-8"
      >
        <Link
          href="/#top"
          aria-label={ui.homeLink}
          className="font-display text-xl tracking-[-0.01em] text-ink"
        >
          {site.name}
        </Link>

        <div className="flex items-center gap-1">
          <ul className="hidden items-center md:flex">
            {nav.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
            {site.resumeUrl && (
              <li>
                <a href={site.resumeUrl} target="_blank" rel="noreferrer" className={linkClass}>
                  {nav.resumeLabel}
                  <span className="sr-only"> {ui.newTab}</span>
                </a>
              </li>
            )}
          </ul>
          <ThemeToggle />
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
