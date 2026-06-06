import { ComponentConfig } from "@reacteditor/core";
import { Award } from "lucide-react";
import { Logos, type LogosProps } from "@/components/logos/logos";

const logosEditor: ComponentConfig<LogosProps> = {
  label: "Press / Logos",
  icon: <Award size={16} />,
  category: "content",
  defaultProps: {
    tagline: "As seen in",
    layout: "row",
    items: [
      { src: "https://logo.clearbit.com/vogue.com", alt: "Vogue" },
      { src: "https://logo.clearbit.com/highsnobiety.com", alt: "Highsnobiety" },
      { src: "https://logo.clearbit.com/gq.com", alt: "GQ" },
      { src: "https://logo.clearbit.com/dezeen.com", alt: "Dezeen" },
      { src: "https://logo.clearbit.com/wallpaper.com", alt: "Wallpaper*" },
    ],
  },
  fields: {
    tagline: { label: "Tagline", type: "text", contentEditable: true },
    layout: {
      label: "Layout",
      type: "radio",
      options: [
        { label: "Row", value: "row" },
        { label: "Marquee", value: "marquee" },
      ],
    },
    items: {
      label: "Logos",
      type: "array",
      defaultItemProps: { src: "", alt: "" },
      getItemSummary: (it) => it?.alt || "Logo",
      arrayFields: {
        src: { label: "Image", type: "image" },
        alt: { label: "Alt text", type: "text", contentEditable: true },
      },
    },
  },
  render: (props) => <Logos {...props} />,
};

export default logosEditor;
