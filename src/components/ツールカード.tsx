/**
 * src/components/ツールカード.tsx
 * トップページ用ツール一覧カードコンポーネント
 *
 * 各ツールの概要をカード形式で表示します。
 * クリックするとツールページへ遷移します。
 */

import Link from "next/link";
import { ツール定義型 } from "@/lib/types";

import { CATEGORIES } from "@/lib/constants";

// カテゴリ別のアイコン設定
const カテゴリアイコン: Record<string, string> = {
  [CATEGORIES.TEXT]: "📝",
  [CATEGORIES.FINANCE]: "💰",
  [CATEGORIES.BUSINESS]: "💼",
  [CATEGORIES.LEGAL]: "⚖️",
  [CATEGORIES.IT]: "🚀",
  [CATEGORIES.LIFE]: "🛠️",
};

interface ツールカードProps {
  ツール: ツール定義型;
  カテゴリカラー?: string;
  強調?: boolean;
}

export default function ツールカード({ ツール, カテゴリカラー, 強調 = false }: ツールカードProps) {
  const アイコン = カテゴリアイコン[ツール.カテゴリ] || カテゴリアイコン["その他"];
  const color = カテゴリカラー || "#675af2";

  return (
    <Link
      href={`/tools/${encodeURIComponent(ツール.スラッグ)}`}
      className={`ツールカード${強調 ? " ツールカード強調" : ""}`}
      aria-label={`${ツール.タイトル}を開く`}
      style={{ "--card-accent": color } as React.CSSProperties}
    >
      {/* カテゴリカラーの左ボーダーアクセント */}
      <span className="カードアクセントライン" aria-hidden="true" />

      <div className="ツールカード内容">
        <div className="ツールカードヘッダー">
          <span
            className="ツールアイコンラッパー"
            style={{ background: `${color}18`, border: `1px solid ${color}30` }}
          >
            <span className="ツールアイコン" aria-hidden="true">{アイコン}</span>
          </span>
          <span
            className="カテゴリバッジ"
            style={{ background: `${color}18`, borderColor: `${color}40`, color: color }}
          >
            {ツール.カテゴリ}
          </span>
        </div>
        <h2 className="ツール名">{ツール.タイトル}</h2>
        <p className="ツール説明">{ツール.説明}</p>
        <div className="カード矢印" style={{ color: color }}>
          <span>使ってみる</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </Link>
  );
}
