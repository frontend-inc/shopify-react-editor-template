import { ComponentConfig } from '@reacteditor/core';
import type { ShopifyProduct } from '@reacteditor/plugin-shopify';
import { Sparkles } from 'lucide-react';
import ProductRecommendations from '@/components/shopify/product-recommendations';

export type ProductRecommendationsBlockProps = {
  title?: string;
  product?: ShopifyProduct | null;
  limit?: number;
};

const productRecommendationsEditor: ComponentConfig<ProductRecommendationsBlockProps> =
  {
    label: 'Recommended products',
    icon: <Sparkles size={16} />,
    category: 'commerce',
    defaultProps: {
      title: 'You May Also Like',
      product: null,
      limit: 4,
    },
    fields: {
      title: { label: 'Title', type: 'text', contentEditable: true },
      product: {
        label: 'Seed product',
        type: 'shopifyProduct',
      } as any,
      limit: { label: 'Products shown', type: 'number', min: 2, max: 12 },
    },
    render: ({ title, product, limit }) => (
      <ProductRecommendations
        title={title}
        handle={product?.handle}
        limit={limit}
      />
    ),
  };

export default productRecommendationsEditor;
