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
}

export default function ツールカード({ ツール }: ツールカードProps) {
  const アイコン = カテゴリアイコン[ツール.カテゴリ] || カテゴリアイコン["その他"];

  return (
    <Link
      href={`/tools/${encodeURIComponent(ツール.スラッグ)}`}
      className="ツールカード"
      aria-label="Open tool"
    >
      <div className="ツールカード内容">
        <div className="ツールカードヘッダー">
          <span className="ツールアイコン" aria-hidden="true">{アイコン}</span>
          <span className="カテゴリバッジ">{ツール.カテゴリ}</span>
        </div>
        <h2 className="ツール名">{ツール.タイトル}</h2>
        <p className="ツール説明">{ツール.説明}</p>
        <div className="カード矢印">
          <span>使ってみる</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </Link>
  );
}
