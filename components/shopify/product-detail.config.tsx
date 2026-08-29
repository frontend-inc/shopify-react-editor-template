import { ComponentConfig } from '@reacteditor/core';
import type { ShopifyProduct } from '@reacteditor/plugin-shopify';
import { Tag } from 'lucide-react';
import ProductDetail from '@/components/shopify/product-detail';

export type ProductDetailBlockProps = {
  product?: ShopifyProduct | null;
  addToCartLabel?: string;
};

const productDetailEditor: ComponentConfig<ProductDetailBlockProps> = {
  label: 'Product page',
  icon: <Tag size={16} />,
  category: 'commerce',
  defaultProps: {
    product: null,
    addToCartLabel: 'Add to Cart',
  },
  fields: {
    product: {
      label: 'Product',
      type: 'shopifyProduct',
    } as any,
    addToCartLabel: {
      label: 'Add to cart label',
      type: 'text',
      contentEditable: true,
    },
  },
  render: ({ product, addToCartLabel }) => (
    <ProductDetail handle={product?.handle} addToCartLabel={addToCartLabel} />
  ),
};

export default productDetailEditor;
