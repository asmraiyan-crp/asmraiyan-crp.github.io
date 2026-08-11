import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // THIS IS CRITICAL
  basePath: '/my-3d-portfolio', 
  assetPrefix: '/my-3d-portfolio/',
};

export default nextConfig;