import type { Metadata } from "next";
import Link from "next/link";
import { notFoundCopy } from "@/content/home";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: notFoundCopy.title,
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col justify-center py-24">
      <p className="label-mono text-muted">{notFoundCopy.label}</p>
      <h1 className="mt-4 font-display text-[clamp(44px,6vw,88px)] leading-[1] tracking-[-0.03em] text-ink">
        {notFoundCopy.title}
      </h1>
      <p className="mt-6 max-w-[48ch] text-body text-muted">{notFoundCopy.body}</p>
      <Link
        href="/"
        className="mt-10 inline-flex min-h-11 w-fit items-center rounded-full bg-accent px-5 text-[15px] font-medium text-bg transition-colors hover:bg-ink"
      >
        {notFoundCopy.homeLink}
      </Link>
    </Container>
  );
}
