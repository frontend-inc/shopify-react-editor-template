import { ComponentConfig, Fields } from "@reacteditor/core";
import { Mail } from "lucide-react";
import { NewsletterCta, type NewsletterCtaProps } from "@/components/newsletter-cta/newsletter-cta";

const baseFields: Fields<NewsletterCtaProps> = {
  tagline: { label: "Tagline", type: "text", contentEditable: true },
  heading: { label: "Heading", type: "text", contentEditable: true },
  subheading: { label: "Subheading", type: "textarea", contentEditable: true },
  buttonLabel: { label: "Button label", type: "text", contentEditable: true },
  emailProvider: {
    label: "Email provider",
    type: "select",
    options: [
      { label: "None (custom endpoint)", value: "none" },
      { label: "Mailchimp", value: "mailchimp" },
      { label: "Klaviyo", value: "klaviyo" },
    ],
  },
  imageUrl: { label: "Image", type: "image" },
  layout: {
    label: "Layout",
    type: "radio",
    options: [
      { label: "Split (image + form)", value: "split" },
      { label: "Stacked (centered)", value: "stacked" },
    ],
  },
};

const newsletterCtaEditor: ComponentConfig<NewsletterCtaProps> = {
  label: "Newsletter",
  icon: <Mail size={16} />,
  category: "content",
  defaultProps: {
    tagline: "Stay in the loop",
    heading: "Letters from the studio",
    subheading:
      "New collections, mill stories, and the occasional invitation to in-person events. Twice a month.",
    buttonLabel: "Subscribe",
    emailProvider: "none",
    endpoint: "",
    mailchimpApiKey: "",
    mailchimpServerPrefix: "",
    mailchimpAudienceId: "",
    klaviyoCompanyId: "",
    klaviyoListId: "",
    imageUrl:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1800&q=80",
    layout: "split",
  },
  fields: baseFields,
  resolveFields: (data) => {
    const provider = data.props.emailProvider;
    if (provider === "mailchimp") {
      return {
        ...baseFields,
        mailchimpApiKey: { label: "Mailchimp API key", type: "text" },
        mailchimpServerPrefix: {
          label: "Server prefix (e.g. us21)",
          type: "text",
        },
        mailchimpAudienceId: { label: "Audience ID", type: "text" },
      };
    }
    if (provider === "klaviyo") {
      return {
        ...baseFields,
        klaviyoCompanyId: { label: "Company ID (public API key)", type: "text" },
        klaviyoListId: { label: "List ID", type: "text" },
      };
    }
    return {
      ...baseFields,
      endpoint: { label: "Submit endpoint", type: "text" },
    };
  },
  render: (props) => <NewsletterCta {...props} />,
};

export default newsletterCtaEditor;
