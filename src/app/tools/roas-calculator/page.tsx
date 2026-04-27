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
import styles from "./roas-calculator.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "roas-calculator",
  タイトル: "ROAS・ROI計算機",
  説明: "広告費・売上・原価からROAS/ROI/CPAを即算出",
  カテゴリ: "IT・DX推進",
  category: "IT",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["📊 広告ROAS {result}を計算。費用対効果の可視化に→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }
function fmt2(n: number) { return n.toFixed(2); }
function pct(n: number) { return n.toFixed(1); }

export default function ROAS計算機ページ() {
  const [広告費, set広告費] = useState("1000000");
  const [売上, set売上] = useState("4000000");
  const [原価, set原価] = useState("2000000");
  const [CV数, setCV数] = useState("100");
  const [モード, setモード] = useState<"基本" | "詳細">("基本");

  const 結果 = useMemo(() => {
    const ad = parseInt(広告費) || 0;
    const rev = parseInt(売上) || 0;
    const cost = parseInt(原価) || 0;
    const cv = parseInt(CV数) || 0;

    if (ad <= 0) return null;

    const ROAS = rev > 0 ? (rev / ad) * 100 : 0;
    const 粗利 = rev - cost;
    const ROI = ad > 0 ? ((粗利 - ad) / ad) * 100 : 0;
    const CPA = cv > 0 ? ad / cv : 0;
    const ROAS目標 = cost > 0 && rev > 0 ? (rev / (rev - cost)) * 100 : 0;

    // 損益分岐ROAS（広告費≦粗利になるROAS）
    // ROAS × 広告費 = 売上 → 損益分岐：広告費 = 売上 - 原価 → ROAS_BEP = rev / (rev - cost) * 100
    const ROAS損益 = cost > 0 && rev > 0 ? ((cost + ad) / ad) * 100 : 0;

    const 判定 = ROAS >= 400 ? { text: "優良", color: "#10b981" }
              : ROAS >= 300 ? { text: "良好", color: "#06b6d4" }
              : ROAS >= 200 ? { text: "普通", color: "#f59e0b" }
              : { text: "要改善", color: "#ef4444" };

    return { ROAS, ROI, CPA, 粗利, 損益分岐ROAS: ROAS損益, 判定, ad, rev, cost, cv };
  }, [広告費, 売上, 原価, CV数]);

  const 結果テキスト = 結果 ? `ROAS ${pct(結果.ROAS)}%・ROI ${pct(結果.ROI)}%・CPA ¥${fmt(結果.CPA)}` : "";

  const 広告費クイック = ["100000","300000","500000","1000000","3000000","5000000"];
  const 売上クイック  = ["300000","1000000","3000000","5000000","10000000","20000000"];

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="roas-calculator" タイトル="ROAS・ROI計算機" 説明="広告費・売上・原価からROAS/ROI/CPAを即算出" カテゴリ="IT・DX推進" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-it">IT・DX推進</Link></li>
              <li aria-hidden="true">›</li>
              <li>ROAS・ROI計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">📊 ROAS・ROI計算機</h1>
          <FavoriteButton slug="roas-calculator" title="ROAS・ROI計算機" emoji="📊" />
          <p className="ツールページ説明">
            広告費・売上・原価を入力するだけでROAS・ROI・CPAを一括算出。
            損益分岐ROASや費用対効果の判定まで表示。広告運用・予算設計の意思決定に。
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
                <label className="フィールドラベル">モード</label>
                <div className={styles.税率選択}>
                  {(["基本", "詳細"] as const).map((m) => (
                    <button key={m}
                      className={`${styles.税率ボタン} ${モード === m ? styles.税率ボタンアクティブ : ""}`}
                      onClick={() => setモード(m)}>{m}モード</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">広告費（円）</label>
                <input type="number" className="数値入力" value={広告費}
                  onChange={(e) => set広告費(e.target.value)} min="0" step="10000" />
                <div className={styles.クイック群}>
                  {広告費クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${広告費 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set広告費(v)}>
                      {Number(v) >= 1000000 ? `${Number(v)/10000}万` : `${Number(v)/10000}万`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">広告経由の売上（円）</label>
                <input type="number" className="数値入力" value={売上}
                  onChange={(e) => set売上(e.target.value)} min="0" step="100000" />
                <div className={styles.クイック群}>
                  {売上クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${売上 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set売上(v)}>
                      {Number(v) >= 10000000 ? `${Number(v)/10000000}千万` : `${Number(v)/10000}万`}
                    </button>
                  ))}
                </div>
              </div>

              {モード === "詳細" && (
                <>
                  <div className="フィールドグループ">
                    <label className="フィールドラベル">原価・仕入れコスト（円）</label>
                    <input type="number" className="数値入力" value={原価}
                      onChange={(e) => set原価(e.target.value)} min="0" step="100000" />
                  </div>
                  <div className="フィールドグループ">
                    <label className="フィールドラベル">コンバージョン数（件）</label>
                    <input type="number" className="数値入力" value={CV数}
                      onChange={(e) => setCV数(e.target.value)} min="0" />
                    <p style={{ fontSize: "11px", color: "var(--カラー-テキスト極薄)", marginTop: "4px" }}>
                      購入・申込・問合せなど成果件数
                    </p>
                  </div>
                </>
              )}

              {/* ROAS目安表 */}
              <div className={styles.目安表}>
                <div className={styles.目安表タイトル}>📋 ROAS目安（業種別）</div>
                {[
                  { 業種: "EC・通販（粗利50%）", 目安: "200%以上", color: "#10b981" },
                  { 業種: "リード獲得（粗利高）", 目安: "300〜500%", color: "#06b6d4" },
                  { 業種: "美容・サービス業", 目安: "400〜800%", color: "#f59e0b" },
                  { 業種: "不動産・高単価", 目安: "1000%超", color: "#f25acc" },
                ].map((item) => (
                  <div key={item.業種} className={styles.目安行}>
                    <span>{item.業種}</span>
                    <span style={{ color: item.color, fontWeight: 700 }}>{item.目安}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── 結果 ─── */}
            <div className="結果セクション">
              <div className="結果見出し">計算結果</div>

              {結果 ? (
                <div className={styles.結果コンテンツ}>
                  {/* ROAS メイン */}
                  <div className={styles.メインカード}>
                    <span className={styles.メインラベル}>ROAS（広告費用対効果）</span>
                    <span className={styles.メイン値}>{pct(結果.ROAS)}<span className={styles.メイン単位}>%</span></span>
                    <span className={styles.判定バッジ} style={{ background: `${結果.判定.color}18`, color: 結果.判定.color }}>
                      {結果.判定.text}
                    </span>
                    <span className={styles.メイン説明}>¥1の広告費で¥{fmt2(結果.ROAS / 100)}の売上</span>
                  </div>

                  {/* 指標グリッド */}
                  <div className="結果グリッド">
                    <div className="結果カード">
                      <span className="結果ラベル">ROAS</span>
                      <span className="結果値" style={{ color: 結果.判定.color }}>{pct(結果.ROAS)}%</span>
                    </div>
                    <div className="結果カード">
                      <span className="結果ラベル">ROI</span>
                      <span className="結果値" style={{ color: 結果.ROI >= 0 ? "#10b981" : "#ef4444" }}>{pct(結果.ROI)}%</span>
                    </div>
                    {結果.cv > 0 && (
                      <div className="結果カード">
                        <span className="結果ラベル">CPA（1件コスト）</span>
                        <span className="結果値" style={{ color: "#06b6d4" }}>¥{fmt(結果.CPA)}</span>
                      </div>
                    )}
                    <div className="結果カード">
                      <span className="結果ラベル">粗利</span>
                      <span className="結果値" style={{ color: "#f59e0b" }}>¥{fmt(結果.粗利)}</span>
                    </div>
                  </div>

                  {/* 損益分岐 */}
                  {結果.cost > 0 && (
                    <div className={styles.損益カード}>
                      <div className={styles.損益タイトル}>⚡ 損益分岐ライン</div>
                      <div className={styles.損益行}>
                        <span>現在のROAS</span>
                        <span style={{ color: 結果.判定.color, fontWeight: 800 }}>{pct(結果.ROAS)}%</span>
                      </div>
                      <div className={styles.損益行}>
                        <span>損益分岐ROAS（最低必要）</span>
                        <span style={{ color: "#f25acc", fontWeight: 800 }}>{pct(結果.損益分岐ROAS)}%</span>
                      </div>
                      <div className={styles.損益結論}>
                        {結果.ROAS >= 結果.損益分岐ROAS
                          ? `✅ 黒字（損益分岐を${pct(結果.ROAS - 結果.損益分岐ROAS)}%上回る）`
                          : `❌ 赤字（損益分岐まであと${pct(結果.損益分岐ROAS - 結果.ROAS)}%不足）`}
                      </div>
                    </div>
                  )}

                  {/* 目標ROAS計算 */}
                  <div className={styles.目標カード}>
                    <div className={styles.目標タイトル}>🎯 目標ROAS達成に必要な売上</div>
                    {[200, 300, 400, 500].map((target) => (
                      <div key={target} className={`${styles.目標行} ${Math.abs(結果.ROAS - target) < 50 ? styles.目標行強調 : ""}`}>
                        <span>ROAS {target}%</span>
                        <span className={styles.目標値}>売上 ¥{fmt(parseInt(広告費) * target / 100)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="プレースホルダーメッセージ">広告費を入力してください</p>
              )}

              {結果 && <>
              <AffiliateSlot カテゴリ="business" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
              </>
              }

            </div>
          </div>


          <ToolGuide slug="roas-calculator" />
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
