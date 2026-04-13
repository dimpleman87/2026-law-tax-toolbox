import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静的エクスポート設定（Vercel/Netlify デプロイ用）
  // output: "export",

  // 画像最適化設定
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // 実験的機能
  experimental: {
    // App Router の最適化
  },
};

export default nextConfig;
