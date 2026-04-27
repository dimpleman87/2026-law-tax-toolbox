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
import styles from "./cloud-migration-cost.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "cloud-migration-cost",
  タイトル: "クラウド移行コスト計算機",
  説明: "オンプレミスからクラウドへの移行費用とROIを試算",
  カテゴリ: "IT・DX推進",
  category: "IT",
  ロジック種別: "calculation" as const,
  入力フィールド: [], 出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [], キーワード: [], 本文: "",
  socialPostTemplates: ["☁️ クラウド移行コストを試算。ROI{result}ヶ月で元が取れる見込み→"],
};

type 移行規模 = "小規模（〜10サーバー）" | "中規模（11〜50台）" | "大規模（51台〜）";

const 規模係数: Record<移行規模, { 工数率: number; リスク係数: number }> = {
  "小規模（〜10サーバー）":  { 工数率: 1.0, リスク係数: 1.1 },
  "中規模（11〜50台）":    { 工数率: 2.5, リスク係数: 1.2 },
  "大規模（51台〜）":      { 工数率: 5.0, リスク係数: 1.35 },
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

export default function クラウド移行コスト計算機ページ() {
  const [移行規模, set移行規模] = useState<移行規模>("小規模（〜10サーバー）");
  const [サーバー台数, setサーバー台数] = useState("5");
  const [現在インフラ月額, set現在インフラ月額] = useState("300000");
  const [クラウド月額, setクラウド月額] = useState("150000");
  const [移行工数, set移行工数] = useState("200");
  const [単価, set単価] = useState("8000");
  const [データ移行費, setデータ移行費] = useState("500000");
  const [テスト期間月, setテスト期間月] = useState("3");

  const 結果 = useMemo(() => {
    const { 工数率, リスク係数 } = 規模係数[移行規模];
    const 工数 = (parseInt(移行工数)||0) * 工数率;
    const 人件費 = 工数 * (parseInt(単価)||0);
    const データ費 = parseInt(データ移行費)||0;
    const テスト = (parseInt(テスト期間月)||0) * (parseInt(現在インフラ月額)||0);
    const 総移行費 = (人件費 + データ費 + テスト) * リスク係数;

    const 現在年間 = (parseInt(現在インフラ月額)||0) * 12;
    const クラウド年間 = (parseInt(クラウド月額)||0) * 12;
    const 年間削減 = 現在年間 - クラウド年間;
    const 回収期間月 = 年間削減 > 0 ? Math.ceil(総移行費 / (年間削減/12)) : 0;
    const 三年ROI = 年間削減 > 0 ? ((年間削減 * 3 - 総移行費) / 総移行費) * 100 : -100;

    return {
      人件費, データ費, テスト, 総移行費,
      現在年間, クラウド年間, 年間削減, 回収期間月, 三年ROI,
    };
  }, [移行規模, 移行工数, 単価, データ移行費, テスト期間月, 現在インフラ月額, クラウド月額]);

  const 結果テキスト = `クラウド移行費¥${fmt(結果.総移行費)}・年間削減¥${fmt(結果.年間削減)}・回収${結果.回収期間月}ヶ月`;

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="cloud-migration-cost" タイトル="クラウド移行コスト計算機" 説明="オンプレミスからクラウドへの移行費用とROIを試算" カテゴリ="IT・DX推進" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-it">IT・DX推進</Link></li>
              <li aria-hidden="true">›</li>
              <li>クラウド移行コスト計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">☁️ クラウド移行コスト計算機</h1>
          <FavoriteButton slug="cloud-migration-cost" title="クラウド移行コスト計算機" emoji="☁️" />
          <p className="ツールページ説明">
            オンプレミスからクラウドへの移行に必要なコスト（人件費・データ移行費・並行稼働費）を試算。
            年間コスト削減額・ROI・回収期間まで一括算出。
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
              <div className="フィールドグループ">
                <label className="フィールドラベル">移行規模</label>
                <div className={styles.クイック群}>
                  {(Object.keys(規模係数) as 移行規模[]).map((k) => (
                    <button key={k}
                      className={`${styles.クイックボタン} ${移行規模 === k ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set移行規模(k)}>{k}</button>
                  ))}
                </div>
              </div>

              {[
                { label: "現在のインフラ月額（円）", val: 現在インフラ月額, set: set現在インフラ月額, step: "50000" },
                { label: "移行後クラウド月額見込（円）", val: クラウド月額, set: setクラウド月額, step: "10000" },
                { label: "移行工数ベース（時間）", val: 移行工数, set: set移行工数, step: "40" },
                { label: "エンジニア単価（円/時）", val: 単価, set: set単価, step: "1000" },
                { label: "データ移行費（円）", val: データ移行費, set: setデータ移行費, step: "100000" },
                { label: "並行稼働期間（ヶ月）", val: テスト期間月, set: setテスト期間月, step: "1" },
              ].map((f) => (
                <div key={f.label} className="フィールドグループ">
                  <label className="フィールドラベル">{f.label}</label>
                  <input type="number" className="数値入力" value={f.val}
                    onChange={(e) => f.set(e.target.value)} min="0" step={f.step} />
                </div>
              ))}
            </div>

            <div className="結果セクション">
              <div className="結果見出し">移行コスト・ROI試算</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>総移行費用（リスク込み）</span>
                  <span className={styles.メイン値}>
                    ¥{fmt(結果.総移行費)}<span className={styles.メイン単位}>円</span>
                  </span>
                  <span className={styles.メインサブ}>
                    回収期間 {結果.回収期間月 > 0 ? `${結果.回収期間月}ヶ月` : "削減なし"}
                  </span>
                </div>

                <div className="結果グリッド">
                  {[
                    { label: "現在インフラ年間", value: `¥${fmt(結果.現在年間)}`, color: "#f25acc" },
                    { label: "クラウド年間", value: `¥${fmt(結果.クラウド年間)}`, color: "#10b981" },
                    { label: "年間削減額", value: `${結果.年間削減 >= 0 ? "+" : ""}¥${fmt(結果.年間削減)}`, color: 結果.年間削減 >= 0 ? "#10b981" : "#f25acc" },
                    { label: "3年間ROI", value: `${結果.三年ROI.toFixed(0)}%`, color: 結果.三年ROI > 0 ? "#06b6d4" : "#f25acc" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "0.9rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.内訳}>
                  <div className={styles.内訳タイトル}>移行費用内訳</div>
                  {[
                    { label: `人件費（工数×規模係数×単価）`, value: `¥${fmt(結果.人件費)}` },
                    { label: "データ移行費", value: `¥${fmt(結果.データ費)}` },
                    { label: `並行稼働費（${テスト期間月}ヶ月分）`, value: `¥${fmt(結果.テスト)}` },
                    { label: "リスク加算後 合計", value: `¥${fmt(結果.総移行費)}` },
                  ].map((row, i) => (
                    <div key={row.label} className={`${styles.内訳行} ${i === 3 ? styles.内訳合計 : ""}`}>
                      <span>{row.label}</span>
                      <span style={{ fontWeight: 700, color: i === 3 ? "var(--カラー-テキスト)" : "var(--カラー-テキスト薄)" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <AffiliateSlot カテゴリ="IT" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
            </div>
          </div>


          <ToolGuide slug="cloud-migration-cost" />
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
