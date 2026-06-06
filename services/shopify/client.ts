export const SHOPIFY_API_VERSION = '2026-04';

type Credentials = {
  domain: string;
  token: string;
};

let currentCreds: Partial<Credentials> = {};

export function setShopifyCredentials(creds: Credentials) {
  currentCreds = { domain: creds.domain, token: creds.token };
}

export function getShopifyCredentials(): Partial<Credentials> {
  return currentCreds;
}

export const SHOPIFY_STORE_DOMAIN = currentCreds.domain ?? '';

export async function shopifyFetch<T = any>({
  query,
  variables = {},
  credentials,
}: {
  query: string;
  variables?: Record<string, any>;
  credentials?: Partial<Credentials>;
}): Promise<{ data: T; errors?: any[] }> {
  const domain = credentials?.domain ?? currentCreds.domain;
  const token = credentials?.token ?? currentCreds.token;
  const apiVersion = SHOPIFY_API_VERSION;

  if (!domain) {
    throw new Error(
      '[shopifyFetch] missing domain. Wrap your tree in <ShopifyProvider domain="..."> or call setShopifyCredentials() before rendering.',
    );
  }

  const url = `https://${domain}/api/${apiVersion}/graphql.json`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['X-Shopify-Storefront-Access-Token'] = token;
  }
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Shopify HTTP ${response.status}: ${body}`);
  }

  const json = await response.json();
  if (json.errors) {
    throw new Error(`Shopify GraphQL errors: ${JSON.stringify(json.errors)}`);
  }
  return json;
}
