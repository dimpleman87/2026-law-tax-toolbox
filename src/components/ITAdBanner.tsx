/**
 * src/components/ITAdBanner.tsx
 * IT・DX推進 カテゴリ アフィリエイト広告バナー
 *
 * 対象: IT・DX推進ツールの結果画面下部に表示。
 * リンクの変更は src/lib/ad-links.ts の BUSINESS_AD_LINKS を編集すること。
 */

"use client";

import { useMemo } from "react";
import { BUSINESS_AD_LINKS } from "@/lib/ad-links";

interface ITAd {
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

const IT_ADS: ITAd[] = [
  {
    id: "moviehacks",
    name: "Movie Hacks 動画編集講座",
    catch: "AIを使った動画編集をゼロから習得",
    description:
      "副業・YouTube運用・社内動画制作に。スマホだけで完結するAI動画編集スキルを習得。",
    label: "オンライン講座",
    href: BUSINESS_AD_LINKS.moviehacks,
    cta: "詳細を見る →",
    accentColor: "#7c3aed",
    emoji: "🎬",
  },
  {
    id: "square-it",
    name: "Square for Retail",
    catch: "POSレジ・在庫管理・ECを一元化",
    description:
      "実店舗とオンラインの売上・在庫をリアルタイム管理。DX化に最適なオールインワン決済。",
    label: "小売DXツール",
    href: BUSINESS_AD_LINKS.square,
    cta: "無料で始める →",
    accentColor: "#1a1a1a",
    emoji: "🖥️",
  },
];

interface ITAdBannerProps {
  adId?: "moviehacks" | "square-it";
  className?: string;
}

export default function ITAdBanner({ adId, className = "" }: ITAdBannerProps) {
  const ad = useMemo<ITAd>(() => {
    if (adId) return IT_ADS.find((a) => a.id === adId) ?? IT_ADS[0];
    return IT_ADS[Math.floor(Math.random() * IT_ADS.length)];
  }, [adId]);

  return (
    <div className={`it-ad-banner ${className}`} style={wrapStyle}>
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
