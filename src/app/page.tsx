/**
 * src/app/page.tsx
 * トップページ — ツール一覧（SSG）
 *
 * src/tools/ 内の全JSONを読み込み、カテゴリ別グリッドで表示します。
 */

import type { Metadata } from "next";
import { カテゴリ別ツール取得 } from "@/lib/load-tools";
import ツールカード from "@/components/ツールカード";
import AdSlot from "@/components/AdSlot";
import { CATEGORIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "無料オンラインツール集 | ToolBox",
  description:
    "文字数カウント・BMI計算・年齢計算など、日常で使える無料Webツールを多数公開。登録不要・ブラウザ上で即座に使えます。",
};

export default async function トップページ() {
  const カテゴリ別ツール = await カテゴリ別ツール取得();
  const カテゴリリスト = Object.values(CATEGORIES);
  const 総ツール数 = Object.values(カテゴリ別ツール).flat().length;

  return (
    <>
      {/* ヒーローセクション */}
      <section className="hero-section" aria-labelledby="main-catch">
        <div className="ヒーロー内容">
          <h1 id="main-catch" className="ヒーロータイトル">
            <span className="タイトルアクセント">無料</span>で使える
            <br />
            Webツール集
          </h1>
          <p className="ヒーローサブテキスト">
            テキスト解析・ビジネス計算・DX支援ツールなど{総ツール数}種類以上のツールを登録不要で即座に利用できます。
          </p>
          <div className="ヒーローバッジ群">
            <span className="バッジ">✓ 完全無料</span>
            <span className="バッジ">✓ 登録不要</span>
            <span className="バッジ">✓ 即座に使える</span>
          </div>
        </div>
      </section>

      {/* 上部広告 */}
      <div className="広告ラッパー">
        <AdSlot 位置="top" />
      </div>

      {/* カテゴリ別ツール一覧 */}
      <section className="tool-list-section" id="category-list" aria-label="Tool categories">
        <div className="section-container">
          {カテゴリリスト.map((カテゴリ, インデックス) => {
            const ツール一覧 = カテゴリ別ツール[カテゴリ] || [];
            if (ツール一覧.length === 0) return null;

            return (
              <div key={インデックス} className="category-section">
                <h2 className="category-heading" id={`cat-${インデックス}`}>
                  <span aria-hidden="true">
                    {カテゴリ === CATEGORIES.TEXT ? "📝" :
                     カテゴリ === CATEGORIES.FINANCE ? "💰" :
                     カテゴリ === CATEGORIES.BUSINESS ? "💼" :
                     カテゴリ === CATEGORIES.LEGAL ? "⚖️" :
                     カテゴリ === CATEGORIES.IT ? "🚀" : "🛠️"}
                  </span>
                  {カテゴリ}
                </h2>
                <div
                  className="ツールグリッド"
                  role="list"
                  aria-labelledby={`cat-${インデックス}`}
                >
                  {ツール一覧.map((ツール) => (
                    <div key={ツール.スラッグ} role="listitem">
                      <ツールカード ツール={ツール} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 下部広告 */}
      <div className="広告ラッパー">
        <AdSlot 位置="bottom" />
      </div>
    </>
  );
}
