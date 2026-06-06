import { ComponentConfig } from "@reacteditor/core";
import { HelpCircle } from "lucide-react";
import { FAQ, type FAQProps } from "@/components/faq/faq";

const faqEditor: ComponentConfig<FAQProps> = {
  label: "FAQ",
  icon: <HelpCircle size={16} />,
  category: "content",
  defaultProps: {
    tagline: "Help",
    heading: "Common questions",
    subheading: "",
    items: [
      {
        question: "What's your return policy?",
        answer:
          "Free returns within 30 days of delivery. Items should be unworn with original tags attached.",
      },
      {
        question: "Where do you ship?",
        answer:
          "We ship worldwide. Free standard shipping on orders over $150 in the US, $250 international.",
      },
      {
        question: "How are your products made?",
        answer:
          "In small batches at family-run mills in Portugal, Italy, and Japan. Every piece is sampled and approved by our team.",
      },
      {
        question: "How do I care for my pieces?",
        answer:
          "Cold wash, lay flat to dry, iron when damp. Care details are on every product page and on the inner label.",
      },
    ],
  },
  fields: {
    tagline: { label: "Tagline", type: "text", contentEditable: true },
    heading: { label: "Heading", type: "text", contentEditable: true },
    subheading: { label: "Subheading", type: "textarea", contentEditable: true },
    items: {
      label: "Items",
      type: "array",
      defaultItemProps: { question: "", answer: "" },
      getItemSummary: (it) => it?.question || "Question",
      arrayFields: {
        question: { label: "Question", type: "text", contentEditable: true },
        answer: { label: "Answer", type: "textarea", contentEditable: true },
      },
    },
  },
  render: (props) => <FAQ {...props} />,
};

export default faqEditor;
