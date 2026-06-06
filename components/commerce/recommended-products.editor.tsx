import { ComponentConfig } from "@reacteditor/core";
import { Sparkles } from "lucide-react";
import { RecommendedProductsView, type RecommendedProductsProps } from "@/components/commerce/recommended-products";

const recommendedProductsEditor: ComponentConfig<RecommendedProductsProps> = {
    label: "Recommended products",
    icon: <Sparkles size={16} />,
    category: "commerce",
    defaultProps: {
      product: null,
      tagline: "You may also like",
      heading: "More to explore",
      limit: 4,
    },
    fields: {
      product: { label: "Source product", type: "shopifyProduct" } as any,
      tagline: { label: "Tagline", type: "text", contentEditable: true },
      heading: { label: "Heading", type: "text", contentEditable: true },
      limit: { label: "Limit", type: "number", min: 2, max: 8 },
    },
    render: (props) => <RecommendedProductsView {...props} />,
};

export default recommendedProductsEditor;
