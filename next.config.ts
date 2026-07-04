import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/projects",
        destination: "/events",
        permanent: true,
      },
      {
        source: "/blog",
        destination: "/events",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
