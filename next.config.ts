import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://storage.bolt.army/**'),new URL('https://sexample.com/**'),new URL('https://images.pexels.com/**')],
  },
};

export default nextConfig;
