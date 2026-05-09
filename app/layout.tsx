import type { Metadata, Viewport } from "next";
import Link from "next/link";
import YouTubeAutoplay from "@/components/YouTubeAutoplay";
import NavbarMusicToggle from "@/components/NavbarMusicToggle";
import "./globals.css";

const siteUrl = "https://jaychothiyawala.space";

function normalizeGoogleVerificationToken(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return undefined;
  }

  const decoded = trimmed
    .replaceAll("&quot;", '"')
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&#34;", '"')
    .replaceAll("&#39;", "'");

  const tokenOnlyMatch = decoded.match(/^[A-Za-z0-9_-]{20,}$/);
  if (tokenOnlyMatch) {
    return decoded;
  }

  const contentMatch = decoded.match(/content\s*=\s*["']([^"']+)["']/i);
  if (contentMatch?.[1]) {
    return contentMatch[1].trim();
  }

  return undefined;
}

const googleVerificationTokens = [
  process.env.GOOGLE_SITE_VERIFICATION,
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  process.env.GOOGLE_VERIFICATION_TOKEN,
  "I31M4VgmGfUERS25jqGM8I9QGhfCaQqwECvfteWZTEA",
  "vcEV6MNHGAPC9ySh7ziK61EQvbwxmlQhXRQoUG5r8D4",
]
  .map((token) => normalizeGoogleVerificationToken(token))
  .filter((token): token is string => Boolean(token && token.length > 0))
  .filter((token, index, all) => all.indexOf(token) === index);

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Nocturne Archive",
      url: siteUrl,
      sameAs: [siteUrl],
      description:
        "A quiet reading space for essays, reflections, and stories.",
    },
    {
      "@type": "WebSite",
      name: "Nocturne Archive",
      url: siteUrl,
      inLanguage: "en-US",
      description:
        "Personal essays, reflections, and stories.",
      potentialAction: {
        "@type": "ReadAction",
        target: `${siteUrl}/writings`,
      },
    },
    {
      "@type": "Organization",
      name: "Nocturne Archive",
      url: siteUrl,
      logo: `${siteUrl}/favicon.ico`,
    },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f5f1e8",
};

export const metadata: Metadata = {
  title: {
    default: "Nocturne Archive",
    template: "%s | Nocturne Archive",
  },
  description:
    "A quiet reading space for personal essays, reflections, and stories at jaychothiyawala.space.",
  metadataBase: new URL(siteUrl),
  applicationName: "Nocturne Archive",
  keywords: [
    "Nocturne Archive",
    "quiet reading space",
    "personal essays",
    "long-form writing",
    "reflections",
    "stories",
  ],
  creator: "Nocturne Archive",
  publisher: "Nocturne Archive",
  category: "blog",
  referrer: "origin-when-cross-origin",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Nocturne Archive",
    url: siteUrl,
    title: "Nocturne Archive",
    description:
      "A quiet reading space for personal essays, reflections, and stories.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Nocturne Archive",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@nocturnearchive",
    creator: "@jaychothiyawala",
    title: "Nocturne Archive",
    description:
      "Personal essays, reflections, and stories.",
    images: ["/twitter-image"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification:
    googleVerificationTokens.length > 0
      ? {
          google:
            googleVerificationTokens.length === 1
              ? googleVerificationTokens[0]
              : googleVerificationTokens,
        }
      : undefined,
  authors: [{ name: "Nocturne Archive" }],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <div className="site-shell">
          <header className="site-header">
            <div className="site-header-inner">
              <div className="site-brand">
                <Link href="/writings" className="site-brand-link">
                  <span className="site-brand-mark">Nocturne Archive</span>
                  <span className="site-brand-subtitle">
                    A quiet room for reading and reflection
                  </span>
                </Link>
              </div>

              <nav aria-label="Primary navigation" className="site-nav">
                <Link href="/writings">Writings</Link>
                <Link href="/about">About</Link>
                <NavbarMusicToggle />
              </nav>
            </div>
          </header>

          <main className="content-wrap">{children}</main>

          {/* Ambient YouTube (autoplay with sound). Falls back to muted if blocked. */}
          <YouTubeAutoplay videoId="SllpB3W5f6s" startMuted={false} />

          <footer className="site-footer">
            <div className="site-footer-inner">
              <p className="site-footer-line">
                Where ink lingers and silence learns to speak.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
