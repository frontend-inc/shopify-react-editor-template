import { ComponentConfig } from "@reacteditor/core";
import { LayoutGrid } from "lucide-react";
import { ProductsGrid, type ProductsGridProps } from "@/components/shopify/products-grid";

const productsGridEditor: ComponentConfig<ProductsGridProps> = {
    label: "Products grid",
    icon: <LayoutGrid size={16} />,
    category: "commerce",
    defaultProps: {
      collection: null,
      tagline: "Shop",
      heading: "Latest arrivals",
      subheading: "New pieces, fresh in this season.",
      columns: "4",
      limit: 8,
      ctaLabel: "View all",
      ctaHref: "",
    },
    fields: {
      collection: { label: "Collection", type: "shopifyCollection" } as any,
      tagline: { label: "Tagline", type: "text", contentEditable: true },
      heading: { label: "Heading", type: "text", contentEditable: true },
      subheading: { label: "Subheading", type: "textarea", contentEditable: true },
      columns: {
        label: "Columns",
        type: "radio",
        options: [
          { label: "3 columns", value: "3" },
          { label: "4 columns", value: "4" },
        ],
      },
      limit: { label: "Limit", type: "number", min: 2, max: 24 },
      ctaLabel: { label: "CTA label", type: "text", contentEditable: true },
      ctaHref: { label: "CTA link", type: "text" },
    },
    render: (props) => <ProductsGrid {...props} />,
};

export default productsGridEditor;
