// Storefront configuration, read from the environment in one place.
//
// These are all `NEXT_PUBLIC_*`, so Next inlines them at build time and they are
// safe to read from client components as well as server code.
export const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;

/**
 * Public Storefront API access token. Safe to expose to the browser — that is
 * what "public" means here. Omitted for tokenless storefronts such as
 * `mock.shop`. Never put a *private* token behind a `NEXT_PUBLIC_` name.
 */
export const SHOPIFY_PUBLIC_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_PUBLIC_ACCESS_TOKEN;

export const SHOPIFY_API_VERSION =
  process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2026-07';
