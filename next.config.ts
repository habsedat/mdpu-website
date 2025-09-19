import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Firebase Hosting
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Compression
  compress: true,
  
  // Build ID for deployment tracking
  generateBuildId: async () => {
    return 'mdpu-build-' + Date.now();
  },
  
  // Disable strict linting for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
