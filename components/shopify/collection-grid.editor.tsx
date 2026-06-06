import { ComponentConfig } from "@reacteditor/core";
import { FolderOpen } from "lucide-react";
import { CollectionGrid, type CollectionGridProps } from "@/components/shopify/collection-grid";

const collectionGridEditor: ComponentConfig<CollectionGridProps> = {
  label: "Collections",
  icon: <FolderOpen size={16} />,
  category: "commerce",
  defaultProps: {
    tagline: "Shop by collection",
    heading: "Curated edits",
    subheading: "Bundles built around the way you actually live.",
    layout: "tiles",
    limit: 6,
  },
  fields: {
    tagline: { label: "Tagline", type: "text", contentEditable: true },
    heading: { label: "Heading", type: "text", contentEditable: true },
    subheading: { label: "Subheading", type: "textarea", contentEditable: true },
    layout: {
      label: "Layout",
      type: "radio",
      options: [
        { label: "Tiles", value: "tiles" },
        { label: "Editorial", value: "editorial" },
      ],
    },
    limit: { label: "Limit", type: "number", min: 2, max: 12 },
  },
  render: (props) => <CollectionGrid {...props} />,
};

export default collectionGridEditor;
