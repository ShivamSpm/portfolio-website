import type { Metadata } from "next";
import { Geist_Mono, Instrument_Sans, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/components/Providers";
import { Nav } from "@/components/nav/Nav";
import { site } from "@/content/site";
import { ui } from "@/content/home";
import "@/styles/globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: `${site.name} · ${site.role}`,
  description: `${site.name}, ${site.role.toLowerCase()}.`,
};

// `modal` is the @modal slot: a story opened from Home renders there as a pop-up
// (intercepted route) while Home stays underneath.
export default function RootLayout({ children, modal }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: next-themes sets the theme class on <html> before hydration.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${newsreader.variable} ${instrumentSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-dvh">
        <Providers>
          <a
            href="#main"
            className="label-mono sr-only rounded-md bg-surface px-4 py-3 text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
          >
            {ui.skipToContent}
          </a>
          <Nav />
          <main id="main">{children}</main>
          {modal}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
