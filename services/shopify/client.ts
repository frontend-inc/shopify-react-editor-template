// Storefront API clients, built on `@shopify/hydrogen`.
//
// Call sites use the package's own API — `storefront.graphql(DOCUMENT, {
// variables })` — and pass the result through `unwrapStorefrontResult`, which
// applies this app's error policy: fail loudly. Hydrogen deliberately does not
// do that itself, because a 200 carrying partial data and GraphQL errors is a
// valid response that some callers want to render.
import {
  createShopifyRequestContext,
  createStorefrontClient,
  type GraphQLFormattedError,
} from '@shopify/hydrogen';
import {
  SHOPIFY_API_VERSION,
  SHOPIFY_PUBLIC_ACCESS_TOKEN,
  SHOPIFY_STORE_DOMAIN,
} from '@/services/shopify/config';

// No incoming request and no buyer context: these clients are module-scoped and
// serve both server rendering and the browser-side hooks, so they must not close
// over per-request state. `$country`/`$language` are injected from this i18n.
const requestContext = createShopifyRequestContext({
  request: { headers: new Headers() },
  i18n: { country: 'US', language: 'EN' },
});

/**
 * Workaround for a bug in this preview build of `@shopify/hydrogen`.
 *
 * The client tags every request with `X-Hydrogen-Version`, but the Storefront
 * API does not list that header in its CORS `access-control-allow-headers`.
 * Browsers therefore reject the preflight and `fetch` throws, which hydrogen
 * reports as the generic "SFAPI request failed". It only bites against real
 * stores — `mock.shop` answers `access-control-allow-headers: *`.
 *
 * Stripped in the browser only: server-side requests are not subject to CORS,
 * so they keep sending the header. Remove this once the API allows it (or once
 * these queries move server-side, which is the better long-term fix).
 */
const CORS_BLOCKED_HEADERS = ['X-Hydrogen-Version'];

// Hydrogen calls `fetch(url, init, cacheOptions)`; Next's caching hints ride
// along on `init`, which is how the two ways of caching get to coexist.
const fetchWith = (overrides: RequestInit): typeof globalThis.fetch =>
  ((url, init) => {
    const headers = new Headers(init?.headers);

    if (typeof document !== 'undefined') {
      for (const header of CORS_BLOCKED_HEADERS) headers.delete(header);
    }

    return globalThis.fetch(url, { ...init, ...overrides, headers });
  }) as typeof globalThis.fetch;

const config = {
  storeDomain: SHOPIFY_STORE_DOMAIN!,
  apiVersion: SHOPIFY_API_VERSION,
  publicStorefrontToken: SHOPIFY_PUBLIC_ACCESS_TOKEN,
};

/**
 * Default client. Uncached, because carts and customer reads must never serve a
 * stale response.
 */
export const storefront = createStorefrontClient({
  type: 'public',
  requestContext,
  config: { ...config, fetch: fetchWith({ cache: 'no-store' }) },
});

/**
 * Client for data that changes rarely (shop policies, and anything else safe to
 * serve from Next's data cache for an hour).
 */
export const cachedStorefront = createStorefrontClient({
  type: 'public',
  requestContext,
  config: { ...config, fetch: fetchWith({ next: { revalidate: 3600 } }) },
});

/**
 * Returns the data from a `graphql()` result, throwing if Shopify reported any
 * GraphQL errors. Transport failures — non-200, timeouts, unparseable bodies —
 * have already thrown as `StorefrontApiError` by this point.
 *
 * `operation` names the query in the log and the thrown message, so a failure
 * points at the call site rather than just at "Shopify".
 */
export function unwrapStorefrontResult<TData>(
  result: { data: TData | null; errors?: GraphQLFormattedError[] },
  operation: string
): TData {
  if (result.errors?.length) {
    console.error(`Shopify GraphQL errors (${operation}):`, result.errors);
    throw new Error(
      `Shopify GraphQL errors (${operation}): ${JSON.stringify(result.errors)}`
    );
  }

  if (result.data == null) {
    throw new Error(`Shopify returned no data for ${operation}.`);
  }

  return result.data;
}
