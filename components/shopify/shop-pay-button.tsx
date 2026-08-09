'use client';

import React from 'react';
import { SHOPIFY_STORE_DOMAIN } from '@/services/shopify/config';
import ShopPayLogo from '@/components/shopify/shop-pay-logo';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';

export interface ShopPayVariant {
  id: string;
  quantity?: number;
}

interface ShopPayButtonProps {
  variants: ShopPayVariant[];
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  /** Used when no permalink can be built (missing domain or unusable IDs). */
  onFallbackClick?: () => void;
}

// Cart permalinks need the bare numeric ID; the Storefront API returns GIDs.
function toNumericVariantId(id: string): string | null {
  const trimmed = id.trim();
  const gid = trimmed.match(/^gid:\/\/shopify\/ProductVariant\/(\d+)/);
  if (gid) return gid[1];
  return /^\d+$/.test(trimmed) ? trimmed : null;
}

function toStoreUrl(domain?: string): string | null {
  if (!domain) return null;
  try {
    return new URL(domain.startsWith('http') ? domain : `https://${domain}`)
      .origin;
  } catch {
    return null;
  }
}

// https://{shop}/cart/{variantId}:{qty},{variantId}:{qty}?payment=shop_pay
// Loads the cart and drops the buyer straight into the Shop Pay checkout.
export function buildShopPayUrl(variants: ShopPayVariant[]): string | null {
  const storeUrl = toStoreUrl(SHOPIFY_STORE_DOMAIN);
  if (!storeUrl || variants.length === 0) return null;

  const lines: string[] = [];
  for (const { id, quantity = 1 } of variants) {
    const numericId = toNumericVariantId(id);
    if (!numericId || !Number.isInteger(quantity) || quantity < 1) return null;
    lines.push(`${numericId}:${quantity}`);
  }

  return `${storeUrl}/cart/${lines.join(',')}?payment=shop_pay`;
}

const BUTTON_CLASSES =
  'flex h-11 w-full cursor-pointer items-center justify-center rounded-md bg-shop px-4 text-white transition-colors hover:bg-shop/85 disabled:cursor-not-allowed disabled:opacity-50';

const ShopPayButton: React.FC<ShopPayButtonProps> = ({
  variants,
  disabled = false,
  loading = false,
  className = '',
  onFallbackClick,
}) => {
  const shopPayUrl = buildShopPayUrl(variants);
  const contents = (
    <>
      <span className="sr-only">Buy with</span>
      {loading ? <Loader size={16} /> : <ShopPayLogo />}
    </>
  );

  // An anchor keeps the checkout URL visible, openable in a new tab, and
  // navigable without JS; the button only stands in when there's no URL.
  if (shopPayUrl && !disabled) {
    return (
      <a
        href={shopPayUrl}
        className={`${BUTTON_CLASSES} ${className}`.trim()}
      >
        {contents}
      </a>
    );
  }

  return (
    <Button
      type="button"
      onClick={onFallbackClick}
      disabled={disabled || (!shopPayUrl && !onFallbackClick)}
      className={`${BUTTON_CLASSES} ${className}`.trim()}
    >
      {contents}
    </Button>
  );
};

export default ShopPayButton;
