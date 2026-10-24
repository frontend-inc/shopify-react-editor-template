import { Config, Data } from '@reacteditor/core';

import type { HeaderBlockProps } from '@/components/shopify/header.config';
import type { FooterBlockProps } from '@/components/shopify/footer.config';
import type { ProductsBlockProps } from '@/components/shopify/products.config';
import type { CollectionsBlockProps } from '@/components/shopify/collections.config';
import type { CollectionDetailBlockProps } from '@/components/shopify/collection-detail.config';
import type { ProductDetailBlockProps } from '@/components/shopify/product-detail.config';
import type { ProductRecommendationsBlockProps } from '@/components/shopify/product-recommendations.config';
import type { SearchResultsBlockProps } from '@/components/shopify/search-results.config';
import type { StoreAssistantBlockProps } from '@/components/shopify/store-assistant.config';
import type { ContentSectionProps } from '@/components/shopify/content-section';
import type { PolicyBodyProps } from '@/components/shopify/policy-body';

import type { AppLayoutProps } from '@/components/shopify/app-layout.config';

import type { MetadataProps } from './metadata';

export type { MetadataProps } from './metadata';

export type Components = {
  AppLayout: AppLayoutProps;
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
  metadata: MetadataProps;
  categories: ['navigation', 'commerce', 'content'];
}>;

export type UserData = Data<Components, MetadataProps>;
