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
import styles from "./rpa-time-saving.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "rpa-time-saving",
  タイトル: "RPA導入削減時間計算機",
  説明: "定型業務の自動化による工数削減効果を算出",
  カテゴリ: "IT・DX推進",
  category: "IT",
  ロジック種別: "calculation" as const,
  入力フィールド: [], 出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [], キーワード: [], 本文: "",
  socialPostTemplates: ["🤖 RPA導入で年間{result}時間削減。人件費換算で即回収できると判明→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }
function fmtH(n: number) { return n.toFixed(1); }

export default function RPA削減計算機ページ() {
  const [作業時間, set作業時間] = useState("30");
  const [作業頻度, set作業頻度] = useState("20");
  const [時給, set時給] = useState("2500");
  const [自動化率, set自動化率] = useState("80");
  const [導入費, set導入費] = useState("500000");

  const 結果 = useMemo(() => {
    const 分 = parseFloat(作業時間) || 0;
    const 回月 = parseFloat(作業頻度) || 0;
    const 円 = parseFloat(時給) || 0;
    const 率 = (parseFloat(自動化率) || 0) / 100;
    const 費 = parseInt(導入費) || 0;

    const 月間作業時間 = (分 * 回月) / 60;
    const 月間削減時間 = 月間作業時間 * 率;
    const 年間削減時間 = 月間削減時間 * 12;
    const 月間削減コスト = 月間削減時間 * 円;
    const 年間削減コスト = 月間削減コスト * 12;
    const 回収期間月 = 年間削減コスト > 0 ? (費 / 月間削減コスト) : 0;
    const 三年ROI = 費 > 0 ? ((年間削減コスト * 3 - 費) / 費) * 100 : 0;

    return {
      月間作業時間, 月間削減時間, 年間削減時間,
      月間削減コスト, 年間削減コスト, 回収期間月, 三年ROI,
    };
  }, [作業時間, 作業頻度, 時給, 自動化率, 導入費]);

  const 結果テキスト = `RPA導入で年間${fmtH(結果.年間削減時間)}時間・¥${fmt(結果.年間削減コスト)}削減（回収${結果.回収期間月.toFixed(1)}ヶ月）`;

  const 時給クイック = ["1500","2000","2500","3500","5000","8000"];
  const 自動化率リスト = ["60","70","80","90","95"];

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="rpa-time-saving" タイトル="RPA導入削減時間計算機" 説明="定型業務の自動化による工数削減効果を算出" カテゴリ="IT・DX推進" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-it">IT・DX推進</Link></li>
              <li aria-hidden="true">›</li>
              <li>RPA導入削減時間計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">🤖 RPA導入削減時間計算機</h1>
          <FavoriteButton slug="rpa-time-saving" title="RPA導入削減時間計算機" emoji="🤖" />
          <p className="ツールページ説明">
            定型業務の作業時間・頻度・人件費を入力するだけで月間・年間の工数削減時間・
            コスト削減額・導入費用の回収期間・3年ROIを即算出。DX投資判断の根拠に。
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
            <div className="入力セクション">
              {[
                { label: "1回あたりの作業時間（分）", val: 作業時間, set: set作業時間, step: "5", ph: "30" },
                { label: "月間実施回数（回/月）", val: 作業頻度, set: set作業頻度, step: "5", ph: "20" },
              ].map((f) => (
                <div key={f.label} className="フィールドグループ">
                  <label className="フィールドラベル">{f.label}</label>
                  <input type="number" className="数値入力" value={f.val}
                    onChange={(e) => f.set(e.target.value)} min="0" step={f.step} placeholder={f.ph} />
                </div>
              ))}

              <div className="フィールドグループ">
                <label className="フィールドラベル">担当者の時間単価（円/時）</label>
                <input type="number" className="数値入力" value={時給}
                  onChange={(e) => set時給(e.target.value)} min="0" step="500" />
                <div className={styles.クイック群}>
                  {時給クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${時給 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set時給(v)}>¥{fmt(parseInt(v))}/h</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">自動化率（%）</label>
                <input type="number" className="数値入力" value={自動化率}
                  onChange={(e) => set自動化率(e.target.value)} min="0" max="100" />
                <div className={styles.クイック群}>
                  {自動化率リスト.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${自動化率 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set自動化率(v)}>{v}%</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">RPA導入費用（円）</label>
                <input type="number" className="数値入力" value={導入費}
                  onChange={(e) => set導入費(e.target.value)} min="0" step="100000" />
                <div className={styles.クイック群}>
                  {["300000","500000","1000000","2000000","5000000"].map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${導入費 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set導入費(v)}>
                      {Number(v) >= 1000000 ? `${Number(v)/10000}万` : `${Number(v)/10000}万`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="結果セクション">
              <div className="結果見出し">導入効果シミュレーション</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>年間コスト削減額</span>
                  <span className={styles.メイン値}>¥{fmt(結果.年間削減コスト)}<span className={styles.メイン単位}>円/年</span></span>
                  <span className={styles.メインサブ}>年間 {fmtH(結果.年間削減時間)}時間 削減</span>
                </div>

                <div className="結果グリッド">
                  {[
                    { label: "月間削減時間", value: `${fmtH(結果.月間削減時間)}時間`, color: "#06b6d4" },
                    { label: "年間削減コスト", value: `¥${fmt(結果.年間削減コスト)}`, color: "#10b981" },
                    { label: "導入費回収期間", value: 結果.回収期間月 > 0 ? `${結果.回収期間月.toFixed(1)}ヶ月` : "即日回収", color: "#f59e0b" },
                    { label: "3年間ROI", value: `${結果.三年ROI.toFixed(0)}%`, color: 結果.三年ROI > 0 ? "#10b981" : "#f25acc" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "0.95rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.内訳}>
                  <div className={styles.内訳タイトル}>詳細計算</div>
                  {[
                    { label: "月間現在の作業時間", value: `${fmtH(結果.月間作業時間)}時間` },
                    { label: "月間削減時間（自動化率適用）", value: `${fmtH(結果.月間削減時間)}時間` },
                    { label: "月間コスト削減", value: `¥${fmt(結果.月間削減コスト)}` },
                    { label: "3年累計削減額", value: `¥${fmt(結果.年間削減コスト * 3)}` },
                    { label: "3年間の純利益（削減-導入費）", value: `¥${fmt(結果.年間削減コスト * 3 - (parseInt(導入費)||0))}` },
                  ].map((row) => (
                    <div key={row.label} className={styles.内訳行}>
                      <span>{row.label}</span>
                      <span style={{ fontWeight: 700 }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <AffiliateSlot カテゴリ="IT" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
            </div>
          </div>


          <ToolGuide slug="rpa-time-saving" />
          <div className="広告ラッパー" style={{ padding: 0, marginTop: "var(--スペース-xl)" }}>
            <div className="広告ラベル">スポンサー</div>
            <AdSlot 位置="middle" />
          </div>
        </div>
      </main>
      <div className="広告ラッパー"><div className="広告ラベル">スポンサー</div><AdSlot 位置="bottom" /></div>
    </>
  );
}
