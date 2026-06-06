import { ComponentConfig } from "@reacteditor/core";
import { Menu as MenuIcon } from "lucide-react";
import { Header, type HeaderProps } from "@/components/header/header";

const headerEditor: ComponentConfig<HeaderProps> = {
  label: "Header",
  icon: <MenuIcon size={16} />,
  category: "navigation",
  global: true,
  defaultProps: {
    brand: "Maison",
    logo: "",
    links: [
      { label: "Mens", href: "/collections/mens" },
      { label: "Womens", href: "/collections/womens" },
      { label: "Shop", href: "/search" },
      { label: "About", href: "/about" },
    ],
    showSearch: "yes",
    showCart: "yes",
    sticky: "yes",
    tone: "default",
  },
  fields: {
    logo: { label: "Logo", type: "image" },
    brand: { label: "Logo Alt", type: "text", contentEditable: true },
    links: {
      label: "Links",
      type: "array",
      defaultItemProps: { label: "Link", href: "/" },
      getItemSummary: (it) => it?.label || "Link",
      arrayFields: {
        label: { label: "Label", type: "text", contentEditable: true },
        href: { label: "Link", type: "text" },
      },
    },
    showSearch: {
      label: "Search icon",
      type: "radio",
      options: [
        { label: "Show", value: "yes" },
        { label: "Hide", value: "no" },
      ],
    },
    showCart: {
      label: "Cart icon",
      type: "radio",
      options: [
        { label: "Show", value: "yes" },
        { label: "Hide", value: "no" },
      ],
    },
    sticky: {
      label: "Position",
      type: "radio",
      options: [
        { label: "Sticky", value: "yes" },
        { label: "Static", value: "no" },
      ],
    },
    tone: {
      label: "Tone",
      type: "select",
      options: [
        { label: "Default", value: "default" },
        { label: "Muted", value: "muted" },
        { label: "Inverse (dark)", value: "inverse" },
      ],
    },
  },
  render: (props) => <Header {...props} />,
};

export default headerEditor;
