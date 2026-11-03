// Shared pieces for the Open Graph images (next/og). The renderer can't read CSS
// variables, so this palette mirrors the light "Paper" tokens in styles/globals.css.
import { cacheLife } from "next/cache";
import { site } from "@/content/site";

export const ogSize = { width: 1200, height: 630 };

export const paper = {
  bg: "#F6F6F3",
  ink: "#15171A",
  muted: "#4A4F57",
  line: "#DCDCD6",
  accent: "#2443D0",
  ok: "#1F8A4C",
};

export const domain = new URL(site.siteUrl).host;

/**
 * Fetches just the glyphs in `text` from Google Fonts as TrueType, once per build.
 * Returns null on failure so an offline build still renders with the default font.
 */
async function loadGoogleFont(family: string, text: string): Promise<ArrayBuffer | null> {
  "use cache";
  // Fonts don't change; the longest profile keeps the images effectively static.
  cacheLife("max");
  try {
    const url = `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
    if (!src) return null;
    return await (await fetch(src[1])).arrayBuffer();
  } catch {
    return null;
  }
}

type FontSpec = { name: string; data: ArrayBuffer; style: "normal" | "italic"; weight: 400 | 500 };

/** Serif (regular + italic) and mono, subset to the strings the image draws. */
export async function ogFonts(serifText: string, italicText: string, monoText: string) {
  const [serif, italic, mono] = await Promise.all([
    loadGoogleFont("Newsreader:opsz@72", serifText),
    loadGoogleFont("Newsreader:ital,opsz@1,72", italicText || "a"),
    loadGoogleFont("Geist+Mono:wght@500", monoText),
  ]);
  const fonts: FontSpec[] = [];
  if (serif) fonts.push({ name: "Newsreader", data: serif, style: "normal", weight: 400 });
  if (italic) fonts.push({ name: "Newsreader", data: italic, style: "italic", weight: 400 });
  if (mono) fonts.push({ name: "Geist Mono", data: mono, style: "normal", weight: 500 });
  return fonts;
}

/** Splits `text` around `accent` so the accent can be drawn in italic accent color. */
export function splitAccent(text: string, accent?: string) {
  const i = accent ? text.indexOf(accent) : -1;
  if (!accent || i === -1) return { before: text, accent: "", after: "" };
  return { before: text.slice(0, i), accent, after: text.slice(i + accent.length) };
}

export const monoLabel = {
  fontFamily: "Geist Mono",
  fontSize: 22,
  letterSpacing: 1.5,
  color: paper.muted,
} as const;

/** Name and domain along the bottom edge, shared by every image. */
export function OgFooter() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        borderTop: `2px solid ${paper.line}`,
        paddingTop: 28,
      }}
    >
      <span style={{ fontFamily: "Newsreader", fontSize: 38, color: paper.ink }}>{site.name}</span>
      <span style={monoLabel}>{domain}</span>
    </div>
  );
}

export function footerText() {
  return { serif: site.name, mono: domain };
}
