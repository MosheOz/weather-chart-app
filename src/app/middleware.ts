import { NextRequest, NextResponse } from "next/server";

// Dev-only in-memory store (replace with Redis for production)
const ipHits = new Map<string, { count: number; lastHit: number }>();
const MAX_REQUESTS = 100;
const WINDOW_MS = 60 * 1000; // 1 minute

export function middleware(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const now = Date.now();
  const hit = ipHits.get(ip);

  if (hit && now - hit.lastHit < WINDOW_MS) {
    hit.count += 1;
    if (hit.count > MAX_REQUESTS) {
      return new NextResponse("Too many requests", { status: 429 });
    }
  } else {
    ipHits.set(ip, { count: 1, lastHit: now });
  }

  // Create response and add secure headers
  const response = NextResponse.next();
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline';"
  );
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");

  return response;
}

export const config = {
  matcher: ["/api/:path*"], // Apply to API routes only
};
