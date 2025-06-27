import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://storage.bolt.army/**')],
    domains: ['example.com', 'images.pexels.com'], // TODO: Replace with your actual image host domain(s)
  },
};

export default nextConfig;
