/**
 * src/components/BusinessAdBanner.tsx
 * ビジネス・経理 / 金融・投資 カテゴリ アフィリエイト広告バナー
 *
 * 対象: ビジネス・経理、金融・投資、士業・法務 ツールの結果画面下部に表示。
 * リンクの変更は src/lib/ad-links.ts の BUSINESS_AD_LINKS を編集すること。
 */

"use client";

import { useMemo } from "react";
import { BUSINESS_AD_LINKS } from "@/lib/ad-links";

interface BusinessAd {
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

const BUSINESS_ADS: BusinessAd[] = [
  {
    id: "moneyforward",
    name: "マネーフォワード 確定申告",
    catch: "freランサー・個人事業主の確定申告を自動化",
    description:
      "銀行・クレカ連携で仕訳を自動化。青色申告65万円控除も簡単に対応。",
    label: "確定申告ソフト",
    href: BUSINESS_AD_LINKS.moneyforward,
    cta: "無料で試してみる →",
    accentColor: "#0066cc",
    emoji: "📊",
  },
  {
    id: "square",
    name: "Square 決済",
    catch: "カード・QR・タッチ決済をすぐに導入",
    description:
      "初期費用ゼロ・月額ゼロ。店舗・出張・ネット販売に対応した決済端末。",
    label: "キャッシュレス決済",
    href: BUSINESS_AD_LINKS.square,
    cta: "無料で始める →",
    accentColor: "#1a1a1a",
    emoji: "💳",
  },
  {
    id: "freee",
    name: "freee 会計",
    catch: "会計・給与・確定申告をクラウドで一元管理",
    description:
      "銀行連携で記帳自動化。税理士との共有もスムーズ。中小企業・個人事業主向け。",
    label: "クラウド会計",
    href: BUSINESS_AD_LINKS.freee,
    cta: "30日無料トライアル →",
    accentColor: "#00b900",
    emoji: "🧾",
  },
  {
    id: "labol",
    name: "labol 資金調達支援",
    catch: "補助金・助成金の申請をプロがサポート",
    description:
      "事業再構築補助金・ものづくり補助金など採択実績多数。無料相談から対応。",
    label: "資金調達・補助金",
    href: BUSINESS_AD_LINKS.labol,
    cta: "無料相談を予約 →",
    accentColor: "#e85d04",
    emoji: "💰",
  },
];

interface BusinessAdBannerProps {
  adId?: "moneyforward" | "square" | "freee" | "labol";
  className?: string;
}

export default function BusinessAdBanner({ adId, className = "" }: BusinessAdBannerProps) {
  const ad = useMemo<BusinessAd>(() => {
    if (adId) return BUSINESS_ADS.find((a) => a.id === adId) ?? BUSINESS_ADS[0];
    return BUSINESS_ADS[Math.floor(Math.random() * BUSINESS_ADS.length)];
  }, [adId]);

  return (
    <div className={`business-ad-banner ${className}`} style={wrapStyle}>
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
