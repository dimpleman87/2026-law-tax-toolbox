/**
 * src/app/sitemap.ts
 * 動的サイトマップ生成
 */

import { MetadataRoute } from "next";
import { 全スラッグ取得 } from "@/lib/load-tools";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 全ツールのスラッグを取得
  const スラッグ一覧 = await 全スラッグ取得();

  // 基本ページ
  const 固定ページ = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
  ];

  // ツール個別ページ
  const ツールページ = スラッグ一覧.map((スラッグ) => ({
    url: `${SITE_URL}/tools/${encodeURIComponent(スラッグ)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...固定ページ, ...ツールページ];
}
