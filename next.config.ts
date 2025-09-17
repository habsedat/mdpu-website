import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable server-side functionality for Firebase Functions
  // output: 'export', // Removed for server-side functionality
  trailingSlash: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Compression
  compress: true,
  
  // Skip API routes during build for now
  generateBuildId: async () => {
    return 'mdpu-build-' + Date.now();
  },
};

export default nextConfig;
