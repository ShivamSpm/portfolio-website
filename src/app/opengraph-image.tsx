import { ImageResponse } from "next/og";
import { hero, seo } from "@/content/home";
import { footerText, monoLabel, OgFooter, ogFonts, ogSize, paper, splitAccent } from "@/lib/og";

export const alt = seo.ogAlt;
export const size = ogSize;
export const contentType = "image/png";

// Site-wide preview for LinkedIn, Slack and X: status line, the headline, name and domain.
export default async function Image() {
  const status = hero.status.toUpperCase();
  const lines = hero.headline.map((line) => splitAccent(line, hero.accent));
  const foot = footerText();
  const fonts = await ogFonts(
    lines.map((l) => l.before + l.after).join("") + foot.serif,
    hero.accent,
    status + foot.mono,
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
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 14, height: 14, borderRadius: 7, background: paper.ok }} />
        <span style={monoLabel}>{status}</span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontFamily: "Newsreader",
          fontSize: 88,
          lineHeight: 1,
          letterSpacing: -2.5,
          color: paper.ink,
        }}
      >
        {lines.map((l, i) => (
          <div key={i} style={{ display: "flex" }}>
            {l.before && <span style={{ whiteSpace: "pre" }}>{l.before}</span>}
            {l.accent && (
              <span style={{ fontStyle: "italic", color: paper.accent, whiteSpace: "pre" }}>
                {l.accent}
              </span>
            )}
            {l.after && <span style={{ whiteSpace: "pre" }}>{l.after}</span>}
          </div>
        ))}
      </div>

      <OgFooter />
    </div>,
    { ...size, fonts },
  );
}
