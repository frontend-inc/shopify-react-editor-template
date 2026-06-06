import { ComponentConfig } from "@reacteditor/core";
import { Package } from "lucide-react";
import { ProductDetailsView, type ProductDetailsProps } from "@/components/commerce/product-details";

const productDetailsEditor: ComponentConfig<ProductDetailsProps> = {
    label: "Product details",
    icon: <Package size={16} />,
    category: "commerce",
    defaultProps: { product: null },
    fields: { product: { label: "Product", type: "shopifyProduct" } as any },
    render: (props) => <ProductDetailsView {...props} />,
};

export default productDetailsEditor;
