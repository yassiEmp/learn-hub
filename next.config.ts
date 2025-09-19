import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'storage.bolt.army', pathname: '/**' },
      { protocol: 'https', hostname: 'sexample.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '/**' },
      { protocol: 'https', hostname: 'ik.imagekit.io', pathname: '/**' },
    ],
  },
};

export default nextConfig;
