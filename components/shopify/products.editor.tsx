import { ComponentConfig } from '@reacteditor/core';
import type { ShopifyCollection } from '@reacteditor/plugin-shopify';
import { LayoutGrid } from 'lucide-react';
import Products from '@/components/shopify/products';

export type ProductsBlockProps = {
  title?: string;
  subtitle?: string;
  collection?: ShopifyCollection | null;
  limit?: number;
};

/**
 * Column counts, gutters and the card design are fixed in `products.tsx`. The
 * editor picks *which* products appear and what the section says about them.
 */
const productsEditor: ComponentConfig<ProductsBlockProps> = {
  label: 'Product grid',
  icon: <LayoutGrid size={16} />,
  category: 'commerce',
  defaultProps: {
    title: 'Shopify Hydrogen Storefront',
    subtitle:
      'An agent-friendly Shopify storefront built with Next.js and Hydrogen.',
    collection: null,
    limit: 12,
  },
  fields: {
    title: { label: 'Title', type: 'text', contentEditable: true },
    subtitle: { label: 'Subtitle', type: 'textarea', contentEditable: true },
    collection: {
      label: 'Collection',
      // Registered by createShopifyPlugin — a live search against the store.
      // Leave empty to show the newest products across the whole catalogue.
      type: 'shopifyCollection',
    } as any,
    limit: { label: 'Products shown', type: 'number', min: 2, max: 48 },
  },
  render: ({ title, subtitle, collection, limit }) => (
    <Products
      title={title}
      subtitle={subtitle}
      limit={limit}
      collectionHandle={collection?.handle}
    />
  ),
};

export default productsEditor;
