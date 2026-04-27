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
import styles from "./real-estate-yield.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "real-estate-yield",
  タイトル: "不動産投資利回り計算機",
  説明: "表面・実質利回りをシミュレーション",
  カテゴリ: "金融・投資",
  category: "Finance",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["🏠 不動産投資の利回りを計算。実質{result}の試算→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }
function pct(n: number) { return n.toFixed(2); }

export default function 不動産利回り計算機ページ() {
  const [購入価格, set購入価格] = useState("30000000");
  const [年間家賃, set年間家賃] = useState("1800000");
  const [諸経費率, set諸経費率] = useState("7");
  const [年間経費, set年間経費] = useState("200000");
  const [ローン有無, setローン有無] = useState(false);
  const [借入額, set借入額] = useState("24000000");
  const [金利, set金利] = useState("1.5");
  const [返済年数, set返済年数] = useState("35");

  const 結果 = useMemo(() => {
    const 価格 = parseInt(購入価格) || 0;
    const 家賃年 = parseInt(年間家賃) || 0;
    const 諸経費 = 価格 * (parseFloat(諸経費率) / 100);
    const 総投資額 = 価格 + 諸経費;
    const 運営経費 = parseInt(年間経費) || 0;
    const 実質家賃 = 家賃年 - 運営経費;

    // 表面利回り
    const 表面利回り = 価格 > 0 ? (家賃年 / 価格) * 100 : 0;
    // 実質利回り
    const 実質利回り = 総投資額 > 0 ? (実質家賃 / 総投資額) * 100 : 0;

    // ローン返済
    let ローン月額 = 0;
    let 年間ローン = 0;
    let キャッシュフロー年 = 実質家賃;

    if (ローン有無) {
      const loan = parseInt(借入額) || 0;
      const r = parseFloat(金利) / 100 / 12;
      const n = parseInt(返済年数) * 12;
      if (r > 0) {
        ローン月額 = loan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      } else {
        ローン月額 = loan / n;
      }
      年間ローン = ローン月額 * 12;
      キャッシュフロー年 = 実質家賃 - 年間ローン;
    }

    // 空室率10%想定
    const 空室家賃 = 家賃年 * 0.9;
    const 空室実質 = (空室家賃 - 運営経費 - 年間ローン);
    const 損益分岐入居率 = 実質家賃 > 0
      ? Math.max(0, (運営経費 + 年間ローン) / 家賃年 * 100)
      : 0;

    // 回収年数
    const 回収年数 = キャッシュフロー年 > 0 ? 総投資額 / キャッシュフロー年 : Infinity;

    const 判定 = 実質利回り >= 8 ? { text: "高利回り", color: "#10b981" }
              : 実質利回り >= 5 ? { text: "標準", color: "#06b6d4" }
              : 実質利回り >= 3 ? { text: "低利回り", color: "#f59e0b" }
              : { text: "要再検討", color: "#ef4444" };

    return {
      表面利回り, 実質利回り, 総投資額, 諸経費,
      キャッシュフロー年, ローン月額, 年間ローン,
      損益分岐入居率, 回収年数, 空室実質,
      判定, 価格, 家賃年, 運営経費,
    };
  }, [購入価格, 年間家賃, 諸経費率, 年間経費, ローン有無, 借入額, 金利, 返済年数]);

  const 結果テキスト = `表面利回り${pct(結果.表面利回り)}%・実質利回り${pct(結果.実質利回り)}%（回収${結果.回収年数 < 100 ? 結果.回収年数.toFixed(0) + "年" : "100年超"}）`;

  const 価格クイック = ["10000000","20000000","30000000","50000000","100000000"];
  const 家賃クイック = ["600000","1200000","1800000","2400000","3600000"];

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="real-estate-yield" タイトル="不動産投資利回り計算機" 説明="表面・実質利回りをシミュレーション" カテゴリ="金融・投資" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-finance">金融・投資</Link></li>
              <li aria-hidden="true">›</li>
              <li>不動産投資利回り計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">🏠 不動産投資利回り計算機</h1>
          <FavoriteButton slug="real-estate-yield" title="不動産投資利回り計算機" emoji="🏠" />
          <p className="ツールページ説明">
            購入価格・家賃収入・経費を入力するだけで表面・実質利回りを即算出。
            ローン返済・キャッシュフロー・損益分岐入居率・投資回収年数まで一括シミュレーション。
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
                <label className="フィールドラベル">物件購入価格（円）</label>
                <input type="number" className="数値入力" value={購入価格}
                  onChange={(e) => set購入価格(e.target.value)} min="0" step="1000000" />
                <div className={styles.クイック群}>
                  {価格クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${購入価格 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set購入価格(v)}>
                      {Number(v) >= 100000000 ? `${Number(v)/100000000}億` : `${Number(v)/10000}万`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">年間家賃収入（満室想定）</label>
                <input type="number" className="数値入力" value={年間家賃}
                  onChange={(e) => set年間家賃(e.target.value)} min="0" step="100000" />
                <div className={styles.クイック群}>
                  {家賃クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${年間家賃 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set年間家賃(v)}>
                      月{Number(v)/12/10000}万
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">購入時諸経費率（%）</label>
                <div className={styles.クイック群}>
                  {["5","7","8","10"].map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${諸経費率 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set諸経費率(v)}>{v}%</button>
                  ))}
                </div>
                <p style={{ fontSize: "11px", color: "var(--カラー-テキスト極薄)", marginTop: "4px" }}>
                  仲介手数料・登記費用・不動産取得税など。一般的に物件価格の6〜8%
                </p>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">年間運営経費（管理費・固定資産税など）</label>
                <input type="number" className="数値入力" value={年間経費}
                  onChange={(e) => set年間経費(e.target.value)} min="0" step="50000" />
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">ローン返済を含める</label>
                <div className={styles.税率選択}>
                  <button
                    className={`${styles.税率ボタン} ${!ローン有無 ? styles.税率ボタンアクティブ : ""}`}
                    onClick={() => setローン有無(false)}>含めない</button>
                  <button
                    className={`${styles.税率ボタン} ${ローン有無 ? styles.税率ボタンアクティブ : ""}`}
                    onClick={() => setローン有無(true)}>含める</button>
                </div>
              </div>

              {ローン有無 && (
                <>
                  <div className="フィールドグループ">
                    <label className="フィールドラベル">借入額（円）</label>
                    <input type="number" className="数値入力" value={借入額}
                      onChange={(e) => set借入額(e.target.value)} min="0" step="1000000" />
                  </div>
                  <div className="フィールドグループ">
                    <label className="フィールドラベル">金利（年率 %）</label>
                    <div className={styles.クイック群}>
                      {["0.5","1.0","1.5","2.0","3.0"].map((v) => (
                        <button key={v}
                          className={`${styles.クイックボタン} ${金利 === v ? styles.クイックボタンアクティブ : ""}`}
                          onClick={() => set金利(v)}>{v}%</button>
                      ))}
                    </div>
                  </div>
                  <div className="フィールドグループ">
                    <label className="フィールドラベル">返済期間（年）</label>
                    <div className={styles.クイック群}>
                      {["20","25","30","35"].map((v) => (
                        <button key={v}
                          className={`${styles.クイックボタン} ${返済年数 === v ? styles.クイックボタンアクティブ : ""}`}
                          onClick={() => set返済年数(v)}>{v}年</button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* ─── 結果 ─── */}
            <div className="結果セクション">
              <div className="結果見出し">試算結果</div>

              <div className={styles.結果コンテンツ}>
                {/* 利回りカード */}
                <div className={styles.利回りグリッド}>
                  <div className={styles.利回りカード}>
                    <span className={styles.利回りラベル}>表面利回り</span>
                    <span className={styles.利回り値} style={{ color: "#06b6d4" }}>{pct(結果.表面利回り)}<span className={styles.利回り単位}>%</span></span>
                    <span className={styles.利回り説明}>家賃÷購入価格</span>
                  </div>
                  <div className={styles.利回りカード} style={{ borderColor: `${結果.判定.color}40` }}>
                    <span className={styles.利回りラベル}>実質利回り</span>
                    <span className={styles.利回り値} style={{ color: 結果.判定.color }}>{pct(結果.実質利回り)}<span className={styles.利回り単位}>%</span></span>
                    <span className={styles.判定バッジ} style={{ background: `${結果.判定.color}18`, color: 結果.判定.color }}>
                      {結果.判定.text}
                    </span>
                  </div>
                </div>

                {/* キャッシュフロー */}
                <div className={styles.CFカード}>
                  <div className={styles.CFタイトル}>💰 年間キャッシュフロー</div>
                  <div className={styles.CF行}>
                    <span>年間家賃収入（満室）</span>
                    <span style={{ color: "#10b981", fontWeight: 700 }}>+¥{fmt(結果.家賃年)}</span>
                  </div>
                  <div className={styles.CF行}>
                    <span>年間運営経費</span>
                    <span style={{ color: "#f25acc", fontWeight: 700 }}>-¥{fmt(結果.運営経費)}</span>
                  </div>
                  {ローン有無 && (
                    <div className={styles.CF行}>
                      <span>年間ローン返済</span>
                      <span style={{ color: "#f25acc", fontWeight: 700 }}>-¥{fmt(結果.年間ローン)}</span>
                    </div>
                  )}
                  <div className={styles.CF仕切り} />
                  <div className={styles.CF合計行}>
                    <span>年間手残り</span>
                    <span style={{ color: 結果.キャッシュフロー年 >= 0 ? "#10b981" : "#ef4444", fontWeight: 900 }}>
                      ¥{fmt(結果.キャッシュフロー年)}
                    </span>
                  </div>
                  <div className={styles.CF月}>月換算 約¥{fmt(結果.キャッシュフロー年 / 12)}/月</div>
                </div>

                {/* 投資指標 */}
                <div className="結果グリッド">
                  {[
                    { label: "総投資額（諸経費込）", value: `¥${fmt(結果.総投資額)}`, color: "#6366f1" },
                    { label: "購入時諸経費", value: `¥${fmt(結果.諸経費)}`, color: "#f59e0b" },
                    { label: "投資回収年数", value: 結果.回収年数 < 100 ? `${結果.回収年数.toFixed(1)}年` : "100年超", color: "#06b6d4" },
                    { label: "損益分岐入居率", value: `${結果.損益分岐入居率.toFixed(1)}%`, color: "#10b981" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "1rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {ローン有無 && (
                  <div className={styles.ローンカード}>
                    <div className={styles.ローンタイトル}>🏦 ローン返済</div>
                    <div className={styles.ローン行}>
                      <span>月返済額</span>
                      <span className={styles.ローン値}>¥{fmt(結果.ローン月額)}/月</span>
                    </div>
                    <div className={styles.ローン行}>
                      <span>年間返済額</span>
                      <span className={styles.ローン値}>¥{fmt(結果.年間ローン)}/年</span>
                    </div>
                    <div className={styles.ローン行}>
                      <span>空室率10%想定の年間手残り</span>
                      <span style={{ color: 結果.空室実質 >= 0 ? "#10b981" : "#ef4444", fontWeight: 800 }}>
                        ¥{fmt(結果.空室実質)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <AffiliateSlot カテゴリ="business" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
            </div>
          </div>


          <ToolGuide slug="real-estate-yield" />
          <div className="広告ラッパー" style={{ padding: 0, marginTop: "var(--スペース-xl)" }}>
            <div className="広告ラベル">スポンサー</div>
            <AdSlot 位置="middle" />
          </div>
        </div>
      </main>

      <div className="広告ラッパー">
        <div className="広告ラベル">スポンサー</div>
        <AdSlot 位置="bottom" />
      </div>
    </>
  );
}
