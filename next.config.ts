import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/AP_Vidhyapith',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
