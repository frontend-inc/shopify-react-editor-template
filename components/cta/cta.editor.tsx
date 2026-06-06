import { ComponentConfig } from "@reacteditor/core";
import { Megaphone } from "lucide-react";
import { CTA, type CTAProps } from "@/components/cta/cta";

const ctaEditor: ComponentConfig<CTAProps> = {
  label: "Call to action",
  icon: <Megaphone size={16} />,
  category: "content",
  defaultProps: {
    tagline: "",
    heading: "Designed once. Worn for years.",
    subheading:
      "Join 40,000 people building a wardrobe they actually reach for.",
    primaryCta: { label: "Shop now", href: "/collections" },
    secondaryCta: { label: "Read our story", href: "/about" },
    imageUrl:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2400&q=80",
    align: "center",
  },
  fields: {
    tagline: { label: "Tagline", type: "text", contentEditable: true },
    heading: { label: "Heading", type: "textarea", contentEditable: true },
    subheading: { label: "Subheading", type: "textarea", contentEditable: true },
    primaryCta: {
      label: "Primary CTA",
      type: "object",
      objectFields: {
        label: { label: "Label", type: "text", contentEditable: true },
        href: { label: "Link", type: "text" },
      },
    },
    secondaryCta: {
      label: "Secondary CTA",
      type: "object",
      objectFields: {
        label: { label: "Label", type: "text", contentEditable: true },
        href: { label: "Link", type: "text" },
      },
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
  },
  render: (props) => <CTA {...props} />,
};

export default ctaEditor;
