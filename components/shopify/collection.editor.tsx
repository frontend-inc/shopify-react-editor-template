import { ComponentConfig } from "@reacteditor/core";
import { FolderOpen } from "lucide-react";
import { CollectionView, type CollectionProps } from "@/components/shopify/collection";

const collectionEditor: ComponentConfig<CollectionProps> = {
    label: "Collection page",
    icon: <FolderOpen size={16} />,
    category: "commerce",
    defaultProps: {
      collection: null,
      showDescription: "yes",
      showCoverImage: "yes",
      customCoverImage: "",
      columns: "4",
      limit: 24,
      defaultSort: "BEST_SELLING",
      showAvailability: "yes",
      showPriceRange: "yes",
      showProductType: "no",
      productTypeOptions: [],
      showVendor: "no",
      vendorOptions: [],
      showTags: "no",
      tagOptions: [],
      showColor: "yes",
      colorOptions: [
        { label: "Black", color: "#000000" },
        { label: "White", color: "#FFFFFF" },
        { label: "Navy", color: "#1e3a5f" },
      ],
      showStyle: "no",
      styleOptions: [],
      showSize: "yes",
      sizeOptions: [
        { label: "XS" },
        { label: "S" },
        { label: "M" },
        { label: "L" },
        { label: "XL" },
      ],
      showMaterial: "no",
      materialOptions: [],
      metafieldFilters: [],
    },
    fields: {
      collection: { label: "Collection", type: "shopifyCollection" } as any,
      showDescription: {
        label: "Description",
        type: "radio",
        options: [
          { label: "Show", value: "yes" },
          { label: "Hide", value: "no" },
        ],
      },
      showCoverImage: {
        label: "Cover image",
        type: "radio",
        options: [
          { label: "Show", value: "yes" },
          { label: "Hide", value: "no" },
        ],
      },
      customCoverImage: {
        label: "Custom cover image",
        type: "image",
      },
      columns: {
        label: "Columns",
        type: "radio",
        options: [
          { label: "2", value: "2" },
          { label: "3", value: "3" },
          { label: "4", value: "4" },
        ],
      },
      limit: { label: "Products per page", type: "number", min: 4, max: 48 },
      defaultSort: {
        label: "Default sort",
        type: "select",
        options: [
          { label: "Best Selling", value: "BEST_SELLING" },
          { label: "Newest", value: "CREATED" },
          { label: "Price: Low to High", value: "PRICE" },
          { label: "Alphabetical", value: "TITLE" },
        ],
      },
      showAvailability: {
        label: "Availability filter",
        type: "radio",
        options: [
          { label: "Show", value: "yes" },
          { label: "Hide", value: "no" },
        ],
      },
      showPriceRange: {
        label: "Price range filter",
        type: "radio",
        options: [
          { label: "Show", value: "yes" },
          { label: "Hide", value: "no" },
        ],
      },
      showColor: {
        label: "Color filter",
        type: "radio",
        options: [
          { label: "Show", value: "yes" },
          { label: "Hide", value: "no" },
        ],
      },
      colorOptions: {
        label: "Colors",
        type: "array",
        defaultItemProps: { label: "", color: "#000000" },
        getItemSummary: (it: any) => it?.label || "Color",
        arrayFields: {
          label: { label: "Color name", type: "text" },
          color: { label: "Color", type: "color" },
        },
      },
      showStyle: {
        label: "Style filter",
        type: "radio",
        options: [
          { label: "Show", value: "yes" },
          { label: "Hide", value: "no" },
        ],
      },
      styleOptions: {
        label: "Styles",
        type: "array",
        defaultItemProps: { label: "" },
        getItemSummary: (it: any) => it?.label || "Style",
        arrayFields: {
          label: { label: "Style name", type: "text" },
        },
      },
      showSize: {
        label: "Size filter",
        type: "radio",
        options: [
          { label: "Show", value: "yes" },
          { label: "Hide", value: "no" },
        ],
      },
      sizeOptions: {
        label: "Sizes",
        type: "array",
        defaultItemProps: { label: "" },
        getItemSummary: (it: any) => it?.label || "Size",
        arrayFields: {
          label: { label: "Size name", type: "text" },
        },
      },
      showMaterial: {
        label: "Material filter",
        type: "radio",
        options: [
          { label: "Show", value: "yes" },
          { label: "Hide", value: "no" },
        ],
      },
      materialOptions: {
        label: "Materials",
        type: "array",
        defaultItemProps: { label: "" },
        getItemSummary: (it: any) => it?.label || "Material",
        arrayFields: {
          label: { label: "Material name", type: "text" },
        },
      },
      showVendor: {
        label: "Brand / vendor filter",
        type: "radio",
        options: [
          { label: "Show", value: "yes" },
          { label: "Hide", value: "no" },
        ],
      },
      vendorOptions: {
        label: "Brands",
        type: "array",
        defaultItemProps: { label: "" },
        getItemSummary: (it: any) => it?.label || "Brand",
        arrayFields: {
          label: { label: "Brand name", type: "text" },
        },
      },
      showProductType: {
        label: "Product type filter",
        type: "radio",
        options: [
          { label: "Show", value: "yes" },
          { label: "Hide", value: "no" },
        ],
      },
      productTypeOptions: {
        label: "Product types",
        type: "array",
        defaultItemProps: { label: "" },
        getItemSummary: (it: any) => it?.label || "Type",
        arrayFields: {
          label: { label: "Type name", type: "text" },
        },
      },
      showTags: {
        label: "Tags filter",
        type: "radio",
        options: [
          { label: "Show", value: "yes" },
          { label: "Hide", value: "no" },
        ],
      },
      tagOptions: {
        label: "Tags",
        type: "array",
        defaultItemProps: { label: "" },
        getItemSummary: (it: any) => it?.label || "Tag",
        arrayFields: {
          label: { label: "Tag name", type: "text" },
        },
      },
      metafieldFilters: {
        label: "Metafield filters",
        type: "array",
        defaultItemProps: { namespace: "", key: "", label: "", values: [{ label: "" }] },
        getItemSummary: (it: any) => it?.label || it?.key || "Metafield",
        arrayFields: {
          namespace: { label: "Namespace", type: "text" },
          key: { label: "Key", type: "text" },
          label: { label: "Label", type: "text" },
          values: {
            label: "Values",
            type: "array",
            defaultItemProps: { label: "" },
            getItemSummary: (v: any) => v?.label || "Value",
            arrayFields: {
              label: { label: "Value", type: "text" },
            },
          },
        },
      },
    },
    render: (props) => <CollectionView {...props} />,
};

export default collectionEditor;
