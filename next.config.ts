import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 纯单机静态导出：无服务端运行时，可托管于任意静态空间或打包进 APK */
  output: "export",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
