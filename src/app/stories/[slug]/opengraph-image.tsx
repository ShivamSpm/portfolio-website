import { ImageResponse } from "next/og";
import { seo, storyUi } from "@/content/home";
import { getStory, stories } from "@/content/stories";
import { footerText, monoLabel, OgFooter, ogFonts, ogSize, paper, splitAccent } from "@/lib/og";

export const alt = seo.ogAlt;
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

// Per-story preview: the story label, its title, and its headline metric (or pitch).
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const story = getStory((await params).slug) ?? stories[0];
  const label = [
    `${story.section === "work" ? storyUi.storyLabel : storyUi.projectLabel} ${String(story.order).padStart(2, "0")}`,
    story.org,
  ]
    .filter(Boolean)
    .join(" · ")
    .toUpperCase();
  const title = splitAccent(story.title, story.titleAccent);
  const metric = story.metric;
  const foot = footerText();
  const fonts = await ogFonts(
    title.before + title.after + (metric ? metric.value : story.pitch) + foot.serif,
    title.accent,
    label + (metric ? metric.label.toUpperCase() : "") + foot.mono,
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: paper.bg,
      }}
    >
      <span style={monoLabel}>{label}</span>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 48,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: metric ? 720 : 1056 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontFamily: "Newsreader",
              fontSize: story.title.length > 34 ? 64 : 76,
              lineHeight: 1.05,
              letterSpacing: -2,
              color: paper.ink,
            }}
          >
            {title.before && <span style={{ whiteSpace: "pre-wrap" }}>{title.before}</span>}
            {title.accent && (
              <span style={{ fontStyle: "italic", color: paper.accent, whiteSpace: "pre-wrap" }}>
                {title.accent}
              </span>
            )}
            {title.after && <span style={{ whiteSpace: "pre-wrap" }}>{title.after}</span>}
          </div>
          {!metric && (
            <span
              style={{
                marginTop: 24,
                fontFamily: "Newsreader",
                fontSize: 30,
                lineHeight: 1.35,
                color: paper.muted,
              }}
            >
              {story.pitch}
            </span>
          )}
        </div>
        {metric && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span
              style={{
                fontFamily: "Newsreader",
                fontSize: 160,
                lineHeight: 0.9,
                letterSpacing: -5,
                color: paper.accent,
              }}
            >
              {metric.value}
            </span>
            <span style={{ ...monoLabel, marginTop: 16 }}>{metric.label.toUpperCase()}</span>
          </div>
        )}
      </div>

      <OgFooter />
    </div>,
    { ...size, fonts },
  );
}
