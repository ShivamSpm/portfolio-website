import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getNextStory, getStory, stories } from "@/content/stories";
import { StoryDialog, StoryDialogLoading } from "@/components/story/StoryDialog";
import { StoryPlayer } from "@/components/story/StoryPlayer";
import { storyMetadata } from "@/lib/storyMetadata";

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: PageProps<"/stories/[slug]">): Promise<Metadata> {
  return storyMetadata(params);
}

async function Story({ params }: { params: PageProps<"/stories/[slug]">["params"] }) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();
  return <StoryPlayer story={story} nextSlug={getNextStory(story.slug).slug} mode="dialog" />;
}

// A story opened from Home: same StoryPlayer, inside a pop-up over the page. The
// dialog opens at once; the slug is read inside Suspense so the shell stays instant.
export default function InterceptedStory({ params }: PageProps<"/stories/[slug]">) {
  return (
    <StoryDialog>
      <Suspense fallback={<StoryDialogLoading />}>
        <Story params={params} />
      </Suspense>
    </StoryDialog>
  );
}
