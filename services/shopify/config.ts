export const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;

// Never assign a private token to this public environment variable.
export const SHOPIFY_PUBLIC_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_PUBLIC_ACCESS_TOKEN;

export const SHOPIFY_API_VERSION =
  process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2026-07';
