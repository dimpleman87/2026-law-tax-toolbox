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
import styles from "./saas-roi-calc.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "saas-roi-calc",
  タイトル: "SaaS導入ROI計算機",
  説明: "月額コストと業務削減時間の投資効果を算出",
  カテゴリ: "IT・DX推進",
  category: "IT",
  ロジック種別: "calculation" as const,
  入力フィールド: [], 出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [], キーワード: [], 本文: "",
  socialPostTemplates: ["💻 SaaS導入ROIを計算。月額¥{result}のコストが何ヶ月で回収できるか判明→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

export default function SaaSROI計算機ページ() {
  const [月額費, set月額費] = useState("30000");
  const [削減時間, set削減時間] = useState("20");
  const [時給, set時給] = useState("3000");
  const [利用人数, set利用人数] = useState("5");
  const [初期費, set初期費] = useState("100000");

  const 結果 = useMemo(() => {
    const 月 = parseInt(月額費) || 0;
    const 時間 = parseFloat(削減時間) || 0;
    const 単価 = parseInt(時給) || 0;
    const 人 = parseInt(利用人数) || 1;
    const 初 = parseInt(初期費) || 0;

    const 月間削減コスト = 時間 * 単価 * 人;
    const 月間純利益 = 月間削減コスト - 月;
    const 年間削減コスト = 月間削減コスト * 12;
    const 年間コスト = 月 * 12 + 初;
    const 年間純利益 = 年間削減コスト - 年間コスト;
    const 年間ROI = 年間コスト > 0 ? (年間純利益 / 年間コスト) * 100 : 0;
    const 回収期間 = 月間純利益 > 0 ? Math.ceil(初 / 月間純利益) : 0;
    const 一人あたり月 = 月 / Math.max(1, 人);

    return {
      月間削減コスト, 月間純利益, 年間削減コスト,
      年間コスト, 年間純利益, 年間ROI, 回収期間, 一人あたり月,
    };
  }, [月額費, 削減時間, 時給, 利用人数, 初期費]);

  const 結果テキスト = `SaaS月額¥${fmt(parseInt(月額費))}→年間ROI${結果.年間ROI.toFixed(0)}%・回収${結果.回収期間}ヶ月`;

  const 月額クイック = ["10000","30000","50000","100000","300000","500000"];

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="saas-roi-calc" タイトル="SaaS導入ROI計算機" 説明="月額コストと業務削減時間の投資効果を算出" カテゴリ="IT・DX推進" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-it">IT・DX推進</Link></li>
              <li aria-hidden="true">›</li>
              <li>SaaS導入ROI計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">💻 SaaS導入ROI計算機</h1>
          <FavoriteButton slug="saas-roi-calc" title="SaaS導入ROI計算機" emoji="💻" />
          <p className="ツールページ説明">
            月額コスト・業務削減時間・利用人数を入力するだけで年間ROI・月間純利益・
            初期費用の回収期間を即算出。SaaS導入稟議の根拠データに。
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
                <label className="フィールドラベル">月額利用料（円）</label>
                <input type="number" className="数値入力" value={月額費}
                  onChange={(e) => set月額費(e.target.value)} min="0" step="5000" />
                <div className={styles.クイック群}>
                  {月額クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${月額費 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set月額費(v)}>
                      {Number(v) >= 100000 ? `${Number(v)/10000}万` : `${Number(v)/10000}万`}
                    </button>
                  ))}
                </div>
              </div>

              {[
                { label: "1人あたりの月間業務削減時間（時間）", val: 削減時間, set: set削減時間, step: "5" },
                { label: "担当者の時間単価（円/時）", val: 時給, set: set時給, step: "500" },
                { label: "利用人数（人）", val: 利用人数, set: set利用人数, step: "1" },
                { label: "初期導入費用（円）", val: 初期費, set: set初期費, step: "50000" },
              ].map((f) => (
                <div key={f.label} className="フィールドグループ">
                  <label className="フィールドラベル">{f.label}</label>
                  <input type="number" className="数値入力" value={f.val}
                    onChange={(e) => f.set(e.target.value)} min="0" step={f.step} />
                </div>
              ))}
            </div>

            <div className="結果セクション">
              <div className="結果見出し">ROIシミュレーション</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>年間ROI</span>
                  <span className={styles.メイン値} style={{ color: 結果.年間ROI > 0 ? "#10b981" : "#f25acc" }}>
                    {結果.年間ROI.toFixed(0)}<span className={styles.メイン単位}>%</span>
                  </span>
                  <span className={styles.メインサブ}>
                    年間純利益 {結果.年間純利益 >= 0 ? "+" : ""}¥{fmt(結果.年間純利益)}
                  </span>
                </div>

                <div className="結果グリッド">
                  {[
                    { label: "月間業務削減コスト", value: `¥${fmt(結果.月間削減コスト)}`, color: "#10b981" },
                    { label: "月間純利益（削減-費用）", value: `${結果.月間純利益 >= 0 ? "+" : ""}¥${fmt(結果.月間純利益)}`, color: 結果.月間純利益 >= 0 ? "#10b981" : "#f25acc" },
                    { label: "初期費用回収期間", value: 結果.回収期間 > 0 ? `${結果.回収期間}ヶ月` : "即回収", color: "#f59e0b" },
                    { label: "1人あたり月額", value: `¥${fmt(結果.一人あたり月)}`, color: "#06b6d4" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "0.9rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.内訳}>
                  <div className={styles.内訳タイトル}>年間収支</div>
                  {[
                    { label: "年間業務削減コスト", value: `¥${fmt(結果.年間削減コスト)}`, plus: true },
                    { label: "年間SaaS費用（月額×12）", value: `-¥${fmt(parseInt(月額費) * 12)}`, plus: false },
                    { label: "初期費用", value: `-¥${fmt(parseInt(初期費)||0)}`, plus: false },
                    { label: "年間純利益", value: `${結果.年間純利益 >= 0 ? "+" : ""}¥${fmt(結果.年間純利益)}`, plus: 結果.年間純利益 >= 0 },
                  ].map((row) => (
                    <div key={row.label} className={styles.内訳行}>
                      <span>{row.label}</span>
                      <span style={{ color: row.plus ? "#10b981" : "#f25acc", fontWeight: 700 }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <AffiliateSlot カテゴリ="IT" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
            </div>
          </div>


          <ToolGuide slug="saas-roi-calc" />
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
