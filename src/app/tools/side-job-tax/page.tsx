"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import AffiliateSlot from "@/components/AffiliateSlot";
import FavoriteButton from "@/components/FavoriteButton";
import RelatedTools from "@/components/RelatedTools";
import CalcHistory from "@/components/CalcHistory";
import ToolJsonLd from "@/components/ToolJsonLd";
import styles from "./side-job-tax.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "side-job-tax",
  タイトル: "副業 確定申告チェッカー",
  説明: "20万円ルール・税額・納付時期を即判定",
  カテゴリ: "ビジネス・経理",
  category: "Business",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["💡 副業収入{result}円の税金を計算。確定申告の要否も即判定→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

function 所得税率取得(課税所得: number): { rate: number; deduct: number } {
  const brackets = [
    { limit: 1950000,  rate: 0.05, deduct: 0 },
    { limit: 3300000,  rate: 0.10, deduct: 97500 },
    { limit: 6950000,  rate: 0.20, deduct: 427500 },
    { limit: 9000000,  rate: 0.23, deduct: 636000 },
    { limit: 18000000, rate: 0.33, deduct: 1536000 },
    { limit: 40000000, rate: 0.40, deduct: 2796000 },
    { limit: Infinity,  rate: 0.45, deduct: 4796000 },
  ];
  return brackets.find((b) => 課税所得 <= b.limit) ?? brackets[brackets.length - 1];
}

type 副業種別 = "雑所得" | "事業所得" | "不動産所得";
type 本業種別 = "会社員" | "パート・アルバイト" | "フリーランス";

export default function 副業確定申告チェッカーページ() {
  const [本業年収, set本業年収] = useState("5000000");
  const [副業収入, set副業収入] = useState("500000");
  const [副業経費, set副業経費] = useState("50000");
  const [副業種別, set副業種別] = useState<副業種別>("雑所得");
  const [本業種別, set本業種別] = useState<本業種別>("会社員");
  const [青色申告, set青色申告] = useState(false);

  const 結果 = useMemo(() => {
    const 本業N = parseInt(本業年収) || 0;
    const 収入N = parseInt(副業収入) || 0;
    const 経費N = parseInt(副業経費) || 0;
    if (収入N <= 0) return null;

    const 青色控除 = 副業種別 === "事業所得" && 青色申告 ? 650000 : 0;
    const 副業所得 = Math.max(0, 収入N - 経費N - 青色控除);

    // 20万円ルール判定（会社員のみ）
    const 申告義務 = 本業種別 === "会社員"
      ? 副業所得 > 200000 ? "要" : "不要（住民税申告は必要）"
      : "要（本業でも確定申告が必要）";

    const 申告必要 = 本業種別 !== "会社員" || 副業所得 > 200000;

    // 本業の給与所得
    let 給与所得控除 = 0;
    if (本業N <= 1625000)      給与所得控除 = 550000;
    else if (本業N <= 1800000) 給与所得控除 = 本業N * 0.4 - 100000;
    else if (本業N <= 3600000) 給与所得控除 = 本業N * 0.3 + 80000;
    else if (本業N <= 6600000) 給与所得控除 = 本業N * 0.2 + 440000;
    else if (本業N <= 8500000) 給与所得控除 = 本業N * 0.1 + 1100000;
    else                       給与所得控除 = 1950000;
    const 本業給与所得 = 本業N - 給与所得控除;

    const 合計所得 = 本業給与所得 + 副業所得;
    const 基礎控除 = 合計所得 <= 24000000 ? 480000 : 0;
    const 課税所得 = Math.max(0, 合計所得 - 基礎控除);

    const { rate, deduct } = 所得税率取得(課税所得);
    const 合計所得税 = (課税所得 * rate - deduct) * 1.021;

    // 副業分の追加所得税（簡易計算：限界税率ベース）
    const 副業追加税 = 申告必要 ? Math.round(副業所得 * rate * 1.021) : 0;
    // 住民税（副業所得の10%）
    const 住民税追加 = Math.round(副業所得 * 0.10);

    // 実質手取り
    const 副業手取り = 副業所得 - 副業追加税 - 住民税追加;
    const 手取り率 = 収入N > 0 ? (副業手取り / 収入N) * 100 : 0;

    return {
      副業所得,
      申告義務,
      申告必要,
      副業追加税,
      住民税追加,
      副業手取り,
      手取り率,
      限界税率: rate,
      青色控除,
      合計所得税: Math.round(合計所得税),
    };
  }, [本業年収, 副業収入, 副業経費, 副業種別, 本業種別, 青色申告]);

  const 結果テキスト = 結果 ? `副業手取り ${fmt(結果.副業手取り)}円（手取率${結果.手取り率.toFixed(0)}%）` : "";

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="side-job-tax" タイトル="副業 確定申告チェッカー" 説明="20万円ルール・税額・納付時期を即判定" カテゴリ="ビジネス・経理" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li>副業 確定申告チェッカー</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">💡 副業 確定申告チェッカー</h1>
          <FavoriteButton slug="side-job-tax" title="副業 確定申告チェッカー" emoji="💡" />
          <p className="ツールページ説明">
            副業収入を入力するだけで申告要否・税額・実質手取りを即判定。20万円ルール・青色申告・住民税バレ対策まで解説。
          </p>
        </div>
      </div>

      <main className="ツールページメイン">
        <div className="ツールページコンテナ">
          <div className="広告ラッパー" style={{ padding: 0, marginBottom: "var(--スペース-lg)" }}>
            <div className="広告ラベル">スポンサー</div>
            <AdSlot 位置="top" />
          </div>

          <div className={styles.ツールUI}>
            {/* ─── 入力 ─── */}
            <div className="入力セクション">
              <div className="フィールドグループ">
                <label className="フィールドラベル">本業の種別</label>
                <div className={styles.モードグリッド}>
                  {(["会社員", "パート・アルバイト", "フリーランス"] as 本業種別[]).map((m) => (
                    <button key={m}
                      className={`${styles.モードボタン} ${本業種別 === m ? styles.モードボタンアクティブ : ""}`}
                      onClick={() => set本業種別(m)}>{m}</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">本業の年収（円）</label>
                <input type="number" className="数値入力" value={本業年収}
                  onChange={(e) => set本業年収(e.target.value)} min="0" step="100000" />
                <div className={styles.クイック群}>
                  {["3000000","4000000","5000000","6000000","8000000"].map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${本業年収 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set本業年収(v)}>
                      {(Number(v)/10000).toFixed(0)}万
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.区切り}>副業・サイドビジネスの情報</div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">副業の所得区分</label>
                <div className={styles.モードグリッド}>
                  {(["雑所得", "事業所得", "不動産所得"] as 副業種別[]).map((m) => (
                    <button key={m}
                      className={`${styles.モードボタン} ${副業種別 === m ? styles.モードボタンアクティブ : ""}`}
                      onClick={() => set副業種別(m)}>{m}</button>
                  ))}
                </div>
                <p style={{ fontSize: "11px", color: "var(--カラー-テキスト極薄)", lineHeight: 1.6 }}>
                  {副業種別 === "雑所得" ? "ブログ・せどり・YouTube等の収益が「雑所得」に該当することが多い。" :
                   副業種別 === "事業所得" ? "継続・反復的な副業は「事業所得」。青色申告65万控除が使える。" :
                   "賃貸収入など不動産からの収益。"}
                </p>
              </div>

              <div className={styles.条件グリッド}>
                <div className="フィールドグループ">
                  <label className="フィールドラベル">副業収入（年間・円）</label>
                  <input type="number" className="数値入力" value={副業収入}
                    onChange={(e) => set副業収入(e.target.value)} min="0" step="10000" />
                </div>
                <div className="フィールドグループ">
                  <label className="フィールドラベル">副業経費（年間・円）</label>
                  <input type="number" className="数値入力" value={副業経費}
                    onChange={(e) => set副業経費(e.target.value)} min="0" step="10000" />
                </div>
              </div>

              {副業種別 === "事業所得" && (
                <label className={styles.チェックラベル}>
                  <input type="checkbox" checked={青色申告} onChange={(e) => set青色申告(e.target.checked)}
                    style={{ accentColor: "var(--カラー-プライマリ)" }} />
                  青色申告（65万円特別控除）を適用する
                </label>
              )}
            </div>

            {/* ─── 結果 ─── */}
            <div className="結果セクション">
              <div className="結果見出し">計算結果</div>

              {結果 ? (
                <div className={styles.結果コンテンツ}>
                  {/* 申告判定バッジ */}
                  <div className={結果.申告必要 ? styles.申告要バッジ : styles.申告不要バッジ}>
                    <span className={styles.バッジアイコン}>{結果.申告必要 ? "⚠️" : "✅"}</span>
                    <div>
                      <div className={styles.バッジタイトル}>確定申告：{結果.申告義務}</div>
                      {!結果.申告必要 && (
                        <div className={styles.バッジサブ}>住民税の申告は市区町村の窓口で別途必要</div>
                      )}
                    </div>
                  </div>

                  {/* 手取りカード */}
                  <div className={styles.手取りカード}>
                    <span className={styles.手取りラベル}>副業の実質手取り</span>
                    <span className={styles.手取り値}>¥{fmt(結果.副業手取り)}</span>
                    <span className={styles.手取り率}>手取率 {結果.手取り率.toFixed(0)}%</span>
                  </div>

                  <div className="結果グリッド">
                    {[
                      { label: "副業所得（経費引後）", value: `¥${fmt(結果.副業所得)}円`, color: "#26d9ca" },
                      { label: "追加所得税（概算）",   value: 結果.申告必要 ? `¥${fmt(結果.副業追加税)}円` : "なし（20万円以下）", color: "#f25acc" },
                      { label: "住民税増加分（概算）", value: `¥${fmt(結果.住民税追加)}円`, color: "#f59e0b" },
                      { label: "適用限界税率",         value: `${(結果.限界税率 * 100).toFixed(0)}%`, color: "" },
                    ].map((item) => (
                      <div key={item.label} className="結果カード">
                        <span className="結果ラベル">{item.label}</span>
                        <span className="結果値" style={{ fontSize: "1.0rem", color: item.color }}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {結果.青色控除 > 0 && (
                    <div className={styles.節税メモ}>
                      ✅ 青色申告特別控除 ¥{fmt(結果.青色控除)}円 が適用されています
                    </div>
                  )}

                  <div className={styles.節税ヒント}>
                    <div className={styles.ヒントタイトル}>💡 節税ポイント</div>
                    <ul className={styles.ヒントリスト}>
                      <li>経費を漏れなく計上（通信費・PC・書籍・交通費）</li>
                      <li>事業所得なら青色申告で最大65万円控除</li>
                      <li>ふるさと納税と組み合わせて住民税を軽減</li>
                      <li>住民税は「普通徴収」に変更して会社バレを防ぐ</li>
                    </ul>
                  </div>

                  <div className={styles.スケジュール}>
                    <div className={styles.スケジュールタイトル}>📅 申告スケジュール</div>
                    <div className={styles.スケジュール行}>
                      <span>確定申告期間</span><span>翌年2月16日〜3月15日</span>
                    </div>
                    <div className={styles.スケジュール行}>
                      <span>所得税納付</span><span>3月15日まで</span>
                    </div>
                    <div className={styles.スケジュール行}>
                      <span>住民税通知</span><span>翌年6月（特別徴収）</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="プレースホルダーメッセージ">副業収入を入力してください</p>
              )}
            </div>
          </div>

          {結果 && <>
              <AffiliateSlot カテゴリ="business" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
              </>
              }


          <ToolGuide slug="side-job-tax" />
        </div>
      </main>
    </>
  );
}
