"use client";

import { useParams } from "next/navigation";

/**
 * Returns the last segment of the current catch-all slug route, e.g. the
 * `cool-shirt` in `/products/cool-shirt`. Components use this to derive the
 * resource they should load from the Next.js route segments directly.
 */
export function useRouteSegment(): string | undefined {
  const params = useParams();
  const segments = Array.isArray(params?.slug) ? (params.slug as string[]) : [];
  // Editor routes are served under `/editor/*`; ignore that prefix so the
  // resolved segment matches the public route.
  const routeSegments = segments[0] === "editor" ? segments.slice(1) : segments;
  return routeSegments[routeSegments.length - 1];
}
