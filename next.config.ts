import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  /** Allow `next/image` for `public/images/*` including optional `?v=` cache-busters. */
  images: {
    localPatterns: [{ pathname: "/images/**" }],
  },
};

export default nextConfig;
