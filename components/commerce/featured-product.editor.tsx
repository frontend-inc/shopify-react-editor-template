import { ComponentConfig } from "@reacteditor/core";
import { Star } from "lucide-react";
import { FeaturedProductView, type FeaturedProductProps } from "@/components/commerce/featured-product";

const featuredProductEditor: ComponentConfig<FeaturedProductProps> = {
    label: "Featured product",
    icon: <Star size={16} />,
    category: "commerce",
    defaultProps: {
      product: null,
      tagline: "Featured",
      ctaLabel: "Add to bag",
      align: "left",
      tone: "default",
    },
    fields: {
      product: { label: "Product", type: "shopifyProduct" } as any,
      tagline: { label: "Tagline", type: "text", contentEditable: true },
      ctaLabel: { label: "CTA label", type: "text", contentEditable: true },
      align: {
        label: "Image alignment",
        type: "radio",
        options: [
          { label: "Image left", value: "left" },
          { label: "Image right", value: "right" },
        ],
      },
      tone: {
        label: "Tone",
        type: "radio",
        options: [
          { label: "Default", value: "default" },
          { label: "Muted", value: "muted" },
        ],
      },
    },
    render: (props) => <FeaturedProductView {...props} />,
};

export default featuredProductEditor;
