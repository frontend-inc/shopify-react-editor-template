import { ComponentConfig } from "@reacteditor/core";
import { LayoutGrid } from "lucide-react";
import {
  ProductRecommendationsView,
  type ProductRecommendationsProps,
} from "@/components/commerce/product-recommendations";

const productRecommendationsEditor: ComponentConfig<ProductRecommendationsProps> = {
    label: "Product recommendations",
    icon: <LayoutGrid size={16} />,
    category: "commerce",
    defaultProps: {
      product: null,
      heading: "You Might Also Like",
      limit: 4,
    },
    fields: {
      product: { label: "Source product", type: "shopifyProduct" } as any,
      heading: { label: "Heading", type: "text", contentEditable: true },
      limit: { label: "Limit", type: "number", min: 2, max: 8 },
    },
    render: (props) => <ProductRecommendationsView {...props} />,
};

export default productRecommendationsEditor;
