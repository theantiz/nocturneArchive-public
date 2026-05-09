import type { MetadataRoute } from "next";
import { getAllMarkdownEntries } from "@/lib/content";

const siteUrl = "https://jaychothiyawala.space";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getAllMarkdownEntries();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/writings`,
      changeFrequency: "weekly",
      priority: 0.9,
      lastModified: new Date(),
    },
  ];

  const writingPages: MetadataRoute.Sitemap = entries.map((entry) => ({
    url: `${siteUrl}${entry.route}`,
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: entry.date ? new Date(entry.date) : new Date(),
  }));

  return [...staticPages, ...writingPages];
}
