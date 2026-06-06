import { Config, Data } from "@reacteditor/core";

import { CoverProps } from "@/components/cover/cover";
import { HeaderProps } from "@/components/header/header";
import { FooterProps } from "@/components/footer/footer";

import { ProductsGridProps } from "@/components/shopify/products-grid";
import { ProductsCarouselProps } from "@/components/shopify/products-carousel";
import { CollectionGridProps } from "@/components/shopify/collection-grid";
import { CollectionProps } from "@/components/shopify/collection";
import { ProductDetailsProps } from "@/components/shopify/product-details";
import { RecommendedProductsProps } from "@/components/shopify/recommended-products";
import { ProductRecommendationsProps } from "@/components/shopify/product-recommendations";
import { SearchProductsProps } from "@/components/shopify/search-products";
import { FeaturedProductProps } from "@/components/shopify/featured-product";

import { NewsletterCtaProps } from "@/components/newsletter-cta/newsletter-cta";

import { RootProps } from "./root";

export type { RootProps } from "./root";

export type Components = {
  header: HeaderProps;
  cover: CoverProps;
  "newsletter-cta": NewsletterCtaProps;
  "featured-product": FeaturedProductProps;
  "products-grid": ProductsGridProps;
  "products-carousel": ProductsCarouselProps;
  "collection-grid": CollectionGridProps;
  collection: CollectionProps;
  "product-details": ProductDetailsProps;
  "recommended-products": RecommendedProductsProps;
  "product-recommendations": ProductRecommendationsProps;
  "search-products": SearchProductsProps;
  footer: FooterProps;
};

export type UserConfig = Config<{
  components: Components;
  root: RootProps;
  categories: ["header", "cover", "commerce", "content", "footer"];
  fields: {
    userField: {
      type: "userField";
      option: boolean;
    };
  };
}>;

export type UserData = Data<Components, RootProps>;
