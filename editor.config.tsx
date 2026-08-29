import Root from '@/config/root';
import type { UserConfig } from '@/config/types';

import headerEditor from '@/components/shopify/header.config';
import footerEditor from '@/components/shopify/footer.config';
import productsEditor from '@/components/shopify/products.config';
import collectionsEditor from '@/components/shopify/collections.config';
import collectionDetailEditor from '@/components/shopify/collection-detail.config';
import productDetailEditor from '@/components/shopify/product-detail.config';
import productRecommendationsEditor from '@/components/shopify/product-recommendations.config';
import searchResultsEditor from '@/components/shopify/search-results.config';
import storeAssistantEditor from '@/components/shopify/store-assistant.config';
import contentSectionEditor from '@/components/shopify/content-section.config';
import policyBodyEditor from '@/components/shopify/policy-body.config';

const categories = {
  navigation: { title: 'Navigation' },
  commerce: { title: 'Commerce' },
  content: { title: 'Content' },
};

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
