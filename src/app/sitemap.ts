/**
 * src/app/sitemap.ts
 * 動的サイトマップ生成（高需要ツールは priority 0.9 に設定）
 */

import { MetadataRoute } from "next";
import { 全スラッグ取得 } from "@/lib/load-tools";
import { SITE_URL } from "@/lib/constants";

// 高需要・高検索ボリュームのツール（priority 0.9）
const 高優先スラッグ = new Set([
  "salary-calculator",
  "furusato-nozei",
  "mortgage-calculator",
  "side-job-tax",
  "year-end-tax-adj",
  "consumption-tax-reverse",
  "hourly-wage-calc",
  "national-health-insurance",
  "gift-tax-calc",
  "invoice-tax-calc",
  "retirement-pay-calc",
  "freelance-tax",
  "meo-checker",
  "bmi-calculator",
  "age-calculator",
  "word-counter",
  "pension-simulator",
  "take-home-reverse",
  "dog-age-calculator",
  "employment-insurance-calc",
  "corporate-tax-estimate",
  "depreciation-calc",
  "resignation-pay-estimate",
  "crypto-tax-2026",
  "high-cost-medical-2026",
  "company-setup-cost",
  "consumption-tax-calc",
  "pet-annual-cost",
  "pet-insurance-check",
  "pet-medical-cost",
  "pet-funeral-cost",
  "rpa-time-saving",
  "saas-roi-calc",
  "telework-cost-benefit",
  "pet-lifetime-care-cost",
  "subsidy-2026-check",
  "system-maintenance-fee",
  "cloud-migration-cost",
  "paperless-saving-calc",
  "security-investment-roi",
  "pet-microchip-registration",
  "ai-infra-energy-cost",
  "gx-carbon-levy-calc",
  "logistics-fare-pass-through",
  "storage-cost-predict",
  "digital-sign-saving",
]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
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
  ];

  // ツールページ（高需要は 0.9、その他は 0.7）
  const ツールページ = スラッグ一覧.map((スラッグ) => ({
    url: `${SITE_URL}/tools/${encodeURIComponent(スラッグ)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 高優先スラッグ.has(スラッグ) ? 0.9 : 0.7,
  }));

  return [...固定ページ, ...ツールページ];
}
