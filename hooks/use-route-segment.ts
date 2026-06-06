"use client";

import { useParams } from "next/navigation";

/**
 * Returns the dynamic handle of the current route, e.g. the `cool-shirt` in
 * `/products/cool-shirt` (or its `/products/cool-shirt/editor` editor view).
 * Both the public and editor routes share the same `[handle]` segment, so the
 * value is identical in either context.
 */
export function useRouteSegment(): string | undefined {
  const params = useParams();
  const handle = params?.handle;
  return typeof handle === "string" ? handle : undefined;
}
