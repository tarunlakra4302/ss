import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  serverExternalPackages: ['googleapis', 'razorpay'],
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'commondatastorage.googleapis.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@phosphor-icons/react',
      'framer-motion',
      'motion',
      'gsap',
      '@gsap/react',
    ],
  },
  allowedDevOrigins: [
    '192.168.155.224',
    'localhost',
    '127.0.0.1',
  ],
};

export default nextConfig;
