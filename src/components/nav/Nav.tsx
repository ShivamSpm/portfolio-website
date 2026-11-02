import Link from "next/link";
import { site } from "@/content/site";
import { ui } from "@/content/home";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

// Slim sticky bar. Section links and the mobile menu sheet arrive in M2.
export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <nav className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 md:px-8">
        <Link
          href="/#top"
          aria-label={ui.homeLink}
          className="font-display text-xl tracking-[-0.01em] text-ink"
        >
          {site.name}
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}
