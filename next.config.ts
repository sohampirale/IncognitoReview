import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Skip TypeScript type checking during builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
