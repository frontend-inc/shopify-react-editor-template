import Root from '@/config/root';
import type { UserConfig } from '@/config/types';

import headerEditor from '@/components/shopify/header.editor';
import footerEditor from '@/components/shopify/footer.editor';
import productsEditor from '@/components/shopify/products.editor';
import collectionsEditor from '@/components/shopify/collections.editor';
import collectionDetailEditor from '@/components/shopify/collection-detail.editor';
import productDetailEditor from '@/components/shopify/product-detail.editor';
import productRecommendationsEditor from '@/components/shopify/product-recommendations.editor';
import searchResultsEditor from '@/components/shopify/search-results.editor';
import storeAssistantEditor from '@/components/shopify/store-assistant.editor';
import contentSectionEditor from '@/components/shopify/content-section.editor';
import policyBodyEditor from '@/components/shopify/policy-body.editor';

const categories = {
  navigation: { title: 'Navigation' },
  commerce: { title: 'Commerce' },
  content: { title: 'Content' },
};

/**
 * The block library. Every entry pairs a storefront component with a config
 * that exposes *content only* — copy, imagery, and which Shopify product or
 * collection to show. Design decisions (columns, spacing, tone, typography)
 * stay inside the components and `app/globals.css`, so editing a page can
 * never take the storefront off-brand.
 */
export const appConfig: UserConfig = {
  root: Root,
  categories,
  components: {
    header: headerEditor,
    footer: footerEditor,
    products: productsEditor,
    collections: collectionsEditor,
    'collection-detail': collectionDetailEditor,
    'product-detail': productDetailEditor,
    'product-recommendations': productRecommendationsEditor,
    'search-results': searchResultsEditor,
    'store-assistant': storeAssistantEditor,
    'content-section': contentSectionEditor,
    policy: policyBodyEditor,
  } as any,
};

export default appConfig;
