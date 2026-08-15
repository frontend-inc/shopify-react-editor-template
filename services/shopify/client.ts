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

// Shared clients must not capture per-request buyer state.
const requestContext = createShopifyRequestContext({
  request: { headers: new Headers() },
  i18n: { country: 'US', language: 'EN' },
});

// Real stores reject this Hydrogen header during browser CORS preflight.
const CORS_BLOCKED_HEADERS = ['X-Hydrogen-Version'];

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

/** Uncached client for carts and customer data. */
export const storefront = createStorefrontClient({
  type: 'public',
  requestContext,
  config: { ...config, fetch: fetchWith({ cache: 'no-store' }) },
});

/** One-hour cache for stable storefront data. */
export const cachedStorefront = createStorefrontClient({
  type: 'public',
  requestContext,
  config: { ...config, fetch: fetchWith({ next: { revalidate: 3600 } }) },
});

/** Returns GraphQL data or throws the first Shopify error. */
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
