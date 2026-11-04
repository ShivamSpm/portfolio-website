import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { storyUi } from "@/content/home";
import { getNextStory, getStory, stories } from "@/content/stories";
import { Container } from "@/components/ui/Container";
import { StoryPlayer } from "@/components/story/StoryPlayer";
import { storyMetadata } from "@/lib/storyMetadata";

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: PageProps<"/stories/[slug]">): Promise<Metadata> {
  return storyMetadata(params);
}

const linkClass = "label-mono inline-flex min-h-11 items-center text-muted hover:text-ink";

async function Story({ params }: { params: PageProps<"/stories/[slug]">["params"] }) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();
  const next = getNextStory(story.slug);
  return (
    <>
      <StoryPlayer story={story} nextSlug={next.slug} mode="page" />
      <div className="mt-6 flex justify-end">
        {/* A plain link: a soft navigation to /stories/* would open the pop-up instead. */}
        <a href={`/stories/${next.slug}`} className={linkClass}>
          {storyUi.nextStory}
        </a>
      </div>
    </>
  );
}

// Full-page story: shareable links, hard refreshes and search engines land here.
// The slug is read inside Suspense so the page shell doesn't depend on the URL.
export default function StoryPage({ params }: PageProps<"/stories/[slug]">) {
  return (
    <Container className="py-8 md:py-12">
      <Link href="/#work" className={linkClass}>
        {storyUi.allWork}
      </Link>
      <div className="mt-4">
        <Suspense
          fallback={<div className="min-h-[70vh] rounded-[18px] border border-line bg-surface" />}
        >
          <Story params={params} />
        </Suspense>
      </div>
    </Container>
  );
}
