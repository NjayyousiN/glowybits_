import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://goycjtqovjbnehanwuvr.supabase.co/**")],
  },
};

export default nextConfig;
