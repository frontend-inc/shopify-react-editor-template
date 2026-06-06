import { ComponentConfig } from "@reacteditor/core";
import { Sparkles } from "lucide-react";
import { Features, type FeaturesProps } from "@/components/features/features";

const featuresEditor: ComponentConfig<FeaturesProps> = {
  label: "Features",
  icon: <Sparkles size={16} />,
  category: "content",
  defaultProps: {
    tagline: "Why us",
    heading: "Built with intention",
    subheading: "A small set of values that shape every piece we make.",
    columns: "3",
    items: [
      {
        title: "Natural fibers",
        body: "Linen, organic cotton, and merino — sourced from mills with traceable supply chains.",
      },
      {
        title: "Small batches",
        body: "Made in considered quantities so nothing goes to waste — and nothing gets discounted into the bin.",
      },
      {
        title: "Built to last",
        body: "Reinforced seams, double-stitched edges, and finishes that age into something better.",
      },
    ],
  },
  fields: {
    tagline: { label: "Tagline", type: "text", contentEditable: true },
    heading: { label: "Heading", type: "text", contentEditable: true },
    subheading: { label: "Subheading", type: "textarea", contentEditable: true },
    columns: {
      label: "Columns",
      type: "select",
      options: [
        { label: "2 columns", value: "2" },
        { label: "3 columns", value: "3" },
        { label: "4 columns", value: "4" },
      ],
    },
    items: {
      label: "Items",
      type: "array",
      defaultItemProps: { title: "Feature", body: "Description." },
      getItemSummary: (it) => it?.title || "Feature",
      arrayFields: {
        title: { label: "Title", type: "text", contentEditable: true },
        body: { label: "Body", type: "textarea", contentEditable: true },
      },
    },
  },
  render: (props) => <Features {...props} />,
};

export default featuresEditor;
