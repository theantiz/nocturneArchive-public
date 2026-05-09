import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleShell from "@/components/ArticleShell";
import MarkdownContent from "@/components/MarkdownContent";
import { getMarkdownContent } from "@/lib/content";

const canonicalUrl = "https://jaychothiyawala.space";

export const metadata: Metadata = {
  title: "Home",
  description:
    "A quiet reading space for essays, reflections, and notes from a quiet room for reading and reflection.",
  keywords: [
    "Nocturne Archive",
    "quiet reading space",
    "essays",
    "reflections",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Nocturne Archive",
    title: "Nocturne Archive",
    description:
      "A quiet reading space for essays, reflections, and notes from a quiet room for reading and reflection.",
    url: canonicalUrl,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Nocturne Archive by Jay Chothiyawala",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@nocturnearchive",
    creator: "@jaychothiyawala",
    title: "Nocturne Archive",
    description:
      "A quiet reading space for essays, reflections, and notes from a quiet room for reading and reflection.",
      images: ["/twitter-image"],
  },
  alternates: {
    canonical: canonicalUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function Page() {
  const content = await getMarkdownContent("home");

  if (!content) {
    notFound();
  }

  const homeJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Nocturne Archive",
    headline: "Nocturne Archive",
    description:
      "A quiet reading space for essays, reflections, and notes from a quiet room for reading and reflection.",
    url: canonicalUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <ArticleShell
        title="Nocturne Archive"
        meta="A quiet room for reading and reflection"
      >
        <MarkdownContent content={content.markdown} />
        <p>
          Continue to <Link href="/writings">Writings</Link> or learn more on
          the <Link href="/about">About</Link> page.
        </p>
      </ArticleShell>
    </>
  );
}
