const CONFIGURED_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN?.trim();

// Falls back to the tokenless mock.shop demo store when the variable is unset
// or blank — the Storefront client rejects an empty domain.
export const SHOPIFY_STORE_DOMAIN = CONFIGURED_STORE_DOMAIN || 'mock.shop';

// Never assign a private token to this public environment variable. Only used
// alongside a configured domain: a token belongs to one store, so it is never
// sent to the mock.shop fallback.
export const SHOPIFY_PUBLIC_ACCESS_TOKEN = CONFIGURED_STORE_DOMAIN
  ? process.env.NEXT_PUBLIC_SHOPIFY_PUBLIC_ACCESS_TOKEN?.trim() || undefined
  : undefined;

export const SHOPIFY_API_VERSION =
  process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2026-07';
