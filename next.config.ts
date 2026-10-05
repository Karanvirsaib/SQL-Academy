import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  ...(process.env.GITHUB_PAGES === 'true' ? {
    output: 'export' as const,
    distDir: '.next-pages',
    trailingSlash: true,
    images: {unoptimized: true},
  } : {}),
};

export default nextConfig;
