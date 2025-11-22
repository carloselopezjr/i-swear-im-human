import type { NextConfig } from "next";

// next.config.ts
// @ts-nocheck

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
