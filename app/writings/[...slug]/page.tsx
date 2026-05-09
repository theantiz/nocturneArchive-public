import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllMarkdownEntries, getMarkdownContentBySlug } from "@/lib/content";
import ReadingProgress from "@/components/ReadingProgress";
import ArticleShell from "@/components/ArticleShell";
import MarkdownContent from "@/components/MarkdownContent";
import ReadingTextSizeControl from "@/components/ReadingTextSizeControl";

type WritingsPageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateStaticParams() {
  const entries = await getAllMarkdownEntries();
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata(
  props: WritingsPageProps,
): Promise<Metadata> {
  const { slug } = await props.params;
  const content = await getMarkdownContentBySlug(slug);

  if (!content) {
    return { title: "Not Found" };
  }

  const canonicalUrl = `https://jaychothiyawala.space/writings/${slug.join("/")}`;
  const description =
    content.description && content.description.trim().length > 0
      ? content.description
      : `${content.title} from Nocturne Archive.`;
  const ogImage = content.cover
    ? content.cover.startsWith("http")
      ? content.cover
      : `https://jaychothiyawala.space${content.cover}`
    : undefined;

  return {
    title: content.title,
    description,
    openGraph: {
      type: "article",
      locale: "en_US",
      siteName: "Nocturne Archive",
      title: content.title,
      description,
      url: canonicalUrl,
      publishedTime: content.date,
      authors: ["Nocturne Archive"],
      tags: content.tags,
      images: ogImage
        ? [
            {
              url: ogImage,
              alt: content.title,
            },
          ]
        : [
            {
              url: "/opengraph-image",
              alt: "Nocturne Archive",
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@nocturnearchive",
      creator: "@jaychothiyawala",
      title: content.title,
      description,
      images: [ogImage ?? "/twitter-image"],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
    authors: [{ name: "Nocturne Archive" }],
    keywords: [...content.tags, "Nocturne Archive"],
  };
}

export default async function WritingDetailPage(props: WritingsPageProps) {
  const { slug } = await props.params;
  const content = await getMarkdownContentBySlug(slug);

  if (!content) {
    notFound();
  }

  const canonicalUrl = `https://jaychothiyawala.space/writings/${slug.join("/")}`;
  const description =
    content.description && content.description.trim().length > 0
      ? content.description
      : `${content.title} from Nocturne Archive.`;
  const ogImage = content.cover
    ? content.cover.startsWith("http")
      ? content.cover
      : `https://jaychothiyawala.space${content.cover}`
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: content.title,
    description,
    author: {
      "@type": "Person",
      name: "Nocturne Archive",
    },
    publisher: {
      "@type": "Organization",
      name: "Nocturne Archive",
      logo: {
        "@type": "ImageObject",
        url: "https://jaychothiyawala.space/favicon.ico",
      },
    },
    datePublished: content.date,
    url: canonicalUrl,
    image: ogImage,
    keywords: content.tags.join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />
      <div className="reading-header">
        <div className="reading-topbar">
          <p className="reading-back-link">
            <Link href="/writings">Return to archive</Link>
          </p>
          <ReadingTextSizeControl />
        </div>
      </div>
      <ArticleShell
        title={content.title}
        meta={`${content.date ? content.date : "Undated"}${content.readTime ? ` · ${content.readTime}` : ""}`}
      >
        <MarkdownContent
          content={content.markdown}
          stripFirstHeading={content.title}
        />
      </ArticleShell>
    </>
  );
}
