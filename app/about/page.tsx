import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMarkdownContent } from "@/lib/content";
import ArticleShell from "@/components/ArticleShell";
import MarkdownContent from "@/components/MarkdownContent";

export const metadata: Metadata = {
  title: "Jay Chothiyawala",
  description:
    "Essays, notes, and reflections from Jay Chothiyawala.",
  keywords: [
    "Jay Chothiyawala",
    "about jay chothiyawala",
    "Jay Chothiyawala",
    "writer",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Jay Chothiyawala",
    title: "Jay Chothiyawala",
    description:
      "Essays, notes, and reflections from Jay Chothiyawala.",
    url: "https://jaychothiyawala.space/about",
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
    title: "Jay Chothiyawala",
    description:
      "About Jay Chothiyawala and Nocturne Archive — personal essays, reflections, and stories.",
    images: ["/twitter-image"],
  },
  alternates: {
    canonical: "https://jaychothiyawala.space/about",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function AboutPage() {
  const content = await getMarkdownContent("about");

  if (!content) {
    notFound();
  }

  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Jay Chothiyawala",
    url: "https://jaychothiyawala.space/about",
    description:
      "Essays, notes, and reflections from Jay Chothiyawala.",
    mainEntity: {
      "@type": "Person",
      name: "Jay Chothiyawala",
      url: "https://jaychothiyawala.space",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <ArticleShell
        title="Nocturne Archive"
        meta="Essays, notes, and reflections"
      >
        <MarkdownContent content={content.markdown} />
      </ArticleShell>
    </>
  );
}
