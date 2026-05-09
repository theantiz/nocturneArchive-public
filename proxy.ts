import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const CANONICAL_HOST = "nocturne.antiz.xyz";
const LEGACY_HOSTS = new Set([
  "nocturne-archive.vercel.app",
  "www.nocturne.antiz.xyz",
]);

export function proxy(request: NextRequest) {
  const hostHeader = request.headers.get("host");

  if (!hostHeader) {
    return NextResponse.next();
  }

  const host = hostHeader.toLowerCase().split(":")[0];

  if (host === CANONICAL_HOST || !LEGACY_HOSTS.has(host)) {
    return NextResponse.next();
  }

  const canonicalUrl = request.nextUrl.clone();
  canonicalUrl.protocol = "https";
  canonicalUrl.host = CANONICAL_HOST;

  return NextResponse.redirect(canonicalUrl, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
