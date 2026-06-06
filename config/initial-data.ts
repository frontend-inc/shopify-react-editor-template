import { UserData } from "./types";

export const getInitialData = (path: string): Partial<UserData> =>
  initialData[path] ?? { content: [], root: { props: { title: "Untitled" } } };

export const initialData: Record<string, UserData> = {
  "/": {
    root: {
      props: {
        title: "Maison — Considered essentials",
        headerFont: "Inter",
        bodyFont: "Inter",
      },
    },
    content: [
      {
        type: "navigation",
        props: {
          id: "nav-home",
          brand: "Maison",
          links: [
            { label: "Shop", href: "/collections" },
            { label: "Lookbook", href: "/lookbook" },
            { label: "Journal", href: "/journal" },
            { label: "About", href: "/about" },
          ],
          cta: { label: "", href: "" },
          showSearch: "yes",
          showCart: "yes",
          sticky: "yes",
          tone: "default",
          bannerText: "",
          bannerTone: "accent",
        },
      },
      {
        type: "hero",
        props: {
          id: "hero-home",
          tagline: "Spring 2026",
          heading: "Made for the way you move",
          subheading:
            "A considered wardrobe of essentials, cut from natural fibers and designed to last.",
          primaryCta: { label: "Shop the collection", href: "/collections" },
          secondaryCta: { label: "Our story", href: "/about" },
          imageUrl:
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2400&q=80",
          align: "left",
          height: "lg",
          tone: "dark",
        },
      },
      {
        type: "products-carousel",
        props: {
          id: "carousel-home",
          tagline: "New",
          heading: "Just dropped",
          subheading: "Fresh additions to the lineup.",
          limit: 12,
          slidesPerView: "4",
          ctaLabel: "Shop new",
          ctaHref: "/collections/new",
        },
      },
      {
        type: "featured-product",
        props: {
          id: "featured-home",
          handle: "",
          tagline: "Featured",
          ctaLabel: "Add to bag",
          align: "left",
          tone: "muted",
        },
      },
      {
        type: "collection-grid",
        props: {
          id: "collections-home",
          tagline: "Shop by collection",
          heading: "Curated edits",
          subheading: "Bundles built around the way you actually live.",
          layout: "tiles",
          limit: 6,
        },
      },
      {
        type: "features",
        props: {
          id: "features-home",
          tagline: "Why us",
          heading: "Built with intention",
          subheading: "A small set of values that shape every piece we make.",
          columns: "3",
          items: [
            {
              title: "Natural fibers",
              body: "Linen, organic cotton, and merino — sourced from mills with traceable supply chains.",
            },
            {
              title: "Small batches",
              body: "Made in considered quantities so nothing goes to waste.",
            },
            {
              title: "Built to last",
              body: "Reinforced seams and finishes that age into something better.",
            },
          ],
        },
      },
      {
        type: "testimonials",
        props: {
          id: "testimonials-home",
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
          ],
        },
      },
      {
        type: "newsletter-cta",
        props: {
          id: "newsletter-home",
          tagline: "Stay in the loop",
          heading: "Letters from the studio",
          subheading:
            "New collections, mill stories, and the occasional invitation. Twice a month.",
          buttonLabel: "Subscribe",
          endpoint: "",
          imageUrl:
            "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1800&q=80",
          layout: "split",
        },
      },
      {
        type: "footer",
        props: {
          id: "footer-home",
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
          showNewsletter: "no",
          newsletterHeading: "Stay in touch",
          newsletterEndpoint: "",
          copyright: "© 2026 Maison. All rights reserved.",
        },
      },
    ],
  },
};
