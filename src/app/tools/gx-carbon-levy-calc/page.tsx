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
import styles from "./gx-carbon-levy-calc.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "gx-carbon-levy-calc",
  タイトル: "GX炭素賦課金コスト計算機",
  説明: "2028年導入予定の炭素賦課金が企業コストに与える影響を試算",
  カテゴリ: "IT・DX推進",
  category: "IT",
  ロジック種別: "calculation" as const,
  入力フィールド: [], 出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [], キーワード: [], 本文: "",
  socialPostTemplates: ["🌍 GX炭素賦課金で自社コストが年間¥{result}増加する試算。今から対策を→"],
};

type 業種 = "製造業" | "建設業" | "小売・飲食" | "IT・サービス" | "物流・運輸" | "その他";

const 排出原単位: Record<業種, number> = {
  "製造業": 0.45,
  "建設業": 0.35,
  "小売・飲食": 0.15,
  "IT・サービス": 0.08,
  "物流・運輸": 0.55,
  "その他": 0.20,
};

// GX炭素賦課金 想定単価（円/tCO2）
const 賦課金単価テーブル: { 年: number; 単価: number }[] = [
  { 年: 2028, 単価: 1500 },
  { 年: 2030, 単価: 3000 },
  { 年: 2032, 単価: 5000 },
  { 年: 2035, 単価: 8000 },
];

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

export default function GX炭素賦課金計算機ページ() {
  const [業種, set業種] = useState<業種>("IT・サービス");
  const [年間売上, set年間売上] = useState("100000000");
  const [電力使用量, set電力使用量] = useState("50000");
  const [ガス使用量, setガス使用量] = useState("1000");
  const [試算年, set試算年] = useState("2030");

  const 結果 = useMemo(() => {
    const 売上 = parseInt(年間売上) || 0;
    const 電力kWh = parseInt(電力使用量) || 0;
    const ガスm3 = parseInt(ガス使用量) || 0;
    const 年 = parseInt(試算年);

    // CO2換算（電力: 0.441kg/kWh、都市ガス: 2.29kg/m3）
    const 電力CO2 = (電力kWh * 0.441) / 1000; // tCO2
    const ガスCO2 = (ガスm3 * 2.29) / 1000;   // tCO2
    const 総CO2 = 電力CO2 + ガスCO2;

    const 単価 = 賦課金単価テーブル.find(t => t.年 >= 年)?.単価 ?? 賦課金単価テーブル[賦課金単価テーブル.length - 1].単価;
    const 賦課金 = 総CO2 * 単価;
    const 売上比 = 売上 > 0 ? (賦課金 / 売上) * 100 : 0;
    const 省エネ30削減 = 賦課金 * 0.3;

    return { 電力CO2, ガスCO2, 総CO2, 単価, 賦課金, 売上比, 省エネ30削減 };
  }, [年間売上, 電力使用量, ガス使用量, 試算年]);

  const 結果テキスト = `${試算年}年GX炭素賦課金：年間¥${fmt(結果.賦課金)}（CO₂ ${結果.総CO2.toFixed(1)}t × ${fmt(結果.単価)}円/t）`;

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="gx-carbon-levy-calc" タイトル="GX炭素賦課金コスト計算機" 説明="2028年導入予定の炭素賦課金が企業コストに与える影響を試算" カテゴリ="IT・DX推進" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-it">IT・DX推進</Link></li>
              <li aria-hidden="true">›</li>
              <li>GX炭素賦課金コスト計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">🌍 GX炭素賦課金コスト計算機</h1>
          <FavoriteButton slug="gx-carbon-levy-calc" title="GX炭素賦課金コスト計算機" emoji="🌍" />
          <p className="ツールページ説明">
            2028年導入予定のGX炭素賦課金（化石燃料賦課金）が企業の電力・ガスコストに
            与える影響を試算。2030・2035年の段階的引き上げシナリオにも対応。
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
                <label className="フィールドラベル">業種</label>
                <div className={styles.クイック群}>
                  {(Object.keys(排出原単位) as 業種[]).map((k) => (
                    <button key={k}
                      className={`${styles.クイックボタン} ${業種 === k ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set業種(k)}>{k}</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">試算年度</label>
                <div className={styles.クイック群}>
                  {賦課金単価テーブル.map((t) => (
                    <button key={t.年}
                      className={`${styles.クイックボタン} ${試算年 === String(t.年) ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set試算年(String(t.年))}>{t.年}年（¥{fmt(t.単価)}/t）</button>
                  ))}
                </div>
              </div>

              {[
                { label: "年間売上（円）", val: 年間売上, set: set年間売上, step: "10000000" },
                { label: "年間電力使用量（kWh）", val: 電力使用量, set: set電力使用量, step: "5000" },
                { label: "年間都市ガス使用量（m³）", val: ガス使用量, set: setガス使用量, step: "100" },
              ].map((f) => (
                <div key={f.label} className="フィールドグループ">
                  <label className="フィールドラベル">{f.label}</label>
                  <input type="number" className="数値入力" value={f.val}
                    onChange={(e) => f.set(e.target.value)} min="0" step={f.step} />
                </div>
              ))}
            </div>

            <div className="結果セクション">
              <div className="結果見出し">{試算年}年 炭素賦課金試算</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>年間炭素賦課金負担額</span>
                  <span className={styles.メイン値}>
                    ¥{fmt(結果.賦課金)}<span className={styles.メイン単位}>円/年</span>
                  </span>
                  <span className={styles.メインサブ}>売上比 {結果.売上比.toFixed(2)}% / CO₂ {結果.総CO2.toFixed(1)}t</span>
                </div>

                <div className="結果グリッド">
                  {[
                    { label: "電力由来CO₂", value: `${結果.電力CO2.toFixed(2)}tCO₂`, color: "#06b6d4" },
                    { label: "ガス由来CO₂", value: `${結果.ガスCO2.toFixed(2)}tCO₂`, color: "#f59e0b" },
                    { label: `賦課金単価（${試算年}年）`, value: `¥${fmt(結果.単価)}/t`, color: "#f25acc" },
                    { label: "省エネ30%削減で節約", value: `¥${fmt(結果.省エネ30削減)}`, color: "#10b981" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "0.9rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.内訳}>
                  <div className={styles.内訳タイトル}>段階別賦課金シナリオ</div>
                  {賦課金単価テーブル.map((t, i) => {
                    const 額 = 結果.総CO2 * t.単価;
                    return (
                      <div key={t.年} className={`${styles.内訳行} ${String(t.年) === 試算年 ? styles.内訳強調 : ""}`}>
                        <span>{t.年}年（¥{fmt(t.単価)}/tCO₂）</span>
                        <span style={{ fontWeight: 700, color: String(t.年) === 試算年 ? "#f25acc" : "var(--カラー-テキスト薄)" }}>¥{fmt(額)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <AffiliateSlot カテゴリ="IT" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
            </div>
          </div>


          <ToolGuide slug="gx-carbon-levy-calc" />
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
