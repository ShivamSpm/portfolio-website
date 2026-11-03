import type { Metadata } from "next";
import { notFoundCopy } from "@/content/home";
import { site } from "@/content/site";
import { getStory } from "@/content/stories";

/** Shared by the full-page and pop-up story routes so the tab title follows the story. */
export async function storyMetadata(params: Promise<{ slug: string }>): Promise<Metadata> {
  const story = getStory((await params).slug);
  // Unknown slugs render the 404 page inside a streamed boundary, so the status stays
  // 200; noindex keeps them out of search results.
  if (!story) return { title: notFoundCopy.title, robots: { index: false } };
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
