import { ComponentConfig } from "@reacteditor/core";
import { Megaphone } from "lucide-react";
import { Banner, type BannerProps } from "@/components/landing/banner";

const bannerEditor: ComponentConfig<BannerProps> = {
  label: "Announcement bar",
  icon: <Megaphone size={16} />,
  category: "hero",
  defaultProps: {
    text: "Free shipping on orders over $150",
    ctaLabel: "Shop new",
    ctaHref: "/collections/new",
    tone: "default",
  },
  fields: {
    text: { label: "Text", type: "text", contentEditable: true },
    ctaLabel: { label: "CTA label", type: "text", contentEditable: true },
    ctaHref: { label: "CTA link", type: "text" },
    tone: {
      label: "Tone",
      type: "select",
      options: [
        { label: "Default (dark)", value: "default" },
        { label: "Inverse (light)", value: "inverse" },
        { label: "Muted", value: "muted" },
      ],
    },
  },
  render: (props) => <Banner {...props} />,
};

export default bannerEditor;
