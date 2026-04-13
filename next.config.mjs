/** @type {import('next').NextConfig} */
const nextConfig = {
  // ビルド時の TypeScript 型チェックをスキップ（Next.js 15+ 対応）
  typescript: {
    ignoreBuildErrors: true,
  },

  // 画像最適化設定
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
