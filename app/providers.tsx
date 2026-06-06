"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ShopifyProvider } from "@/contexts/shopify-context";

const SHOPIFY_DOMAIN =
  process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ?? "mock.shop";
const STOREFRONT_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "";

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <ShopifyProvider domain={SHOPIFY_DOMAIN} token={STOREFRONT_TOKEN}>
      {children}
    </ShopifyProvider>
  );
}
