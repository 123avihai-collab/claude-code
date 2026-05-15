import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: process.env.GH_PAGES === "true" ? "/claude-code" : "",
  assetPrefix: process.env.GH_PAGES === "true" ? "/claude-code/" : "",
};

export default nextConfig;
