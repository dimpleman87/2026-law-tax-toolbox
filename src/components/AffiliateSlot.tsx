/**
 * src/components/AffiliateSlot.tsx
 *
 * カテゴリ連動アフィリエイトリンク枠
 * - カテゴリ文字列を受け取り、Amazon / 楽天 / A8 のリンクを
 *   最大3件カード形式で表示
 * - ツールページの結果セクション下に差し込む
 *
 * 使い方:
 *   <AffiliateSlot カテゴリ="pet" />
 *   <AffiliateSlot カテゴリ="IT" />
 *   <AffiliateSlot カテゴリ="business" />
 */

import {
  PET_AD_LINKS,
  BUSINESS_AD_LINKS,
  IT_AD_LINKS,
  DIET_AD_LINKS,
  GENERAL_AD_LINKS,
} from "@/lib/ad-links";

type カテゴリ種別 = "pet" | "IT" | "business" | "health" | "general";

interface AffiliateItem {
  label: string;
  href: string;
  badge: string;   // "Amazon" | "楽天" | "A8" など
  emoji: string;
  pixel?: string;  // A8.net インプレッション計測ピクセル URL
}

const リンクマップ: Record<カテゴリ種別, AffiliateItem[]> = {
  pet: [
    { label: "国産ドッグフード・キャットフードを探す", href: PET_AD_LINKS.petGoods,         badge: "Amazon", emoji: "🛒" },
    { label: "ペット保険の比較本を見る",               href: PET_AD_LINKS.petInsuranceBook, badge: "Amazon", emoji: "📚" },
    { label: "Furbo ドッグカメラ（外出先から確認）",   href: PET_AD_LINKS.furbo,            badge: "PR",     emoji: "📷" },
  ],
  IT: [
    { label: "ウイルスバスター セキュリティソフト",   href: IT_AD_LINKS.virusbuster,   badge: "PR", emoji: "🛡️", pixel: IT_AD_LINKS.virusbusterPixel },
    { label: "DX推進・業務自動化の実践本",            href: IT_AD_LINKS.dxBook,        badge: "Amazon", emoji: "📚" },
    { label: "RPA・クラウド移行入門書を探す",          href: IT_AD_LINKS.rpaBook,       badge: "Amazon", emoji: "🤖" },
  ],
  business: [
    { label: "マネーフォワード クラウド確定申告（無料）", href: BUSINESS_AD_LINKS.moneyforward, badge: "PR", emoji: "💻", pixel: BUSINESS_AD_LINKS.moneyforwardPixel },
    { label: "URUMAP ビジネスマッチングで案件獲得",     href: BUSINESS_AD_LINKS.urumap,      badge: "PR", emoji: "🤝", pixel: BUSINESS_AD_LINKS.urumapPixel },
    { label: "補助金・助成金申請ガイド本",              href: BUSINESS_AD_LINKS.subsidyBook, badge: "Amazon", emoji: "💰" },
  ],
  health: [
    { label: "健康管理・セルフケア本を探す",   href: DIET_AD_LINKS.healthBook, badge: "Amazon", emoji: "📚" },
    { label: "Amazonで健康グッズを探す",       href: GENERAL_AD_LINKS.amazon,  badge: "Amazon", emoji: "🛒" },
    { label: "CLOUD GYM 遺伝子検査キット",     href: DIET_AD_LINKS.cloudgym,   badge: "PR",     emoji: "🧬" },
  ],
  general: [
    { label: "マネーフォワード クラウド確定申告（無料）", href: BUSINESS_AD_LINKS.moneyforward,  badge: "PR",     emoji: "💻", pixel: BUSINESS_AD_LINKS.moneyforwardPixel },
    { label: "ビジネス書おすすめ2026",                  href: GENERAL_AD_LINKS.businessBooks,  badge: "Amazon", emoji: "📚" },
    { label: "URUMAP ビジネスマッチングで案件獲得",      href: BUSINESS_AD_LINKS.urumap,        badge: "PR",     emoji: "🤝", pixel: BUSINESS_AD_LINKS.urumapPixel },
  ],
};

const バッジ色: Record<string, string> = {
  Amazon: "#f59e0b",
  楽天:   "#e61a1a",
  PR:     "#6366f1",
  A8:     "#10b981",
};

interface AffiliateSlotProps {
  カテゴリ?: カテゴリ種別;
}

export default function AffiliateSlot({ カテゴリ = "general" }: AffiliateSlotProps) {
  const items = リンクマップ[カテゴリ] ?? リンクマップ.general;

  return (
    <div style={wrapStyle}>
      <p style={labelStyle}>関連商品・サービス（広告）</p>
      <div style={gridStyle}>
        {items.map((item) => (
          <div key={item.href}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer sponsored"
              style={cardStyle}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--カラー-ボーダー強)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--カラー-ボーダー)"; }}
            >
              <span style={emojiStyle}>{item.emoji}</span>
              <span style={cardTextStyle}>{item.label}</span>
              <span style={{ ...badgeStyle, background: バッジ色[item.badge] ?? "#6366f1" }}>
                {item.badge}
              </span>
            </a>
            {/* A8.net インプレッション計測ピクセル */}
            {item.pixel && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                width={1}
                height={1}
                src={item.pixel}
                alt=""
                style={{ display: "block", width: 1, height: 1, border: "none" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const wrapStyle: React.CSSProperties = {
  marginTop: "var(--スペース-lg)",
  padding: "var(--スペース-md)",
  background: "rgba(255,255,255,0.015)",
  border: "1px solid var(--カラー-ボーダー)",
  borderRadius: "var(--角丸-md)",
};

const labelStyle: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 600,
  color: "var(--カラー-テキスト薄)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: "10px",
};

const gridStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const cardStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 10px",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid var(--カラー-ボーダー)",
  borderRadius: "var(--角丸-sm)",
  textDecoration: "none",
  transition: "border-color 0.15s",
  cursor: "pointer",
};

const emojiStyle: React.CSSProperties = {
  fontSize: "16px",
  flexShrink: 0,
};

const cardTextStyle: React.CSSProperties = {
  flex: 1,
  fontSize: "12px",
  color: "var(--カラー-テキスト薄)",
  fontWeight: 600,
  lineHeight: 1.4,
};

const badgeStyle: React.CSSProperties = {
  flexShrink: 0,
  fontSize: "10px",
  fontWeight: 700,
  color: "#fff",
  padding: "2px 6px",
  borderRadius: "4px",
};
