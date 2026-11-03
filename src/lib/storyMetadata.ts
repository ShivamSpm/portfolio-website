import type { Metadata } from "next";
import { site } from "@/content/site";
import { getStory } from "@/content/stories";

/** Shared by the full-page and pop-up story routes so the tab title follows the story. */
export async function storyMetadata(params: Promise<{ slug: string }>): Promise<Metadata> {
  const story = getStory((await params).slug);
  if (!story) return {};
  const url = `/stories/${story.slug}`;
  return {
    title: story.title,
    description: story.pitch,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: site.name,
      title: story.title,
      description: story.pitch,
      url,
    },
  };
}
