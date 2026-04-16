/**
 * src/components/LifeAdBanner.tsx
 * 生活・計算 カテゴリ アフィリエイト広告バナー
 *
 * 対象: 生活・計算（BMI・高額療養費等）ツールの結果画面下部に表示。
 * リンクの変更は src/lib/ad-links.ts の DIET_AD_LINKS を編集すること。
 */

"use client";

import { useMemo } from "react";
import { DIET_AD_LINKS } from "@/lib/ad-links";

interface LifeAd {
  id: string;
  name: string;
  catch: string;
  description: string;
  label: string;
  href: string;
  cta: string;
  accentColor: string;
  emoji: string;
}

const LIFE_ADS: LifeAd[] = [
  {
    id: "cloudgym",
    name: "CLOUD GYM 遺伝子検査",
    catch: "あなたの遺伝子に合ったダイエット法が分かる",
    description:
      "300項目以上の遺伝子を解析。体質・太りやすさ・最適な運動種目を科学的に判定。",
    label: "遺伝子検査キット",
    href: DIET_AD_LINKS.cloudgym,
    cta: "詳細を見る →",
    accentColor: "#059669",
    emoji: "🧬",
  },
  {
    id: "rizap",
    name: "RIZAP",
    catch: "完全個室・専属トレーナーで確実に結果を出す",
    description:
      "30日間全額返金保証付き。食事管理+パーソナルトレーニングで体型を根本から変える。",
    label: "パーソナルジム",
    href: DIET_AD_LINKS.rizap,
    cta: "無料カウンセリング →",
    accentColor: "#dc2626",
    emoji: "💪",
  },
];

interface LifeAdBannerProps {
  adId?: "cloudgym" | "rizap";
  className?: string;
}

export default function LifeAdBanner({ adId, className = "" }: LifeAdBannerProps) {
  const ad = useMemo<LifeAd>(() => {
    if (adId) return LIFE_ADS.find((a) => a.id === adId) ?? LIFE_ADS[0];
    return LIFE_ADS[Math.floor(Math.random() * LIFE_ADS.length)];
  }, [adId]);

  return (
    <div className={`life-ad-banner ${className}`} style={wrapStyle}>
      <p style={sponsorLabelStyle}>スポンサーリンク</p>
      <a
        href={ad.href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        style={{ ...bannerStyle, borderColor: ad.accentColor }}
        aria-label={`${ad.name} - 広告`}
      >
        <span style={{ ...emojiStyle, background: ad.accentColor + "22" }}>
          {ad.emoji}
        </span>
        <div style={textBlockStyle}>
          <span style={{ ...labelBadgeStyle, background: ad.accentColor + "22", color: ad.accentColor }}>
            {ad.label}
          </span>
          <p style={nameStyle}>{ad.name}</p>
          <p style={catchStyle}>{ad.catch}</p>
          <p style={descStyle}>{ad.description}</p>
        </div>
        <span style={{ ...ctaStyle, background: ad.accentColor }}>
          {ad.cta}
        </span>
      </a>
    </div>
  );
}

const wrapStyle: React.CSSProperties = { marginTop: "24px", width: "100%" };
const sponsorLabelStyle: React.CSSProperties = {
  fontSize: "10px", color: "rgba(148, 163, 184, 0.5)",
  marginBottom: "6px", textAlign: "right", letterSpacing: "0.05em",
};
const bannerStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "14px", padding: "16px",
  borderRadius: "12px", border: "1px solid", background: "rgba(255,255,255,0.04)",
  textDecoration: "none", transition: "opacity 0.2s", cursor: "pointer",
  flexWrap: "wrap",
};
const emojiStyle: React.CSSProperties = {
  fontSize: "32px", width: "56px", height: "56px", borderRadius: "12px",
  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
};
const textBlockStyle: React.CSSProperties = {
  flex: 1, minWidth: "140px", display: "flex", flexDirection: "column", gap: "4px",
};
const labelBadgeStyle: React.CSSProperties = {
  display: "inline-block", fontSize: "10px", fontWeight: 600,
  padding: "2px 8px", borderRadius: "99px", width: "fit-content", letterSpacing: "0.04em",
};
const nameStyle: React.CSSProperties = {
  margin: 0, fontSize: "15px", fontWeight: 700, color: "rgba(226, 232, 240, 0.95)",
};
const catchStyle: React.CSSProperties = {
  margin: 0, fontSize: "12px", color: "rgba(148, 163, 184, 0.9)", fontWeight: 500,
};
const descStyle: React.CSSProperties = {
  margin: 0, fontSize: "11px", color: "rgba(148, 163, 184, 0.6)", lineHeight: 1.5,
};
const ctaStyle: React.CSSProperties = {
  flexShrink: 0, padding: "8px 14px", borderRadius: "8px",
  fontSize: "12px", fontWeight: 700, color: "#fff",
  whiteSpace: "nowrap", alignSelf: "center",
};
