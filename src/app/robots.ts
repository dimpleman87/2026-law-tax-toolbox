/**
 * src/app/robots.ts
 * robots.txt の動的生成
 */

import type { MetadataRoute } from "next";

const サイトURL = process.env.NEXT_PUBLIC_SITE_URL || "https://toolbox-free.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${サイトURL}/sitemap.xml`,
  };
}
