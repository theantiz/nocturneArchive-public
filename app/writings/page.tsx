import type { Metadata } from "next";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { getAllMarkdownEntries } from "@/lib/content";

type WritingsPageProps = {
  searchParams: Promise<{ tag?: string | string[] }>;
};

function readSelectedTag(tag: string | string[] | undefined) {
  if (typeof tag === "string") {
    return tag;
  }

  if (Array.isArray(tag) && typeof tag[0] === "string") {
    return tag[0];
  }

  return null;
}

export const metadata: Metadata = {
  title: "Writings",
  description:
    "Complete archive of essays, reflections, and stories. Long-form writing on culture, psychology, technology, and personal experience.",
  keywords: [
    "Nocturne Archive writings",
    "Nocturne Archive essays",
    "Nocturne Archive",
    "long-form writing",
    "personal essays",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Nocturne Archive",
    title: "Writings | Nocturne Archive",
    description:
      "Complete archive of essays, reflections, and stories. Long-form writing on culture, psychology, technology, and personal experience.",
    url: "https://jaychothiyawala.space/writings",
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
    title: "Writings | Nocturne Archive",
    description:
      "Complete archive of essays, reflections, and stories. Long-form writing on culture, psychology, technology, and personal experience.",
    images: ["/twitter-image"],
  },
  alternates: {
    canonical: "https://jaychothiyawala.space/writings",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function WritingsPage({
  searchParams,
}: WritingsPageProps) {
  const entries = await getAllMarkdownEntries();
  const tagCounts = entries.reduce<Record<string, number>>((acc, entry) => {
    for (const tag of entry.tags) {
      acc[tag] = (acc[tag] ?? 0) + 1;
    }

    return acc;
  }, {});
  const selectedTag = readSelectedTag((await searchParams).tag);
  const allTags = Array.from(
    new Set(entries.flatMap((entry) => entry.tags.map((tag) => tag.trim()))),
  )
    .filter((tag) => tag.length > 0)
    .sort((a, b) => a.localeCompare(b));
  const hasSelectedTag =
    selectedTag !== null && allTags.some((tag) => tag === selectedTag);
  const filteredEntries = hasSelectedTag
    ? entries.filter((entry) => entry.tags.includes(selectedTag))
    : entries;

  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Writings by Nocturne Archive",
    itemListElement: filteredEntries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.title,
      url: `https://jaychothiyawala.space${entry.route}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }}
      />
      <section className="manuscript archive-page">
        <header className="archive-hero">
          <h1 className="archive-title">Writings by Jay Chothiyawala</h1>
          <p className="archive-intro">
            A living archive of essays, reflections, and stories.
          </p>
        </header>

        <nav className="archive-toolbar" aria-label="Filter writings by tag">
          <p className="archive-toolbar-copy">
            Filter by theme
            {hasSelectedTag ? ` · ${selectedTag}` : " · all writings"}
          </p>
          <div className="archive-filter">
            <Link
              href="/writings"
              className={`archive-filter-link${
                hasSelectedTag ? "" : " archive-filter-link-active"
              }`}
              aria-current={hasSelectedTag ? undefined : "page"}
            >
              <span>All</span>
              <span className="archive-filter-count">{entries.length}</span>
            </Link>
            {allTags.map((tag) => {
              const isActive = hasSelectedTag && selectedTag === tag;

              return (
                <Link
                  key={tag}
                  href={{ pathname: "/writings", query: { tag } }}
                  className={`archive-filter-link${
                    isActive ? " archive-filter-link-active" : ""
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span>{tag}</span>
                  <span className="archive-filter-count">{tagCounts[tag]}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <ul className="archive-list">
          {filteredEntries.map((entry, index) => (
            <ScrollReveal key={entry.route} delay={index * 80}>
              <li className="archive-item">
                <div className="archive-entry-head">
                  <span className="archive-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Link href={entry.route} className="archive-link">
                    {entry.title}
                  </Link>
                </div>
                <div className="archive-meta-row">
                  {entry.date ? (
                    <span className="archive-meta">{entry.date}</span>
                  ) : null}
                  {entry.readTime ? (
                    <span className="archive-meta">{entry.readTime}</span>
                  ) : null}
                </div>
                {entry.description ? (
                  <p className="archive-description">{entry.description}</p>
                ) : null}
                {entry.tags.length > 0 ? (
                  <p className="archive-tags">
                    {entry.tags.map((tag, tagIndex) => (
                      <span key={`${entry.route}-${tag}`}>
                        {tagIndex > 0 ? " · " : ""}
                        <Link
                          href={{ pathname: "/writings", query: { tag } }}
                          className="archive-tag-link"
                        >
                          {tag}
                        </Link>
                      </span>
                    ))}
                  </p>
                ) : null}
              </li>
            </ScrollReveal>
          ))}
        </ul>
        {filteredEntries.length === 0 ? (
          <p className="archive-empty">
            No writings found for this tag. Try another tag or view all.
          </p>
        ) : null}
      </section>
    </>
  );
}
