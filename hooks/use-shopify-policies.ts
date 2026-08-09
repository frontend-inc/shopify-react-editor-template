import {
  cachedStorefront,
  unwrapStorefrontResult,
} from '@/services/shopify/client';
import { GET_SHOP_POLICIES_QUERY } from '@/graphql/policies';

export interface ShopPolicy {
  id: string;
  title: string;
  handle: string;
  body: string;
  url: string;
}

// Handles Shopify uses for each policy — also the routes under /policies/[handle].
export const POLICY_HANDLES = [
  'terms-of-service',
  'privacy-policy',
  'refund-policy',
  'shipping-policy',
  'subscription-policy',
] as const;

// Policies change rarely, so this reads through the cached client (revalidated
// hourly) rather than the no-store one used for carts and products.
export async function getShopPolicies(): Promise<ShopPolicy[]> {
  try {
    const data = unwrapStorefrontResult(
      await cachedStorefront.graphql(GET_SHOP_POLICIES_QUERY),
      'GetShopPolicies'
    );

    return Object.values(data.shop ?? {}).filter(
      (policy): policy is ShopPolicy => Boolean(policy?.handle)
    );
  } catch (err) {
    // A storefront without policies configured shouldn't break the footer.
    console.error('Failed to load shop policies:', err);
    return [];
  }
}

export async function getShopPolicy(
  handle: string
): Promise<ShopPolicy | null> {
  const policies = await getShopPolicies();
  return policies.find((policy) => policy.handle === handle) ?? null;
}
