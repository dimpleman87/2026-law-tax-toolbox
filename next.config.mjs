/** @type {import('next').NextConfig} */
const nextConfig = {
  // ビルド時の TypeScript 型エラーをスキップ
  typescript: {
    ignoreBuildErrors: true,
  },

  // 画像最適化設定
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // trailing slash を明示的に無効化（GSC正規化対策）
  trailingSlash: false,

  // www → non-www リダイレクト（canonical統一）
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.toolbox-free.com" }],
        destination: "https://toolbox-free.com/:path*",
        permanent: true, // 301
      },
    ];
  },

  // canonical Link ヘッダーをHTTPレベルで付与（HTMLのmetaと二重保証）
  async headers() {
    return [
      {
        source: "/tools/:slug",
        headers: [
          {
            key: "Link",
            value: '<https://toolbox-free.com/tools/:slug>; rel="canonical"',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
