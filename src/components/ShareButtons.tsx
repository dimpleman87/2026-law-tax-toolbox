/**
 * src/components/ShareButtons.tsx
 * SNS（X）シェアボタンコンポーネント
 *
 * 計算結果の「自分事の数字」をXに投稿させ、バイラル流入を狙います。
 * socialPostTemplates の {result} を実際の結果値に差し替えて表示します。
 */

"use client";

import { useState } from "react";
import { ツール定義型 } from "@/lib/types";
import { SITE_URL } from "@/lib/constants";

interface ShareButtonsProps {
  /** 対象ツールの定義 */
  ツール: ツール定義型;
  /** {result} に代入する実際の計算結果テキスト（例: "42,000円"） */
  結果テキスト?: string;
}

/** X(Twitter)シェアURLを生成します */
function Xシェア用URL(テキスト: string, ツールURL: string): string {
  const 投稿文 = `${テキスト}\n${ツールURL}`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(投稿文)}`;
}

export default function ShareButtons({ ツール, 結果テキスト }: ShareButtonsProps) {
  const [選択インデックス, set選択インデックス] = useState<number | null>(null);

  const テンプレート一覧 = ツール.socialPostTemplates ?? [];
  if (テンプレート一覧.length === 0) return null;

  const ツールURL = `${SITE_URL}/tools/${encodeURIComponent(ツール.スラッグ)}`;
  const 結果プレースホルダー = 結果テキスト ?? "◯◯";

  const ラベル = ["🔥 煽り", "💬 共感", "📢 最新情報"];

  return (
    <div className="share-section">
      <div className="share-header">
        <span className="share-icon">𝕏</span>
        <span className="share-title">この結果をXでシェアして流入を呼ぶ</span>
      </div>

      <div className="share-templates">
        {テンプレート一覧.map((テンプレート, i) => {
          const 投稿文 = テンプレート.replace(/\{result\}/g, 結果プレースホルダー);
          const 選択済み = 選択インデックス === i;

          return (
            <div
              key={i}
              className={`share-card${選択済み ? " share-card--selected" : ""}`}
              onClick={() => set選択インデックス(選択済み ? null : i)}
              role="button"
              tabIndex={0}
              aria-pressed={選択済み}
              onKeyDown={(e) => e.key === "Enter" && set選択インデックス(選択済み ? null : i)}
            >
              <span className="share-card-label">{ラベル[i] ?? `パターン${i + 1}`}</span>
              <p className="share-card-text">{投稿文}</p>

              {選択済み && (
                <a
                  href={Xシェア用URL(投稿文, ツールURL)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="x-post-button"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Xに投稿: ${投稿文}`}
                >
                  𝕏 ポストする
                </a>
              )}
            </div>
          );
        })}
      </div>

      <p className="share-hint">
        ↑ カードをタップして投稿文を確認 → 「𝕏 ポストする」でシェア
      </p>
    </div>
  );
}
