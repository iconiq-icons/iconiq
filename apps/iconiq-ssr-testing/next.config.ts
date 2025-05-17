import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Configure server-side rendering options
  experimental: {
    // Enable server actions for testing
    serverActions: {
      bodySizeLimit: '5mb',
    },
    // For testing SSR optimizations
    optimizePackageImports: ['@iconiq/react'],
    // Enhanced server-side rendering metrics
    serverComponentsExternalPackages: [],
    // Improve test reliability
    typedRoutes: true,
  },

  // Increase static generation timeout for testing
  staticPageGenerationTimeout: 120,

  // Support various image formats
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Optimize testing environment
  eslint: {
    ignoreDuringBuilds: true, // For faster test builds
  },

  typescript: {
    ignoreBuildErrors: true, // For faster test builds
  },

  // Custom config for SSR testing
  env: {
    SSR_TESTING: 'true',
  },
};

export default nextConfig;
