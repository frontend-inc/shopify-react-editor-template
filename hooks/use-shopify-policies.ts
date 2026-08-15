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

export const POLICY_HANDLES = [
  'terms-of-service',
  'privacy-policy',
  'refund-policy',
  'shipping-policy',
  'subscription-policy',
] as const;

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
