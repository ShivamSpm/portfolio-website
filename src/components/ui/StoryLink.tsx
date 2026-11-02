import Link from "next/link";
import type { StorySlug } from "@/content/types";

// Every way into a story goes through here, so the route lives in one place.
export function StoryLink({
  slug,
  className,
  children,
  ...rest
}: {
  slug: StorySlug;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Link>, "href">) {
  return (
    <Link href={`/stories/${slug}`} className={className} {...rest}>
      {children}
    </Link>
  );
}
