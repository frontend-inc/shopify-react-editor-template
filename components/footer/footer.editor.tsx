import { ComponentConfig } from "@reacteditor/core";
import { LayoutGrid } from "lucide-react";
import { Footer, type FooterProps } from "@/components/footer/footer";

const footerEditor: ComponentConfig<FooterProps> = {
  label: "Footer",
  icon: <LayoutGrid size={16} />,
  category: "footer",
  global: true,
  defaultProps: {
    brand: "Maison",
    tagline:
      "Considered essentials, made in small batches and built to last beyond the season.",
    columns: [
      {
        title: "Shop",
        links: [
          { label: "All", href: "/collections" },
          { label: "New", href: "/collections/new" },
          { label: "Best sellers", href: "/collections/best" },
        ],
      },
      {
        title: "About",
        links: [
          { label: "Our story", href: "/about" },
          { label: "Materials", href: "/materials" },
          { label: "Journal", href: "/journal" },
        ],
      },
      {
        title: "Help",
        links: [
          { label: "Shipping", href: "/help/shipping" },
          { label: "Returns", href: "/help/returns" },
          { label: "Contact", href: "/contact" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Terms", href: "/terms" },
          { label: "Privacy", href: "/privacy" },
        ],
      },
    ],
    social: [
      { label: "Instagram", href: "#" },
      { label: "Pinterest", href: "#" },
      { label: "TikTok", href: "#" },
    ],
    showNewsletter: "yes",
    newsletterHeading: "Stay in touch",
    newsletterEndpoint: "",
    copyright: "© 2026 Maison. All rights reserved.",
  },
  fields: {
    brand: { label: "Brand", type: "text", contentEditable: true },
    tagline: { label: "Tagline", type: "textarea", contentEditable: true },
    columns: {
      label: "Columns",
      type: "array",
      defaultItemProps: { title: "Column", links: [] },
      getItemSummary: (it) => it?.title || "Column",
      arrayFields: {
        title: { label: "Title", type: "text", contentEditable: true },
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
      },
    },
    social: {
      label: "Social links",
      type: "array",
      defaultItemProps: { label: "Instagram", href: "#" },
      getItemSummary: (it) => it?.label || "Social",
      arrayFields: {
        label: { label: "Label", type: "text", contentEditable: true },
        href: { label: "Link", type: "text" },
      },
    },
    showNewsletter: {
      label: "Newsletter form",
      type: "radio",
      options: [
        { label: "Show", value: "yes" },
        { label: "Hide", value: "no" },
      ],
    },
    newsletterHeading: { label: "Newsletter heading", type: "text", contentEditable: true },
    newsletterEndpoint: { label: "Newsletter endpoint", type: "text" },
    copyright: { label: "Copyright", type: "text", contentEditable: true },
  },
  render: (props) => <Footer {...props} />,
};

export default footerEditor;
