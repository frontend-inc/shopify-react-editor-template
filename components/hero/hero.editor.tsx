import { ComponentConfig } from "@reacteditor/core";
import { LayoutTemplate } from "lucide-react";
import { Hero, type HeroProps } from "@/components/hero/hero";

const heroEditor: ComponentConfig<HeroProps> = {
  label: "Hero",
  icon: <LayoutTemplate size={16} />,
  category: "hero",
  defaultProps: {
    tagline: "Spring 2026",
    heading: "Made for the way you move",
    subheading:
      "A considered wardrobe of essentials, cut from natural fibers and designed to last.",
    buttons: [
      { label: "Shop the collection", href: "/collections", variant: "primary" },
      { label: "Our story", href: "/about", variant: "secondary" },
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2400&q=80",
    align: "left",
    height: "lg",
    tone: "dark",
  },
  fields: {
    tagline: { label: "Tagline", type: "text", contentEditable: true },
    heading: { label: "Heading", type: "textarea", contentEditable: true },
    subheading: { label: "Subheading", type: "textarea", contentEditable: true },
    buttons: {
      label: "Buttons",
      type: "array",
      arrayFields: {
        label: { label: "Label", type: "text", contentEditable: true },
        href: { label: "Link", type: "text" },
        variant: {
          label: "Variant",
          type: "select",
          options: [
            { label: "Primary (filled)", value: "primary" },
            { label: "Secondary (outline)", value: "secondary" },
            { label: "Outline", value: "outline" },
            { label: "Ghost", value: "ghost" },
          ],
        },
      },
      defaultItemProps: {
        label: "Button",
        href: "/",
        variant: "primary",
      },
      getItemSummary: (item) => item?.label || "Button",
    },
    imageUrl: { label: "Background image", type: "image" },
    align: {
      label: "Alignment",
      type: "radio",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
      ],
    },
    height: {
      label: "Height",
      type: "select",
      options: [
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Full", value: "full" },
      ],
    },
    tone: {
      label: "Tone",
      type: "radio",
      options: [
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
      ],
    },
  },
  render: (props) => <Hero {...props} />,
};

export default heroEditor;
