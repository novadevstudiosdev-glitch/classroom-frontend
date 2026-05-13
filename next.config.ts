import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Redirect all old static minigame HTML pages to the new React lobby
      {
        source: '/minigame/:file*.html',
        destination: '/minigame/lobby',
        permanent: false,
      },
      {
        source: '/minigame/solo',
        destination: '/minigame/lobby',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
