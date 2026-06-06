import { ComponentConfig } from "@reacteditor/core";
import { GalleryHorizontalEnd } from "lucide-react";
import { ProductsCarousel, type ProductsCarouselProps } from "@/components/commerce/products-carousel";

const productsCarouselEditor: ComponentConfig<ProductsCarouselProps> = {
    label: "Products carousel",
    icon: <GalleryHorizontalEnd size={16} />,
    category: "commerce",
    defaultProps: {
      collection: null,
      tagline: "New",
      heading: "Just dropped",
      subheading: "Fresh additions to the lineup.",
      limit: 12,
      slidesPerView: "4",
      ctaLabel: "Shop new",
      ctaHref: "",
    },
    fields: {
      collection: { label: "Collection", type: "shopifyCollection" } as any,
      tagline: { label: "Tagline", type: "text", contentEditable: true },
      heading: { label: "Heading", type: "text", contentEditable: true },
      subheading: { label: "Subheading", type: "textarea", contentEditable: true },
      limit: { label: "Limit", type: "number", min: 4, max: 24 },
      slidesPerView: {
        label: "Slides per view",
        type: "select",
        options: [
          { label: "2 per view", value: "2" },
          { label: "3 per view", value: "3" },
          { label: "4 per view", value: "4" },
        ],
      },
      ctaLabel: { label: "CTA label", type: "text", contentEditable: true },
      ctaHref: { label: "CTA link", type: "text" },
    },
    render: (props) => <ProductsCarousel {...props} />,
};

export default productsCarouselEditor;
