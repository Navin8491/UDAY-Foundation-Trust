import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Speed up dev: pre-bundle heavy packages instead of compiling them on every request
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "gsap",
      "lucide-react",
      "@supabase/supabase-js",
      "react-hot-toast",
    ],
  },

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
