import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

type PageSlug = "home" | "about";

export type MarkdownEntry = {
  slug: string[];
  route: string;
  title: string;
  date?: string;
  description?: string;
  readTime?: string;
  tags: string[];
  cover?: string;
};

function normalizeDate(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  return undefined;
}

function normalizeTags(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function dateSortValue(date?: string) {
  if (!date) {
    return Number.NEGATIVE_INFINITY;
  }

  const timestamp = Date.parse(date);
  return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
}

function toPosixPath(value: string) {
  return value.replaceAll("\\", "/");
}

function buildAbsoluteMarkdownPath(slugParts: string[]) {
  const requestedPath = path.resolve(contentDirectory, ...slugParts) + ".md";

  if (!requestedPath.startsWith(contentDirectory)) {
    return null;
  }

  return requestedPath;
}

async function walkMarkdownFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return walkMarkdownFiles(absolutePath);
      }

      if (entry.isFile() && absolutePath.endsWith(".md")) {
        return [absolutePath];
      }

      return [];
    }),
  );

  return files.flat();
}

export async function getMarkdownContent(slug: PageSlug) {
  return getMarkdownContentBySlug([slug]);
}

export async function getMarkdownContentBySlug(slugParts: string[]) {
  const filePath = buildAbsoluteMarkdownPath(slugParts);

  if (!filePath) {
    return null;
  }

  try {
    const markdown = await readFile(filePath, "utf8");
    const { content, data } = matter(markdown);
    const fallbackTitle = slugParts[slugParts.length - 1] ?? "Untitled";

    return {
      markdown: content,
      title:
        typeof data.title === "string" && data.title.trim().length > 0
          ? data.title
          : fallbackTitle,
      date: normalizeDate(data.date),
      description:
        typeof data.description === "string" ? data.description : undefined,
      readTime: typeof data.readTime === "string" ? data.readTime : undefined,
      tags: normalizeTags(data.tags),
      cover: typeof data.cover === "string" ? data.cover : undefined,
    };
  } catch {
    return null;
  }
}

export async function getAllMarkdownEntries(): Promise<MarkdownEntry[]> {
  const markdownFiles = await walkMarkdownFiles(contentDirectory);

  const entries = await Promise.all(
    markdownFiles.map(async (filePath) => {
      const relativePath = toPosixPath(
        path.relative(contentDirectory, filePath),
      );
      const noExtension = relativePath.replace(/\.md$/i, "");
      const slug = noExtension.split("/");
      const markdown = await readFile(filePath, "utf8");
      const { data } = matter(markdown);
      const fallbackTitle = slug[slug.length - 1] ?? "Untitled";

      return {
        slug,
        route: `/writings/${slug.join("/")}`,
        title:
          typeof data.title === "string" && data.title.trim().length > 0
            ? data.title
            : fallbackTitle,
        date: normalizeDate(data.date),
        description:
          typeof data.description === "string" ? data.description : undefined,
        readTime: typeof data.readTime === "string" ? data.readTime : undefined,
        tags: normalizeTags(data.tags),
        cover: typeof data.cover === "string" ? data.cover : undefined,
      };
    }),
  );

  return entries
    .filter((entry) => entry.slug[0] !== "about" && entry.slug[0] !== "home")
    .sort((a, b) => {
      const byDate = dateSortValue(b.date) - dateSortValue(a.date);

      if (byDate !== 0) {
        return byDate;
      }

      return a.route.localeCompare(b.route);
    });
}
