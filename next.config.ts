import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    domains: ['res.cloudinary.com'],
    formats: ['image/avif', 'image/webp'],
  },
  typescript: {
    // During development we'll catch type errors
    ignoreBuildErrors: false,
  },
  eslint: {
    // During development we'll catch lint errors
    ignoreDuringBuilds: false,
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@radix-ui/react-icons', '@heroicons/react', 'lucide-react'],
  },
};

export default nextConfig;
