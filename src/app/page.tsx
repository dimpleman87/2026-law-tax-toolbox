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

// カテゴリ設定（アイコン・色・アンカー）
const カテゴリ設定 = [
  { キー: CATEGORIES.FINANCE,  emoji: "💰", color: "#10b981", anchor: "finance"  },
  { キー: CATEGORIES.BUSINESS, emoji: "💼", color: "#675af2", anchor: "business" },
  { キー: CATEGORIES.LEGAL,    emoji: "⚖️", color: "#f59e0b", anchor: "legal"    },
  { キー: CATEGORIES.IT,       emoji: "🚀", color: "#38bdf8", anchor: "it"       },
  { キー: CATEGORIES.TEXT,     emoji: "📝", color: "#a78bfa", anchor: "text"     },
  { キー: CATEGORIES.LIFE,     emoji: "🛠️", color: "#fb923c", anchor: "life"     },
  { キー: CATEGORIES.PET,      emoji: "🐾", color: "#f472b6", anchor: "pet"      },
];

// 人気ツール（スラッグで指定）
const 人気ツールスラッグ = [
  "word-counter",
  "bmi-calculator",
  "meo-checker",
  "roas-calculator",
  "freelance-tax",
  "age-calculator",
];

export default async function トップページ() {
  const カテゴリ別ツール = await カテゴリ別ツール取得();
  const カテゴリリスト = Object.values(CATEGORIES);
  const 総ツール数 = Object.values(カテゴリ別ツール).flat().length;
  const 全ツール = Object.values(カテゴリ別ツール).flat();
  const 人気ツール一覧 = 人気ツールスラッグ
    .map((slug) => 全ツール.find((t) => t.スラッグ === slug))
    .filter(Boolean) as typeof 全ツール;

  return (
    <>
      {/* ヒーローセクション */}
      <section className="ヒーローセクション" aria-labelledby="main-catch">
        <div className="ヒーロー内容">
          {/* 統計バッジ */}
          <div className="ヒーロー統計バッジ">
            <span className="統計バッジアイテム">
              <span className="統計数字">{総ツール数}</span>
              <span className="統計ラベル">種類のツール</span>
            </span>
            <span className="統計区切り">|</span>
            <span className="統計バッジアイテム">
              <span className="統計数字">0円</span>
              <span className="統計ラベル">完全無料</span>
            </span>
            <span className="統計区切り">|</span>
            <span className="統計バッジアイテム">
              <span className="統計数字">0秒</span>
              <span className="統計ラベル">登録不要</span>
            </span>
          </div>

          <h1 id="main-catch" className="ヒーロータイトル">
            <span className="タイトルアクセント">無料</span>で使える
            <br className="sp-break" />
            Webツール集
          </h1>
          <p className="ヒーローサブテキスト">
            ビジネス・金融・DX・テキスト解析まで、仕事で即使えるツールを揃えました。
            <br />登録不要・広告表示のみ・完全無料。
          </p>
        </div>
      </section>

      {/* カテゴリクイックナビ */}
      <nav className="カテゴリクイックナビ" aria-label="カテゴリジャンプ">
        <div className="カテゴリナビコンテナ">
          {カテゴリ設定.map((設定) => {
            const count = (カテゴリ別ツール[設定.キー] || []).length;
            if (count === 0) return null;
            return (
              <a
                key={設定.anchor}
                href={`#cat-${設定.anchor}`}
                className="カテゴリナビアイテム"
                style={{ "--cat-color": 設定.color } as React.CSSProperties}
              >
                <span className="カテゴリナビアイコン">{設定.emoji}</span>
                <span className="カテゴリナビ名">{設定.キー}</span>
                <span className="カテゴリナビ数">{count}</span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* 上部広告 */}
      <div className="広告ラッパー">
        <div className="広告ラベル">スポンサー</div>
        <AdSlot 位置="top" />
      </div>

      {/* 人気ツール */}
      {人気ツール一覧.length > 0 && (
        <section className="人気ツールセクション" aria-labelledby="popular-heading">
          <div className="セクションコンテナ">
            <h2 className="人気ツール見出し" id="popular-heading">
              <span className="見出しアイコン">⭐</span>
              よく使われているツール
            </h2>
            <div className="人気ツールグリッド" role="list">
              {人気ツール一覧.map((ツール) => (
                <div key={ツール.スラッグ} role="listitem">
                  <ツールカード ツール={ツール} 強調={true} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* カテゴリ別ツール一覧 */}
      <section className="ツール一覧セクション" id="category-list" aria-label="Tool categories">
        <div className="セクションコンテナ">
          {カテゴリ設定.map((設定) => {
            const ツール一覧 = カテゴリ別ツール[設定.キー] || [];
            if (ツール一覧.length === 0) return null;

            return (
              <div
                key={設定.anchor}
                className="カテゴリセクション"
                id={`cat-${設定.anchor}`}
              >
                <h2
                  className="カテゴリ見出し"
                  style={{ "--cat-color": 設定.color } as React.CSSProperties}
                >
                  <span
                    className="カテゴリ見出しアイコンラッパー"
                    style={{ background: `${設定.color}20`, borderColor: `${設定.color}40` }}
                  >
                    <span aria-hidden="true">{設定.emoji}</span>
                  </span>
                  {設定.キー}
                  <span className="カテゴリ件数">{ツール一覧.length}件</span>
                </h2>
                <div
                  className="ツールグリッド"
                  role="list"
                  aria-label={設定.キー}
                >
                  {ツール一覧.map((ツール) => (
                    <div key={ツール.スラッグ} role="listitem">
                      <ツールカード ツール={ツール} カテゴリカラー={設定.color} />
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
        <div className="広告ラベル">スポンサー</div>
        <AdSlot 位置="bottom" />
      </div>
    </>
  );
}
