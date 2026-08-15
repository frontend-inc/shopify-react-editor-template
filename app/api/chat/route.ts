import { streamText, tool, convertToModelMessages, stepCountIs } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { z } from 'zod';
import {
  searchProducts,
  getProduct,
  getProductsPage,
  getCollections,
  getCollectionProductsPage,
  isDefaultTitleOption,
  isDefaultTitleSelection,
} from '@/services/shopify/shop';

export const maxDuration = 30;

const MODEL = process.env.OPENROUTER_MODEL ?? 'openai/gpt-5.6-luna-pro';

const SYSTEM_PROMPT = `You are the shopping assistant for an online store built on Shopify.

You help shoppers find products, compare options, and understand what the store
carries. You have tools that read live catalogue data — always use them rather
than guessing, and never invent products, prices, availability, or policies.

Guidelines:
- Call a tool whenever the answer depends on catalogue data. If a shopper asks
  something vague like "what do you have?", call listCollections or
  searchCatalogue to ground your answer.
- Prices returned by the tools are in the store's currency; show them as given.
- Link products as /products/{handle} and collections as /collections/{handle}
  so the shopper can click through.
- Keep replies short and conversational — a sentence or two plus a compact list.
  Do not repeat the raw tool output; the interface already shows it.
- If a tool returns nothing, say so plainly and suggest a different search.
- You cannot place orders, change carts, process payments, or look up customer
  or order data. Say so and point the shopper to the relevant page instead.`;

const summariseProduct = (product: {
  id: string;
  title: string;
  handle: string;
  description?: string;
  productType?: string;
  tags?: string[];
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  variants?: {
    edges: Array<{
      node: {
        title: string;
        availableForSale: boolean;
        selectedOptions?: Array<{ name: string; value: string }>;
      };
    }>;
  };
  images?: { edges: Array<{ node: { url: string } }> };
  options?: Array<{ name: string; values: string[] }>;
}) => ({
  title: product.title,
  handle: product.handle,
  url: `/products/${product.handle}`,
  price: `${product.priceRange.minVariantPrice.amount} ${product.priceRange.minVariantPrice.currencyCode}`,
  image: product.images?.edges[0]?.node.url ?? null,
  description: product.description?.slice(0, 300) ?? null,
  productType: product.productType || null,
  tags: product.tags ?? [],
  options: product.options
    ?.filter((option) => !isDefaultTitleOption(option))
    .map((option) => ({
      name: option.name,
      values: option.values,
    })),
  inStock: product.variants?.edges.some((edge) => edge.node.availableForSale),
});

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'OPENROUTER_API_KEY is not configured.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { messages } = await req.json();
  const openrouter = createOpenRouter({ apiKey });

  const result = streamText({
    model: openrouter(MODEL, { reasoning: { enabled: true, effort: 'medium' } }),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      searchCatalogue: tool({
        description:
          'Search the store for products matching a term. Use for any question about what the store sells.',
        inputSchema: z.object({
          query: z
            .string()
            .describe('Search terms, e.g. "green hoodie" or "jacket".'),
          limit: z.number().int().min(1).max(10).default(5),
        }),
        execute: async ({ query, limit }) => {
          const { products, totalCount } = await searchProducts({
            query,
            first: limit,
          });
          return {
            totalCount,
            products: products.map(summariseProduct),
          };
        },
      }),

      getProductDetails: tool({
        description:
          'Get full details for one product by its handle, including options, variants, and stock.',
        inputSchema: z.object({
          handle: z
            .string()
            .describe('The product handle, e.g. "flowguard-jacket".'),
        }),
        execute: async ({ handle }) => {
          const product = await getProduct(handle);
          if (!product) return { found: false, handle };

          return {
            found: true,
            ...summariseProduct(product),
            variants: product.variants.edges.slice(0, 25).map(({ node }) => ({
              title: node.title,
              available: node.availableForSale,
              price: `${node.price.amount} ${node.price.currencyCode}`,
              options: node.selectedOptions?.filter(
                (option) => !isDefaultTitleSelection(option)
              ),
            })),
          };
        },
      }),

      listCollections: tool({
        description:
          'List the store\'s collections. Use when the shopper asks what categories or ranges exist.',
        inputSchema: z.object({
          limit: z.number().int().min(1).max(25).default(10),
        }),
        execute: async ({ limit }) => {
          const collections = await getCollections(limit);
          return {
            collections: collections.map((collection) => ({
              title: collection.title,
              handle: collection.handle,
              url: `/collections/${collection.handle}`,
              description: collection.description?.slice(0, 200) ?? null,
            })),
          };
        },
      }),

      getCollectionProducts: tool({
        description:
          'List the products inside one collection, by collection handle.',
        inputSchema: z.object({
          handle: z.string().describe('The collection handle, e.g. "men".'),
          limit: z.number().int().min(1).max(20).default(8),
        }),
        execute: async ({ handle, limit }) => {
          const page = await getCollectionProductsPage(handle, { first: limit });
          if (!page.collection) return { found: false, handle };

          return {
            found: true,
            collection: page.collection.title,
            url: `/collections/${handle}`,
            products: page.products.map(summariseProduct),
          };
        },
      }),

      browseProducts: tool({
        description:
          'Browse the newest products when the shopper has no specific search term.',
        inputSchema: z.object({
          limit: z.number().int().min(1).max(20).default(8),
        }),
        execute: async ({ limit }) => {
          const page = await getProductsPage({
            first: limit,
            sortKey: 'CREATED_AT',
            reverse: true,
          });
          return { products: page.products.map(summariseProduct) };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse({ sendReasoning: true });
}
