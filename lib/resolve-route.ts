import schema from "@/app.schema.json";

export type ResolvedRoute = {
  key: string;
  path: string;
  params: Record<string, string>;
};

const ROUTE_KEYS = Object.keys(schema as Record<string, unknown>);

/**
 * Matches a concrete path's segments against a single express-style pattern
 * (e.g. `/products/:handle`). Returns the captured params, or null on mismatch.
 */
const matchPattern = (
  pattern: string,
  segments: string[],
): Record<string, string> | null => {
  const patternSegments = pattern === "/" ? [] : pattern.slice(1).split("/");
  if (patternSegments.length !== segments.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < patternSegments.length; i++) {
    const part = patternSegments[i];
    if (part.startsWith(":")) {
      params[part.slice(1)] = segments[i];
    } else if (part !== segments[i]) {
      return null;
    }
  }
  return params;
};

/**
 * Resolves catch-all slug segments to a route key defined in the schema,
 * supporting any express-style pattern (`/products/:handle`, `/blog/:slug`,
 * etc.). Static segments are preferred over dynamic ones when both match.
 */
const resolveRoute = (segments: string[] = []): ResolvedRoute => {
  // Editor routes live under `/editor/*`; the `editor` prefix is not part of
  // the schema route keys, so strip it before matching.
  const routeSegments =
    segments[0] === "editor" ? segments.slice(1) : segments;
  const path =
    routeSegments.length === 0 ? "/" : `/${routeSegments.join("/")}`;

  let best: ResolvedRoute | null = null;
  let bestDynamicCount = Infinity;

  for (const key of ROUTE_KEYS) {
    const params = matchPattern(key, routeSegments);
    if (!params) continue;

    const dynamicCount = Object.keys(params).length;
    if (dynamicCount < bestDynamicCount) {
      best = { key, path, params };
      bestDynamicCount = dynamicCount;
    }
  }

  return best ?? { key: path, path, params: {} };
};

export default resolveRoute;
