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
  },
  webpack: (config, { isServer }) => {
    // Disable CSS minification to prevent TailwindCSS v4 issues in Docker
    if (!isServer) {
      config.optimization.minimizer = config.optimization.minimizer?.filter(
        (plugin: any) => !plugin.constructor.name.includes('CssMinimizerPlugin')
      );
    }
    return config;
  },
};

export default nextConfig;
