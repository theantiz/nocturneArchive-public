import ScrollReveal from "@/components/ScrollReveal";

type ArticleShellProps = {
  title: string;
  eyebrow?: string;
  meta?: string;
  children: React.ReactNode;
};

export default function ArticleShell({
  title,
  eyebrow,
  meta,
  children,
}: ArticleShellProps) {
  return (
    <article className="article-shell">
      <header className="article-header">
        {eyebrow ? <p className="article-eyebrow">{eyebrow}</p> : null}
        {meta ? <p className="reading-meta">{meta}</p> : null}
        <h1 className="article-title">{title}</h1>
        <div className="article-title-divider" aria-hidden="true" />
      </header>
      <ScrollReveal>
        <div className="article-body">{children}</div>
      </ScrollReveal>
    </article>
  );
}
