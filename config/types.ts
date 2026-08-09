import { Config, Data } from '@reacteditor/core';

import type { HeaderBlockProps } from '@/components/shopify/header.editor';
import type { FooterBlockProps } from '@/components/shopify/footer.editor';
import type { ProductsBlockProps } from '@/components/shopify/products.editor';
import type { CollectionsBlockProps } from '@/components/shopify/collections.editor';
import type { CollectionDetailBlockProps } from '@/components/shopify/collection-detail.editor';
import type { ProductDetailBlockProps } from '@/components/shopify/product-detail.editor';
import type { ProductRecommendationsBlockProps } from '@/components/shopify/product-recommendations.editor';
import type { SearchResultsBlockProps } from '@/components/shopify/search-results.editor';
import type { StoreAssistantBlockProps } from '@/components/shopify/store-assistant.editor';
import type { ContentSectionProps } from '@/components/shopify/content-section';
import type { PolicyBodyProps } from '@/components/shopify/policy-body';

import type { RootProps } from './root';

export type { RootProps } from './root';

export type Components = {
  header: HeaderBlockProps;
  footer: FooterBlockProps;
  products: ProductsBlockProps;
  collections: CollectionsBlockProps;
  'collection-detail': CollectionDetailBlockProps;
  'product-detail': ProductDetailBlockProps;
  'product-recommendations': ProductRecommendationsBlockProps;
  'search-results': SearchResultsBlockProps;
  'store-assistant': StoreAssistantBlockProps;
  'content-section': ContentSectionProps;
  policy: PolicyBodyProps;
};

export type UserConfig = Config<{
  components: Components;
  root: RootProps;
  categories: ['navigation', 'commerce', 'content'];
}>;

export type UserData = Data<Components, RootProps>;
