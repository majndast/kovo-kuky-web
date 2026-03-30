import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Optimize for modern browsers only (no IE11, no old Safari)
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  // Compress responses
  compress: true,
  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Remove console in production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default withNextIntl(nextConfig);
