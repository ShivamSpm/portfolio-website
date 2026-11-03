import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { stories } from "@/content/stories";

// Home plus every story's full page. /for/* links are private tracking links, not listed.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.siteUrl, changeFrequency: "monthly", priority: 1 },
    ...stories.map((s) => ({
      url: `${site.siteUrl}/stories/${s.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
