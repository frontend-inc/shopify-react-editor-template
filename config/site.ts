/**
 * Store-wide constants that aren't page content.
 *
 * Nav links, the logo and the footer used to live here; they're editor fields
 * on the header/footer blocks now, so a merchant changes them in the editor
 * rather than in code. What's left is the metadata fallback for routes that
 * haven't set their own.
 */
export const site = {
  storeName: 'Shop',
  description:
    'An agent-friendly Shopify storefront built with Next.js and Hydrogen.',
  // Absolute origin behind `metadataBase`, so Open Graph images resolve to full
  // URLs. Vercel injects VERCEL_PROJECT_PRODUCTION_URL on deployed builds.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000'),
};
