import { Config, Data } from "@reacteditor/core";

import { HeroProps } from "@/components/hero/hero";
import { LogosProps } from "@/components/logos/logos";
import { FeaturesProps } from "@/components/features/features";
import { TestimonialsProps } from "@/components/testimonials/testimonials";
import { CTAProps } from "@/components/cta/cta";
import { FAQProps } from "@/components/faq/faq";
import { NavigationProps } from "@/components/navigation/navigation";
import { FooterProps } from "@/components/footer/footer";

import { ProductsGridProps } from "@/components/commerce/products-grid";
import { ProductsCarouselProps } from "@/components/commerce/products-carousel";
import { CollectionGridProps } from "@/components/commerce/collection-grid";
import { CollectionProps } from "@/components/commerce/collection";
import { ProductDetailsProps } from "@/components/commerce/product-details";
import { RecommendedProductsProps } from "@/components/commerce/recommended-products";
import { FeaturedProductProps } from "@/components/commerce/featured-product";

import { BannerProps } from "@/components/landing/banner";
import { NewsletterCtaProps } from "@/components/landing/newsletter-cta";
import { ImageGalleryProps } from "@/components/landing/image-gallery";

import { RootProps } from "./root";

export type { RootProps } from "./root";

export type Components = {
  navigation: NavigationProps;
  hero: HeroProps;
  banner: BannerProps;
  "featured-product": FeaturedProductProps;
  "products-grid": ProductsGridProps;
  "products-carousel": ProductsCarouselProps;
  "collection-grid": CollectionGridProps;
  collection: CollectionProps;
  "product-details": ProductDetailsProps;
  "recommended-products": RecommendedProductsProps;
  features: FeaturesProps;
  testimonials: TestimonialsProps;
  "image-gallery": ImageGalleryProps;
  "newsletter-cta": NewsletterCtaProps;
  logos: LogosProps;
  cta: CTAProps;
  faq: FAQProps;
  footer: FooterProps;
};

export type UserConfig = Config<{
  components: Components;
  root: RootProps;
  categories: ["navigation", "hero", "commerce", "content", "footer"];
  fields: {
    userField: {
      type: "userField";
      option: boolean;
    };
  };
}>;

export type UserData = Data<Components, RootProps>;
