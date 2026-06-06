import navigationEditor from "@/components/navigation/navigation.editor";
import footerEditor from "@/components/footer/footer.editor";

import heroEditor from "@/components/hero/hero.editor";
import bannerEditor from "@/components/landing/banner.editor";

import featuredProductEditor from "@/components/commerce/featured-product.editor";
import productsGridEditor from "@/components/commerce/products-grid.editor";
import productsCarouselEditor from "@/components/commerce/products-carousel.editor";
import collectionGridEditor from "@/components/commerce/collection-grid.editor";
import collectionEditor from "@/components/commerce/collection.editor";
import productDetailsEditor from "@/components/commerce/product-details.editor";
import recommendedProductsEditor from "@/components/commerce/recommended-products.editor";
import productRecommendationsEditor from "@/components/commerce/product-recommendations.editor";
import searchProductsEditor from "@/components/commerce/search-products.editor";

import featuresEditor from "@/components/features/features.editor";
import testimonialsEditor from "@/components/testimonials/testimonials.editor";
import imageGalleryEditor from "@/components/landing/image-gallery.editor";
import newsletterCtaEditor from "@/components/landing/newsletter-cta.editor";
import logosEditor from "@/components/logos/logos.editor";
import ctaEditor from "@/components/cta/cta.editor";
import faqEditor from "@/components/faq/faq.editor";

import Root from "@/config/root";
import type { UserConfig } from "@/config/types";

const categories = {
  navigation: { title: "Navigation" },
  hero: { title: "Hero & Banners" },
  commerce: { title: "Commerce" },
  content: { title: "Content" },
  footer: { title: "Footer" },
};

export const appConfig: UserConfig = {
  root: Root,
  categories,
  components: {
    navigation: navigationEditor,
    footer: footerEditor,
    hero: heroEditor,
    banner: bannerEditor,
    "featured-product": featuredProductEditor,
    "products-grid": productsGridEditor,
    "products-carousel": productsCarouselEditor,
    "collection-grid": collectionGridEditor,
    collection: collectionEditor,
    "product-details": productDetailsEditor,
    "recommended-products": recommendedProductsEditor,
    "product-recommendations": productRecommendationsEditor,
    "search-products": searchProductsEditor,
    features: featuresEditor,
    testimonials: testimonialsEditor,
    "image-gallery": imageGalleryEditor,
    "newsletter-cta": newsletterCtaEditor,
    logos: logosEditor,
    cta: ctaEditor,
    faq: faqEditor,
  } as any,
};
