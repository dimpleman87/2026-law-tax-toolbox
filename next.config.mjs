/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    formats: ["image/avif", "image/webp"],
  },

  // trailing slash を無効化（canonical統一）
  trailingSlash: false,
};

export default nextConfig;
