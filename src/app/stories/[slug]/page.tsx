import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { storyUi } from "@/content/home";
import { site } from "@/content/site";
import { getNextStory, getStory, stories } from "@/content/stories";
import { Container } from "@/components/ui/Container";
import { StoryPlayer } from "@/components/story/StoryPlayer";

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/stories/[slug]">): Promise<Metadata> {
  const story = getStory((await params).slug);
  if (!story) return {};
  return { title: `${story.title} · ${site.name}`, description: story.pitch };
}

const linkClass = "label-mono inline-flex min-h-11 items-center text-muted hover:text-ink";

// Full-page story: shareable links, hard refreshes and search engines land here.
export default async function StoryPage({ params }: PageProps<"/stories/[slug]">) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();
  const next = getNextStory(story.slug);

  return (
    <Container className="py-8 md:py-12">
      <Link href="/#work" className={linkClass}>
        {storyUi.allWork}
      </Link>
      <div className="mt-4">
        <StoryPlayer story={story} nextSlug={next.slug} mode="page" />
      </div>
      <div className="mt-6 flex justify-end">
        {/* A plain link: a soft navigation to /stories/* would open the pop-up instead. */}
        <a href={`/stories/${next.slug}`} className={linkClass}>
          {storyUi.nextStory}
        </a>
      </div>
    </Container>
  );
}
