import { ImageResponse } from "next/og";

const siteName = "Nocturne Archive";
const siteTagline = "A quiet archive for long-form reading";
const siteUrl = "jaychothiyawala.space";

export const socialImageSize = {
  width: 1200,
  height: 630,
};

export function createSocialImage(title: string, subtitle: string) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px",
        background:
          "linear-gradient(135deg, #f5f1e8 0%, #e7dcc7 52%, #d7c3a5 100%)",
        color: "#241a16",
        fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 28,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        <span>{siteName}</span>
        <span>{siteUrl}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            width: 96,
            height: 2,
            background: "#241a16",
            opacity: 0.4,
          }}
        />
        <h1
          style={{
            margin: 0,
            fontSize: 78,
            lineHeight: 1.02,
            fontWeight: 700,
            maxWidth: 900,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 30,
            lineHeight: 1.35,
            maxWidth: 820,
            opacity: 0.88,
          }}
        >
          {subtitle}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          fontSize: 24,
          opacity: 0.82,
        }}
      >
        <span>{siteTagline}</span>
        <span>Jay Chothiyawala</span>
      </div>
    </div>,
    socialImageSize,
  );
}
