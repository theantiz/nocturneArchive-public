"use client";

import React, { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  content: string;
  stripFirstHeading?: string;
  className?: string;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripDuplicateHeading(content: string, heading?: string) {
  let normalized = content.replace(/^\uFEFF/, "").trimStart();

  function dedentCommonIndent(text: string) {
    const lines = text.split(/\r?\n/);
    const nonEmpty = lines.filter((l) => l.trim().length > 0);
    if (nonEmpty.length === 0) return text;
    const indents = nonEmpty.map((l) => {
      const m = l.match(/^(\s+)/);
      return m ? m[1].length : 0;
    });
    const minIndent = Math.min(...indents);
    if (minIndent >= 2) {
      return lines
        .map((l) => (l.startsWith(" ") ? l.slice(minIndent) : l))
        .join("\n");
    }
    return text;
  }

  normalized = dedentCommonIndent(normalized);

  if (heading) {
    const exactPattern = new RegExp(
      `^#\\s+${escapeRegExp(heading)}\\s*(\\r?\\n)+`,
      "i",
    );
    if (exactPattern.test(normalized)) {
      return normalized.replace(exactPattern, "");
    }
  }

  normalized = normalized.replace(/^#\s+.*(\r?\n)+/i, "");
  normalized = normalized.replace(/^[^\r\n]+\r?\n=+\r?\n+/i, "");

  return normalized;
}

function CodeBlock({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const code = String(children).replace(/\n$/, "");
  const match = /language-(\w+)/.exec(className || "");
  const language = match?.[1] || "text";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ position: "relative", margin: "1rem 0" }}>
      <button
        onClick={handleCopy}
        style={{
          position: "absolute",
          right: "0.5rem",
          top: "0.5rem",
          fontSize: "0.75rem",
          background: "rgba(28, 20, 13, 0.85)",
          color: "#fdfbf6",
          padding: "0.25rem 0.6rem",
          borderRadius: "0.25rem",
          border: "none",
          cursor: "pointer",
        }}
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: "0.4rem",
          paddingTop: "2.5rem",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default function MarkdownContent({
  content,
  stripFirstHeading,
  className = "",
}: Props) {
  const normalizedContent = useMemo(() => {
    return stripDuplicateHeading(content, stripFirstHeading);
  }, [content, stripFirstHeading]);

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1>{children}</h1>,
          h2: ({ children }) => <h2>{children}</h2>,
          h3: ({ children }) => <h3>{children}</h3>,
          p: ({ children }) => <p>{children}</p>,
          a: ({ children, href }) => {
            const isExternal = href?.startsWith("http");
            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
              >
                {children}
              </a>
            );
          },
          img: ({ src, alt }) => (
            <img
              src={src || ""}
              alt={alt || ""}
              loading="lazy"
            />
          ),
          blockquote: ({ children }) => <blockquote>{children}</blockquote>,
          ul: ({ children }) => <ul>{children}</ul>,
          ol: ({ children }) => <ol>{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          code: ({ className, children }) => {
            const isInline = !className;
            return isInline ? (
              <code>{children}</code>
            ) : (
              <CodeBlock className={className}>{children}</CodeBlock>
            );
          },
          hr: () => <hr />,
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
}
