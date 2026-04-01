import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Clean URL for solo mode
      {
        source: '/minigame/solo',
        destination: '/minigame/index.html',
      },
    ];
  },
};

export default nextConfig;
