import { ComponentConfig } from "@reacteditor/core";
import { Quote } from "lucide-react";
import { Testimonials, type TestimonialsProps } from "@/components/testimonials/testimonials";

const testimonialsEditor: ComponentConfig<TestimonialsProps> = {
  label: "Testimonials",
  icon: <Quote size={16} />,
  category: "content",
  defaultProps: {
    tagline: "Reviews",
    heading: "What our customers say",
    items: [
      {
        quote:
          "I've been wearing the same linen shirt for two summers now and it's somehow gotten better with every wash.",
        author: "Mara K.",
        role: "Berlin",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      },
      {
        quote:
          "Considered cuts, neutral palette, real fabric. Exactly what I want when I'm getting dressed in the dark.",
        author: "Theo R.",
        role: "Brooklyn",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      },
      {
        quote:
          "The shipping was thoughtful, the packaging was minimal, and the trousers fit on the first try. Rare combination.",
        author: "Ines P.",
        role: "Paris",
        avatar:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
      },
    ],
  },
  fields: {
    tagline: { label: "Tagline", type: "text", contentEditable: true },
    heading: { label: "Heading", type: "text", contentEditable: true },
    items: {
      label: "Items",
      type: "array",
      defaultItemProps: { quote: "", author: "", role: "" },
      getItemSummary: (it) => it?.author || "Testimonial",
      arrayFields: {
        quote: { label: "Quote", type: "textarea", contentEditable: true },
        author: { label: "Author", type: "text", contentEditable: true },
        role: { label: "Role", type: "text", contentEditable: true },
        avatar: { label: "Avatar", type: "image" },
      },
    },
  },
  render: (props) => <Testimonials {...props} />,
};

export default testimonialsEditor;
