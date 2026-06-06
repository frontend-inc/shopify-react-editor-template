import headerEditor from "@/components/header/header.editor";
import footerEditor from "@/components/footer/footer.editor";

import coverEditor from "@/components/cover/cover.editor";
import newsletterCtaEditor from "@/components/newsletter-cta/newsletter-cta.editor";

import featuredProductEditor from "@/components/shopify/featured-product.editor";
import productsGridEditor from "@/components/shopify/products-grid.editor";
import productsCarouselEditor from "@/components/shopify/products-carousel.editor";
import collectionGridEditor from "@/components/shopify/collection-grid.editor";
import collectionEditor from "@/components/shopify/collection.editor";
import productDetailsEditor from "@/components/shopify/product-details.editor";
import recommendedProductsEditor from "@/components/shopify/recommended-products.editor";
import productRecommendationsEditor from "@/components/shopify/product-recommendations.editor";
import searchProductsEditor from "@/components/shopify/search-products.editor";

import Root from "@/config/root";
import type { UserConfig } from "@/config/types";

const categories = {
  header: { title: "Header" },
  cover: { title: "Cover" },
  commerce: { title: "Commerce" },
  content: { title: "Content" },
  footer: { title: "Footer" },
};

export const appConfig: UserConfig = {
  root: Root,
  categories,
  components: {
    header: headerEditor,
    footer: footerEditor,
    cover: coverEditor,
    "newsletter-cta": newsletterCtaEditor,
    "featured-product": featuredProductEditor,
    "products-grid": productsGridEditor,
    "products-carousel": productsCarouselEditor,
    "collection-grid": collectionGridEditor,
    collection: collectionEditor,
    "product-details": productDetailsEditor,
    "recommended-products": recommendedProductsEditor,
    "product-recommendations": productRecommendationsEditor,
    "search-products": searchProductsEditor,
  } as any,
};
