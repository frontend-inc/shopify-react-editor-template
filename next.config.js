import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export default {
  reactStrictMode: true,
  // Prevent sibling lockfiles from changing Next's inferred tracing root.
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.shopify.com',
      },
      {
        protocol: 'https',
        hostname: '**.frontend.co',
      },
    ],
  },
  experimental: {
    reactDebugChannel: false,
  },
  webpack: (config, { isServer, webpack }) => {
    config.cache = { type: 'memory' };
    // Hydrogen's root entry imports this browser-only analytics module by URL.
    // Webpack resolves it before tree-shaking and otherwise rejects the https: scheme.
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp:
          /^https:\/\/cdn\.shopify\.com\/storefront\/standard-events\.js$/,
      })
    );
    if (isServer) {
      config.optimization = config.optimization || {};
      config.optimization.splitChunks = false;
    }
    return config;
  },
};
