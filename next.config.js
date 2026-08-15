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
  webpack: (config, { isServer }) => {
    config.cache = { type: 'memory' };
    if (isServer) {
      config.optimization = config.optimization || {};
      config.optimization.splitChunks = false;
    }
    return config;
  },
};
