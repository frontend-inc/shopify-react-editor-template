import { ComponentConfig } from "@reacteditor/core";
import { Images } from "lucide-react";
import { ImageGallery, type ImageGalleryProps } from "@/components/landing/image-gallery";

const imageGalleryEditor: ComponentConfig<ImageGalleryProps> = {
  label: "Image gallery",
  icon: <Images size={16} />,
  category: "content",
  defaultProps: {
    tagline: "Lookbook",
    heading: "Spring in the studio",
    subheading: "",
    layout: "editorial",
    items: [
      { src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80", alt: "" },
      { src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80", alt: "" },
      { src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80", alt: "" },
      { src: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80", alt: "" },
      { src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80", alt: "" },
    ],
  },
  fields: {
    tagline: { label: "Tagline", type: "text", contentEditable: true },
    heading: { label: "Heading", type: "text", contentEditable: true },
    subheading: { label: "Subheading", type: "textarea", contentEditable: true },
    layout: {
      label: "Layout",
      type: "select",
      options: [
        { label: "Grid", value: "grid" },
        { label: "Masonry", value: "masonry" },
        { label: "Editorial (mosaic)", value: "editorial" },
      ],
    },
    items: {
      label: "Images",
      type: "array",
      defaultItemProps: { src: "", alt: "" },
      getItemSummary: (it) => it?.caption || "Image",
      arrayFields: {
        src: { label: "Image", type: "image" },
        alt: { label: "Alt text", type: "text", contentEditable: true },
        caption: { label: "Caption", type: "text", contentEditable: true },
      },
    },
  },
  render: (props) => <ImageGallery {...props} />,
};

export default imageGalleryEditor;
