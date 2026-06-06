# React Editor Demo (Shopify)

Standalone Vite SPA wiring up the Shopify-aware React Editor via `<App />` from `@reacteditor/core`.

## What's here

- **`index.html`** — Vite entrypoint.
- **`src/main.tsx`** — mounts `<App />` into `#root`.
- **`src/App.tsx`** — wires `<App />` from `@reacteditor/core` with the schema, plugins, and the Shopify provider.
- **`editor/`** — drop-in copy of the editor scaffold from `fe-shopify-client/app/editor`. Components, config, theme, Shopify client/queries/hooks/contexts, plugin-ai vendor css.
- **`app.schema.json`** — source of truth for every page in the demo. Shape: `{ "/": { root, content }, "/about": { ... }, ... }`.
- **`api/chat.ts`** — `aiPlugin` endpoint exposed in dev via a Vite middleware. Talks to Claude via `@ai-sdk/anthropic` with the editor + Shopify tool surface (`updatePage`, `searchProducts`, etc.).

## Run

```bash
cp .env.local.example .env.local   # optional — defaults to mock.shop
yarn install
yarn dev   # → http://localhost:3001
```

## Shopify

Defaults to the public `mock.shop` storefront (no token needed) so commerce blocks render demo data immediately. Override via `VITE_SHOPIFY_DOMAIN` and `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN` in `.env.local`.

## AI

`/api/chat` is served in dev by a Vite middleware that loads `api/chat.ts` via `ssrLoadModule`. Set `ANTHROPIC_API_KEY` in `.env.local`. Tools include the React Editor built-ins plus Shopify search/lookup helpers. For production deployment you'll need to host `api/chat.ts` behind your own Node server (the handler exports a standard `POST(req: Request): Promise<Response>`).
