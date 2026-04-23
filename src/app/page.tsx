/**
 * src/app/page.tsx
 * トップページ — SocialXup風 フルリデザイン版
 */

import type { Metadata } from "next";
import Link from "next/link";
import { 全ツール取得, カテゴリ別ツール取得 } from "@/lib/load-tools";
import ツールカード from "@/components/ツールカード";
import AdSlot from "@/components/AdSlot";
import HeroSearch from "@/components/HeroSearch";
import { CATEGORIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "無料オンラインツール集 | ToolBox — 51種類すべて登録不要",
  description:
    "文字数カウント・ROAS計算・MEO診断・BMI・年齢計算など51種類の無料Webツール。ビジネス・金融・DX・テキスト解析まで、登録不要でブラウザ上から即利用。",
};

// ─── カテゴリ設定 ───────────────────────────────────────────
const カテゴリ設定 = [
  { キー: CATEGORIES.FINANCE,  emoji: "💰", color: "#10b981", anchor: "finance",  説明: "複利・ROAS・投資利回りを即計算" },
  { キー: CATEGORIES.BUSINESS, emoji: "💼", color: "#675af2", anchor: "business", 説明: "MEO診断・経費・会社設立コストなど" },
  { キー: CATEGORIES.LEGAL,    emoji: "⚖️", color: "#f59e0b", anchor: "legal",    説明: "印紙税・相続税・建築確認など" },
  { キー: CATEGORIES.IT,       emoji: "🚀", color: "#38bdf8", anchor: "it",       説明: "QRコード・パスワード・DX推進ツール" },
  { キー: CATEGORIES.TEXT,     emoji: "📝", color: "#a78bfa", anchor: "text",     説明: "文字数カウント・テキスト解析" },
  { キー: CATEGORIES.LIFE,     emoji: "🛠️", color: "#fb923c", anchor: "life",     説明: "年齢・BMI・生活計算ツール" },
  { キー: CATEGORIES.PET,      emoji: "🐾", color: "#f472b6", anchor: "pet",      説明: "ペット年齢・医療費・保険チェック" },
];

// ─── 人気ツール（スラッグ指定）────────────────────────────
const 人気ツールスラッグ = [
  "word-counter", "meo-checker", "roas-calculator",
  "freelance-tax", "bmi-calculator", "age-calculator",
];

// ─── シミュレーター特集 ───────────────────────────────────
const シミュレーター特集 = [
  {
    スラッグ: "meo-checker",
    見出し: "Googleマップ集客を診断",
    キャッチ: "MEO伸びしろスコア",
    説明: "業種・口コミ数・HP有無の4項目を入力するだけで、Googleマップ集客ポテンシャルを0〜100でスコアリング。具体的な改善アクションも提示します。",
    CTA: "無料で診断する",
    emoji: "📍",
    color: "#675af2",
  },
  {
    スラッグ: "freelance-tax",
    見出し: "フリーランス手取りを試算",
    キャッチ: "税金シミュレーター",
    説明: "年収・経費・控除を入力すると、所得税・住民税・国保・手取り額をすべて一括計算。確定申告前の資金計画に。",
    CTA: "手取りを計算する",
    emoji: "💰",
    color: "#10b981",
  },
  {
    スラッグ: "roas-calculator",
    見出し: "広告費対効果を即計算",
    キャッチ: "ROAS・ROI計算機",
    説明: "広告費・売上・原価を入力してROAS・ROI・CPA・利益率を自動算出。広告運用の改善ポイントがすぐわかります。",
    CTA: "ROASを計算する",
    emoji: "📊",
    color: "#38bdf8",
  },
];

// ─── 特徴リスト ───────────────────────────────────────────
const 特徴リスト = [
  { emoji: "⚡", タイトル: "即座に結果が出る",    説明: "入力した瞬間にリアルタイム計算。待ち時間ゼロ。" },
  { emoji: "🔒", タイトル: "データはサーバーに送らない", 説明: "計算はすべてブラウザ内で完結。プライバシー安心。" },
  { emoji: "📱", タイトル: "スマホでも快適",      説明: "モバイルファーストで設計。どのデバイスでも使いやすい。" },
  { emoji: "🆓", タイトル: "完全無料・登録不要",  説明: "51種類すべて無料。アカウント作成も不要。" },
  { emoji: "📋", タイトル: "結果を1クリックでコピー", 説明: "計算結果をそのままクリップボードにコピーして使える。" },
  { emoji: "🔗", タイトル: "SNSでシェアできる",   説明: "計算結果をX（旧Twitter）に投稿するテンプレートを用意。" },
];

// ─── FAQ ─────────────────────────────────────────────────
const FAQリスト = [
  {
    Q: "本当に無料ですか？",
    A: "すべてのツールは完全無料です。ページ内に広告が表示されますが、ツールの利用には一切費用がかかりません。",
  },
  {
    Q: "アカウント登録は必要ですか？",
    A: "不要です。URLを開けばすぐに使えます。入力データはサーバーに送信されません。",
  },
  {
    Q: "計算結果の精度はどのくらいですか？",
    A: "各ツールは法令・公式計算式に基づいて設計しています。ただし、最終的な判断は専門家への確認をお勧めします。",
  },
  {
    Q: "スマートフォンでも使えますか？",
    A: "モバイルファーストで設計しているため、iPhoneやAndroidのブラウザでも快適にご利用いただけます。",
  },
  {
    Q: "新しいツールのリクエストはできますか？",
    A: "フッターの「お問い合わせ」からリクエストをお送りください。需要の高いツールを優先的に追加します。",
  },
];

// ─── ユースケース ─────────────────────────────────────────
const ユースケース = [
  { emoji: "👔", シーン: "広告運用担当者",   使い方: "ROAS・CPAを毎日チェックして予算配分を最適化" },
  { emoji: "💼", シーン: "フリーランス",     使い方: "年収から手取り・税金を逆算して単価設定を見直す" },
  { emoji: "🏪", シーン: "店舗オーナー",     使い方: "MEO診断でGoogleマップ集客の伸びしろを可視化" },
  { emoji: "📊", シーン: "経営者・CFO",      使い方: "会社設立コスト・減価償却・法人税を素早く試算" },
  { emoji: "✍️", シーン: "ライター・編集者", 使い方: "文字数カウントで原稿量を管理しながら執筆" },
  { emoji: "🐕", シーン: "ペットオーナー",   使い方: "愛犬・愛猫の生涯医療費・介護コストを事前計算" },
];

// ─── メインコンポーネント ─────────────────────────────────
export default async function トップページ() {
  const [全ツール, カテゴリ別ツール] = await Promise.all([
    全ツール取得(),
    カテゴリ別ツール取得(),
  ]);

  const 総ツール数 = 全ツール.length;

  // 人気ツール一覧を構築
  const 人気ツール一覧 = 人気ツールスラッグ
    .map((slug) => 全ツール.find((t) => t.スラッグ === slug))
    .filter(Boolean) as typeof 全ツール;

  // HeroSearch用の軽量データ
  const 検索用ツール = 全ツール.map((t) => ({
    スラッグ: t.スラッグ,
    タイトル: t.タイトル,
    説明: t.説明,
    カテゴリ: t.カテゴリ,
  }));

  // 最近追加されたツール（JSONの順序で最後8件）
  const 新着ツール = [...全ツール].slice(-6);

  return (
    <>
      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
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
              <span className="統計数字">完全無料</span>
              <span className="統計ラベル">広告表示のみ</span>
            </span>
            <span className="統計区切り">|</span>
            <span className="統計バッジアイテム">
              <span className="統計数字">登録不要</span>
              <span className="統計ラベル">0秒で利用開始</span>
            </span>
          </div>

          <h1 id="main-catch" className="ヒーロータイトル">
            仕事がサクサク進む<br />
            <span className="タイトルアクセント">無料オンラインツール集</span>
          </h1>
          <p className="ヒーローサブテキスト">
            ビジネス・金融・DX・テキスト解析まで{総ツール数}種類。<br className="pc-break" />
            登録不要、広告表示のみで、すべて完全無料で使えます。
          </p>

          {/* 検索バー */}
          <div className="ヒーロー検索ラッパー">
            <HeroSearch ツール一覧={検索用ツール} />
          </div>

          {/* 人気ツール小カード横スクロール */}
          <div className="ヒーロー人気ラベル">よく使われているツール</div>
          <div className="ヒーロー人気スクロール" role="list">
            {人気ツール一覧.map((ツール) => (
              <Link
                key={ツール.スラッグ}
                href={`/tools/${ツール.スラッグ}`}
                className="ヒーロー小カード"
                role="listitem"
              >
                <span className="ヒーロー小カードアイコン">
                  {カテゴリ設定.find((c) => c.キー === ツール.カテゴリ)?.emoji || "🛠️"}
                </span>
                <span className="ヒーロー小カード名">{ツール.タイトル.split("｜")[0]}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 背景装飾 */}
        <div className="ヒーロー装飾1" aria-hidden="true" />
        <div className="ヒーロー装飾2" aria-hidden="true" />
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

      {/* ══════════════════════════════════════
          ⭐ よく使われているツール
      ══════════════════════════════════════ */}
      {人気ツール一覧.length > 0 && (
        <section className="人気ツールセクション" aria-labelledby="popular-heading">
          <div className="セクションコンテナ">
            <div className="セクション見出しブロック">
              <h2 className="セクション大見出し" id="popular-heading">
                <span className="見出しアイコン">⭐</span>
                よく使われているツール
              </h2>
              <p className="セクションサブ">利用頻度の高いツールをピックアップ</p>
            </div>
            <div className="人気ツールグリッド" role="list">
              {人気ツール一覧.map((ツール) => {
                const cat = カテゴリ設定.find((c) => c.キー === ツール.カテゴリ);
                return (
                  <div key={ツール.スラッグ} role="listitem">
                    <ツールカード ツール={ツール} カテゴリカラー={cat?.color} 強調={true} />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          カテゴリグリッド
      ══════════════════════════════════════ */}
      <section className="カテゴリグリッドセクション" aria-labelledby="cat-grid-heading">
        <div className="セクションコンテナ">
          <div className="セクション見出しブロック">
            <h2 className="セクション大見出し" id="cat-grid-heading">
              <span className="見出しアイコン">📂</span>
              ツールカテゴリ一覧
            </h2>
            <p className="セクションサブ">カテゴリを選んで目的のツールをすぐ見つける</p>
          </div>
          <div className="カテゴリカードグリッド">
            {カテゴリ設定.map((設定) => {
              const count = (カテゴリ別ツール[設定.キー] || []).length;
              if (count === 0) return null;
              return (
                <a
                  key={設定.anchor}
                  href={`#cat-${設定.anchor}`}
                  className="カテゴリカード"
                  style={{ "--cat-color": 設定.color } as React.CSSProperties}
                >
                  <span className="カテゴリカードアイコン">{設定.emoji}</span>
                  <div className="カテゴリカードテキスト">
                    <span className="カテゴリカード名">{設定.キー}</span>
                    <span className="カテゴリカード説明">{設定.説明}</span>
                  </div>
                  <span className="カテゴリカード数バッジ">{count}件</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          シミュレーター特集
      ══════════════════════════════════════ */}
      <section className="シミュレーター特集セクション" aria-labelledby="sim-heading">
        <div className="セクションコンテナ">
          <div className="セクション見出しブロック">
            <h2 className="セクション大見出し" id="sim-heading">
              <span className="見出しアイコン">🎯</span>
              おすすめシミュレーター
            </h2>
            <p className="セクションサブ">複雑な計算も入力するだけで即スコア・金額を算出</p>
          </div>
          <div className="シミュレーターグリッド">
            {シミュレーター特集.map((sim) => (
              <Link
                key={sim.スラッグ}
                href={`/tools/${sim.スラッグ}`}
                className="シミュレーターカード"
                style={{ "--sim-color": sim.color } as React.CSSProperties}
              >
                <div className="シミュレーターカードヘッダー">
                  <span className="シミュレーターアイコン">{sim.emoji}</span>
                  <span className="シミュレーターキャッチ">{sim.キャッチ}</span>
                </div>
                <h3 className="シミュレーター見出し">{sim.見出し}</h3>
                <p className="シミュレーター説明">{sim.説明}</p>
                <div className="シミュレーターCTA">
                  <span>{sim.CTA}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 中部広告 */}
      <div className="広告ラッパー">
        <div className="広告ラベル">スポンサー</div>
        <AdSlot 位置="middle" />
      </div>

      {/* ══════════════════════════════════════
          カテゴリ別ツール一覧（全件）
      ══════════════════════════════════════ */}
      <section className="ツール一覧セクション" id="category-list" aria-label="全ツール一覧">
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
                <div className="ツールグリッド" role="list" aria-label={設定.キー}>
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

      {/* ══════════════════════════════════════
          特徴セクション
      ══════════════════════════════════════ */}
      <section className="特徴セクション" aria-labelledby="features-heading">
        <div className="セクションコンテナ">
          <div className="セクション見出しブロック">
            <h2 className="セクション大見出し" id="features-heading">
              <span className="見出しアイコン">✨</span>
              ToolBoxの特徴
            </h2>
          </div>
          <div className="特徴グリッド">
            {特徴リスト.map((特徴, i) => (
              <div key={i} className="特徴カード">
                <span className="特徴アイコン">{特徴.emoji}</span>
                <h3 className="特徴タイトル">{特徴.タイトル}</h3>
                <p className="特徴説明">{特徴.説明}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          使い方（2ステップ）
      ══════════════════════════════════════ */}
      <section className="使い方セクション" aria-labelledby="howto-heading">
        <div className="セクションコンテナ">
          <div className="セクション見出しブロック">
            <h2 className="セクション大見出し" id="howto-heading">
              <span className="見出しアイコン">📖</span>
              2ステップで即利用
            </h2>
          </div>
          <div className="使い方ステップ">
            <div className="ステップカード">
              <div className="ステップ番号">1</div>
              <div className="ステップテキスト">
                <h3 className="ステップタイトル">使いたいツールを選ぶ</h3>
                <p className="ステップ説明">上の検索バーにキーワードを入力するか、カテゴリから選んでください。51種類から目的に合ったツールがすぐ見つかります。</p>
              </div>
            </div>
            <div className="ステップ矢印" aria-hidden="true">→</div>
            <div className="ステップカード">
              <div className="ステップ番号">2</div>
              <div className="ステップテキスト">
                <h3 className="ステップタイトル">入力して即結果を確認</h3>
                <p className="ステップ説明">必要な値を入力するだけでリアルタイムに結果が表示されます。登録不要・課金不要。結果はコピーして使えます。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          こんな方に使われています
      ══════════════════════════════════════ */}
      <section className="ユースケースセクション" aria-labelledby="usecase-heading">
        <div className="セクションコンテナ">
          <div className="セクション見出しブロック">
            <h2 className="セクション大見出し" id="usecase-heading">
              <span className="見出しアイコン">👥</span>
              こんな方に使われています
            </h2>
          </div>
          <div className="ユースケースグリッド">
            {ユースケース.map((uc, i) => (
              <div key={i} className="ユースケースカード">
                <span className="ユースケースアイコン">{uc.emoji}</span>
                <div className="ユースケーステキスト">
                  <span className="ユースケースシーン">{uc.シーン}</span>
                  <span className="ユースケース使い方">{uc.使い方}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          新着ツール
      ══════════════════════════════════════ */}
      {新着ツール.length > 0 && (
        <section className="新着セクション" aria-labelledby="new-heading">
          <div className="セクションコンテナ">
            <div className="セクション見出しブロック">
              <h2 className="セクション大見出し" id="new-heading">
                <span className="見出しアイコン">🆕</span>
                新着・最近追加されたツール
              </h2>
            </div>
            <div className="人気ツールグリッド" role="list">
              {新着ツール.map((ツール) => {
                const cat = カテゴリ設定.find((c) => c.キー === ツール.カテゴリ);
                return (
                  <div key={ツール.スラッグ} role="listitem">
                    <ツールカード ツール={ツール} カテゴリカラー={cat?.color} />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          FAQ
      ══════════════════════════════════════ */}
      <section className="FAQセクション" aria-labelledby="faq-heading">
        <div className="セクションコンテナ セクションコンテナ狭">
          <div className="セクション見出しブロック">
            <h2 className="セクション大見出し" id="faq-heading">
              <span className="見出しアイコン">❓</span>
              よくある質問
            </h2>
          </div>
          <div className="FAQリスト">
            {FAQリスト.map((faq, i) => (
              <details key={i} className="FAQアイテム">
                <summary className="FAQ質問">
                  <span className="FAQQマーク">Q</span>
                  {faq.Q}
                  <span className="FAQ矢印" aria-hidden="true">▾</span>
                </summary>
                <div className="FAQ回答">
                  <span className="FAQAマーク">A</span>
                  {faq.A}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          最終CTA
      ══════════════════════════════════════ */}
      <section className="最終CTAセクション" aria-labelledby="final-cta-heading">
        <div className="セクションコンテナ">
          <div className="最終CTA内容">
            <h2 className="最終CTA見出し" id="final-cta-heading">
              今すぐツールを使ってみる
            </h2>
            <p className="最終CTAサブ">
              {総ツール数}種類すべて無料・登録不要。ビジネスも生活も、計算はToolBoxで。
            </p>
            <HeroSearch ツール一覧={検索用ツール} />
            <div className="最終CTAボタン群">
              <a href="#cat-business" className="最終CTAボタン メイン">ビジネスツールを見る</a>
              <a href="#cat-finance" className="最終CTAボタン サブ">金融・投資ツールを見る</a>
            </div>
          </div>
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
