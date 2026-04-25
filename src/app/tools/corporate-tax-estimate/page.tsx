"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import AffiliateSlot from "@/components/AffiliateSlot";
import styles from "./corporate-tax-estimate.module.css";

const ツール定義 = {
  スラッグ: "corporate-tax-estimate",
  タイトル: "法人税概算シミュレーター",
  説明: "中小法人の利益から実効税率・法人税総額を試算",
  カテゴリ: "金融・投資",
  category: "Finance",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["💼 法人税をシミュレーション。利益{result}の税負担が判明→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }
function pct(n: number) { return n.toFixed(1); }

type 資本金区分 = "中小（1億円以下）" | "大法人（1億円超）";
type 地域 = "東京都" | "大阪府" | "その他";

export default function 法人税シミュレーターページ() {
  const [利益, set利益] = useState("10000000");
  const [資本金, set資本金] = useState<資本金区分>("中小（1億円以下）");
  const [地域, set地域] = useState<地域>("東京都");

  const 結果 = useMemo(() => {
    const 所得 = parseInt(利益) || 0;
    const 中小 = 資本金 === "中小（1億円以下）";

    // 法人税（国税）
    // 中小：年800万以下15%、超え23.2%
    // 大法人：一律23.2%
    let 法人税 = 0;
    if (中小) {
      if (所得 <= 8000000) {
        法人税 = 所得 * 0.15;
      } else {
        法人税 = 8000000 * 0.15 + (所得 - 8000000) * 0.232;
      }
    } else {
      法人税 = 所得 * 0.232;
    }

    // 地方法人税（法人税額 × 10.3%）
    const 地方法人税 = 法人税 * 0.103;

    // 法人住民税（法人税割）
    // 東京都：法人税割標準税率7.0%、大阪府6.0%、その他6.0%
    const 住民税割率 = 地域 === "東京都" ? 0.070 : 0.060;
    const 法人税割 = 法人税 * 住民税割率;
    // 均等割（資本金1千万以下・従業者50人以下の場合）
    const 均等割 = 中小 ? 70000 : 200000;

    // 法人事業税（所得割）
    // 中小（年400万以下3.5%、400〜800万5.3%、800万超7.0%）
    // 大法人：一律9.6%
    let 事業税 = 0;
    if (中小) {
      if (所得 <= 4000000) {
        事業税 = 所得 * 0.035;
      } else if (所得 <= 8000000) {
        事業税 = 4000000 * 0.035 + (所得 - 4000000) * 0.053;
      } else {
        事業税 = 4000000 * 0.035 + 4000000 * 0.053 + (所得 - 8000000) * 0.070;
      }
    } else {
      事業税 = 所得 * 0.096;
    }

    // 特別法人事業税（事業税 × 37%）
    const 特別事業税 = 事業税 * 0.37;

    const 合計 = 法人税 + 地方法人税 + 法人税割 + 均等割 + 事業税 + 特別事業税;
    const 実効税率 = 所得 > 0 ? (合計 / 所得) * 100 : 0;
    const 税引後利益 = 所得 - 合計;

    return {
      法人税, 地方法人税, 法人税割, 均等割, 事業税, 特別事業税,
      合計, 実効税率, 税引後利益, 所得,
    };
  }, [利益, 資本金, 地域]);

  const 結果テキスト = `利益¥${fmt(結果.所得)}→法人税等¥${fmt(結果.合計)}・実効税率${pct(結果.実効税率)}%`;

  const 利益クイック = ["3000000","5000000","10000000","20000000","50000000","100000000"];

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-finance">金融・投資</Link></li>
              <li aria-hidden="true">›</li>
              <li>法人税概算シミュレーター</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">💼 法人税概算シミュレーター</h1>
          <p className="ツールページ説明">
            見込利益・資本金・所在地を入力するだけで、法人税・法人住民税・法人事業税・特別法人事業税の
            合計額と実効税率を試算。決算対策・節税計画の第一歩に。
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
                <label className="フィールドラベル">見込利益（税引前・円）</label>
                <input type="number" className="数値入力" value={利益}
                  onChange={(e) => set利益(e.target.value)} min="0" step="1000000" />
                <div className={styles.クイック群}>
                  {利益クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${利益 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set利益(v)}>
                      {Number(v) >= 100000000 ? `${Number(v)/100000000}億` : `${Number(v)/10000}万`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">資本金区分</label>
                <div className={styles.税率選択}>
                  {(["中小（1億円以下）", "大法人（1億円超）"] as 資本金区分[]).map((m) => (
                    <button key={m}
                      className={`${styles.税率ボタン} ${資本金 === m ? styles.税率ボタンアクティブ : ""}`}
                      onClick={() => set資本金(m)}>{m}</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">事業所の所在地</label>
                <div className={styles.税率選択}>
                  {(["東京都", "大阪府", "その他"] as 地域[]).map((m) => (
                    <button key={m}
                      className={`${styles.税率ボタン} ${地域 === m ? styles.税率ボタンアクティブ : ""}`}
                      onClick={() => set地域(m)}>{m}</button>
                  ))}
                </div>
              </div>

              {/* 税率表 */}
              <div className={styles.税率表}>
                <div className={styles.税率表タイトル}>📋 中小法人の法人税率</div>
                <div className={styles.税率行}>
                  <span>年800万円以下の所得</span><span style={{ color: "#10b981", fontWeight: 700 }}>15%</span>
                </div>
                <div className={styles.税率行}>
                  <span>年800万円超の所得</span><span style={{ color: "#f59e0b", fontWeight: 700 }}>23.2%</span>
                </div>
                <div className={styles.税率行}>
                  <span>地方法人税</span><span style={{ fontWeight: 700 }}>法人税額×10.3%</span>
                </div>
                <div className={styles.税率行}>
                  <span>実効税率の目安（中小）</span><span style={{ color: "#06b6d4", fontWeight: 700 }}>約23〜33%</span>
                </div>
              </div>

              <div className={styles.注意書き}>
                ※ 本ツールは標準税率での概算です。超過税率・資本割・付加価値割は含みません。
                正確な試算は顧問税理士にご確認ください。
              </div>
            </div>

            <div className="結果セクション">
              <div className="結果見出し">試算結果</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>法人税等 合計（概算）</span>
                  <span className={styles.メイン値}>¥{fmt(結果.合計)}<span className={styles.メイン単位}>円</span></span>
                  <span className={styles.実効税率}>実効税率 {pct(結果.実効税率)}%</span>
                  <span className={styles.税引後}>税引後利益 ¥{fmt(結果.税引後利益)}</span>
                </div>

                <div className={styles.内訳カード}>
                  <div className={styles.内訳タイトル}>税目別内訳</div>
                  {[
                    { label: "法人税（国税）", value: 結果.法人税, color: "#f25acc" },
                    { label: "地方法人税", value: 結果.地方法人税, color: "#f97316" },
                    { label: "法人住民税（法人税割）", value: 結果.法人税割, color: "#f59e0b" },
                    { label: "法人住民税（均等割）", value: 結果.均等割, color: "#a78bfa" },
                    { label: "法人事業税", value: 結果.事業税, color: "#6366f1" },
                    { label: "特別法人事業税", value: 結果.特別事業税, color: "#818cf8" },
                  ].map((item) => (
                    <div key={item.label} className={styles.内訳行}>
                      <span>{item.label}</span>
                      <span style={{ color: item.color, fontWeight: 700 }}>¥{fmt(item.value)}</span>
                    </div>
                  ))}
                  <div className={styles.内訳合計行}>
                    <span>合計</span>
                    <span>¥{fmt(結果.合計)}</span>
                  </div>
                </div>

                <div className="結果グリッド">
                  {[
                    { label: "見込利益", value: `¥${fmt(結果.所得)}`, color: "#06b6d4" },
                    { label: "法人税等合計", value: `¥${fmt(結果.合計)}`, color: "#f25acc" },
                    { label: "実効税率", value: `${pct(結果.実効税率)}%`, color: "#f59e0b" },
                    { label: "税引後利益", value: `¥${fmt(結果.税引後利益)}`, color: "#10b981" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "1rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <AffiliateSlot カテゴリ="business" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
            </div>
          </div>

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
