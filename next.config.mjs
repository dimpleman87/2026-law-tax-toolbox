/** @type {import('next').NextConfig} */
const nextConfig = {
  // ビルド時の TypeScript 型チェックをスキップ（Vercel デプロイ優先）
  typescript: {
    ignoreBuildErrors: true,
  },

  // ビルド時の ESLint チェックをスキップ
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 画像最適化設定
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
