import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export default {
  reactStrictMode: true,
  // Sibling templates each carry a lockfile, so pin the tracing root here
  // rather than letting Next infer one from a parent directory.
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
      // Covers cdn.shopify.com plus any other Shopify-hosted image subdomain.
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
  webpack: (config, { isServer }) => {
    config.cache = { type: 'memory' };
    if (isServer) {
      config.optimization = config.optimization || {};
      config.optimization.splitChunks = false;
    }
    return config;
  },
};
