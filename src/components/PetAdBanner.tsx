/**
 * src/components/PetAdBanner.tsx
 * Pet カテゴリ アフィリエイト広告バナー
 *
 * 犬の年齢換算ツールなど、ペット系ツールの結果画面下部に表示する。
 * 4種の広告からランダムに1枠を選択して表示。
 * リンクの変更は src/lib/ad-links.ts の PET_AD_LINKS を編集すること。
 */

"use client";

import { useMemo } from "react";
import { PET_AD_LINKS } from "@/lib/ad-links";

// ============================================================
// 広告データ定義（アフィリエイトURLは要差し替え）
// ============================================================

interface PetAd {
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

const PET_ADS: PetAd[] = [
  {
    id: "furbo",
    name: "Furbo ドッグカメラ",
    catch: "外出中も愛犬をリアルタイムで見守れる",
    description:
      "スマホから顔認識・おやつ投げ・双方向通話。分離不安の改善にも。",
    label: "見守りカメラ",
    href: PET_AD_LINKS.furbo,
    cta: "Furboを詳しく見る",
    accentColor: "#ff6b35",
    emoji: "📹",
  },
  {
    id: "wannmatch",
    name: "わんマッチ DNA診断",
    catch: "愛犬の犬種・遺伝的疾患リスクをDNAで解析",
    description:
      "綿棒1本で200以上の遺伝的疾患リスクと犬種構成を判定。食事・運動の最適化に。",
    label: "DNA検査キット",
    href: PET_AD_LINKS.wannmatch,
    cta: "DNA検査キットを見る",
    accentColor: "#6c63ff",
    emoji: "🧬",
  },
  {
    id: "o2pet",
    name: "オーツーペット 酸素室",
    catch: "シニア犬・術後ケアに自宅酸素室をレンタル",
    description:
      "心疾患・気管虚脱・手術後の回復期に。獣医師推奨の酸素濃縮器レンタル。",
    label: "酸素室レンタル",
    href: PET_AD_LINKS.o2pet,
    cta: "レンタルプランを見る",
    accentColor: "#00b4d8",
    emoji: "🫧",
  },
  {
    id: "dogfood",
    name: "プレミアムドッグフード",
    catch: "国産・無添加・グレインフリーで健康寿命を延ばす",
    description:
      "添加物ゼロ・獣医師監修。ライフステージ・体重・犬種別に最適なフードを提案。",
    label: "ドッグフード",
    href: PET_AD_LINKS.dogfood,
    cta: "おすすめフードを見る",
    accentColor: "#52b788",
    emoji: "🦴",
  },
];

// ============================================================
// コンポーネント
// ============================================================

interface PetAdBannerProps {
  /** 表示する広告を固定したい場合に指定（省略時はランダム） */
  adId?: "furbo" | "wannmatch" | "o2pet" | "dogfood";
  className?: string;
}

export default function PetAdBanner({ adId, className = "" }: PetAdBannerProps) {
  // SSR/CSRで一致するようにuseMemoで固定（hydrationエラー防止）
  const ad = useMemo<PetAd>(() => {
    if (adId) {
      return PET_ADS.find((a) => a.id === adId) ?? PET_ADS[0];
    }
    return PET_ADS[Math.floor(Math.random() * PET_ADS.length)];
  }, [adId]);

  return (
    <div className={`pet-ad-banner ${className}`} style={wrapStyle}>
      {/* スポンサー表記 */}
      <p style={sponsorLabelStyle}>スポンサーリンク</p>

      {/* バナー本体 */}
      <a
        href={ad.href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        style={{ ...bannerStyle, borderColor: ad.accentColor }}
        aria-label={`${ad.name} - 広告`}
      >
        {/* 左: アイコン */}
        <span style={{ ...emojiStyle, background: ad.accentColor + "22" }}>
          {ad.emoji}
        </span>

        {/* 中: テキスト */}
        <div style={textBlockStyle}>
          <span style={{ ...labelBadgeStyle, background: ad.accentColor + "22", color: ad.accentColor }}>
            {ad.label}
          </span>
          <p style={nameStyle}>{ad.name}</p>
          <p style={catchStyle}>{ad.catch}</p>
          <p style={descStyle}>{ad.description}</p>
        </div>

        {/* 右: CTA */}
        <span style={{ ...ctaStyle, background: ad.accentColor }}>
          {ad.cta} →
        </span>
      </a>
    </div>
  );
}

// ============================================================
// インラインスタイル（Tailwindクラスが届かない動的カラーのため）
// ============================================================

const wrapStyle: React.CSSProperties = {
  marginTop: "24px",
  width: "100%",
};

const sponsorLabelStyle: React.CSSProperties = {
  fontSize: "10px",
  color: "rgba(148, 163, 184, 0.5)",
  marginBottom: "6px",
  textAlign: "right" as const,
  letterSpacing: "0.05em",
};

const bannerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid",
  background: "rgba(255,255,255,0.04)",
  textDecoration: "none",
  transition: "opacity 0.2s",
  cursor: "pointer",
  flexWrap: "wrap" as const,
};

const emojiStyle: React.CSSProperties = {
  fontSize: "32px",
  width: "56px",
  height: "56px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const textBlockStyle: React.CSSProperties = {
  flex: 1,
  minWidth: "140px",
  display: "flex",
  flexDirection: "column" as const,
  gap: "4px",
};

const labelBadgeStyle: React.CSSProperties = {
  display: "inline-block",
  fontSize: "10px",
  fontWeight: 600,
  padding: "2px 8px",
  borderRadius: "99px",
  width: "fit-content",
  letterSpacing: "0.04em",
};

const nameStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "15px",
  fontWeight: 700,
  color: "rgba(226, 232, 240, 0.95)",
};

const catchStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "12px",
  color: "rgba(148, 163, 184, 0.9)",
  fontWeight: 500,
};

const descStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "11px",
  color: "rgba(148, 163, 184, 0.6)",
  lineHeight: 1.5,
};

const ctaStyle: React.CSSProperties = {
  flexShrink: 0,
  padding: "8px 14px",
  borderRadius: "8px",
  fontSize: "12px",
  fontWeight: 700,
  color: "#fff",
  whiteSpace: "nowrap" as const,
  alignSelf: "center" as const,
};
