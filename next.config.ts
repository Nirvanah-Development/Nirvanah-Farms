import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizeCss: false, // Disable CSS optimization that might cause issues
    turbo: {
      rules: {
        "*.css": {
          loaders: ["css-loader"],
          as: "*.css",
        },
      },
    },
  },
  webpack: (config, { isServer, dev }) => {
    // Disable CSS minification to prevent TailwindCSS v4 issues in Docker
    if (!isServer && !dev) {
      config.optimization.minimize = false;
      config.optimization.minimizer = [];
    }
    return config;
  },
};

export default nextConfig;
