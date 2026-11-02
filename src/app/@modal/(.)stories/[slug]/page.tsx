import { notFound } from "next/navigation";
import { getNextStory, getStory, stories } from "@/content/stories";
import { StoryDialog } from "@/components/story/StoryDialog";
import { StoryPlayer } from "@/components/story/StoryPlayer";

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

// A story opened from Home: same StoryPlayer, inside a pop-up over the page.
export default async function InterceptedStory({ params }: PageProps<"/stories/[slug]">) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();

  return (
    <StoryDialog>
      <StoryPlayer story={story} nextSlug={getNextStory(story.slug).slug} mode="dialog" />
    </StoryDialog>
  );
}
